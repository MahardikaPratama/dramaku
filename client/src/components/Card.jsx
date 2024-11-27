import React from "react";

const Card = ({ title, year, genres, rating, views, imageURL, status, onClick }) => {

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

    // Menentukan warna status
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
            className="relative p-4 transition-transform transform bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:scale-105 hover:bg-gray-700"
            onClick={onClick}
        >
            {/* Gambar poster */}
            <div className="relative">
                <img
                    src={imageURL}
                    alt={`Poster of ${title}`}
                    className="object-cover w-full mb-4 rounded-md h-72"
                    loading="lazy" 
                />
                {/* Indikator status */}
                <div className={`absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white ${statusColor} rounded-md shadow-md`}>
                    {status}
                </div>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-white line-clamp-1">{title}</h3>
            <p className="mb-1 text-sm text-gray-400">{year}</p>
            <p className="mb-2 text-sm text-gray-400 line-clamp-1">{genres}</p>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Rating: {rating}/5.0</p>
                <p className="text-sm text-gray-500">{formatViews(views)} views</p>
            </div>
        </div>
    );
};

export default Card;
