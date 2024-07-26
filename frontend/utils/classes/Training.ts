export enum TrainingStatus {
    Scheduled = "Scheduled",
    Cancelled = "Cancelled"
}

interface MandatoryCustomTrainingProps {
    "Volunteer_Training_Details.Thumbnail": number | null;
    "Volunteer_Training_Details.Expiration_Date": string | null;
    "Volunteer_Training_Details.Validity_Period" : number | null;
    [key: string]: any;
}

export interface TrainingProps extends MandatoryCustomTrainingProps {
    id: number | null;
    activity_date_time: string | null;
    subject: string | null;
    duration: number | null;
    details: string | null;
    location: string | null;
    thumbnail: string | null;
    "status_id:name": TrainingStatus | null;
}

export class Training implements TrainingProps {
    public id: number | null = null;
    public activity_date_time: string | null = null;
    public subject: string | null = null;
    public duration: number | null = null;
    public details: string | null = null;
    public location: string | null = null;
    public thumbnail: string | null = null;
    public "status_id:name": TrainingStatus | null = null;

    public "Volunteer_Training_Details.Thumbnail": number | null = null;
    public "Volunteer_Training_Details.Expiration_Date": string | null = null;
    public "Volunteer_Training_Details.Validity_Period": number | null = null;
    [key: string]: any;

    constructor(props: Partial<TrainingProps>) {
        for (const key in props) {
            if (key.startsWith("thumbnail")) this.thumbnail = props[key];
            else this[key as keyof Training] = props[key];
        }
    }
}