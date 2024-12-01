import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import userDataService from "../services/user.service";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState(["", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordWarnings, setPasswordWarnings] = useState([]);
    const [timeLeft, setTimeLeft] = useState(180); // 3-minute countdown
    const [canResend, setCanResend] = useState(false);
    const tokenInputRefs = useRef([]);
    const navigate = useNavigate();

    // Countdown timer for token expiration
    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft <= 0) {
            setCanResend(true);
        }
    }, [timeLeft, step]);

    const handleSendVerification = async () => {
        try {
            await userDataService.forgotPassword(email);
            setStep(2);
            setTimeLeft(180);
            setCanResend(false);
            setErrorMessage("Verification code has been sent to your email.");
        } catch (error) {
            setErrorMessage("Failed to send verification code. Please try again.");
        }
    };

    const handleResendToken = async () => {
        try {
            await userDataService.resendVerificationToken(email);
            setTimeLeft(180);
            setCanResend(false);
            setErrorMessage("New verification code sent to your email.");
        } catch (error) {
            setErrorMessage("Failed to resend verification code. Please try again.");
        }
    };

    const handleVerifyToken = async () => {
        const verificationCode = token.join("");
        try {
            await userDataService.verifyResetToken(email, verificationCode);
            setStep(3);
            setErrorMessage("Verification successful. Enter your new password.");
        } catch (error) {
            setErrorMessage("Invalid or expired verification code. Please request a new one.");
        }
    };

    const validatePassword = (password) => {
        const warnings = [];
        if (password.length < 8) warnings.push("Password must be at least 8 characters.");
        if (!/[A-Z]/.test(password)) warnings.push("Include at least one uppercase letter.");
        if (!/[a-z]/.test(password)) warnings.push("Include at least one lowercase letter.");
        if (!/[0-9]/.test(password)) warnings.push("Include at least one number.");
        if (!/[@$!%*?&]/.test(password)) warnings.push("Include at least one special character (@$!%*?&).");

        setPasswordWarnings(warnings);
        return warnings.length === 0;
    };

    const handleResetPassword = async () => {
        if (!validatePassword(newPassword)) {
            setErrorMessage("Password does not meet the requirements.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            await userDataService.resetPassword(email, newPassword);
            setStep(4);
            setErrorMessage("Password reset successful. You can now log in with your new password.");
        } catch (error) {
            setErrorMessage("Failed to reset password. Please try again.");
        }
    };

    const handleTokenInputChange = (e, index) => {
        const newToken = [...token];
        newToken[index] = e.target.value;
        setToken(newToken);

        if (e.target.value && index < 3) {
            tokenInputRefs.current[index + 1].focus();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-bold text-center text-white">
                    {step === 1 && "Forgot Password"}
                    {step === 2 && "Enter Verification Code"}
                    {step === 3 && "Create New Password"}
                    {step === 4 && "Password Reset Successful"}
                </h2>
                {errorMessage && <p className="mb-3 text-sm text-center text-red-500">{errorMessage}</p>}
                
                {step === 1 && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mb-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
                        />
                        <button
                            onClick={handleSendVerification}
                            className="w-full p-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Send Verification Code
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="flex justify-center space-x-2">
                            {token.map((value, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (tokenInputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={value}
                                    onChange={(e) => handleTokenInputChange(e, index)}
                                    className="w-12 h-12 text-lg text-center text-white bg-gray-900 border border-gray-600 rounded focus:outline-none"
                                />
                            ))}
                        </div>
                        {timeLeft > 0 ? (
                            <p className="mt-3 text-sm text-gray-300">
                                Token expires in: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
                            </p>
                        ) : (
                            <p className="mt-3 text-sm text-red-500">Token has expired. Please request a new one.</p>
                        )}
                        <button
                            onClick={handleVerifyToken}
                            className="w-full p-2 mt-6 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Verify
                        </button>
                        {canResend && (
                            <button
                                onClick={handleResendToken}
                                className="w-full p-2 mt-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                            >
                                Resend Verification Code
                            </button>
                        )}
                    </>
                )}

                {step === 3 && (
                    <>
                        <label className="mb-2 text-gray-300">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                                className="w-full p-2 mb-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <ul className="pl-5 mt-2 text-sm text-red-500 list-disc">
                            {passwordWarnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                        <label className="mb-2 text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 mb-3 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
                        />
                        <button
                            onClick={handleResetPassword}
                            className="w-full p-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Reset Password
                        </button>
                    </>
                )}

                {step === 4 && (
                    <>
                        <p className="mb-4 text-sm text-gray-300">
                            Your password has been successfully reset. You can now log in with your new password.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full p-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Go to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;