import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faUser,
    faEdit,
    faHeart,
    faPlus,
    faFilm,
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const SidebarUser = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsVisible(!isVisible);
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

                    <h2 className="text-2xl text-white">User Menu</h2>

                    <ul className="mt-4 space-y-2">
                        <li>
                            <Link
                                to="/profile"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/profile")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/update-profile"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/update-profile")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Update Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/wishlist-movies"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/wishlist-movies")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon icon={faHeart} className="mr-2" />
                                Wishlist Movies
                            </Link>
                        </li>
                        {/* Daftar drama yang diinput user */}
                        <li>
                            <Link
                                to="/user-dramas"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/user-dramas")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon icon={faFilm} className="mr-2" />
                                User Dramas
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/input-new-drama"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/input-new-drama")
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Input New Drama
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/login"
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    isActiveLink("/logout")
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

export default SidebarUser;
