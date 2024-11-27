import React from 'react';

const Footer = () => {
    return (
        <footer className="z-50 p-4 text-center text-gray-300 bg-gray-800">
            <div className="container mx-auto">
                <p>&copy; 2024 DramaKu. All rights reserved.</p>
                <div className="flex justify-center mt-2 space-x-4">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white"
                    >
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white"
                    >
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white"
                    >
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white"
                    >
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
