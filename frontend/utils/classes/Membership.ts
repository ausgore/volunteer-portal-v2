import CRM from "../crm";

export enum MembershipStatus {
    New = 1,
    Current = 2,
    Grace = 3,
    Expired = 4,
    Pending = 5,
    Cancelled = 6,
    Deceased = 7
}

export interface iMembership {
    id: number;
    contact_id: number;
    membership_type_id: number;
    "membership_type_id:name": string;
    join_date: string;
    start_date: string;
    end_date: string;
    status_id: MembershipStatus;
    "status_id:name": string;
    "membership_type_id.minimum_fee": number | null;
}

export class Membership implements iMembership {
    id: number;
    contact_id: number;
    membership_type_id: number;
    "membership_type_id:name": string;
    join_date: string;
    start_date: string;
    end_date: string;
    status_id: MembershipStatus;
    "status_id:name": string;
    "membership_type_id.minimum_fee": number | null;

    constructor(props: iMembership) {
        this.id = props.id;
        this.contact_id = props.contact_id;
        this.membership_type_id = props.membership_type_id;
        this["membership_type_id:name"] = props["membership_type_id:name"];
        this.join_date = props.join_date;
        this.start_date = props.start_date;
        this.end_date = props.end_date;
        this.status_id = props.status_id;
        this["status_id:name"] = props["status_id:name"];
        this["membership_type_id.minimum_fee"] = props["membership_type_id.minimum_fee"];
    }

    async update(values: [keyof Membership, any][]) {
        await CRM("Membership", "update", { where: [["id", "=", this.id]], values });
        for (const [key, value] of values) (this as any)[key as any] = value;
        return this;
    }
}