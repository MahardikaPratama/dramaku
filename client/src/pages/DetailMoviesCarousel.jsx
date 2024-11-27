import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const MoviesCarousel = ({ idUrl }) => {
    const [movieData, setMovieData] = useState([]);
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await fetch('/api/movies'); // Ganti dengan endpoint API yang sesuai
                const data = await response.json();
                setMovieData(data);
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };

        fetchMovieData();
    }, []);

    const scrollLeft = () => {
        carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold text-white">Movies You Might Like</h2>
            <div className="relative carousel-container" style={{ overflowX: 'hidden' }}>
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 z-10 flex items-center justify-center w-10 h-10 text-white bg-gray-800 rounded-full top-1/2 transform -translate-y-1/2 hover:bg-gray-700 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <div
                    ref={carouselRef}
                    className="flex space-x-4 overflow-x-auto carousel-items px-12 py-2"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {movieData
                        .filter((otherMovie) => otherMovie.id !== idUrl)
                        .map((otherMovie) => (
                            <div
                                key={otherMovie.id}
                                className="flex-none w-40 transform transition-transform duration-300 hover:scale-110"
                                onClick={() => window.location.href = `/detail/${otherMovie.id}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="h-56 bg-gray-200">
                                    <img
                                        src={otherMovie.coverImage}
                                        alt={otherMovie.title}
                                        className="object-cover w-full h-full rounded-md"
                                    />
                                </div>
                                <p className="mt-2 text-center text-gray-400">
                                    {otherMovie.title}
                                </p>
                            </div>
                        ))}
                </div>

                <button
                    onClick={scrollRight}
                    className="absolute right-0 z-10 flex items-center justify-center w-10 h-10 text-white bg-gray-800 rounded-full top-1/2 transform -translate-y-1/2 hover:bg-gray-700 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </div>
    );
};

export default MoviesCarousel;
