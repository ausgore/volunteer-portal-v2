import { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import EventDetailManager from "../../utils/managers/EventDetailManager";
import { useParams } from "react-router-dom";
import { EventDetails } from "../../utils/classes/EventDetails";
import { EventRole } from "../../utils/classes/EventRole";
import Loading from "../components/Loading";
import config from "../../../config";
import { CiFileOff } from "react-icons/ci";

export default function Event() {
    const { eventId, roleId } = useParams();
    const [event, setEvent] = useState<EventDetails>();
    const [schedules, setSechedules] = useState<EventRole[]>();

    useEffect(() => {
        (async () => {
            const event = await EventDetailManager.fetch(eventId!);
            console.log(event);
            const schedules = await event.fetchSchedules({ roleId });
            setSechedules(schedules);
            setEvent(event);
        })();
    },[]);
    return <Wrapper>
        {!event ? <Loading className="h-screen items-center" /> : <div className="p-4">
            <h1 className="font-semibold text-lg text-gray-600">Event Details</h1>
            <div className="bg-white rounded-md mt-4 py-6 px-4 max-w-[1400px]">
                {/* Image */}
                <div className="mb-8 h-[200px] rounded-lg relative border border-gray-50 bg-gray-200">
                    {event.thumbnail ?
                        <img src={`${config.domain}/wp-content/uploads/civicrm/custom/${event.thumbnail}`} className="w-full h-full object-cover rounded-lg" /> :
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <CiFileOff className="text-[80px] text-gray-500" />
                        </div>}
                </div>
            </div>
        </div>}
    </Wrapper>
}