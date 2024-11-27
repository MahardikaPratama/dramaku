import React, { useState } from "react";

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword === confirmNewPassword) {
            alert("Password changed successfully.");
        } else {
            alert("Passwords do not match.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="flex flex-col w-full max-w-lg bg-gray-800 rounded-lg shadow-lg md:flex-row md:max-w-4xl">
                {/* Form Change Password */}
                <div className="w-full p-6 md:w-1/2 md:px-8 lg:px-12">
                    <h2 className="mb-4 text-xl font-bold text-center text-white">Change Password</h2>
                    <form onSubmit={handlePasswordChange}>
                        <div className="mb-3">
                            <label htmlFor="new-password" className="block mb-1 text-sm font-semibold text-gray-400">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="new-password"
                                    name="new-password"
                                    placeholder="New Password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex mt-4">
                                <input
                                    id="toggleNewPasswordCheckbox"
                                    type="checkbox"
                                    checked={showNewPassword}
                                    onChange={() => setShowNewPassword(!showNewPassword)}
                                    className="shrink-0 mt-0.5 border-gray-700 rounded text-orange-500 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-orange-500 dark:checked:border-orange-500 dark:focus:ring-offset-gray-800"
                                />
                                <label htmlFor="toggleNewPasswordCheckbox" className="ml-3 text-sm text-gray-400">Show password</label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirm-new-password" className="block mb-1 text-sm font-semibold text-gray-400">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    id="confirm-new-password"
                                    name="confirm-new-password"
                                    placeholder="Confirm New Password"
                                    required
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    className="w-full p-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex mt-4">
                                <input
                                    id="toggleConfirmNewPasswordCheckbox"
                                    type="checkbox"
                                    checked={showConfirmNewPassword}
                                    onChange={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    className="shrink-0 mt-0.5 border-gray-700 rounded text-orange-500 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-orange-500 dark:checked:border-orange-500 dark:focus:ring-offset-gray-800"
                                />
                                <label htmlFor="toggleConfirmNewPasswordCheckbox" className="ml-3 text-sm text-gray-400">Show password</label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <button
                                type="submit"
                                className="w-full p-2 text-sm font-semibold text-white transition bg-orange-600 rounded-lg hover:bg-orange-700"
                            >
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* Ilustrasi Gambar */}
                <div className="hidden w-full p-6 md:block md:w-1/2">
                    <img
                        src="https://th.bing.com/th/id/OIP.h8qCr42qmI2JNiJJSh5EBQHaEK?rs=1&pid=ImgDetMain"
                        alt="Ilustrasi Change Password"
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
