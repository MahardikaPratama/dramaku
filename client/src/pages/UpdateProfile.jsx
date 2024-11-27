import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import SidebarUser from "../components/SidebarUser";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Error from "../components/Error";
import userDataService from "../services/user.service";
import "../css/dashboard.css";

const UpdateProfile = () => {
    const queryClient = useQueryClient();
    const [previewImage, setPreviewImage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [newProfile, setNewProfile] = useState({ username: "", foto_profil_url: null });

    const defaultProfileImage =
        "https://cdn.idntimes.com/content-images/post/20240207/33bac083ba44f180c1435fc41975bf36-ca73ec342155d955387493c4eb78c8bb.jpg";

    // Fetch user profile data
    const { isLoading, isError } = useQuery(
        "userProfile",
        async () => {
            const response = await userDataService.getProfile();
            setNewProfile(response.data); // Set initial profile data
            setPreviewImage(response.data.foto_profil_url || defaultProfileImage); // Set initial profile image
            return response.data;
        },
        { refetchOnWindowFocus: false }
    );

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    // Handle removing profile image
    const handleRemoveImage = () => {
        setPreviewImage(defaultProfileImage);
        setImageFile(null); // Clear the selected file
        setNewProfile({ ...newProfile, foto_profil_url: null }); // Clear the file in newProfile
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedProfile = {
                ...newProfile,
                foto_profil_url: imageFile || null, // Pass the file if updated, otherwise null
            };
            console.log("Updated Profile: ", updatedProfile);
            await userDataService.updateProfile(updatedProfile.user_id, updatedProfile);
            setFeedbackMessage({ type: "success", text: "Profile updated successfully!" });
            queryClient.invalidateQueries("userProfile");
        } catch (error) {
            setFeedbackMessage({ type: "error", text: "Failed to update profile. Please try again." });
        } finally {
            setImageFile(null); // Clear the selected file
            newProfile.foto_profil_url = null; // Clear the file in newProfile
            newProfile.username = ""; // Clear the username
        }

        // Clear feedback after a delay
        setTimeout(() => setFeedbackMessage(null), 3000);
    };

    // Handle username change
    const handleUsernameChange = (e) => {
        setNewProfile({ ...newProfile, username: e.target.value });
    };

    // Loading and error handling
    if (isLoading) return <Loading />;
    if (isError) return <Error />;

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
                <SidebarUser />
                <main className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800">
                        <h1 className="text-3xl font-semibold text-white">Update Profile</h1>
                    </div>
                    <section className="container p-4 mx-auto bg-gray-900">
                        <form
                            className="p-6 space-y-6 bg-gray-800 rounded-lg shadow-md"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex flex-col items-center">
                                <img
                                    src={previewImage}
                                    alt="Profile Preview"
                                    className="object-cover w-24 h-24 mb-4 rounded-full"
                                />
                                <label
                                    htmlFor="fileInput"
                                    className="px-4 py-2 mt-2 text-sm font-medium text-white transition duration-200 bg-orange-600 rounded cursor-pointer hover:bg-orange-700"
                                >
                                    Choose Image
                                </label>
                                <input
                                    type="file"
                                    id="fileInput"
                                    name="foto_profil_url"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="px-4 py-2 mt-2 text-sm font-medium text-white transition duration-200 bg-red-600 rounded hover:bg-red-700"
                                >
                                    Remove Image
                                </button>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="username" className="text-sm text-gray-400">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={newProfile.username}
                                    onChange={handleUsernameChange}
                                    className="p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 mt-4 font-semibold text-white transition duration-200 bg-orange-600 rounded hover:bg-orange-700"
                            >
                                Save Changes
                            </button>
                            {feedbackMessage && (
                                <div
                                    className={`mt-4 p-4 text-center rounded-lg ${
                                        feedbackMessage.type === "success" ? "bg-green-500" : "bg-red-500"
                                    }`}
                                >
                                    {feedbackMessage.text}
                                </div>
                            )}
                        </form>
                    </section>
                </main>
            </div>
            <Footer className="sticky bottom-0 w-full" />
        </div>
    );
};

export default UpdateProfile;
