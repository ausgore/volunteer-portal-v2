import moment from "moment";
import { EventRole, EventRoleProps } from "../classes/EventRole";
import CRM, { ComparisonOperator } from "../crm";
import { format } from "date-fns";

export interface FetchOptions {
    eventRoleId?: string | number;
    eventId?: string | number;
    roleId?: string | number;
    search?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    grouped?: boolean;
    limit?: number;
    page?: number;
    [key: string]: any;
    select?: string[];
    onlyToday?: boolean;
    fullRange?: boolean;
    where?: [string,ComparisonOperator, any][];
}

const EventRoleManager = new class EventRoleManager {
    private entity = "Activity";

    async fetch(options?: FetchOptions): Promise<EventRole | EventRole[]> {
        const where: [string, ComparisonOperator, any][] = [["activity_type_id:name", "=", "Volunteer Event Role"]];
        if (options?.where) where.push(...options.where);
        if (options?.eventRoleId) where.push(["id", "=", options.eventRoleId]);
        else {
            // Fetch every event role where its event id
            if (options?.eventId) where.push(["Volunteer_Event_Role_Details.Event", "=", options.eventId]);
            // Fetch every event role where its role id
            if (options?.roleId) where.push(["Volunteer_Event_Role_Details.Role", "=", options.roleId]);
            // Get any event where the subject contains the search provided
            if (options?.search) where.push(["event.subject", "CONTAINS", options.search]);
            // If there is a start date provided
            if (options?.startDate) {
                const startDate = JSON.parse(options.startDate);
                // Set the range to be any after the beginning of that date
                where.push(["activity_date_time", ">=", `${moment(startDate).format("YYYY-MM-DD")} 00:00:00`]);
                // And unless they want a range (if they didn't provide an endDate), make it so that it only returns that specific day
                if (options.onlyToday) where.push(["activity_date_time", "<=", `${moment(options.endDate ? JSON.parse(options.endDate) : startDate).format("YYYY-MM-DD")} 23:59:59`]);
            }
            // Otherewise
            else {
                // Set the starter to be any event from today onwards, since it can be assumed that it's still available
                if (!options?.fullRange) where.push(["activity_date_time", ">=", `${moment(new Date()).format("YYYY-MM-DD")} 00:00:00`]);
                // GEt every single activty where it's before the end of the provided day
                if (options?.endDate) {
                    const endDate = JSON.parse(options.endDate);
                    where.push(["activity_date_time", "<=", `${moment(endDate).format("YYYY-MM-DD")} 23:59:59`]);
                }
            }
        }

        for (const key in options) {
            if (key.startsWith("Volunteer_Event_Details")) where.push([`event.${key}`, "IN", JSON.parse(options[key]) ?? "[]"]);
            else if (key.startsWith("Volunteer_Event_Role_Details")) where.push([key, "IN", JSON.parse(options[key]) ?? "[]"]);
        }

        const response = await CRM(this.entity, "get", {
            where,
            select: options?.select ?? [
                "activity_date_time",
                "duration",
                "status_id:name",
                "lcoation",

                "Volunteer_Event_Role_Details.*",
                "Volunteer_Event_Role_Details.Role:label",

                "event.id",
                "event.activity_date_time",
                "event.subject",
                "event.duration",
                "event.details",
                "event.location",
                "event.status_id:name",
                "event.Volunteer_Event_Details.*",

                "thumbnail.uri"
            ],
            join: [
                ["Activity AS event", "LEFT", ["event.id", "=", "Volunteer_Event_Role_Details.Event"]],
                ["File AS thumbnail", "LEFT", ["thumbnail.id", "=", "event.Volunteer_Event_Details.Thumbnail"]]
            ],
            limit: options?.limit,
            offset: options?.page && options?.limit ? (options?.page - 1) * options?.limit : 0,
            group: options?.grouped ? ["Volunteer_Event_Role_Details.Event", "Volunteer_Event_Role_Details.Role"] : []
        });

        if (options?.eventRoleId) return new EventRole(response!.data[0]);
        return response?.data.map((r: EventRoleProps) => new EventRole(r));
    }

    async fetchUnregistered(registeredEventRoles: number[]) {
        const now = new Date();
        const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
        return await this.fetch({ where: [
            ["activity_date_time", ">", formattedNow],
            ["id", "NOT IN", registeredEventRoles]
        ]})
    }

};

export default EventRoleManager;