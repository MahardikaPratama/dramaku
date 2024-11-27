import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <FontAwesomeIcon icon={faSpinner} className="mb-2 text-4xl text-white animate-spin" />
            <p className="text-lg text-white">Loading data, please wait...</p>
        </div>
    );
};

export default Loading;
