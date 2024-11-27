import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import userDataService from '../services/user.service';

const LoginPage = () => {
    const navigate = useNavigate();
    
    // State untuk mengatur visibilitas password dan pesan error
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Call the login service
            const response = await userDataService.login({ email, password });
            console.log(response.data);
            navigate('/'); // Redirect ke halaman utama setelah login berhasil
        } catch (error) {
            // Handling different types of errors
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid email or password.');
            } else if (error.response && error.response.status === 400) {
                setErrorMessage('Please enter a valid email address.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const handleGoogleLogin = () => {
        window.open("http://localhost:8080/auth/google", "_self"); 
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col w-full max-w-lg bg-gray-800 rounded-lg shadow-lg md:flex-row md:max-w-4xl">
                
                <div className="w-full p-6 md:w-1/2 md:px-8 lg:px-12">
                    <h2 className="mb-4 text-xl font-bold text-center text-white">Login</h2>
                    
                    {/* Display error message if any */}
                    {errorMessage && (
                        <div className="mb-4 text-sm text-center text-red-500">
                            {errorMessage}
                        </div>
                    )}

                    <form className="px-4">
                        <div className="mb-3">
                            <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-400">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Email" 
                                required
                                className="w-full p-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-400">Password</label>
                            <div className="relative">
                                <input 
                                    id="password" 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    placeholder="Password" 
                                    required
                                    className="w-full p-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                                />
                                
                                <div className="flex mt-4">
                                    <input 
                                        id="togglePasswordCheckbox" 
                                        type="checkbox" 
                                        checked={showPassword} 
                                        onChange={togglePasswordVisibility}
                                        className="shrink-0 mt-0.5 border-gray-700 rounded text-orange-500 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-orange-500 dark:checked:border-orange-500 dark:focus:ring-offset-gray-800" 
                                    />
                                    <label htmlFor="togglePasswordCheckbox" className="ml-3 text-sm text-gray-400">Show password</label>
                                </div>
                            </div>
                        </div>                

                        <div className="mb-3">
                            <button 
                                type="button" 
                                id="loginButton"
                                className="w-full p-2 text-sm font-semibold text-white transition bg-orange-600 rounded-lg hover:bg-orange-700"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-full border-t border-gray-200"></div>
                            <span className="mx-2 text-xs text-gray-300">OR</span>
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        
                        <div className="mb-3">
                        <button 
                            type="button" 
                            id="googleLogin"
                            className="flex items-center justify-center w-full p-2 text-sm font-semibold text-black transition bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                            onClick={handleGoogleLogin} 
                        >
                                <img 
                                    src="https://pluspng.com/img-png/google-adwords-logo-vector-png-google-favicon-2015-vector-google-developers-logo-vector-512.png" 
                                    alt="Google Logo" 
                                    className="w-4 h-4 mr-2" 
                                />
                                Login with Google
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot your password?</a>
                        </div>
                        
                        <div className="mt-2 text-center">
                            <span className="text-sm text-gray-400">Don't have an account?</span>
                            <a href="/register" className="text-sm text-blue-600 hover:underline">Register</a>
                        </div>            
                    </form>
                </div>

                <div className="hidden w-full p-6 md:block md:w-1/2">
                    <img 
                        src="https://th.bing.com/th/id/OIP.h8qCr42qmI2JNiJJSh5EBQHaEK?rs=1&pid=ImgDetMain" 
                        alt="Ilustrasi Login" 
                        className="object-contain w-full h-full" 
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;