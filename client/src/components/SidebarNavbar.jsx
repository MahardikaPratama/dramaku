import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import countryDataService from "../services/country.service";
import userDataService from "../services/user.service";
import CountryButton from "./CountryButton";

const SidebarNavbar = ({ onCountryFilter, currentFilter, searchTerm, onSearchChange, searchResults }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login
    const searchResultsRef = useRef(null);
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    // isi dengan link gambar default profil kosong atau polos
    const DefaultPreviewImage ="https://cdn.idntimes.com/content-images/post/20240207/33bac083ba44f180c1435fc41975bf36-ca73ec342155d955387493c4eb78c8bb.jpg";


    const {
        data: countries,
        isLoading: countryLoading,
        isError: countryError,
    } = useQuery("countries", async () => {
        const response = await countryDataService.getAll();
        return response.data;
    }, {
        staleTime: 300000, // Cache data selama 5 menit
        refetchOnWindowFocus: false, // Hindari refetch saat kembali ke window
    });


    const fetchUserData = async () => {
        try {
            const response = await userDataService.getProfile();
            if (response.data) {
                setUserName(response.data.username);
                setUserEmail(response.data.email);
                setUserRole(response.data.role);
                setPreviewImage(response.data.foto_profil_url);
                setIsLoggedIn(true); // Set status login menjadi true jika data pengguna berhasil diambil
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setIsLoggedIn(false); // Set status login menjadi false jika ada error
        }
    };

    useEffect(() => {
        fetchUserData(); // Panggil API untuk mendapatkan data pengguna saat komponen dimuat
    }, []);

    const handleProfileClick = () => {
        toggleDropdown();
    };

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchResultsRef]);

    const handleLogout = async () => {
        try {
            await userDataService.logout(); // Panggil API untuk logout pengguna
            setIsLoggedIn(false); // Ubah status login menjadi false
            navigate('/'); // Redirect ke halaman utama
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Check loading state and errors
    if (countryLoading)
        return <p>Loading data...</p>;
    if (countryError)
        return <p>Error loading data</p>;

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <button
                                onClick={toggleSidebar}
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                    />
                                </svg>
                            </button>
                            <a href="/" className="flex items-center ms-2 md:me-24">
                                <img
                                    src="https://res.cloudinary.com/dnw6u159c/image/upload/v1732899238/tksjaqibiihmty918wwm.png"
                                    className="h-8 bg-white border rounded-full me-3"
                                    alt="Dramaku Logo"
                                />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    Dramaku
                                </span>
                            </a>
                        </div>

                        {/* Search Bar for Desktop */}
                        <div className="relative items-center hidden w-full max-w-md mx-5 md:flex">
                            <form  className="relative w-full">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        onSearchChange(e); // Panggil fungsi pencarian
                                        setShowSearchResults(true); // Tampilkan hasil pencarian saat mengetik
                                    }}
                                    className="block w-full p-3 pl-12 text-sm text-gray-900 border border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Search Movie..."
                                />
                                {showSearchResults && searchResults.length > 0 && (
                                    <ul ref={searchResultsRef} className="absolute z-10 w-full overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg max-h-60">
                                        {searchResults.slice(0, 5).map((result) => (
                                            <li 
                                                key={result.id} 
                                                className="flex items-center p-2 cursor-pointer hover:bg-gray-700"
                                                onClick={() => navigate(`/movies/${result.movie_id}`)}
                                            >
                                                <img src={result.poster_url} alt={result.title} className="w-12 h-16 mr-2 rounded" />
                                                <span className="text-white">{result.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}



                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                            </form>
                        </div>


                        {/* Profile Icon and Dropdown */}
                        <div className="flex items-center ms-3">
                            <button
                                type="button"
                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                onClick={handleProfileClick} // Ganti onClick menjadi handleProfileClick
                            >
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src={previewImage || DefaultPreviewImage}
                                    alt="User"
                                />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute z-20 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-md top-12 right-5">
                                    {isLoggedIn ? (
                                        <ul className="py-1">
                                            <li className="p-4">
                                                <p className="text-sm font-medium text-gray-100">{userName}</p>
                                                <p className="text-sm text-gray-400 break-words">{userEmail}</p>
                                            </li>
                                            {userRole === 'ADMIN' && (
                                                <li>
                                                    <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">CMS Admin</a>
                                                </li>
                                            )}
                                            {userRole === 'USER' && (
                                                <li>
                                                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</a>
                                                </li>
                                            )}
                                            <li>
                                            <button
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    ) : (
                                        <ul className="py-1">
                                            <li>
                                                <a href="/login" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Login</a>
                                            </li>
                                            <li>
                                                <a href="/register" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Register</a>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } sm:translate-x-0`}
            >
                <div className="h-full px-3 pb-4 overflow-y-auto">
                    {/* Search Form in Sidebar for Mobile */}
                    <div className="relative mt-3 md:hidden"> {/* Hidden on desktop */}
                        <form >
                            <input
                                type="text"
                                value={searchTerm} 
                                onChange={onSearchChange} 
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
                                placeholder="Search..."
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>

                            </div>
                        </form>
                    </div>

                    <ul className="mt-3 space-y-2 font-medium">
                        <li>
                            <button
                                onClick={() => onCountryFilter('')}
                                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                                    currentFilter === '' ? 'bg-gray-700' : 'hover:bg-gray-700'
                                } w-full text-left`}
                            >
                                <i className="mr-4 fas fa-film"></i>
                                All Dramas
                            </button>
                        </li>
                        {countries.data && countries.totalEntries > 0 && countries.data.map((country) => (
                            <CountryButton
                                key={country.country_name}
                                country={country.country_name}
                                flagUrl={country.flag_url}
                                isSelected={currentFilter === country.country_name}
                                onClick={onCountryFilter}
                            />
                        ))}

                    </ul>
                </div>
            </aside>
        </>
    );
};

export default SidebarNavbar;
