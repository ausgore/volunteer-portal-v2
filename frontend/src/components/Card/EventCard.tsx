import { EventRole } from "../../../utils/classes/EventRole";
import Card from "./Card";
import { GrLocation } from "react-icons/gr";
import { IoBriefcaseOutline } from "react-icons/io5";
import { EventDetails, EventStatus } from "../../../utils/classes/EventDetails";
import { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import moment from "moment";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { Spinner } from "flowbite-react";

interface EventCardProps {
    event: EventDetails;
    roleId: number;
    roleName: String;
    className?: string;
}

export default function EventCard(props: EventCardProps) {
    const [schedules, setSchedules] = useState<EventRole[]>();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    useEffect(() => {
        (async () => {
            const timestamps = (await props.event.fetchSchedules({ fullRange: true, roleId: props.roleId!, select: ["activity_date_time"] })).map(e => e.activity_date_time).map(ds => new Date(ds!).getTime());
            const schedules =  await props.event.fetchSchedules({ roleId: props.roleId! });
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
        url={`/events/${props.event.id}/${props.roleName}`}
        thumbnail={props.event["thumbnail.uri"]}
        cancelled={props.event["status_id:name"] == EventStatus.Cancelled}
    >
        <h1 className="font-semibold mb-4">{props.event.subject}</h1>
        <div className="grid grid-rows-1 gap-y-2 text-black/70">
            {/* Date and Time */}
            <div className="flex items-center">
                <FiCalendar className="text-secondary mr-3" />
                {schedules ? <span className="text-sm font-semibold">
                    {moment(startDate).format("D MMM YYYY")}
                    {moment(startDate).format("D MMM YYYY") != moment(endDate).format("D MMM YYYY") && <>
                        <span className="text-sm mx-1">-</span>
                        {moment(endDate).format("D MMM YYYY")}
                    </>}
                </span> : <Spinner className="w-[14px] h-[14px] fill-secondary mr-1" />}
            </div>
            {/* Location */}
            <div className="gap-x-3 flex items-center">
                <GrLocation className="text-secondary" />
                <span className="text-sm font-semibold">{props.event.location}</span>
            </div>
            <div className="flex gap-x-3 items-center">
                <RiCalendarScheduleLine className="text-secondary" />
                <span className="text-sm font-semibold items-center">
                    {schedules ? schedules.length > 1 ? "Multiple Schedules" : schedules.length == 1 ? `${moment(schedules[0].activity_date_time).format("hh:mm A")} - ${moment(new Date(schedules[0].activity_date_time!).getTime() + (schedules[0].duration! * 60 * 1000)).format("hh:mm A")}` : "No Schedules Available" : <Spinner className="w-[14px] h-[14px] fill-secondary mr-1" />}
                </span>
            </div>
            {/* Role */}
            <div className="gap-x-3 flex items-center">
                <IoBriefcaseOutline className="text-secondary" />
                <span className="text-sm font-semibold">{props.roleName}</span>
            </div>
        </div>
    </Card>
}