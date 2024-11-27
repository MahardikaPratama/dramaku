import React, { useState } from 'react';

const PaginationAdmin = ({ currentPage, totalEntries, entriesPerPage, onPageChange }) => {
    const [page, setPage] = useState(currentPage);
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const handlePrev = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            setPage(prevPage => prevPage + 1);
            onPageChange(page + 1);
        }
    };

    return (
        <div className="flex flex-col items-center mt-4">
            {/* Displaying Data Range */}
            <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{(page - 1) * entriesPerPage + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(page * entriesPerPage, totalEntries)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalEntries}</span> Entries
            </span>
            
            {/* Pagination Buttons */}
            <div className="inline-flex mt-2">
                <button
                    onClick={handlePrev}
                    className="flex items-center justify-center h-8 px-3 text-sm font-medium text-white bg-gray-700 rounded-l hover:bg-gray-900 disabled:bg-gray-600"
                    disabled={page === 1}
                >
                    <svg className="w-3.5 h-3.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                    </svg>
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className="flex items-center justify-center h-8 px-3 text-sm font-medium text-white bg-gray-700 border-l border-gray-700 rounded-r hover:bg-gray-900 disabled:bg-gray-600"
                    disabled={page === totalPages}
                >
                    Next
                    <svg className="w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PaginationAdmin;
