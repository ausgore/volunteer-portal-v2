import { EventRole, EventRoleProps } from "./EventRole";

export enum RegistrationStatus {
    Approved = "Completed",
    ApprovalRequired = "Approval Required",
    Unapproved = "Unapproved"
}

export interface EventRegistrationProps {
    id: number;
    "status_id:name": RegistrationStatus;
    [key: string]: any;
}

export class EventRegistration implements EventRegistrationProps {
    public id: number;
    public eventRole: EventRole | null = null;
    public "status_id:name": RegistrationStatus;
    [key: string]: any;
    
    constructor(props: EventRegistrationProps) {
        this.id = props.id;
        this["status_id:name"] = props["status_id:name"];

        const eventRoleDetails: Partial<EventRoleProps> = {};
        for (const key in props) {
            if (key.startsWith("eventRole.")) eventRoleDetails[key.split("eventRole.")[1]] = props[key];
            if (key.startsWith("event.")) eventRoleDetails[key] = props[key];
        }

        this.eventRole = new EventRole(eventRoleDetails as EventRoleProps);
    }
}