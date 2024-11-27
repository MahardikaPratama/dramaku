import React from "react";

const ForgotPassword = () => {

    const handleResetPassword = () => {
        alert("Link reset password telah dikirim ke email Anda.");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="flex flex-col w-full max-w-lg bg-gray-800 rounded-lg shadow-lg md:flex-row md:max-w-4xl">
                {/* Form Forgot Password */}
                <div className="w-full p-6 md:w-1/2 md:px-8 lg:px-12">
                    <h2 className="mb-4 text-xl font-bold text-center text-white">Forgot Password</h2>
                    <p className="mb-4 text-sm text-center text-gray-300">
                        Enter your email address below and we'll send you a link to reset your password.
                    </p>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-400">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                required
                                className="w-full p-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        <div className="mb-3">
                            <button
                                type="button"
                                id="resetPasswordButton"
                                onClick={handleResetPassword}
                                className="w-full p-2 text-sm font-semibold text-white transition bg-orange-600 rounded-lg hover:bg-orange-700"
                            >
                                Send Reset Link
                            </button>
                        </div>
                        <div className="text-center">
                            <a href="/login" class="text-sm text-blue-400 hover:underline">Back to Login</a>
                        </div>
                    </form>
                </div>

                {/* Ilustrasi Gambar */}
                <div className="hidden w-full p-6 md:block md:w-1/2">
                    <img
                        src="https://th.bing.com/th/id/OIP.h8qCr42qmI2JNiJJSh5EBQHaEK?rs=1&pid=ImgDetMain"
                        alt="Ilustrasi Forgot Password"
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
