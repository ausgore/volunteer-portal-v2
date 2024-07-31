import CRM from "../crm";
import EventRoleManager, { FetchOptions } from "../managers/EventRoleManager";
import { EventRole } from "./EventRole";

export enum EventStatus {
    Scheduled = "Scheduled",
    Cancelled = "Cancelled"
}

interface MandatoryCustomEventDetailProps {
    "Volunteer_Event_Details.Attendance_Code": string | null;
    "Volunteer_Event_Details.Thumbnail": number | null;
    [key: string]: any;
}

export interface EventDetailProps extends MandatoryCustomEventDetailProps {
    id: number | null;
    activity_date_time: string | null;
    subject: string | null;
    duration: number | null;
    details: string | null;
    location: string | null;
    thumbnail: string | null;
    "status_id:name": null | EventStatus;
}

export class EventDetails implements EventDetailProps {
    public id: number | null = null;
    public activity_date_time: string | null = null;
    public subject: string | null = null;
    public duration: number | null = null;
    public details: string | null = null;
    public location: string | null = null;
    public thumbnail: string | null = null;
    public "status_id:name": null | EventStatus = null;

    public "Volunteer_Event_Details.Attendance_Code": string | null = null;
    public "Volunteer_Event_Details.Thumbnail": number | null = null;
    [key: string]: any;

    constructor(props: Partial<EventDetailProps>) {
        for (const key in props) this[key as keyof EventDetails] = props[key];
    }

    public async getOptionalCustomFields() {
        const keys = Object.keys(this);
        const emptyEventDetails = new EventDetails({} as EventDetailProps);
        const defaultKeys = Object.keys(emptyEventDetails);
        const customKeys = keys.filter(k => !defaultKeys.includes(k));

        const response = await CRM("OptionGroup", "get", {
            select: ["name", "option.value", "option.label"],
            join: [["OptionValue AS option", "LEFT", ["option.option_group_id", "=", "id"]]],
            where: [["name", "IN", customKeys.map(c => `Volunteer_Event_Details_${c.split("Volunteer_Event_Details.")[1]}`)]]
        });
        const datas = response?.data as OptionalFieldData[];
        
        const result: { [key: string]: any } = {};
        for (const key of customKeys) {
            const data = datas.find(d => d.name == `Volunteer_Event_Details_${key.split("Volunteer_Event_Details.")[1]}` && d["option.value"] == this[key as keyof EventDetails]);
            result[key] = data ? data["option.label"] : this[key as keyof EventDetails]
        }
        return result;
    }

    public async fetchSchedules(props?: FetchOptions) {
        return await EventRoleManager.fetch({ eventId: this.id!, ...props }) as EventRole[];
    }
}

export interface OptionalFieldData {
    name: string;
    "option.value": any;
    "option.label": string;
}