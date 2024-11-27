import React, { useState, useMemo, useEffect } from "react";
import SidebarAdmin from '../components/SidebarAdmin';
import Footer from '../components/Footer';
import { useQuery, useQueryClient } from "react-query";
import PaginationAdmin from '../components/PaginationAdmin';
import userDataService from "../services/user.service";
import '../css/style.css';
import Loading from "../components/Loading";  
import Error from "../components/Error";

const CmsUsers = () => {
    const queryClient = useQueryClient();

    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchedTerm('');
        } else {
            setSearchedTerm(searchTerm);
        }
    }, [searchTerm]);

    const { data, isLoading, isError } = useQuery(
        ['users', { searchTerm, currentPage }],
        async () => {
            console.log("Fetching users with:", { searchTerm, currentPage });
            if (searchTerm) {
                const response = await userDataService.searchUserByUsername(searchTerm, currentPage, entriesPerPage);
                return response.data;
            } else {
                const response = await userDataService.getAll(currentPage, entriesPerPage);
                return response.data;
            }
        },
        {
            keepPreviousData: true,
        }
    );

    useEffect(() => {
        if (searchTerm) {
            setSearchResults(data?.users || []);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, data]);

    const users = useMemo(() => {
        return Array.isArray(data?.users) ? data.users : [];
    }, [data]);


    const totalEntries = data?.totalEntries || 0;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userDataService.updateRole(userId, { role: newRole });
            queryClient.invalidateQueries('users');
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    const handleStatusToggle = async (userId) => {
        try {
            const user = users.find(user => user.user_id === userId);
            await userDataService.updateStatusSuspend(userId, { is_suspended: !user.is_suspended });
            queryClient.invalidateQueries('users');
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (isLoading) return <Loading />;
    if (isError) return <Error />;

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
                <SidebarAdmin 
                    isVisible={isSidebarVisible}
                    toggleSidebar={toggleSidebar}
                />

                <main className="flex-1 p-4 md:p-6">
                    <button
                        id="hamburger"
                        className="p-2 text-gray-400 md:hidden focus:outline-none"
                        onClick={toggleSidebar}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>

                    <section className="container p-4 mx-auto bg-gray-800 rounded-md shadow-md md:p-6">
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full p-2 px-4 text-gray-300 bg-gray-900 border-gray-700 rounded-md md:w-auto focus:ring focus:ring-orange-500"
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-gray-300 bg-gray-800">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2 text-left border-b border-gray-600">#</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Username</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Email</th>
                                        <th className="px-4 py-2 border-b border-gray-600">Role</th>
                                        <th className="px-4 py-2 border-b border-gray-600">Status Suspend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedTerm ? (
                                        searchResults.length > 0 ? (
                                            searchResults.map((user, index) => (
                                                <tr key={user.user_id} className={`bg-gray-800 ${index % 2 === 0 ? 'odd:bg-gray-700' : ''}`}>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {index + 1 + (currentPage - 1) * entriesPerPage}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">{user.username}</td>
                                                    <td className="px-4 py-2 border-b border-gray-600">{user.email}</td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                                            className="text-gray-300 transition duration-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring focus:ring-orange-500"
                                                        >
                                                            <option value="ADMIN" className="bg-gray-800">ADMIN</option>
                                                            <option value="USER" className="bg-gray-800">USER</option>
                                                        </select>
                                                    </td>
                                                    <td className="flex items-center justify-center px-4 py-2 border-b border-gray-600">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={user.is_suspended}
                                                                onChange={() => handleStatusToggle(user.user_id)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                                                    No results found for <span className="text-orange-600">"{searchedTerm}"</span>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        users.map((user, index) => (
                                            <tr key={user.user_id} className={`bg-gray-800 ${index % 2 === 0 ? 'odd:bg-gray-700' : ''}`}>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {index + 1 + (currentPage - 1) * entriesPerPage}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">{user.username}</td>
                                                <td className="px-4 py-2 border-b border-gray-600">{user.email}</td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                                        className="text-gray-300 transition duration-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring focus:ring-orange-500"
                                                    >
                                                        <option value="ADMIN" className="bg-gray-800">ADMIN</option>
                                                        <option value="USER" className="bg-gray-800">USER</option>
                                                    </select>
                                                </td>
                                                <td className="flex items-center justify-center px-4 py-2 border-b border-gray-600">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={user.is_suspended}
                                                            onChange={() => handleStatusToggle(user.user_id)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <PaginationAdmin 
                            currentPage={currentPage} 
                            totalEntries={totalEntries} 
                            entriesPerPage={entriesPerPage} 
                            onPageChange={handlePageChange} 
                        />
                    </section>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default CmsUsers;