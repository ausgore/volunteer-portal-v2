import { useNavigate } from "react-router-dom";
import { Training, TrainingStatus } from "../../utils/classes/Training";
import config from "../../../config";
import moment from "moment";
import { IoIosPeople } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { FaArrowRight } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";

interface TrainingCardProps {
    className?: string;
    training: Training;
}

export default function TrainingCard(props: TrainingCardProps) {
    const navigate = useNavigate();


    return <div className={props.className}>
        <div className="bg-white w-full shadow-md rounded-md transition-transform duration-300 transform hover:scale-105 flex flex-col justify-between relative">
            {/* If the training is cancelledm do later */}
            {props.training["status_id:name"] == TrainingStatus.Cancelled && <>
            </>}
            {/* Main body */}
            <div>
                {/* Thumbnail */}
                <div className="mb-4 h-[160px] md:h-[150px] rounded-lg relative bg-gray-200 cursor-pointer" onClick={() => navigate(`/trainings/${props.training.id}`)}>
                    {props.training.thumbnail && <img src={`${config.domain}/wp-content/uploads/civicrm/custom/${props.training.thumbnail}`} className="w-full h-full object-cover rounded-lg" />}
                </div>
                <div className="px-3 pb-3">
                    <h1 className="font-semibold mb-4">{props.training.subject}</h1>
                    <div className="grid grid-cols-1 gap-y-1 text-black/70 text-sm">
                        {/* Vacancy */}
                        <div className="flex items-center">
                            <IoIosPeople className="text-secondary mr-3" />
                            <span>0 / {props.training["Volunteer_Training_Details.Vacancy"]}</span>
                        </div>
                        {/* Date and Time */}
                        <div className="flex items-center">
                            <FiCalendar className="text-secondary mr-3" />
                            {moment(new Date(props.training.activity_date_time!).getTime() + (props.training.duration! * 60 * 1000)).format("h:mma")}
                        </div>
                        {/* Location */}
                        <div className="flex items-center">
                            <GrLocation className="text-secondary mr-3" />
                            <span>{props.training.location}</span>
                        </div>
                    </div>
                </div>
                {/* Button */}
                <div className="flex w-full justify-center hover:bg-gray-100 font-semibold text-sm cursor-pointer py-2" onClick={() => navigate(`/trainings/${props.training.id}`)}>
                    <div className="flex">
                        <span className="mr-3">View More</span>
                        <FaArrowRight className="text-secondary" />
                    </div>
                </div>
            </div>
        </div>
    </div>
}