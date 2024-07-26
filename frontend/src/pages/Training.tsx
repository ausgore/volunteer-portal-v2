import { useParams } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { useEffect, useState } from "react";
import { Training } from "../../utils/classes/Training";
import TrainingManager from "../../utils/managers/TrainingManager";
import Loading from "../components/Loading";
import config from "../../../config";
import { CiFileOff } from "react-icons/ci";

export default function TrainingPage() {
    const { id } = useParams();
    const [training, setTraining] = useState<Training>();
    useEffect(() => {
        (async () => {
            const training = await TrainingManager.fetch({ id }) as Training;
            setTraining(training);
        })();
    }, []);

    return <Wrapper>
        {!training ? <Loading className="h-screen items-center" /> : <div className="p-4">
            <h1 className="font-semibold text-lg text-gray-600">Training Details</h1>
            <div className="bg-white rounded-md mt-4 py-6 px-4 max-w-[1400px]">
                {/* Image */}
                <div className="mb-8 h-[200px] rounded-lg relative border border-gray-50 bg-gray-200">
                    {training.thumbnail ? <img src={`${config.domain}/wp-content/uploads/civicrm/custom/${training.thumbnail}`} className="w-full h-full object-cover rounded-lg" /> : <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <CiFileOff className="text-[80px] text-gray-500" />
                    </div>}
                </div>
                {/* Header */}
                <header className="flex flex-row justify-between w-full gap-x-4">
                    {/* Description */}
                    <div className="flex-grow">
                        <h2 className="text-2xl text-black/90 font-bold">{training.subject}</h2>
                        {(training.details?.length ?? 0) > 0 && <div className="max-w-[780px] mt-4 text-black/70" dangerouslySetInnerHTML={{ __html: training.details ?? "" }} />}
                    </div>
                    {/* Sign Up Section */}
                    <div className="text-center min-w-[180px] max-w-[180px] hidden lg:block">
                        <button>sign up</button>
                    </div>
                </header>
            </div>
        </div>}
    </Wrapper>
}