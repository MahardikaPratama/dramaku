import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";

// const EmailVerification = ({ email }) => {
    const EmailVerification = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState(["", "", "", ""]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    // Get email from localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            navigate('/register'); // Redirect to register page if email is not found
        }
    }, [navigate]);    

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isSent) {
            setErrorMessage("Kode token telah kadaluarsa. Silakan kirim ulang.");
        }
    }, [timeLeft, isSent]);

    const handleInputChange = (e, index) => {
        const newToken = [...token];
        newToken[index] = e.target.value;
        setToken(newToken);

        if (e.target.value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = token.join("");
    
        try {
            console.log({ verification_token: verificationCode, email }); // Log data before sending
            await userService.verifyEmail({ verification_token: verificationCode, email });
            setTimeout(() => {
                navigate("/email-verified");
            }, 3000);
        } catch (error) {
            console.error("Verification error:", error);
            setErrorMessage("Kode token tidak valid atau sudah kadaluarsa.");
        }
    };    

    const handleResendVerification = async () => {
        setErrorMessage("");
        setIsSent(false);
        setTimeLeft(180); // Reset timer for new code
        setToken(["", "", "", ""]); // Reset input token

        try {
            await userService.resendVerificationToken(email);
            setIsSent(true);
        } catch (error) {
            setErrorMessage("Gagal mengirim ulang kode verifikasi.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-gray-300 bg-gray-900">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-bold text-center">Email Verification</h2>
                <p className="mt-4 text-center">
                    Masukkan kode verifikasi 4 digit yang dikirimkan ke email Anda.
                </p>
                <form onSubmit={handleSubmit} className="flex justify-center mt-6 space-x-3">
                    {token.map((value, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={value}
                            onChange={(e) => handleInputChange(e, index)}
                            className="w-12 h-12 text-lg text-center bg-gray-900 border border-gray-600 rounded focus:outline-none focus:border-orange-500"
                        />
                    ))}
                </form>
                <button
                    onClick={handleSubmit}
                    className="w-full py-2 mt-6 text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none"
                >
                    Verify
                </button>
                {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
                <button
                    onClick={handleResendVerification}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                >
                    Resend Verification Code
                </button>
                {isSent && <p className="mt-4 text-green-500">Verification code resent successfully.</p>}
                {timeLeft === 0 && !isSent && (
                    <p className="mt-4 text-red-500">Kode token telah kadaluarsa. Silakan kirim ulang.</p>
                )}
                
                {/* Countdown display */}
                <div className="mt-4 text-center">
                    <p className="text-gray-400">Token expires in: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;