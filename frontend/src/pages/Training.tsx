import { useParams } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import React, { useEffect, useState } from "react";
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
import { CheckIcon, PencilIcon, LockClosedIcon, ChevronDownIcon, ChevronUpIcon, UserIcon, PhoneIcon, EnvelopeOpenIcon } from '@heroicons/react/24/solid';


export default function TrainingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState<Training>();
    const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
    const [loadingScheduleId, setLoadingScheduleId] = useState<number | null>(null);
    const [expandedRowIds, setExpandedRowIds] = useState<Set<number>>(new Set());
    const email = (window as any).email ?? config.email;

    useEffect(() => {
        (async () => {
            const training = await TrainingManager.fetch({ id }) as Training;
            setTraining(training);

            const trainingSchedules = await training?.fetchSchedules() as TrainingSchedule[];
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

    const toggleRowExpansion = (id: number) => {
        setExpandedRowIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const renderSchedulesTable = () => {
        if (schedules.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No schedules available
                    </td>
                </tr>
            );
        }

        return (
            <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule, index) => {
                    const isExpanded = expandedRowIds.has(schedule.id as number);
                    const Activity_Date_Time = schedule.activity_date_time ?? 'N/A';
                    const Duration = schedule.training.duration ?? 0;
                    const End_Time = moment(Activity_Date_Time).add(Duration, 'minutes');
                    const Vacancy = schedule["Volunteer_Training_Schedule_Details.Vacancy"] ?? 'N/A';
                    const NumRegistrations = schedule.registrations.length;
                    const Registration_Start_Date = schedule["Volunteer_Training_Schedule_Details.Registration_Start_Date"] ?? 'N/A';
                    const Registration_End_Date = schedule["Volunteer_Training_Schedule_Details.Registration_End_Date"] ?? 'N/A';
                    const Expiration_Date = schedule["Volunteer_Training_Schedule_Details.Expiration_Date"] ?? 'N/A';
                    const Location = schedule.location ?? 'N/A';
                    const currentDate = moment();

                    const isRegistrationOpen = (
                        (Registration_Start_Date === 'N/A' || currentDate.isSameOrAfter(moment(Registration_Start_Date))) &&
                        (Registration_End_Date === 'N/A' || currentDate.isSameOrBefore(moment(Registration_End_Date))) &&
                        (Vacancy === 'N/A' || (Vacancy - NumRegistrations) > 0)
                    );

                    const userIsRegistered = isUserRegistered(schedule, email);
                    const isRegistering = loadingScheduleId === schedule.id;

                    return (
                        <React.Fragment key={index}>
                            <tr
                                className="hover:bg-gray-100 transition ease-in-out cursor-pointer"
                                onClick={() => toggleRowExpansion(schedule.id as number)}
                            >
                                {/* Training Date Column */}
                                <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-800">
                                    {moment(Activity_Date_Time).format('D MMM YYYY LT')} - {End_Time.format('LT')}
                                </td>

                                {/* Participants Column */}
                                <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-800">
                                    {Vacancy === "N/A" ? NumRegistrations : NumRegistrations + "/" + Vacancy}
                                </td>

                                {/* Registration end hidden on lg and below */}
                                <td className="hidden lg:table-cell px-2 py-3 whitespace-nowrap text-sm text-gray-800">
                                    {Registration_End_Date === "N/A" ? moment(Activity_Date_Time).format('D MMM YYYY LT') : moment(Registration_End_Date).format('D MMM YYYY LT')}
                                </td>

                                {/* Register hidden on md and below */}
                                <td className="hidden md:table-cell px-2 py-3 whitespace-nowrap">
                                    <button
                                        disabled={!isRegistrationOpen || userIsRegistered || isRegistering}
                                        className={`w-[150px] px-2 py-2 rounded font-semibold ${userIsRegistered ? 'bg-blue-500 text-white cursor-not-allowed' : isRegistrationOpen ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800 cursor-not-allowed'} flex items-center justify-center`}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click event
                                            handleRegisterClick(schedule);
                                        }}>
                                        {isRegistering ? (
                                            <Spinner className="w-5 h-5 mr-2 text-white" />
                                        ) : userIsRegistered ? (
                                            <>
                                                <CheckIcon className="w-5 h-5 mr-2 text-white" />
                                                Registered
                                            </>
                                        ) : isRegistrationOpen ? (
                                            <>
                                                <PencilIcon className="w-5 h-5 mr-2 text-white" />
                                                Register
                                            </>
                                        ) : (
                                            <>
                                                <LockClosedIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Closed
                                            </>
                                        )}
                                    </button>
                                </td>

                                {/* Expand/Collapse Icon */}
                                <td className="px-2 py-3 whitespace-nowrap">
                                    {isExpanded ? (
                                        <ChevronUpIcon className="w-5 h-5 text-gray-800" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5 text-gray-800" />
                                    )}
                                </td>
                            </tr>

                            {/* Expanded content */}
                            {isExpanded && (
                                <tr>
                                    <td colSpan={5} className="px-2 py-4 bg-gray-50 text-sm text-gray-700">
                                        <div><strong>Location:</strong> {Location}</div>
                                        <div><strong>Valid Through:</strong> {Expiration_Date === "N/A" ? Expiration_Date : moment(Expiration_Date).format('D MMM YYYY LT')}</div>

                                        {/* Registration Period and Register fields visible only on lg and md or smaller screens respectively */}
                                        <div className="lg:hidden">
                                            <div><strong>Registration End:</strong> <br />{moment(Registration_End_Date).format('D MMM YYYY LT')}</div>
                                            <button
                                                disabled={!isRegistrationOpen || userIsRegistered || isRegistering}
                                                className={`md:hidden mt-2 w-[150px] px-2 py-2 rounded font-semibold ${userIsRegistered ? 'bg-blue-500 text-white cursor-not-allowed' : isRegistrationOpen ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'} flex items-center justify-center`}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click event
                                                    handleRegisterClick(schedule);
                                                }}>
                                                {isRegistering ? (
                                                    <Spinner className="w-5 h-5 mr-2 text-white" />
                                                ) : userIsRegistered ? (
                                                    <>
                                                        <CheckIcon className="w-5 h-5 mr-2 text-white" />
                                                        Registered
                                                    </>
                                                ) : isRegistrationOpen ? (
                                                    <>
                                                        <PencilIcon className="w-5 h-5 mr-2 text-white" />
                                                        Register
                                                    </>
                                                ) : (
                                                    <>
                                                        <LockClosedIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                        Closed
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
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
                    <div className="bg-white rounded-md mt-4 py-6 px-2 max-w-[1400px]">
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
                            <h2 className="text-2xl text-black font-bold">{training.subject}</h2>
                            {training.details && (
                                <div className="flex flex-col lg:flex-row lg:space-x-[10%] mt-4">
                                    {/* Details Section */}
                                    <div
                                        className="flex-grow lg:max-w-[60%] text-black/70"
                                        dangerouslySetInnerHTML={{ __html: training.details }}
                                    />
                                    {/* Point of Contact Section */}
                                    <div className="flex-shrink lg:max-w-[30%] mt-4 lg:mt-0">
                                        <h3 className="text-xl text-black/90 font-semibold">Point Of Contact</h3>
                                        <div className="flex flex-col space-y-4 mt-4">
                                            <div className="flex items-center">
                                                <UserIcon className="w-5 h-5 mr-2 text-black/80" />
                                                <p className="text-black/70">{training.contact?.first_name + " " + training.contact?.last_name}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <PhoneIcon className="w-5 h-5 mr-2 text-black/80" />
                                                <p className="text-black/70">{training.contact?.["phone_primary.phone_numeric"]}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <EnvelopeOpenIcon className="w-5 h-5 mr-2 text-black/80" />
                                                <p className="text-black/70">{training.contact?.["email_primary.email"]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </header>
                        <br />
                        {/* Schedules */}
                        <h3 className="text-xl text-black/90 font-semibold">Training Schedule</h3>
                        <br />
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider"><strong>Training Date</strong></th>
                                        <th className="px-2 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider"><strong>Participants</strong></th>
                                        <th className="hidden lg:table-cell px-2 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider"><strong>Registration End</strong></th>
                                        <th className="hidden md:table-cell px-2 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider"><strong>Register</strong></th>
                                        <th className="px-2 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                {schedules.length === 0 ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-black-500">
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
                </div>
            )}
        </Wrapper>
    );
}
