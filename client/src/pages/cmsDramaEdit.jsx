import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import Select, { components } from "react-select";
import SidebarAdmin from "../components/SidebarAdmin";
import Footer from "../components/Footer";
import "../css/dashboard.css";
import movieDataService from "../services/movie.service";
import countryDataService from "../services/country.service";
import platformDataService from "../services/platform.service";
import actorDataService from "../services/actor.service";
import awardDataService from "../services/award.service";
import userDataService from "../services/user.service";
import genreDataService from "../services/genre.service";
import Loading from "../components/Loading";
import Error from "../components/Error";

const CmsDramaEdit = () => {
    const { id } = useParams();
    const movie_id = parseInt(id, 10);
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [posterPreview, setPosterPreview] = useState(null);
    const [selectedActors, setSelectedActors] = useState([]);
    const [newMovie, setNewMovie] = useState({ title: '', alternative_title: '', year: '', country_id: '', synopsis: '', release_status: '', link_trailer: '', poster_url: null, user_id: '' });
    const [newAvailability, setNewAvailability] = useState({ movie_id: '', platform_ids: [] });
    const [newCategorizedAs, setNewCategorizedAs] = useState({ movie_id: '', genre_ids: [] });
    const [newActedIn, setNewActedIn] = useState({ movie_id: '', actor_ids: [] });
    const [newAwarded, setNewAwarded] = useState({ movie_id: '', award_ids: [] });
    const [notification, setNotification] = useState({ message: '', type: '' });

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    // Custom styles for react-select with improved spacing and responsiveness
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#374151", // bg-gray-700
            color: "#d1d5db", // text-gray-300
            borderColor: "#4b5563", // border-gray-600
            minHeight: "3rem", // Minimal height untuk tampilan awal
            borderRadius: "0.375rem", // rounded-md
            boxShadow: state.isFocused ? "0 0 0 2px #f97316" : "none", // ring-orange-600 on focus
            "&:hover": {
                borderColor: "#f97316", // ring-orange-600 on hover
            },
            overflowY: "auto", // agar kontrol tumbuh sesuai konten
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#374151", // bg-gray-700
            color: "#d1d5db", // text-gray-300
            borderRadius: "0.375rem", // rounded-md
            marginTop: "0.25rem", // mt-1 for spacing
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#f97316" // bg-orange-500 if selected
                : state.isFocused
                ? "#4b5563" // bg-gray-600 on focus
                : "#374151", // bg-gray-700 otherwise
            color: state.isSelected ? "#ffffff" : "#d1d5db",
            padding: "0.5rem 1rem", // adjust padding for option items
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#d1d5db", // text-gray-300
        }),
        input: (provided) => ({
            ...provided,
            color: "#d1d5db", // text-gray-300 for search term
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af", // text-gray-400 for placeholder
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#4b5563", // bg-gray-600 for selected items
            color: "#d1d5db",
            borderRadius: "0.375rem", // rounded-md
            padding: "0.25rem 0.5rem", // px-2 py-1
            margin: "0.125rem", // small spacing between selected items
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "#d1d5db", // text-gray-300 for label text
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: "#f97316", // text-orange-500 for remove button
            "&:hover": {
                backgroundColor: "#f97316", // bg-orange-500 on hover
                color: "#ffffff", // white text on hover
            },
        }),
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userDataService.getProfile();
                if (response.data) {
                    setNewMovie((prevMovie) => ({
                        ...prevMovie,
                        user_id: response.data.user_id,
                    }));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchMovieData = async () => {
            try {
                const movieRes = await movieDataService.getMovieById(movie_id);

                const movieData = movieRes.data;
                const posterRes = movieData.poster_url;

                if (movieData) {
                    setNewMovie({
                        title: movieData.title,
                        alternative_title: movieData.alternative_title,
                        year: movieData.year,
                        country_id: movieData.country_id,
                        synopsis: movieData.synopsis,
                        release_status: movieData.release_status,
                        link_trailer: movieData.link_trailer,
                        poster_url: movieData.poster_url,
                    });

                    if(posterRes){
                        setPosterPreview(posterRes);
                    }

                    const availabilityRes = await movieDataService.getAvailabilityByMovieId(movie_id);
                    const categorizedAsRes = await movieDataService.getCategorizedAs(movie_id);
                    const actedInRes = await movieDataService.getActedIn(movie_id);
                    const awardedRes = await movieDataService.getAwarded(movie_id);

                    const availabilityData = availabilityRes.data;
                    const categorizedAsData = categorizedAsRes.data;
                    const actedInData = actedInRes.data;
                    const awardedData = awardedRes.data;

                    if (availabilityData) {
                        setNewAvailability({
                            movie_id: movie_id,
                            platform_ids: availabilityData.map((platform) => platform.platform_id),
                        });
                    }

                    if (categorizedAsData) {
                        setNewCategorizedAs({
                            movie_id: movie_id,
                            genre_ids: categorizedAsData.map((genre) => genre.genre_id),
                        });
                    }

                    if (actedInData) {
                        setNewActedIn({
                            movie_id: movie_id,
                            actor_ids: actedInData.map((actor) => actor.actor_id),
                        });
                        setSelectedActors(actedInData.map((actor) => ({
                            value: actor.actor_id,
                            label: actor.actor_name,
                            foto: actor.foto_url,
                        })));
                    }

                    if (awardedData) {
                        setNewAwarded({
                            movie_id: movie_id,
                            award_ids: awardedData.map((award) => award.award_id),
                        });
                    }
                }

            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        };

        fetchUserData();
        fetchMovieData();
    }, [movie_id]);

    const {
        data: genres,
        isLoading: genresLoading,
        isError: genresError,
    } = useQuery("genres", async () => {
        const response = await genreDataService.getAll();
        return response.data;
    });

    const {
        data: countries = [],
        isLoading: countryLoading,
        isError: countryError,
    } = useQuery(
        "countries",
        async () => {
            const response = await countryDataService.getAll();
            return response.data;
        },
        {
            staleTime: 300000, // Cache data selama 5 menit
            refetchOnWindowFocus: false, // Hindari refetch saat kembali ke window
        }
    );

    const {
        data: platforms = [],
        isLoading: platformLoading,
        isError: platformError,
    } = useQuery(
        "platforms",
        async () => {
            const response = await platformDataService.getAll();
            return response.data;
        },
        {
            staleTime: 300000, // Cache data selama 5 menit
            refetchOnWindowFocus: false, // Hindari refetch saat kembali ke window
        }
    );

    const {
        data: actors = [],
        isLoading: actorLoading,
        isError: actorError,
    } = useQuery(
        "actors",
        async () => {
            const response = await actorDataService.getAll();
            return response.data;
        },
        {
            staleTime: 300000, // Cache data selama 5 menit
            refetchOnWindowFocus: false, // Hindari refetch saat kembali ke window
        }
    );

    const {
        data: awards = [],
        isLoading: awardLoading,
        isError: awardError,
    } = useQuery(
        "awards",
        async () => {
            const response = await awardDataService.getAll();
            return response.data;
        },
        {
            staleTime: 300000, // Cache data selama 5 menit
            refetchOnWindowFocus: false, // Hindari refetch saat kembali ke window
        }
    );

    const countryOptions = Array.isArray(countries.data)
        ? countries.data.map((country) => ({
              value: country.country_id,
              label: country.country_name,
          }))
        : [];

    const platformOptions = Array.isArray(platforms)
        ? platforms.map((platform) => ({
              value: platform.platform_id,
              label: platform.platform_name,
          }))
        : [];

    const actorOptions = Array.isArray(actors)
        ? actors.map((actor) => ({
              value: actor.actor_id,
              label: actor.actor_name,
              foto: actor.foto_url,
          }))
        : [];

    const awardOptions = Array.isArray(awards)
        ? awards.map((award) => ({
              value: award.award_id,
              label: award.award_name,
          }))
        : [];

    const ActorOption = (props) => (
        <components.Option {...props}>
            <div className="flex items-center">
                <img
                    src={props.data.foto}
                    alt={props.data.label}
                    className="object-cover w-8 h-8 mr-2 rounded-full"
                />
                <span>{props.data.label}</span>
            </div>
        </components.Option>
    );

    if (countryLoading || platformLoading || actorLoading || awardLoading || genresLoading)
        return <Loading />;
    if (countryError || platformError || actorError || awardError || genresError)
        return <Error />;

    const handlePosterChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPosterPreview(previewUrl); // Set the preview URL
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewMovie((prevMovie) => ({
            ...prevMovie,
            [name]: files ? files[0] : value,
        }));
    };

    const handleInputAvailability = (selectedOptions) => {
        setNewAvailability((prevAvailability) => ({
            ...prevAvailability,
            platform_ids: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
    };

    const handleInputAwarded = (selectedOptions) => {
        setNewAwarded((prevAwarded) => ({
            ...prevAwarded,
            award_ids: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
    };

    const handleInputActedIn = (selectedOptions) => {
        setNewActedIn((prevActedIn) => ({
            ...prevActedIn,
            actor_ids: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
    };
    
    const handleActorChange = (actors) => {
        setSelectedActors(actors || []);
        handleInputActedIn(actors);
    };
    
    const removeActor = (actorToRemove) => {
        const updatedActors = selectedActors.filter(
            (actor) => actor.value !== actorToRemove.value
        );
        setSelectedActors(updatedActors);
        handleInputActedIn(updatedActors); // Update newActedIn after removal
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const updatedGenres = checked
            ? [...newCategorizedAs.genre_ids, parseInt(value, 10)]
            : newCategorizedAs.genre_ids.filter((genre) => genre !== parseInt(value, 10));
        setNewCategorizedAs((prevCategorizedAs) => ({ ...prevCategorizedAs, genre_ids: updatedGenres }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await movieDataService.updateMovie(movie_id, newMovie);
            const movieId = response.data.movie_id;
    
            // Update newAvailability dengan movie_id secara langsung
            const updatedAvailability = {
                ...newAvailability,
                movie_id: movieId,
            };
            setNewAvailability(updatedAvailability);
    
            // Update objek lainnya dengan cara yang sama
            const updatedCategorizedAs = {
                ...newCategorizedAs,
                movie_id: movieId,
            };
            setNewCategorizedAs(updatedCategorizedAs);
    
            const updatedActedIn = {
                ...newActedIn,
                movie_id: movieId,
            };
            setNewActedIn(updatedActedIn);
    
            const updatedAwarded = {
                ...newAwarded,
                movie_id: movieId,
            };
            setNewAwarded(updatedAwarded);

            console.log("Updated Availaility:", updatedAvailability);
    
            if (updatedAvailability.movie_id && updatedAvailability.platform_ids.length > 0) {
                await movieDataService.createAvailability(updatedAvailability);
            }
            if (updatedCategorizedAs.movie_id && updatedCategorizedAs.genre_ids.length > 0) {
                await movieDataService.createCategorizedAs(updatedCategorizedAs);
            }
            if (updatedActedIn.movie_id && updatedActedIn.actor_ids.length > 0) {
                await movieDataService.createActedIn(updatedActedIn);
            }
            if (updatedAwarded.movie_id && updatedAwarded.award_ids.length > 0) {
                await movieDataService.createAwarded(updatedAwarded);
            }
    
            // Reset semua state setelah submit berhasil
            setNewMovie({ ...newMovie, poster_url: null });
            setNewAvailability({ movie_id: '', platform_ids: [] });
            setNewCategorizedAs({ movie_id: '', genre_ids: [] });
            setNewActedIn({ movie_id: '', actor_ids: [] });
            setNewAwarded({ movie_id: '', award_ids: [] });
            setPosterPreview(null);
            setSelectedActors([]);
            setNotification({ message: 'Movie updated successfully!', type: 'success' });
        } catch (error) {
            console.error("An error occurred while updating the movie:", error);
            setNotification({ message: 'Failed to update movie. Please try again.', type: 'error' });
        } finally {
            // Display notification for 2 seconds then redirect
            setTimeout(() => {
                setNotification({ message: '', type: '' }); // Clear notification
                navigate('/cms-drama'); // Redirect to /drama using navigate
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
                {/* Sidebar Component */}
                <SidebarAdmin
                    isVisible={isSidebarVisible}
                    toggleSidebar={toggleSidebar}
                />
    
                <main className="flex-1 p-4 md:p-6">
                    <button
                        id="hamburger"
                        className="p-2 text-gray-400 md:hidden focus:outline-none"
                        onClick={toggleSidebar}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
    
                    <section className="container p-4 mx-auto bg-gray-800 rounded-md shadow-md md:p-6">
                        <form
                            className="flex flex-col md:grid md:grid-cols-2 md:gap-4"
                            onSubmit={handleSubmit}
                        >
                            {/* Title and Alternative Title */}
                            <div className="flex flex-col w-full col-span-2 md:flex-row md:space-x-4">
                                <div className="flex flex-col w-full">
                                    <label
                                        htmlFor="title"
                                        className="block font-medium text-gray-300"
                                    >
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newMovie.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter Title"
                                        className="block w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-orange-500"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label
                                        htmlFor="alternative-title"
                                        className="block font-medium text-gray-300"
                                    >
                                        Alternative Title
                                    </label>
                                    <input
                                        type="text"
                                        id="alternative_title"
                                        name="alternative_title"
                                        value={newMovie.alternative_title}
                                        onChange={handleInputChange}
                                        placeholder="Enter Alternative Title"
                                        className="block w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-orange-500"
                                    />
                                </div>
                            </div>
    
                            {/* Year and Country */}
                            <div className="flex flex-col w-full col-span-2 md:flex-row md:space-x-4">
                                <div className="flex flex-col w-full">
                                    <label
                                        htmlFor="year"
                                        className="block font-medium text-gray-300"
                                    >
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        id="year"
                                        name="year"
                                        value={newMovie.year}
                                        onChange={handleInputChange}
                                        placeholder="Enter Year"
                                        className="h-12 p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label
                                        htmlFor="country"
                                        className="h-13.5 block font-medium text-gray-300"
                                    >
                                        Country
                                    </label>
                                    <Select
                                        id="country"
                                        name="country"
                                        options={countryOptions}
                                        placeholder="Select Country"
                                        value={countryOptions.find(
                                            (country) => country.value === newMovie.country_id
                                        )}
                                        onChange={(selectedOption) =>
                                            handleInputChange({
                                                target: { name: 'country_id', value: selectedOption ? selectedOption.value : '' },
                                            })
                                        }
                                        styles={customStyles}
                                        maxMenuHeight={150}
                                        isClearable
                                        filterOption={(candidate, input) =>
                                            input
                                                ? candidate.label.includes(input) && candidate.label.startsWith(input)
                                                : true
                                        }
                                    />
                                </div>
                            </div>
    
                            {/* Synopsis */}
                            <div className="flex flex-col w-full col-span-2">
                                <label
                                    htmlFor="synopsis"
                                    className="block font-medium text-gray-300"
                                >
                                    Synopsis
                                </label>
                                <textarea
                                    id="synopsis"
                                    rows="3"
                                    name="synopsis"
                                    value={newMovie.synopsis}
                                    onChange={handleInputChange}
                                    placeholder="Enter Synopsis"
                                    className="block w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-orange-500"
                                ></textarea>
                            </div>
    
                            {/* Availability and Status */}
                            <div className="flex flex-col w-full col-span-2 md:flex-row md:space-x-4">
                                <div className="flex flex-col w-full col-span-2">
                                    <label
                                        htmlFor="availability"
                                        className="block font-medium text-gray-300"
                                    >
                                        Availability
                                    </label>
                                        <Select
                                            id="availability"
                                            options={platformOptions}
                                            placeholder="Select Platforms"
                                            styles={customStyles}
                                            isMulti
                                            maxMenuHeight={150}
                                            value={platformOptions.filter(option => newAvailability.platform_ids.includes(option.value))}
                                            filterOption={(candidate, input) =>
                                                input ? candidate.label.startsWith(input) : true
                                            }
                                            onChange={handleInputAvailability} // Updated to use handleInputAvailability
                                        />
                                </div>
                                <div className="flex flex-col w-full h-full">
                                    <label
                                        htmlFor="status"
                                        className="block font-medium text-gray-300"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id="release_status"
                                        name="release_status"
                                        value={newMovie.release_status}
                                        onChange={handleInputChange}
                                        className="flex-1 w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                                    >
                                        <option disabled value="">
                                            Select Status
                                        </option>
                                        <option
                                            value="ONGOING"
                                            className="bg-gray-800 hover:bg-gray-700"
                                        >
                                            Ongoing
                                        </option>
                                        <option
                                            value="COMPLETED"
                                            className="bg-gray-800 hover:bg-gray-700"
                                        >
                                            Completed
                                        </option>
                                        <option
                                            value="UPCOMING"
                                            className="bg-gray-800 hover:bg-gray-700"
                                        >
                                            Upcoming
                                        </option>
                                    </select>
                                </div>
                            </div>
    
                            {/* Genres */}
                            <div className="w-full col-span-2">
                                <label htmlFor="genres" className="block text-sm font-medium text-gray-300">
                                    Genres
                                </label>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                    {genres && genres.data.map((genre) => (
                                        <label key={genre.genre_id} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                value={genre.genre_id}
                                                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded form-checkbox focus:ring-orange-500"
                                                onChange={handleCheckboxChange}
                                                checked={newCategorizedAs.genre_ids.includes(genre.genre_id)}
                                            />
                                            <span className="ml-2 text-gray-300">{genre.genre_name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* Cover Image */}
                            <div className="flex flex-col w-full col-span-2">
                                <label
                                    htmlFor="poster-image"
                                    className="block font-medium text-gray-300"
                                >
                                    Poster Film
                                </label>
                                <input
                                    type="file"
                                    id="poster_url"
                                    name="poster_url"
                                    accept="image/*"
                                    onChange={(e) => {
                                        handlePosterChange(e);
                                        handleInputChange(e);
                                    }}
                                    className="block w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-orange-500"
                                />
                                {posterPreview && ( // Conditional rendering for the image preview
                                    <div className="mt-2">
                                        <img
                                            src={posterPreview}
                                            alt="Poster Preview"
                                            className="w-24 h-32 rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col w-full col-span-2">
                                <label htmlFor="actors" className="block font-medium text-gray-300">
                                    Actors
                                </label>
                                <Select
                                    id="actors"
                                    name="actors"
                                    options={actorOptions}
                                    placeholder="Select Actors"
                                    styles={customStyles}
                                    isMulti
                                    value={selectedActors}
                                    components={{ Option: ActorOption }}
                                    maxMenuHeight={150}
                                    onChange={handleActorChange}
                                />
    
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedActors.map((actor) => (
                                        <div
                                            key={actor.value}
                                            className="relative flex flex-col items-center p-2 bg-gray-700 rounded-md"
                                            style={{
                                                width: "120px",
                                                height: "160px",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => removeActor(actor)}
                                                className="absolute top-0 text-red-500 right-2 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                            <img
                                                src={actor.foto}
                                                alt={actor.label}
                                                className="object-cover w-16 h-16 mb-2 rounded-full"
                                            />
                                            <span className="text-center text-white">
                                                {actor.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
    
                            {/* Link Trailer and Award */}
                            <div className="flex flex-col w-full col-span-2 md:flex-row md:space-x-4">
                                <div className="flex flex-col w-full">
                                    <label
                                        htmlFor="trailer"
                                        className="block font-medium text-gray-300"
                                    >
                                        Link Trailer
                                    </label>
                                    <input
                                        type="text"
                                        id="link_trailer"
                                        name="link_trailer"
                                        value={newMovie.link_trailer}
                                        onChange={handleInputChange}
                                        placeholder="Enter Trailer Link"
                                        className="block w-full h-12 p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-orange-500"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label
                                        htmlFor="awards"
                                        className="block font-medium text-gray-300"
                                    >
                                        Awards
                                    </label>
                                    <Select
                                        id="awards"
                                        name="awards"
                                        options={awardOptions}
                                        placeholder="Select Awards"
                                        styles={customStyles}
                                        isMulti
                                        maxMenuHeight={150}
                                        value={awardOptions.filter(option => newAwarded.award_ids.includes(option.value))}
                                        filterOption={(candidate, input) =>
                                            input ? candidate.label.startsWith(input):true
                                        }
                                        onChange={handleInputAwarded}
                                    />
                                </div>
                            </div>
    
                            {/* Submit Button */}
                            <div className="w-full col-span-2 mt-4">
                                <button
                                    type="submit"
                                    className="w-full py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                                    onClick={handleSubmit}
                                >
                                    Update Movie
                                </button>
                            </div>
                        </form>
                        {notification.message && (
                            <div className={`mt-4 p-4 rounded-md text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {notification.message}
                            </div>
                        )}
                    </section>
                </main>
            </div>
    
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CmsDramaEdit;