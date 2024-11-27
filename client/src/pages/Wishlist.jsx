import React, { useState } from "react";
import { useQuery } from "react-query";
import SidebarUser from "../components/SidebarUser";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Card from "../components/Card";
import "../css/dashboard.css";
import userDataService from "../services/user.service";
import movieDataService from "../services/movie.service";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");

    // Fetch user profile data
    const { data: user, isLoading: userLoading, isError: userError } = useQuery(
        "userProfile",
        async () => {
            const response = await userDataService.getProfile();
            setUserId(response.data.user_id); // Set userId when data is fetched
            return response.data;
        }
    );

    console.log("Fetch data user", user);

    // Fetch wishlist data
    const { data: movies, isLoading: moviesLoading, isError: moviesError } = useQuery(
        ["userWishlist", userId],
        () => movieDataService.getWishlist(userId),
        {
            enabled: !!userId, // Only run this query if userId is set
        }
    );

    console.log("Fetch data movies", movies);

    // Loading and error handling
    if (userLoading || moviesLoading) return <Loading />;
    if (userError || moviesError) return <Error />;

    // Function to handle click on a movie
    const handleDramaClick = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
                {/* Sidebar Component */}
                <SidebarUser />

                <main className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800">
                        <h1 className="text-3xl font-semibold text-white">
                            My Wishlist
                        </h1>
                    </div>

                    {/* Wishlist Content */}
                    <section className="container p-4 mx-auto bg-gray-900">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {movies?.data?.length > 0 ? (
                                movies.data.map((item, index) => (
                                    <Card
                                        key={index}
                                        title={item.title}
                                        year={item.year}
                                        genres={item.genres}
                                        rating={item.movie_rate}
                                        views={item.views}
                                        imageURL={item.poster_url}
                                        status={item.release_status}
                                        onClick={() => handleDramaClick(item.movie_id)}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-400">
                                    Your wishlist is empty.
                                </p>
                            )}
                        </div>
                    </section>
                </main>
            </div>

            {/* Footer */}
            <Footer className="sticky bottom-0 w-full" />
        </div>
    );
};

export default Wishlist;
