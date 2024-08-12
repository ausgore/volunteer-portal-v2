import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import O8Logo from "../../../assets/O8Logo.png";
import { PiSignOutBold } from "react-icons/pi";
import { LuCalendarRange } from "react-icons/lu";
import axios from "axios";
import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal";
import SignOut from "../../../assets/SignOut.png";
import config from "../../../../config";
import { GiHamburgerMenu } from "react-icons/gi";

interface NavbarProps {
    className: string;
}

export default function Navbar(props: NavbarProps) {
    const [isSigningOut, setIsSigningOut] = useState(false);
    const signOut = async () => {
        setIsSigningOut(true);
        await axios.get(`${config.domain}/portal/api/logout.php`);
        window.location.href = `${config.domain}/wp-login.php?redirect_to=${encodeURIComponent(window.location.href)}`;
    }

    const [showModal, setShowModal] = useState(false);

    // Open modal
    const openModal = () => {
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    }
    // Close modal
    const closeModal = () => {
        setShowModal(false);
        document.body.style.overflow = '';
    };

    const [menuOpen, setMenuOpen] = useState(false);


    return <>
        <ConfirmationModal showModal={showModal} closeModal={closeModal} image={SignOut} imageWidth="max-w-[260px]" imageHeight="h-[160px]">
            <h1 className="font-semibold text-[16px] mt-4 text-gray-400">Are you sure you want to sign out?</h1>
            <button className="text-sm font-semibold bg-secondary disabled:bg-primary rounded-md p-2 w-[180px] text-white self-center mt-4" onClick={signOut} disabled={isSigningOut}>
                {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
            <p className="font-semibold mt-3 text-gray-400 cursor-pointer" onClick={closeModal}>Cancel</p>
        </ConfirmationModal>
        <nav className={`h-full fixed bg-white flex-col hidden md:flex z-[11] ${props.className}`}>
            {/* Responsible for the image */}
            <div className="p-4 flex items-center">
                <img src={O8Logo} />
            </div>
            {/* Navigation */}
            <div className="mt-6 flex flex-col justify-between h-full">
                <div>
                    <Link to="/">
                        <div className="hover:bg-primary/30 text-secondary hover:text-secondary/90 border-l-[5px] border-l-transparent hover:border-l-secondary/70 font-semibold flex pl-12 py-2 mb-2 items-center gap-x-4">
                            <RxDashboard />
                            <span>Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/events">
                        <div className="hover:bg-primary/30 text-secondary hover:text-secondary/90 border-l-[5px] border-l-transparent hover:border-l-secondary/70 font-semibold flex pl-12 py-2 mb-2 items-center gap-x-4">
                            <LuCalendarRange />
                            <span>All Events</span>
                        </div>
                    </Link>
                    <Link to="/profile">
                        <div className="hover:bg-primary/30 text-secondary hover:text-secondary/90 border-l-[5px] border-l-transparent hover:border-l-secondary/70 font-semibold flex pl-12 py-2 mb-2 items-center gap-x-4">
                            <CgProfile />
                            <span>Profile</span>
                        </div>
                    </Link>
                </div>
                <button onClick={openModal} className="hover:bg-primary/30 text-secondary hover:text-secondary/90 border-l-[5px] border-l-transparent hover:border-l-secondary/70 font-semibold flex pl-12 py-2 mb-2 items-center gap-x-4">
                    <PiSignOutBold />
                    <span>Sign Out</span>
                </button>
            </div>
        </nav>
        {menuOpen && <div className="h-full w-screen bg-black opacity-30 z-[11] fixed md:hidden" onClick={() => setMenuOpen(false)} />}
        <nav className="w-full fixed bg-white flex flex-col z-20 md:hidden">
            <div className="flex justify-between h-20 items-center px-6">
                {/* Responsible for the image */}
                <div className="p-4 w-[220px] flex items-center">
                    <img src={O8Logo} />
                </div>
                {/* Button */}
                <button className={`text ${menuOpen ? "text-secondary" : "text-primary"} hover:text-secondary`} onClick={() => setMenuOpen(!menuOpen)}>
                    <GiHamburgerMenu size={24} />
                </button>
            </div>
            {menuOpen && <>
                <hr />
                <div className="flex flex-col pt-2">
                    <Link to="/">
                        <div className="text-center hover:bg-primary/30 text-secondary hover:text-secondary/90 font-semibold flex pl-12 py-2 mb-2 items-center gap-x-4">
                            Dashboard
                        </div>
                    </Link>
                    <Link to="/events">
                        <div className="text-center hover:bg-primary/30 text-secondary hover:text-secondary/90 font-semibold flex pl-12 py-2 mb-2 items-center gap-x-4">
                            All Events
                        </div>
                    </Link>
                    <Link to="/profile">
                        <div className="text-center hover:bg-primary/30 text-secondary hover:text-secondary/90 font-semibold flex pl-12 py-2 mb-2 items-center gap-x-4">
                            Profile
                        </div>
                    </Link>
                    <button onClick={openModal} className="text-center hover:bg-primary/30 text-secondary hover:text-secondary/90 font-semibold flex pl-12 py-2 mb-2 items-center gap-x-4">
                        <span>Sign Out</span>
                    </button>
                </div>
            </>}
        </nav>
    </>
}