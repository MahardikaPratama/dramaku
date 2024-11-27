import React from "react";
import { useQuery } from "react-query";
import SidebarUser from "../components/SidebarUser";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Error from "../components/Error";
import userService from "../services/user.service";
import "../css/dashboard.css";

const Profile = () => {
    // Fetch user profile data using useQuery
    const {
        data: user,
        isLoading,
        isError,
    } = useQuery("userProfile", async () => {
        const response = await userService.getProfile();
        console.log("Fetched user data:", response.data); 
        return response.data;
    });

    const defaultProfileImage = "https://cdn.idntimes.com/content-images/post/20240207/33bac083ba44f180c1435fc41975bf36-ca73ec342155d955387493c4eb78c8bb.jpg";

    if (isLoading) return <Loading />;
    if (isError) return <Error />;

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
                {/* Sidebar Component */}
                <SidebarUser />

                <main className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800">
                        <h1 className="text-3xl font-semibold text-white">
                            User Profile
                        </h1>
                    </div>

                    <section className="container p-4 mx-auto bg-gray-800 rounded-md shadow-md">
                        <div className="flex items-center space-x-4">
                            <img
                                src={user.foto_profil_url || defaultProfileImage}
                                alt="User Profile"
                                className="w-24 h-24 border-4 border-gray-700 rounded-full"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {user.username}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="mb-2 text-lg font-semibold text-gray-300">
                                Profile Information
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="p-4 bg-gray-700 rounded-md">
                                    <h4 className="text-sm font-semibold text-gray-400">
                                        Username
                                    </h4>
                                    <p className="text-white">
                                        {user.username}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-700 rounded-md">
                                    <h4 className="text-sm font-semibold text-gray-400">
                                        Email
                                    </h4>
                                    <p className="text-white">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Footer */}
            <Footer className="sticky bottom-0 w-full" />
        </div>
    );
};

export default Profile;
