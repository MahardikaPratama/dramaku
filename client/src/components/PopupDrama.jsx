import React, { useState, useRef } from 'react';
import { useQuery } from "react-query";
import '../css/comment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheckCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import MovieDataService from "../services/movie.service";
import ActorDataService from "../services/actor.service";
import Loading from "../components/Loading";  
import Error from "../components/Error"; 

const PopupDrama = ({ isVisible, hideModal, movieId, handleDelete, handleUpdateApproval }) => {
    const modalClass = isVisible ? 'block' : 'hidden';
    const actorRef = useRef(null); 
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const {
        data: movieData,
        isLoading: isMovieLoading,
        error: movieError,
    } = useQuery(["movie", movieId], async () => {
        const response = await MovieDataService.getMovieById(movieId);
        return response.data;
    }, {
        enabled: !!movieId,
    });
    
    const {
        data: actorsData,
        isLoading: isActorsLoading,
        error: actorsError,
    } = useQuery(["actors", movieId], async () => {
        const response = await ActorDataService.getByMovie(movieId);
        return response.data;
    }, {
        enabled: !!movieId,
    });

    const actorScrollLeft = () => {
        actorRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const actorScrollRight = () => {
        actorRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    if (isMovieLoading || isActorsLoading) {
        return <Loading />;
    }

    if (movieError || actorsError) {
        return <Error />;
    }

    return (
        <div id="movieApprovalModal" className={`fixed inset-0 items-start justify-center bg-black bg-opacity-50 z-[9999] overflow-y-auto ${modalClass}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                    <div className="relative overflow-hidden text-left transition-all transform bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-3xl">
                        <button
                            className="absolute text-2xl text-white top-4 right-4"
                            onClick={hideModal}
                        >
                            &times;
                        </button>
                        <div className="modal-header">
                            <div className="flex flex-wrap justify-center gap-3 mt-4">
                                <button 
                                    className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white transition-transform duration-200 transform bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-md hover:scale-105"
                                    onClick={() => {
                                        handleUpdateApproval(movieId); // Call handleUpdateApproval with movieId
                                        hideModal();  // Close modal after deleting
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                    Approve
                                </button>
                                <button 
                                    className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white transition-transform duration-200 transform bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 text-md hover:scale-105"
                                    onClick={() => {
                                        handleDelete(movieId); // Call handleDelete with movieId
                                        hideModal();  // Close modal after deleting
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-800 shadow-md md:p-6">
                            {/* Movie Details Section */}
                            <div className="flex flex-col lg:flex-row">
                                <div className="mb-4 lg:w-1/4 lg:mb-0">
                                    <div className="relative">
                                        <img
                                            src={movieData?.poster_url}
                                            alt="Drama Poster"
                                            className={`object-cover w-full h-auto rounded-md ${isImageLoaded ? '' : 'hidden'}`}
                                            onLoad={() => setIsImageLoaded(true)}
                                            onError={() => setIsImageLoaded(false)}
                                        />
                                        {!isImageLoaded && (
                                            <div className="flex items-center justify-center w-full bg-gray-700 rounded-md h-72">
                                                <p className="text-gray-400">No Image Available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:w-3/4 lg:pl-6">
                                    <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">{movieData?.title}</h1>
                                    <p className="mt-2 text-sm text-gray-400 sm:text-base">Other Title: {movieData?.alternative_title}</p>
                                    <p className="mt-2 text-sm text-gray-400 sm:text-base">Year: {movieData?.year}</p>
                                    <p className="mt-2 text-sm text-gray-400 sm:text-base">Synopsis: {movieData?.synopsis}</p>
                                    <p className="mt-2 text-sm text-gray-400 sm:text-base">Genre: {movieData?.genres}</p>
                                    <p className="mt-2 text-sm text-gray-400 sm:text-base">Rating: {movieData?.movie_rate}/10</p>
                                    <p className="mt-2 text-sm text-gray-400 sm:text-base">Availability: {movieData?.platforms}</p>
                                </div>
                            </div>

                            {/* Actors Carousel */}
                            <div className="mt-6 md:mt-10">
                                <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">Actors</h2>
                                <div className="relative">
                                    <button onClick={actorScrollLeft} className="carousel-btn left">
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </button>
                                    <button onClick={actorScrollRight} className="carousel-btn right">
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                    <div ref={actorRef} className="flex space-x-4 overflow-x-scroll hide-scrollbar" style={{ scrollBehavior: "smooth" }}>
                                        {actorsData?.length > 0 ? (
                                            actorsData.map((actor, i) => (
                                                <div key={i} className="flex-none w-24 sm:w-32">
                                                    <img src={actor.foto_url} alt={actor.actor_name} className="object-cover w-full h-32 rounded-md sm:h-40" />
                                                    <p className="mt-2 text-xs text-center text-gray-400 sm:text-sm">{actor.actor_name}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No actors found for this movie.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Video Section */}
                            <div className="flex items-center justify-center mt-8 bg-gray-200 md:mt-10">
                                <div className="w-full" style={{ maxWidth: "1280px", aspectRatio: "16/9" }}>
                                    <iframe
                                        className="w-full h-full"
                                        src={movieData?.link_trailer}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupDrama;
