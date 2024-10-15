import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Contact } from "../../../../utils/classes/Contact";

interface HeaderProps {
    contact: Contact;
}

export default function Header(props: HeaderProps) {
    return <div className="relative p-6 md:p-10 bg-[#dce4f4] shadow-md justify-between items-center rounded-lg w-full">
        <div className="flex flex-col md:flex-row items-center w-full">
            <div className="mb-4 md:mb-0 md:mr-2 flex-shrink-0">
                <img src="https://th.bing.com/th/id/R.d995d728def36a40a261e36bab9f9bfe?rik=LDZuJgLPtIzgZw&riu=http%3a%2f%2fromanroadtrust.co.uk%2fwp-content%2fuploads%2f2018%2f01%2fprofile-icon-png-898.png&ehk=WfpwpBbTdOcQK51xzwmVamkbadbdbzi2tYDYnK8V2hM%3d&risl=&pid=ImgRaw&r=0" alt="Profile" className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white overflow-hidden" />
            </div>
            <div className="md:ml-3 lg:ml-4 mb-2 md:mb-0 text-center md:text-left">
                <h1 className="flex font-semibold text-3xl gap-x-2">
                    <span className="hidden md:block">Welcome,</span>{props.contact.first_name} {props.contact.last_name ? props.contact.last_name : ""}
                </h1>
                <h2 className="text-lg text-gray-700">{props.contact["email_primary.email"]}</h2>
            </div>
        </div>
        {/* Profile Button */}
        <div className="absolute top-5 right-5">
            <Link className="text-secondary hover:text-[#495b92] cursor-pointer" to="/profile">
                <FiEdit className="w-6 h-6 md:w-8 md:h-8" />
            </Link>
        </div>
    </div>
}