export enum TrainingSchedulesStatus {
    Scheduled = "Scheduled",
    Cancelled = "Cancelled"
}

interface MandatoryCustomTrainingSchedulesProps {
    'Volunteer_Training_Schedule_Details.Vacancy': number | null,
    'Volunteer_Training_Schedule_Details.Registration_Start_Date': string | null,
    'Volunteer_Training_Schedule_Details.Registration_End_Date': string | null,
    'Volunteer_Training_Schedule_Details.Expiration_Date': string | null,
    [key: string]: any;
}

export interface TrainingSchedulesProps extends MandatoryCustomTrainingSchedulesProps {
    id: number | null;
    activity_date_time: string | null;
    "status_id:name": TrainingSchedulesStatus | null;
    [key: string]: any;
}

export class TrainingSchedules implements TrainingSchedulesProps {
    public id: number | null = null;
    public activity_date_time: string | null = null;
    public "status_id:name": TrainingSchedulesStatus | null = null;

    public 'Volunteer_Training_Schedule_Details.Vacancy': number | null;
    public 'Volunteer_Training_Schedule_Details.Registration_Start_Date': string | null;
    public 'Volunteer_Training_Schedule_Details.Registration_End_Date': string | null;
    public 'Volunteer_Training_Schedule_Details.Expiration_Date': string | null;
    [key: string]: any;

    constructor(props: Partial<TrainingSchedulesProps>) {
        for (const key in props) {
            this[key as keyof TrainingSchedules] = props[key];
        }
    }
}