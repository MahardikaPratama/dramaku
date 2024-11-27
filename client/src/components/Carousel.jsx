import React, { useState, useEffect, useCallback } from "react";

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        "https://cdn.oneesports.gg/cdn-data/2024/01/Anime_DemonSlayer_Wallpaper_Hashira_HD-1024x576.jpg",
        "https://wallpapercave.com/wp/wp1837578.jpg",
        "https://wallpapers.com/images/featured/crash-landing-on-you-pictures-mz5rpq3x9lcvrcxh.jpg",
        "https://wallpapers.com/images/hd/korean-drama-itaewon-class-stars-kjzzburs4e8bzdq6.jpg",
        "https://wallpapers.com/images/hd/the-untamed-chinese-drama-icvq8xaaaf99n1ay.jpg",
    ];

    const handlePrev = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }, [images.length]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images.length]);

    // Mengatur efek untuk carousel otomatis
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 3000); // Ganti gambar setiap 3 detik

        return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
    }, [handleNext]);

    return (
        <div className="relative w-full">
            {/* Carousel wrapper */}
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute block w-full transition-opacity duration-700 ease-in-out ${
                            currentIndex === index ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <img
                            src={src}
                            className="w-full"
                            alt={`Slide ${index + 1}`}
                        />
                    </div>
                ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 space-x-3 bottom-5 left-1/2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${
                            currentIndex === index
                                ? "bg-blue-500"
                                : "bg-gray-300"
                        }`}
                        aria-current={currentIndex === index}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => setCurrentIndex(index)}
                    ></button>
                ))}
            </div>

            {/* Slider controls */}
            <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={handlePrev}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white group-hover:bg-gray-700">
                    <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 1 1 5l4 4"
                        />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={handleNext}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white group-hover:bg-gray-700">
                    <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 9 4-4-4-4"
                        />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
    );
};

export default Carousel;
