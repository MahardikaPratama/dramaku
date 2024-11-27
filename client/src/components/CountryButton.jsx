import React from "react";

const CountryButton = ({ country, flagUrl, isSelected, onClick }) => {
    return (
        <li>
            <button
                onClick={() => onClick(country)}
                className={`flex items-center px-4 py-2 text-gray-300 rounded-md ${
                    isSelected ? 'bg-gray-700' : 'hover:bg-gray-700'
                } w-full text-left`}
            >
                <img
                    src={flagUrl}
                    alt={`${country} Flag`}
                    className="w-6 h-4 mr-2"
                />
                {country}
            </button>
        </li>
    );
};

export default CountryButton;
