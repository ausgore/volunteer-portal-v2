export enum TrainingScheduleStatus {
    Scheduled = "Scheduled",
    Cancelled = "Cancelled"
}

interface MandatoryCustomTrainingScheduleProps {
    'Volunteer_Training_Schedule_Details.Vacancy': number | null,
    'Volunteer_Training_Schedule_Details.Registration_Start_Date': string | null,
    'Volunteer_Training_Schedule_Details.Registration_End_Date': string | null,
    'Volunteer_Training_Schedule_Details.Expiration_Date': string | null,
    [key: string]: any;
}

export interface TrainingScheduleProps extends MandatoryCustomTrainingScheduleProps {
    id: number | null;
    activity_date_time: string | null;
    "status_id:name": TrainingScheduleStatus | null;
    [key: string]: any;
}

export class TrainingSchedule implements TrainingScheduleProps {
    public id: number | null = null;
    public activity_date_time: string | null = null;
    public "status_id:name": TrainingScheduleStatus | null = null;

    public 'Volunteer_Training_Schedule_Details.Vacancy': number | null;
    public 'Volunteer_Training_Schedule_Details.Registration_Start_Date': string | null;
    public 'Volunteer_Training_Schedule_Details.Registration_End_Date': string | null;
    public 'Volunteer_Training_Schedule_Details.Expiration_Date': string | null;
    [key: string]: any;

    constructor(props: Partial<TrainingScheduleProps>) {
        for (const key in props) {
            this[key as keyof TrainingSchedule] = props[key];
        }
    }
}