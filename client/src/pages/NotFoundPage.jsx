import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect } from 'react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    useEffect(() => {
        console.log("NotFoundPage rendered");
    }, []);
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
            <div className="flex flex-col items-center">
                <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
                <p className="text-2xl font-semibold mb-4">Oops! Page Not Found</p>
                <p className="mb-8 text-gray-400 text-center">
                    The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                <button 
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                    onClick={goToHome}
                >
                    Go Back to Home
                </button>
                <div className="mt-6">
                    <i className="fas fa-exclamation-triangle text-orange-500 text-6xl"></i>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
