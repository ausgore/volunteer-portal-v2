import { EventRole } from "../../../utils/classes/EventRole";
import Card from "./Card";
import { GrLocation } from "react-icons/gr";
import { IoBriefcaseOutline } from "react-icons/io5";
import { EventStatus } from "../../../utils/classes/EventDetails";

interface EventRoleCardProps {
    eventRole: EventRole;
    className?: string;
}

export default function EventRoleCard(props: EventRoleCardProps) {
    return <Card
        className={props.className}
        url={`/events/${props.eventRole.id}`}
        thumbnail={props.eventRole.event.thumbnail}
        cancelled={props.eventRole.event["status_id:name"] == EventStatus.Cancelled}
    >
        <h1 className="font-semibold mb-4">{props.eventRole.event.subject}</h1>
        <div className="grid grid-rows-1 gap-y-2 text-black/70">
            {/* Location */}
            <div className="gap-x-3 flex items-center">
                <GrLocation className="text-secondary" />
                <span className="text-sm font-semibold">{props.eventRole.event.location}</span>
            </div>
            {/* Role */}
            <div className="gap-x-3 flex items-center">
                <IoBriefcaseOutline className="text-secondary" />
                <span className="text-sm font-semibold">{props.eventRole["Volunteer_Event_Role_Details.Role:label"]}</span>
            </div>
        </div>
    </Card>
}