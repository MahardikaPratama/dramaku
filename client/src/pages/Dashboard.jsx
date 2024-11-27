import React from "react";
import { useQuery } from "react-query";
import SidebarAdmin from "../components/SidebarAdmin";
import Footer from "../components/Footer";
import "../css/dashboard.css";
import movieDataService from "../services/movie.service";
import Loading from "../components/Loading";  
import Error from "../components/Error";    

const AdminDramaDashboard = () => {
    // Fetching data using useQuery hooks at the top level
    const { data: total, isLoading: movieLoading, isError: movieError } = useQuery("total", async () => {
        const response = await movieDataService.getTotals();
        return response.data;
    });


    if (movieLoading) return <Loading />;  
    if (movieError) return <Error />;

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
                {/* Sidebar */}
                <SidebarAdmin />

                <div className="flex flex-col w-full">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between p-4 bg-gray-800">
                        <h1 className="text-3xl font-semibold text-white">Movies Dashboard</h1>
                    </div>

                    {/* Movie Table */}
                    <div className="flex-1 p-6 bg-gray-900">
                        {/* Dashboard Stats */}
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center p-4 text-left bg-gray-700 bg-opacity-50 rounded-md shadow-md">
                                <i className="mr-4 text-3xl text-red-500 fas fa-film"></i>
                                <div>
                                    <h2 className="mb-1 text-base font-semibold text-white">Total Movies</h2>
                                    <p className="text-sm text-white">{total.totalMovies}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 text-left bg-gray-700 bg-opacity-50 rounded-md shadow-md">
                                <i className="mr-4 text-3xl text-orange-500 fas fa-globe"></i>
                                <div>
                                    <h2 className="mb-1 text-base font-semibold text-white">Total Countries</h2>
                                    <p className="text-sm text-white">{total.totalCountries}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 text-left bg-gray-700 bg-opacity-50 rounded-md shadow-md">
                                <i className="mr-4 text-3xl text-slate-500 fas fa-trophy"></i>
                                <div>
                                    <h2 className="mb-1 text-base font-semibold text-white">Total Awards</h2>
                                    <p className="text-sm text-white">{total.totalAwards}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 text-left bg-gray-700 bg-opacity-50 rounded-md shadow-md">
                                <i className="mr-4 text-3xl text-lime-500 fas fa-tags"></i>
                                <div>
                                    <h2 className="mb-1 text-base font-semibold text-white">Total Genres</h2>
                                    <p className="text-sm text-white">{total.totalGenres}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 text-left bg-gray-700 bg-opacity-50 rounded-md shadow-md">
                                <i className="mr-4 text-3xl text-blue-500 fas fa-theater-masks"></i>
                                <div>
                                    <h2 className="mb-1 text-base font-semibold text-white">Total Actors</h2>
                                    <p className="text-sm text-white">{total.totalActors}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 text-left bg-gray-700 bg-opacity-50 rounded-md shadow-md">
                                <i className="mr-4 text-3xl text-purple-500 fas fa-comments"></i>
                                <div>
                                    <h2 className="mb-1 text-base font-semibold text-white">Total Reviews</h2>
                                    <p className="text-sm text-white">{total.totalComments}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 text-left bg-gray-700 bg-opacity-50 rounded-md shadow-md">
                                <i className="mr-4 text-3xl text-yellow-500 fas fa-users"></i>
                                <div>
                                    <h2 className="mb-1 text-base font-semibold text-white">Total Users</h2>
                                    <p className="text-sm text-white">{total.totalUsers}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer className="sticky bottom-0 w-full" />
                </div>
            </div>
        </div>
    );
};

export default AdminDramaDashboard;
