import { useNavigate } from "react-router-dom";
import { Training, TrainingStatus } from "../../utils/classes/Training";
import config from "../../../config";

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
                    <div className="grid grid-cols-1 text-sm">
                        {/* Vacancy */}
                        <p className="col-span-1">40/{props.training["Volunteer_Training_Details.Vacancy"]}</p>
                        <p className="col-span-1">16:00 - 17:00</p>
                        <p className="col-span-1">Octopus8</p>
                    </div>
                </div>
                <div className="w-full items-center text-center hover:bg-gray-100 font-semibold text-sm cursor-pointer" onClick={() => navigate(`/trainings/${props.training.id}`)}>
                    View More
                </div>
            </div>
        </div>
    </div>
}