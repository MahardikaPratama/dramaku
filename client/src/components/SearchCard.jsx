import React from "react";

const SearchCard = ({ title, year, genres, rating, views, imageUrl, status, onClick }) => {

    // Fungsi untuk memformat jumlah views
    const formatViews = (views) => {
        if (views >= 1e6) {
            return `${(views / 1e6).toFixed(1)}M`; // Menampilkan juta
        } else if (views >= 1e3) {
            return `${(views / 1e3).toFixed(1)}k`; // Menampilkan ribu
        } else {
            return views; // Menampilkan angka asli jika kurang dari seribu
        }
    };

    // Fungsi untuk mengatur warna status
    const statusColor = (() => {
        switch (status) {
            case 'ONGOING':
                return 'bg-green-600';
            case 'COMPLETED':
                return 'bg-blue-600';
            case 'UPCOMING':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    })();

    return (
        <div 
            className="relative flex flex-col items-center p-4 space-y-4 transition-transform transform bg-gray-800 rounded-lg shadow-lg cursor-pointer sm:flex-row sm:space-y-0 sm:space-x-4 hover:scale-105 hover:bg-gray-700 hover:shadow-lg"
            onClick={onClick}    
        >
            {/* Gambar Poster dengan tombol wishlist di dalamnya */}
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={`Poster of ${title}`}
                    className="object-contain w-full mb-2 rounded-md sm:w-28 h-36 sm:mb-0"
                    loading="lazy"
                />
            </div>
            
            {/* Informasi Film */}
            <div className="flex-1 w-full">
                <h3 className="mb-1 text-lg font-semibold text-white line-clamp-1">{title}</h3>
                <p className="mb-1 text-sm text-gray-400">{year}</p>
                <p className="mb-1 text-sm text-gray-400 line-clamp-1">{genres}</p>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Rating: {rating}/5.0</p>
                    <p className="text-sm text-gray-500">{formatViews(views)} views</p>
                </div>
            </div>
            
            {/* Indikator Status */}
            <div className={`absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white ${statusColor} rounded-md`}>
                {status}
            </div>
        </div>
    );
};

export default SearchCard;
