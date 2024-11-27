import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faHeart,
    faHeartBroken,
} from "@fortawesome/free-solid-svg-icons";
import "../css/comment.css";
import Footer from "../components/Footer";
import MovieDataService from "../services/movie.service";
import ActorDataService from "../services/actor.service";
import CommentDataService from "../services/comment.service";
import userDataService from "../services/user.service";
import Loading from "../components/Loading";
import Error from "../components/Error";

const DetailPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const idUrl = parseInt(id, 10);
    const carouselRef = useRef(null);
    const actorRef = useRef(null);

    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState("");
    const [commentText, setCommentText] = useState("");
    const [rating, setRating] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isImageLoaded, setIsImageLoaded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");
    const [editRating, setEditRating] = useState(0);
    
    const defaultProfileImage =
        "https://cdn.idntimes.com/content-images/post/20240207/33bac083ba44f180c1435fc41975bf36-ca73ec342155d955387493c4eb78c8bb.jpg";

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -300,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: 300, // Atur sesuai kecepatan scroll yang diinginkan
                behavior: "smooth",
            });
        }
    };

    const actorScrollLeft = () => {
        if (actorRef.current) {
            actorRef.current.scrollBy({
                left: -300, // Atur sesuai kecepatan scroll yang diinginkan
                behavior: "smooth",
            });
        }
    };

    const actorScrollRight = () => {
        if (actorRef.current) {
            actorRef.current.scrollBy({
                left: 300, // Atur sesuai kecepatan scroll yang diinginkan
                behavior: "smooth",
            });
        }
    };

    // Fetch movie by ID
    const {
        data: movieData,
        isLoading: isMovieLoading,
        error: movieError,
    } = useQuery(["movie", idUrl], () => MovieDataService.getMovieById(idUrl), {
        enabled: !!idUrl,
    });

    // Fetch actors by movie ID
    const {
        data: actorsData,
        isLoading: isActorsLoading,
        error: actorsError,
    } = useQuery(["actors", idUrl], () => ActorDataService.getByMovie(idUrl), {
        enabled: !!idUrl,
    });

    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        error: commentsError,
    } = useQuery(
        ["comments", idUrl],
        async () => {
            const response = await CommentDataService.getByMovie(idUrl);
            console.log("Fetched comments:", response.data); // Check if data is fetched here
            return response.data;
        },
        {
            enabled: !!idUrl,
            onError: (err) => console.error("Query error:", err),
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!isLoggedIn) {
            setShowWarning(true); // Show warning message if not logged in
            return;
        }

        // Define commentData with required properties
        const commentData = {
            comment_rate: parseFloat(rating),
            detail_comment: commentText,
            user_id: userId,
            movie_id: idUrl,
            approved: false, // Set to false initially (Unapprove status)
        };

        try {
            await CommentDataService.create(commentData);
            setSuccessMessage(
                "Comment submitted successfully! Awaiting approval."
            );
            setCommentText("");
            setRating(0);
            queryClient.invalidateQueries(["comments", idUrl]); // Only invalidate comments query for specific movie_id
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("You have already submitted a comment for this movie.");
            } else {
                console.error("Failed to submit comment:", error);
            }
        } finally {
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }

    };

    // Function to start editing a comment
    const handleEditClick = (comment) => {
        setIsEditing(true);
        setEditingCommentId(comment.comment_id);
        setEditCommentText(comment.detail_comment);
        setEditRating(comment.comment_rate);
    };

    // Function to cancel editing
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingCommentId(null);
        setEditCommentText("");
        setEditRating(0);
    };
    
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await CommentDataService.update(editingCommentId, {
                detail_comment: editCommentText,
                comment_rate: editRating,
            });
            queryClient.invalidateQueries(["comments", idUrl]);
            queryClient.invalidateQueries(["movie", idUrl]);
            setIsEditing(false);
            setEditingCommentId(null);
            setEditCommentText("");
            setEditRating(0);
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };
    // Fetch similar movies by genre
    const {
        data: similarMoviesData,
        isLoading: isSimilarMoviesLoading,
        error: similarMoviesError,
    } = useQuery(
        ["similarMovies", idUrl],
        () => MovieDataService.getMovieBySameGenre(idUrl),
        { enabled: !!idUrl }
    );

    // Define fetchUserData before using it
    const fetchUserData = async () => {
        try {
            const response = await userDataService.getProfile();
            if (response.data) {
                setUserId(response.data.user_id);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchWishlist = useCallback(async () => {
        if (userId) {
            try {
                const response = await MovieDataService.getWishlist(userId);
                if (response.data) {
                    const wishlist = response.data.map(
                        (movie) => movie.movie_id
                    );
                    console.log("Wishlist:", wishlist);
                    setIsInWishlist(wishlist.includes(idUrl));
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        }
    }, [userId, idUrl]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchWishlist();
        }
    }, [isLoggedIn, fetchWishlist]);

    if (
        isMovieLoading ||
        isActorsLoading ||
        isCommentsLoading ||
        isSimilarMoviesLoading
    ) {
        return <Loading />;
    }

    if (movieError || actorsError || commentsError || similarMoviesError) {
        return <Error />;
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating); // Bintang penuh
        const hasHalfStar = rating - fullStars >= 0.5; // Setengah bintang jika ada desimal >= 0.5
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Sisa bintang kosong

        return (
            <>
                {"★".repeat(fullStars)} {/* Bintang penuh */}
                {hasHalfStar && "☆"} {/* Setengah bintang */}
                {"☆".repeat(emptyStars)} {/* Bintang kosong */}
            </>
        );
    };

    const formatDate = (isoDate) => {
        try {
            if (!isoDate) throw new Error("Invalid date input");
            const parsedDate = new Date(isoDate);
            if (isNaN(parsedDate)) throw new Error("Invalid time value");
            return format(parsedDate, "dd MMM yyyy, HH:mm:ss");
        } catch (error) {
            console.error(error.message);
            return "Invalid date";
        }
    };

    const toggleWishlist = async () => {
        if (!isLoggedIn) {
            setShowWarning(true);
            return;
        }

        try {
            if (isInWishlist) {
                await MovieDataService.removeFromWishlist(userId, idUrl);
                setIsInWishlist(false);
                setSuccessMessage("Movie removed from wishlist!");
            } else {
                await MovieDataService.addToWishlist(userId, idUrl);
                setIsInWishlist(true);
                setSuccessMessage("Movie added to wishlist!");
            }
            setShowWarning(false);
        } catch (error) {
            console.error("Failed to update wishlist:", error);
            setErrorMessage("Failed to update wishlist. Please try again.");
        } finally {
            setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 3000);
        }
    };

    return (
        <div className="text-gray-300 bg-gray-900">
            <header className="bg-gray-800 shadow">
                <div className="container px-6 py-4 mx-auto">
                    <h1 className="text-3xl font-bold text-white">DramaKu</h1>
                </div>
            </header>

            {/* Tombol Back to Home */}
            <div className="container px-6 py-2 mx-auto">
                <button
                    onClick={() => navigate("/")} // Arahkan ke halaman Home
                    className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-gray-800 rounded hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    <i className="fas fa-arrow-left"></i> {/* Ikon Back */}
                    Back to Home
                </button>
            </div>

            <main className="container px-6 py-2 mx-auto">
                <div className="p-6 bg-gray-800 shadow-md">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/4">
                            <div className="relative">
                                {isImageLoaded ? (
                                    <img
                                        src={movieData?.data?.poster_url}
                                        alt="Drama Poster"
                                        className="object-cover w-full h-auto rounded-md"
                                        onLoad={() => setIsImageLoaded(true)}
                                        onError={() => setIsImageLoaded(false)} // Jika gagal, set status gambar
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full bg-gray-700 rounded-md h-72">
                                        <p className="text-gray-400">
                                            No Image Available
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-start mt-4">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700"
                                    onClick={toggleWishlist}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            isInWishlist
                                                ? faHeartBroken
                                                : faHeart
                                        }
                                    />
                                    {isInWishlist
                                        ? "Remove from Wishlist"
                                        : "Add to Wishlist"}
                                </button>
                            </div>

                            {/* Pesan peringatan jika pengguna belum login */}
                            {showWarning && (
                                <div className="mt-2 text-red-500">
                                    Please log in to add movies to your
                                    wishlist.
                                </div>
                            )}

                            {/* Pesan sukses jika film berhasil ditambahkan */}
                            {successMessage && (
                                <div className="mt-2 text-green-500">
                                    {successMessage}
                                </div>
                            )}
                            {errorMessage && (
                                <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-md">
                                    {errorMessage}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 lg:w-3/4 lg:pl-6 lg:mt-0">
                            <h1 className="text-4xl font-bold leading-tight text-white">
                                {movieData?.data?.title}
                            </h1>
                            <p className="mt-2 text-gray-400">
                                Other Title:{" "}
                                {movieData?.data?.alternative_title}
                            </p>
                            <p className="mt-2 text-gray-400">
                                Year: {movieData?.data?.year}
                            </p>
                            <p className="mt-2 text-gray-400">
                                Synopsis: {movieData?.data?.synopsis}
                            </p>
                            <p className="mt-2 text-gray-400">
                                Genre: {movieData?.data?.genres}
                            </p>
                            <p className="mt-2 text-gray-400">
                                Rating: {movieData?.data?.movie_rate}/5.0
                            </p>
                            <p className="mt-2 text-gray-400">
                                Availability: {movieData?.data?.platforms}
                            </p>
                        </div>
                    </div>

                    {/* Actor Carousel */}
                    <div className="mt-10">
                        <h2 className="mb-4 text-2xl font-bold text-white">
                            Actors
                        </h2>
                        <div className="relative">
                            <button
                                onClick={actorScrollLeft}
                                className="carousel-btn left"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <button
                                onClick={actorScrollRight}
                                className="carousel-btn right"
                            >
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>

                            <div
                                ref={actorRef}
                                className="flex space-x-4 overflow-x-scroll hide-scrollbar"
                                style={{ scrollBehavior: "smooth" }}
                            >
                                {actorsData?.data?.length > 0 ? (
                                    actorsData.data.map((actor, i) => (
                                        <div key={i} className="flex-none w-32">
                                            <img
                                                src={actor.foto_url}
                                                alt={actor.actor_name}
                                                className="object-cover w-full h-40 rounded-md"
                                            />
                                            <p className="mt-2 text-center text-gray-400">
                                                {actor.actor_name}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">
                                        No actors found for this movie.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className="flex items-center justify-center mt-10 bg-gray-200">
                        <div
                            className="w-full"
                            style={{ maxWidth: "1280px", aspectRatio: "16/9" }}
                        >
                            <iframe
                                className="w-full h-full"
                                src={movieData?.data?.link_trailer}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-white">Comments</h2>
                        <div className="p-6 mt-6 bg-gray-900 rounded-lg shadow-md">
                            {commentsData.length > 0 ? (
                                commentsData.map((comment, i) => (
                                    <div key={i}>
                                        {/* Single Comment */}
                                        <div className="p-4 bg-gray-800 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    {/* Foto profil */}
                                                    <div className="flex items-center">
                                                        <img
                                                            src={comment.foto_profil_url || defaultProfileImage}
                                                            alt="Profile"
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <div className="ml-2 text-gray-400">
                                                            {comment.username}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-400">{formatDate(comment.updated_at)}</div>
                                                </div>
                                                {comment.user_id === userId && (
                                                    <button
                                                        onClick={() => handleEditClick(comment)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Edit Comment"
                                                    >
                                                        <i className="fas fa-edit"></i> {/* Edit Icon */}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                {comment.comment_rate ? renderStars(comment.comment_rate) : <span className="text-gray-400">No rating</span>}
                                            </div>
                                            {isEditing && editingCommentId === comment.comment_id ? (
                                                // Edit Form
                                                <form onSubmit={handleEditSubmit} className="mt-2">
                                                    <textarea
                                                        className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
                                                        rows="2"
                                                        value={editCommentText}
                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                        required
                                                    />
                                                    <div className="flex items-center mt-2">
                                                        <label className="mr-4 text-gray-400">Rate:</label>
                                                        {[...Array(5)].map((_, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                className={`text-2xl ${
                                                                    index < editRating ? "text-yellow-500" : "text-gray-500"
                                                                }`}
                                                                onClick={() => setEditRating(index + 1)}
                                                            >
                                                                ★
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center mt-4 space-x-4">
                                                        <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                // Comment Text
                                                <div className="mt-2 text-gray-200">
                                                    {comment.detail_comment?.trim() ? comment.detail_comment : <span className="text-gray-400">No comment provided.</span>}
                                                </div>
                                            )}
                                        </div>
                                        {/* Separator Line */}
                                        {i < commentsData.length - 1 && <hr className="my-4 border-gray-700" />}
                                    </div>
                                ))
                            ) : (
                                // Tampilan jika tidak ada komentar
                                <div className="text-center text-gray-400">
                                    <p>No comments yet. Be the first to add one!</p>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Comment Form */}
                    <div className="p-6 bg-gray-900 rounded-md shadow-md comment-form">
                        <h2 className="mb-4 text-2xl font-bold text-white">
                            Add Your Comment
                        </h2>
                        {successMessage && (
                            <div className="p-4 mb-4 text-green-800 bg-green-100 rounded-md">
                                {successMessage}
                            </div>
                        )}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col space-y-4"
                        >
                            <textarea
                                className="px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows="4"
                                placeholder="Write your comment here..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                required
                            />
                            <div className="flex items-center">
                                <label className="mr-4 text-gray-400">
                                    Rate:
                                </label>
                                {[...Array(5)].map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`text-2xl ${
                                            index < rating
                                                ? "text-yellow-500"
                                                : "text-gray-500"
                                        }`}
                                        onClick={() => setRating(index + 1)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {showWarning && (
                                <p className="text-red-500">
                                    {"Please log in to submit a comment."}
                                </p>
                            )}
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            >
                                Submit Comment
                            </button>
                            {errorMessage && (
                                <div className="p-4 mt-4 text-red-500 bg-pink-100 border border-pink-300 rounded-md">
                                    {errorMessage}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Similar Movies */}
                    <div className="mt-10">
                        <h2 className="mb-4 text-2xl font-bold text-white">
                            Movies You Might Like
                        </h2>
                        <div className="relative">
                            {/* Tombol Panah Kiri */}
                            <button
                                onClick={scrollLeft}
                                className="absolute p-2 text-white transform -translate-y-1/2 bg-gray-800 rounded-full carousel-btn left top-1/2 hover:bg-gray-700"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>

                            {/* Tombol Panah Kanan */}
                            <button
                                onClick={scrollRight}
                                className="absolute right-0 p-2 text-white transform -translate-y-1/2 bg-gray-800 rounded-full carousel-btn right top-1/2 hover:bg-gray-700"
                            >
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>

                            <div
                                ref={carouselRef}
                                className="flex space-x-4 overflow-x-scroll hide-scrollbar"
                                style={{ scrollBehavior: "smooth" }}
                            >
                                {similarMoviesData?.data?.length > 0 ? (
                                    similarMoviesData.data.map((similar, i) => (
                                        <div
                                            key={i}
                                            className="flex-none w-32 group"
                                        >
                                            <img
                                                src={similar.poster_url}
                                                alt={similar.title}
                                                className="object-cover w-full h-40 transition-transform duration-300 ease-in-out transform rounded-md group-hover:scale-105 group-hover:shadow-lg"
                                                onClick={() =>
                                                    navigate(
                                                        `/movies/${similar.movie_id}`
                                                    )
                                                }
                                            />
                                            <p className="mt-2 text-center text-gray-400">
                                                {similar.title}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">
                                        No similar movies found.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DetailPage;
