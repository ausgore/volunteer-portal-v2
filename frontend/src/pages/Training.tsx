import { useParams } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { useEffect, useState } from "react";
import { Training } from "../../utils/classes/Training";
import { TrainingSchedule } from "../../utils/classes/TrainingSchedule";
import TrainingManager from "../../utils/managers/TrainingManager";
import Loading from "../components/Loading";
import config from "../../../config";
import { CiFileOff } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function TrainingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState<Training>();
    const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);

    useEffect(() => {
        (async () => {
            const training = await TrainingManager.fetch({ id }) as Training;
            setTraining(training);

            const trainingSchedules = await training?.fetchSchedules(id) as TrainingSchedule[];
            console.log(trainingSchedules);
            setSchedules(trainingSchedules);
        })();
    }, [id]);

    const handleRegisterClick = async (scheduleId: number | null) => {
        try {
            alert(`Registering user for schedule ID: ${scheduleId}`);
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const renderSchedulesTable = () => (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacancy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Start</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration End</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Till</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Register</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {schedules.length > 0 ? (
                    schedules.map((schedule, index) => {
                        const Activity_Date_Time = schedule.activity_date_time ?? 'N/A';
                        const Vacancy = schedule["Volunteer_Training_Schedule_Details.Vacancy"] ?? 'N/A';
                        const Registration_Start_Date = schedule["Volunteer_Training_Schedule_Details.Registration_Start_Date"] ?? 'N/A';
                        const Registration_End_Date = schedule["Volunteer_Training_Schedule_Details.Registration_End_Date"] ?? 'N/A';
                        const Expiration_Date = schedule["Volunteer_Training_Schedule_Details.Expiration_Date"] ?? 'N/A';
                        const currentDate = moment();
                        const isRegistrationOpen = Registration_Start_Date !== 'N/A' && Registration_End_Date !== 'N/A' && currentDate.isBetween(moment(Registration_Start_Date), moment(Registration_End_Date)) && Vacancy !== 'N/A' && Vacancy > 0;

                        return (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{Activity_Date_Time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{Vacancy}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{Registration_Start_Date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{Registration_End_Date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{Expiration_Date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        disabled={!isRegistrationOpen}
                                        className={`px-4 py-2 rounded ${isRegistrationOpen ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                        onClick={() => handleRegisterClick(schedule.id)}>
                                        {isRegistrationOpen ? 'Register' : 'Closed'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No schedules available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    return (
        <Wrapper>
            {!training ? (
                <Loading className="h-screen items-center" />
            ) : (
                <div className="p-4">
                    <h1 className="font-semibold text-lg text-gray-600">Training Details</h1>
                    <div className="bg-white rounded-md mt-4 py-6 px-4 max-w-[1400px]">
                        {/* Image */}
                        <div className="mb-8 h-[200px] rounded-lg relative border border-gray-50 bg-gray-200">
                            {training.thumbnail ? (
                                <img
                                    src={`${config.domain}/wp-content/uploads/civicrm/custom/${training.thumbnail}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <CiFileOff className="text-[80px] text-gray-500" />
                                </div>
                            )}
                        </div>
                        {/* Header */}
                        <header className="flex flex-row justify-between w-full gap-x-4">
                            {/* Description */}
                            <div className="flex-grow">
                                <h2 className="text-2xl text-black/90 font-bold">{training.subject}</h2>
                                {training.details && (
                                    <div
                                        className="max-w-[780px] mt-4 text-black/70"
                                        dangerouslySetInnerHTML={{ __html: training.details }}
                                    />
                                )}
                            </div>
                            {/* Sign Up Section */}
                            <div className="text-center min-w-[180px] max-w-[180px] hidden lg:block">
                                <button>Sign Up</button>
                            </div>
                        </header>
                        <br />
                        {/* Schedules */}
                        {renderSchedulesTable()}
                    </div>
                </div>
            )}
        </Wrapper>
    );
}