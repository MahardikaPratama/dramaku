import React from 'react';

const PaginationHome = ({ currentPage, totalEntries, entriesPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalEntries / entriesPerPage); // Menghitung total halaman

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; 
        onPageChange(newPage); 
    };
    

    return (
        <div className="flex flex-col items-center mt-4">
            {/* Menampilkan rentang data yang ditampilkan */}
            <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * entriesPerPage + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * entriesPerPage, totalEntries)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalEntries}</span> Entries
            </span>

            {/* Kontrol Pagination */}
            <div className="inline-flex flex-wrap mt-2">
                <button
                    onClick={() => handlePageChange(1)}
                    className="flex items-center justify-center h-8 px-2 text-xs font-medium text-white bg-gray-700 rounded-l sm:px-3 sm:text-sm hover:bg-gray-900 disabled:bg-gray-600"
                    disabled={currentPage === 1} // Disable jika di halaman pertama
                >
                    First
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex items-center justify-center h-8 px-2 text-xs font-medium text-white bg-gray-700 sm:px-3 sm:text-sm hover:bg-gray-900 disabled:bg-gray-600"
                    disabled={currentPage === 1} // Disable jika di halaman pertama
                >
                    Prev
                </button>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex items-center justify-center h-8 px-2 text-xs font-medium text-white bg-gray-700 sm:px-3 sm:text-sm hover:bg-gray-900 disabled:bg-gray-600"
                    disabled={currentPage === totalPages} // Disable jika di halaman terakhir
                >
                    Next
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    className="flex items-center justify-center h-8 px-2 text-xs font-medium text-white bg-gray-700 rounded-r sm:px-3 sm:text-sm hover:bg-gray-900 disabled:bg-gray-600"
                    disabled={currentPage === totalPages} // Disable jika di halaman terakhir
                >
                    Last
                </button>
            </div>
        </div>
    );
};

export default PaginationHome;
