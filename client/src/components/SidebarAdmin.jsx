import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faFilm,
    faCheck,
    faPlus,
    faGlobe,
    faTrophy,
    faTags,
    faUser,
    faComments,
    faUsers,
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const SidebarAdmin = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    };

    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };

    const isActiveLink = (path) => location.pathname === path;

    return (
        <>
            <header className="flex items-center justify-between bg-gray-900">
                <button
                    className="p-2 text-white md:hidden"
                    onClick={toggleSidebar}
                >
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
            </header>

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ${
                    isVisible ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:relative md:w-1/5`}
            >
                <div className="relative p-6">
                    <button
                        className="absolute p-2 text-gray-400 top-4 right-4 md:hidden"
                        onClick={toggleSidebar}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <h2 className="flex items-center mb-4 text-2xl text-white">
                        <img
                            src="https://i.pinimg.com/originals/2c/ae/fe/2caefe0fe73204830ee22868604390d5.png"
                            alt="Drama Icon"
                            className="w-6 h-6 p-1 mr-2 bg-white border rounded-full"
                        />
                        DramaKu
                    </h2>

                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/dashboard"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/dashboard")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faGlobe}
                                    className="mr-2"
                                />
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <button
                                className={`flex items-center justify-between w-full px-4 py-2 text-left text-gray-300 ${
                                    isActiveLink("/cms-drama") ||
                                    isActiveLink("/cms-drama-input")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                                onClick={toggleAccordion}
                            >
                                <span className="flex items-center">
                                    <FontAwesomeIcon
                                        icon={faFilm}
                                        className="mr-2"
                                    />
                                    Dramas
                                </span>
                                <span className="text-xl">
                                    {isAccordionOpen ? "−" : "+"}
                                </span>
                            </button>
                            <ul
                                className={`mt-2 ml-4 space-y-2 ${
                                    isAccordionOpen ? "block" : "hidden"
                                }`}
                            >
                                <li>
                                    <Link
                                        to="/cms-drama"
                                        className={`block px-4 py-2 text-gray-300 rounded-md ${
                                            isActiveLink("/cms-drama")
                                                ? "bg-gray-700"
                                                : "hover:bg-gray-700"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="mr-2"
                                        />
                                        Validate
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/cms-drama-input"
                                        className={`block px-4 py-2 text-gray-300 rounded-md ${
                                            isActiveLink("/cms-drama-input")
                                                ? "bg-gray-700"
                                                : "hover:bg-gray-700"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className="mr-2"
                                        />
                                        Input New Drama
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link
                                to="/cms-country"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/cms-country")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faGlobe}
                                    className="mr-2"
                                />
                                Countries
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cms-awards"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/cms-awards")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faTrophy}
                                    className="mr-2"
                                />
                                Awards
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cms-genres"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/cms-genres")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faTags}
                                    className="mr-2"
                                />
                                Genres
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cms-actors"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/cms-actors")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-2"
                                />
                                Actors
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cms-comments"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/cms-comments")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faComments}
                                    className="mr-2"
                                />
                                Reviews
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cms-users"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/cms-users")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faUsers}
                                    className="mr-2"
                                />
                                Users
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/login"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/login")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faSignOutAlt}
                                    className="mr-2"
                                />
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default SidebarAdmin;
