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
import { Spinner } from "flowbite-react";
import swal from 'sweetalert';

export default function TrainingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState<Training>();
    const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
    const [loadingScheduleId, setLoadingScheduleId] = useState<number | null>(null);
    const email = (window as any).email ?? config.email;

    useEffect(() => {
        (async () => {
            const training = await TrainingManager.fetch({ id }) as Training;
            setTraining(training);

            const trainingSchedules = await training?.fetchSchedules() as TrainingSchedule[];
            console.log(trainingSchedules);
            setSchedules(trainingSchedules);
        })();
    }, [id]);

    const isUserRegistered = (schedule: TrainingSchedule, email: string) => {
        return schedule.registrations.some(
            registration => registration["contact.email_primary.email"] === email
        );
    };

    const handleRegisterClick = async (schedule: TrainingSchedule) => {
        if (isUserRegistered(schedule, email)) {
            alert("You are already registered for this training.");
            return;
        }

        setLoadingScheduleId(schedule.id); // Set loading state for this schedule

        try {
            const registration = await schedule.register(email) as TrainingSchedule[];
            console.log(registration);

            if (registration) {
                // Update the whole schedule state with the new registration
                setSchedules(registration);
                swal(`You have registered for ${schedule.subject}`, {
                    icon: "success",
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            swal(`Registration failed`, {
                icon: "error"
            });
        } finally {
            setLoadingScheduleId(null); // Reset loading state
        }
    };

    const renderSchedulesTable = () => {
        if (schedules.length === 0) {
            return (
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No schedules available
                    </td>
                </tr>
            );
        }

        return (
            <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule, index) => {
                    const Activity_Date_Time = schedule.activity_date_time ?? 'N/A';
                    const Vacancy = schedule["Volunteer_Training_Schedule_Details.Vacancy"] ?? 'N/A';
                    const NumRegistrations = schedule.registrations.length;
                    const Registration_Start_Date = schedule["Volunteer_Training_Schedule_Details.Registration_Start_Date"] ?? 'N/A';
                    const Registration_End_Date = schedule["Volunteer_Training_Schedule_Details.Registration_End_Date"] ?? 'N/A';
                    const Expiration_Date = schedule["Volunteer_Training_Schedule_Details.Expiration_Date"] ?? 'N/A';
                    const currentDate = moment();
                    const isRegistrationOpen = Registration_Start_Date !== 'N/A' && Registration_End_Date !== 'N/A' && currentDate.isBetween(moment(Registration_Start_Date), moment(Registration_End_Date)) && Vacancy !== 'N/A' && (Vacancy - NumRegistrations) > 0;

                    const userIsRegistered = isUserRegistered(schedule, email);
                    const isRegistering = loadingScheduleId === schedule.id;

                    return (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{Activity_Date_Time}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Registration_Start_Date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Registration_End_Date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{Expiration_Date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{NumRegistrations}/{Vacancy}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    disabled={!isRegistrationOpen || userIsRegistered || isRegistering}
                                    className={`px-4 py-2 rounded ${userIsRegistered ? 'bg-blue-500 text-white cursor-not-allowed' : isRegistrationOpen ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    onClick={() => handleRegisterClick(schedule)}>
                                    {isRegistering ? 'Registering...' : userIsRegistered ? 'Registered' : isRegistrationOpen ? 'Register' : 'Closed'}
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        );
    };

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
                        <header className="w-full">
                            <h2 className="text-2xl text-black/90 font-bold">{training.subject}</h2>
                            {training.details && (
                                <div
                                    className="max-w-[780px] mt-4 text-black/70"
                                    dangerouslySetInnerHTML={{ __html: training.details }}
                                />
                            )}
                        </header>
                        <br />
                        {/* Schedules */}
                        <h3 className="text-xl text-black font-semibold">Training Schedule</h3>
                        <br />
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Start</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration End</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Till</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Register</th>
                                </tr>
                            </thead>
                            {schedules.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            <Spinner className="w-[25px] h-[25px] fill-secondary" />
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                renderSchedulesTable()
                            )}
                        </table>
                    </div>
                </div>
            )}
        </Wrapper>
    );
}