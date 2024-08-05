import { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import EventDetailManager from "../../utils/managers/EventDetailManager";
import { useParams } from "react-router-dom";
import { EventDetails } from "../../utils/classes/EventDetails";
import { EventRole } from "../../utils/classes/EventRole";
import Loading from "../components/Loading";
import config from "../../../config";
import { CiFileOff } from "react-icons/ci";
import { GrLocation } from "react-icons/gr";
import { FiCalendar } from "react-icons/fi";
import moment from "moment";
import { IoMdBriefcase } from "react-icons/io";

export default function Event() {
    const { eventId, roleId } = useParams();
    const [event, setEvent] = useState<EventDetails>();
    const [schedules, setSechedules] = useState<EventRole[]>();
    const [fields, setFields] = useState<{ [key: string]: any }>();

    useEffect(() => {
        (async () => {
            const event = await EventDetailManager.fetch(eventId!);
            const schedules = await event.fetchSchedules({ roleId });
            setFields(await event.getOptionalCustomFields());
            setSechedules(schedules);
            setEvent(event);
        })();
    }, []);
    return <Wrapper>
        {!event ? <Loading className="h-screen items-center" /> : <div className="p-4">
            <h1 className="font-semibold text-lg text-gray-600">Event Details</h1>
            <div className="bg-white rounded-md mt-4 py-6 px-4 max-w-[1400px]">
                {/* Image */}
                <div className="mb-8 h-[200px] rounded-lg relative border border-gray-50 bg-gray-200">
                    {event["thumbnail.uri"] ?
                        <img src={`${config.domain}/wp-content/uploads/civicrm/custom/${event["thumbnail.uri"]}`} className="w-full h-full object-cover rounded-lg" /> :
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <CiFileOff className="text-[80px] text-gray-500" />
                        </div>}
                </div>
                {/* Header */}
                <header className="flex flex-row justify-between w-full gap-x-4">
                    {/* Description */}
                    <div className="flex-grow">
                        <h2 className="text-2xl text-secondary font-semibold">{event.subject}</h2>
                        {(event.details?.length ?? 0) > 0 && <div className="max-w-[780px] mt-4 text-black/70" dangerouslySetInnerHTML={{ __html: event.details ?? "" }} />}
                    </div>
                </header>
                {/* Information */}
                <div className="grid grid-cols-4 lg:flex lg:flex-row gap-4 w-full mt-6">
                    {/* Location */}
                    <div className="bg-primary/30 text-secondary rounded-md py-2 px-3 col-span-2">
                        <h3 className="text-xs font-semibold mb-2">Location</h3>
                        <div className="flex flex-row items-center gap-x-3 font-bold text-sm">
                            <GrLocation size={22} />
                            <span>{event.location}</span>
                        </div>
                    </div>
                    {/* No Schedules */}
                    {(schedules!.length == 0 || schedules!.length > 1) && <div className="bg-primary/30 text-secondary rounded-md py-2 px-3 col-span-2">
                        <h3 className="text-xs font-semibold mb-2">Schedules</h3>
                        <div className="flex flex-row items-center gap-x-3 font-bold text-sm">
                            <FiCalendar size={22} />
                            <span>{schedules?.length ? "Multiple Schedules" : "No Available Schedules"}</span>
                        </div>
                    </div>}
                    {/* 1 Schedule */}
                    {schedules?.length == 1 && <>
                        <div className="bg-primary/30 text-secondary rounded-md py-2 px-3 col-span-4 lg:col-span-2">
                        <h3 className="text-sm font-semibold mb-2">Date & Time</h3>
                        <div className="flex flex-row items-center gap-x-3 font-bold text-sm">
                            <FiCalendar size={22} />
                            <div className="flex flex-col sm:flex-row gap-x-3">
                                <span>{moment(schedules[0].activity_date_time).format("D MMM YYYY, h:mm A")}</span>
                                <span className="hidden sm:block">-</span>
                                <span>{moment(new Date(schedules[0].activity_date_time!).getTime() + (schedules[0].duration! * 60 * 1000)).format("D MMM YYYY, h:mm A")}</span>
                            </div>
                        </div>
                    </div>
                    </>}
                    {/* Role */}
                    <div className="bg-primary/30 text-secondary rounded-md py-2 px-3 col-span-4 lg:col-span-2">
                        <h3 className="text-sm font-semibold mb-2">Role</h3>
                        <div className="flex flex-row items-center gap-x-3 font-bold text-sm">
                            <IoMdBriefcase size={22} />
                            <span>{roleId}</span>
                        </div>
                    </div>
                </div>
                {/* Optional Fields */}
                <div className="mt-6">
                    {Object.keys(fields!).map(key => <div className="mb-6">
                        <h1 className="font-bold mb-2 text-black/70">{key.split("Volunteer_Event_Details.")[1]}</h1>
                        <p className="text-black/70">{fields![key]}</p>
                    </div>)}
                </div>
            </div>
        </div>}
    </Wrapper>
}