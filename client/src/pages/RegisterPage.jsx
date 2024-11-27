import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import userDataService from '../services/user.service'; 


const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '', 
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [validationStatus, setValidationStatus] = useState({
        username: false, 
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateSingleField(name, value);
    };

    const validateSingleField = (name, value) => {
        let formErrors = {};
        let status = { ...validationStatus };

        if (name === 'username') { 
            if (value.length < 3) {
                formErrors.username = "Username must be at least 3 characters"; 
                status.username = false;
            } else {
                status.username = true;
            }
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                formErrors.email = "Invalid email format";
                status.email = false;
            } else {
                status.email = true;
            }
        }

        if (name === 'password') {
            if (value.length < 8) {
                formErrors.password = "Password must be at least 8 characters";
                status.password = false;
            } else {
                status.password = true;
            }
        }

        if (name === 'confirmPassword') {
            if (value !== formData.password || value.length === 0) {
                formErrors.confirmPassword = "Passwords do not match";
                status.confirmPassword = false;
            } else {
                status.confirmPassword = true;
            }
        }

        setErrors(formErrors);
        setValidationStatus(status);
    };

    const validateForm = () => {
        return Object.values(validationStatus).every((status) => status === true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validateForm()) {
            try {
                const response = await userDataService.register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                });
                console.log(response);
    
                // Store email in localStorage to pass to EmailVerification component
                localStorage.setItem('email', formData.email);
    
                navigate('/email-verification');
            } catch (error) {
                if (error.response?.status === 400 && error.response.data?.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('Registration failed. Please try again.');
                }
                setSuccessMessage('');
            }
        }
    };
    

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     if (validateForm()) {
    //         try {
    //             const response = await userDataService.register({
    //                 username: formData.username,
    //                 email: formData.email,
    //                 password: formData.password,
    //             });
    //             console.log(response);
    //             navigate('/email-verification');
    //         } catch (error) {
    //             if (error.response?.status === 400 && error.response.data?.message) {
    //                 // Handling error jika username atau email sudah ada
    //                 setErrorMessage(error.response.data.message);
    //             } else {
    //                 setErrorMessage('Registration failed. Please try again.');
    //             }
    //             localStorage.removeItem('token'); // Bersihkan token jika gagal
    //             setSuccessMessage('');
    //         }
    //     }
    // };
    
    const renderValidationIcon = (isValid) => {
        return isValid ? (
            <i className="text-green-500 fas fa-check"></i>
        ) : (
            <i className="text-red-500 fas fa-times"></i>
        );
    };

    const handleGoogleSignin = () => {
        window.open("http://localhost:8080/auth/google", "_self");
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col w-full max-w-lg bg-gray-800 rounded-lg shadow-lg md:flex-row md:max-w-4xl">
                <div className="w-full p-6 md:w-1/2 md:px-8 lg:px-12">
                    <h2 className="mb-4 text-xl font-bold text-center text-white">Register</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Form Fields */}
                        <div className="relative mb-3">
                            <label htmlFor="username" className="block mb-1 text-sm font-semibold text-gray-400">Username</label> {/* Mengganti label name menjadi username */}
                            <input 
                                type="text" 
                                id="username" // Mengganti id name menjadi username
                                name="username" // Mengganti name menjadi username
                                value={formData.username} // Mengganti value name menjadi username
                                onChange={handleInputChange}
                                placeholder="Username" 
                                required
                                className="w-full p-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                            />
                            <div className="absolute right-2 top-8">
                                {renderValidationIcon(validationStatus.username)} {/* Mengganti validasi name menjadi username */}
                            </div>
                            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>} {/* Mengganti error name menjadi username */}
                        </div>

                        <div className="relative mb-3">
                            <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-400">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email" 
                                required
                                className="w-full p-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                            />
                            <div className="absolute right-2 top-8">
                                {renderValidationIcon(validationStatus.email)}
                            </div>
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="relative mb-3">
                            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-400">Password</label>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password" 
                                    name="password" 
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password" 
                                    required
                                    className="w-full p-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                                />
                                <div className="absolute right-2 top-8">
                                    {renderValidationIcon(validationStatus.password)}
                                </div>
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            <div className="flex items-center mt-2">
                                <input 
                                    id="togglePasswordCheckbox" 
                                    type="checkbox" 
                                    checked={showPassword} 
                                    onChange={togglePasswordVisibility}
                                    className="shrink-0 mt-0.5 border-gray-700 rounded text-orange-500 focus:ring-orange-500" 
                                />
                                <label htmlFor="togglePasswordCheckbox" className="ml-3 text-sm text-gray-400">Show password</label>
                            </div>
                        </div>

                        <div className="relative mb-3">
                            <label htmlFor="confirm-password" className="block mb-1 text-sm font-semibold text-gray-400">Confirm Password</label>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    id="confirm-password" 
                                    name="confirmPassword" 
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm Password" 
                                    required
                                    className="w-full p-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                                />
                                <div className="absolute right-2 top-8">
                                    {renderValidationIcon(validationStatus.confirmPassword)}
                                </div>
                            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                            <div className="flex items-center mt-2">
                                <input 
                                    id="toggleConfirmPasswordCheckbox" 
                                    type="checkbox" 
                                    checked={showConfirmPassword} 
                                    onChange={toggleConfirmPasswordVisibility}
                                    className="shrink-0 mt-0.5 border-gray-700 rounded text-orange-500 focus:ring-orange-500" 
                                />
                                <label htmlFor="toggleConfirmPasswordCheckbox" className="ml-3 text-sm text-gray-400">Show confirm password</label>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full p-2 mt-4 text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none"
                        >
                            Register
                        </button>
                        <div className="flex items-center justify-center mt-3">
                            <div className="w-full border-t border-gray-200"></div>
                            <span className="mx-2 text-xs text-gray-300">OR</span>
                            <div className="w-full border-t border-gray-200"></div>
                        </div>

                        {/* Tombol register dengan Google */}
                        <div className="mt-3">
                            <button 
                                id='googleButton'
                                onClick={handleGoogleSignin}
                                type="button"
                                className="flex items-center justify-center w-full p-2 text-sm font-semibold text-black transition bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                <img 
                                    src="https://pluspng.com/img-png/google-adwords-logo-vector-png-google-favicon-2015-vector-google-developers-logo-vector-512.png" 
                                    alt="Google Logo" 
                                    className="w-4 h-4 mr-2" 
                                />
                                Register with Google
                            </button>
                        </div>

                        {/* Link untuk login jika sudah memiliki akun */}
                        <div className="mt-3 text-center">
                            <span className="text-sm text-gray-400">Already have an account?</span>
                            <a href="/login" className="text-sm text-blue-600 hover:underline">Login</a>
                        </div>
                    </form>
                    {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
                    {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
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

export default RegisterPage;
