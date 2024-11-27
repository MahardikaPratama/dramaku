// src/components/RecommendedMovies.js

import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const RecommendedMovies = ({ movieData, currentMovieId }) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-white">Movies You Might Like</h2>
      <div className="relative carousel-container" style={{ overflowX: 'hidden' }}>
        {/* Carousel controls */}
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
          {/* Movie items */}
          {Array.isArray(movieData) && movieData.length > 0 ? (
            movieData
              .filter((otherMovie) => otherMovie.movie_id !== currentMovieId) // Menggunakan movie_id sesuai dengan data API
              .map((otherMovie) => (
                <div
                  key={otherMovie.movie_id}
                  className="flex-none w-40 transform transition-transform duration-300 hover:scale-110"
                  onClick={() => window.location.href = `/detail/${otherMovie.movie_id}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="h-56 bg-gray-200">
                    <img
                      src={otherMovie.poster_url} // Menggunakan poster_url sesuai dengan data API
                      alt={otherMovie.title}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-center text-gray-400">
                    {otherMovie.title}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-white">No recommended movies available.</p>
          )}
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

export default RecommendedMovies;
