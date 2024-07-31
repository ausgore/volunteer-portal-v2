import { EventRole } from "../../../utils/classes/EventRole";
import Card from "./Card";
import { GrLocation } from "react-icons/gr";
import { IoBriefcaseOutline } from "react-icons/io5";
import { EventStatus } from "../../../utils/classes/EventDetails";
import { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import moment from "moment";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { Spinner } from "flowbite-react";

interface EventCard {
    eventRole: EventRole;
    className?: string;
}

export default function EventCard(props: EventCard) {
    const [schedules, setSchedules] = useState<EventRole[]>();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    useEffect(() => {
        (async () => {
            const timestamps = (await props.eventRole.event.fetchSchedules({ fullRange: true, roleId: props.eventRole["Volunteer_Event_Role_Details.Role"]!, select: ["activity_date_time"] })).map(e => e.activity_date_time).map(ds => new Date(ds!).getTime());

            const schedules =  await props.eventRole.event.fetchSchedules({ roleId: props.eventRole["Volunteer_Event_Role_Details.Role"]! });
            console.log(schedules);
            setSchedules(schedules);

            const start = new Date(Math.min(...timestamps));
            start.setHours(0, 0, 0, 0);
            const end = new Date(Math.max(...timestamps));
            end.setHours(12, 59, 59, 999);
            setStartDate(start);
            setEndDate(end);
        })();
    }, [])

    return <Card
        className={props.className}
        url={`/events/${props.eventRole.event.id}`}
        thumbnail={props.eventRole.event.thumbnail}
        cancelled={props.eventRole.event["status_id:name"] == EventStatus.Cancelled}
    >
        <h1 className="font-semibold mb-4">{props.eventRole.event.subject}</h1>
        <div className="grid grid-rows-1 gap-y-2 text-black/70">
            {/* Date and Time */}
            <div className="flex items-center">
                <FiCalendar className="text-secondary mr-3" />
                <span className="text-sm font-semibold">
                    {moment(startDate).format("D MMM YYYY")}
                    {moment(startDate).format("D MMM YYYY") != moment(endDate).format("D MMM YYYY") && <>
                        <span className="text-sm mx-1">-</span>
                        {moment(endDate).format("D MMM YYYY")}
                    </>}
                </span>
            </div>
            {/* Location */}
            <div className="gap-x-3 flex items-center">
                <GrLocation className="text-secondary" />
                <span className="text-sm font-semibold">{props.eventRole.event.location}</span>
            </div>
            <div className="flex gap-x-3 items-center">
                <RiCalendarScheduleLine className="text-secondary" />
                <span className="text-sm font-semibold items-center">
                    {schedules ? schedules.length > 1 ? "Multiple Shifts" : schedules.length == 1 ? `${moment(schedules[0].activity_date_time).format("hh:mm A")} - ${moment(new Date(schedules[0].activity_date_time!).getTime() + (schedules[0].duration! * 60 * 1000)).format("hh:mm A")}` : "No Shifts Available" : <Spinner className="w-[14px] h-[14px] fill-secondary mr-1" />}
                </span>
            </div>
            {/* Role */}
            <div className="gap-x-3 flex items-center">
                <IoBriefcaseOutline className="text-secondary" />
                <span className="text-sm font-semibold">{props.eventRole["Volunteer_Event_Role_Details.Role:label"]}</span>
            </div>
        </div>
    </Card>
}