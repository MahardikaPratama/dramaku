import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import SidebarUser from "../components/SidebarUser";
import FilterAdmin from '../components/FilterAdmin'; 
import PaginationAdmin from '../components/PaginationAdmin'; 
import PopupDrama from '../components/PopupDrama'; 
import Footer from "../components/Footer";
import movieDataService from "../services/movie.service";
import userDataService from "../services/user.service";
import Loading from "../components/Loading";  
import Error from "../components/Error";
import { useNavigate } from "react-router-dom";

const CmsDrama = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [deleteResult, setDeleteResult] = useState(null);
    const [updateResult, setUpdateResult] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedTerm, setSearchedTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('None');
    const [numberOfShows, setNumberOfShows] = useState(10);


    const MAX_ACTORS_LENGTH = 50; 
    const MAX_SYNOPSIS_LENGTH = 100; 

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userDataService.getProfile();
                if (response.data) {
                    setUserId(response.data.user_id);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
    
        fetchUserData();
    }, []);

    const hideModal = () => setModalVisible(false);

    const { data, isLoading, isError } = useQuery(
        ['movies', { searchTerm: searchedTerm, filterStatus, numberOfShows, currentPage }],
        async () => {
            if (searchTerm) {
                console.log("Searching for:", searchedTerm);
                const response = await movieDataService.searchByTitleUser(userId, searchedTerm, currentPage, numberOfShows);
                console.log("Search response:", response.data);
                return response.data;
            } else if (filterStatus !== 'None') {
                console.log("Filtering by status:", filterStatus);
                const response = await movieDataService.filterByStatusUser(userId, filterStatus, currentPage, numberOfShows);
                return response.data;
            } else {
                const response = await movieDataService.getAllMoviesCMSUser(userId, currentPage, numberOfShows);
                return response.data;
            }
        },
        {
            keepPreviousData: true,
        }
    );

    const movies = useMemo(() => Array.isArray(data) ? data : (data?.movies || []), [data]);
    const totalEntries = data?.totalCount || 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchedTerm('');
        } else {
            setSearchedTerm(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchedTerm) {
            setSearchResults(movies);
        } else {
            setSearchResults([]);
        }
    }, [searchedTerm, movies]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const confirmDelete = (movieId) => {
        setSelectedMovieId(movieId);
        setDeleteConfirmVisible(true);
    };

    const handleDelete = async () => {
        try {
            await movieDataService.deleteMovie(selectedMovieId);
            setDeleteResult("success");
            queryClient.invalidateQueries("movies");
        } catch (error) {
            setDeleteResult("failure");
        } finally {
            setDeleteConfirmVisible(false);
            setSelectedMovieId(null);
        }
    };

    const handleUpdateApproval = async () => {
        try {
            await movieDataService.updateApprovalStatus(selectedMovieId);
            setUpdateResult("success");
            queryClient.invalidateQueries("movies");
        } catch (error) {
            setUpdateResult("failure");
        } finally {
            setSelectedMovieId(null);
        }
    };


    const closeDeleteResultPopup = () => setDeleteResult(null);
    const closeUpdateResultPopup = () => setUpdateResult(null);

    const handleEdit = (movieId) => {
        navigate(`/edit-drama/${movieId}`);
    };

    if (isLoading) return <Loading />;
    if (isError) return <Error />;

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
                <SidebarUser isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6">
                    <section className="container p-4 mx-auto bg-gray-800 rounded-md shadow-md md:p-6">
                        <div className="flex flex-col mb-4 space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                            {/* Pass handlers to FilterAdmin */}
                            <FilterAdmin
                                onFilterStatusChange={setFilterStatus}
                                onNumberOfShowsChange={setNumberOfShows}
                            />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search drama..."
                                className="w-full px-4 py-2 text-gray-300 bg-gray-900 border border-gray-700 rounded-md md:w-auto focus:ring focus:ring-orange-500"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-gray-300 bg-gray-800">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2 border-b border-gray-600">#</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Drama</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Actors</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Genres</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Synopsis</th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchTerm ? (
                                        searchResults.length > 0 ? (
                                            searchResults.map((movie, index) => (
                                                <tr key={movie.movie_id} className={`bg-gray-800 ${index % 2 === 0 ? 'odd:bg-gray-700' : ''}`}>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {index + 1 + (currentPage - 1) * numberOfShows}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">{movie.title}</td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {movie.actors.length > MAX_ACTORS_LENGTH
                                                            ? `${movie.actors.slice(0, MAX_ACTORS_LENGTH)}...`
                                                            : movie.actors}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {movie.genres}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {movie.synopsis.length > MAX_SYNOPSIS_LENGTH
                                                            ? `${movie.synopsis.slice(0, MAX_SYNOPSIS_LENGTH)}...`
                                                            : movie.synopsis}
                                                    </td>
                                                    <td className="w-1/6 px-4 py-2 text-left border-b border-gray-600">
                                                        <button 
                                                            className="mr-2 text-red-500 hover:text-red-600"
                                                            onClick={() => handleEdit(movie.movie_id)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        |
                                                        <button onClick={() => confirmDelete(movie.movie_id)} className="ml-2 text-red-500 hover:text-red-600">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-4 text-center text-gray-400">
                                                    No results found for <span className="text-orange-600">"{searchedTerm}"</span>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        movies.map((movie, index) => (
                                            <tr key={movie.movie_id} className={`bg-gray-800 ${index % 2 === 0 ? 'odd:bg-gray-700' : ''}`}>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {index + 1 + (currentPage - 1) * numberOfShows}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">{movie.title}</td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {movie.actors.length > MAX_ACTORS_LENGTH
                                                        ? `${movie.actors.slice(0, MAX_ACTORS_LENGTH)}...`
                                                        : movie.actors}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {movie.genres}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {movie.synopsis.length > MAX_SYNOPSIS_LENGTH
                                                        ? `${movie.synopsis.slice(0, MAX_SYNOPSIS_LENGTH)}...`
                                                        : movie.synopsis}
                                                </td>
                                                <td className="w-1/6 px-4 py-2 text-left border-b border-gray-600">
                                                    <button 
                                                        className="mr-2 text-red-500 hover:text-red-600"
                                                        onClick={() => handleEdit(movie.movie_id)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    |
                                                    <button onClick={() => confirmDelete(movie.movie_id)} className="ml-2 text-red-500 hover:text-red-600">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>
                        </div>
                        <PaginationAdmin
                            currentPage={currentPage}
                            totalEntries={totalEntries}
                            entriesPerPage={numberOfShows}
                            onPageChange={handlePageChange}
                        />
                    </section>
                    {deleteConfirmVisible && (
                        <div className="fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-60">
                            <div className="p-6 text-center transition-transform duration-300 ease-in-out transform scale-105 bg-gray-900 rounded-lg shadow-lg">
                                <p className="mb-4 text-lg font-semibold text-gray-300">Are you sure you want to delete this movie?</p>
                                <div className="flex justify-center space-x-4">
                                    <button 
                                        onClick={handleDelete} 
                                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:ring focus:ring-red-500"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button 
                                        onClick={() => setDeleteConfirmVisible(false)} 
                                        className="px-4 py-2 text-gray-400 bg-gray-700 rounded hover:bg-gray-600 focus:ring focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {deleteResult && (
                        <div className="fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-60">
                            <div className={`p-6 bg-gray-900 rounded-lg shadow-lg text-center transform transition-transform duration-300 ease-in-out scale-105 ${
                                deleteResult === "success" ? "text-green-400" : "text-red-400"
                            }`}>
                                <p className="mb-4 text-lg font-semibold">
                                    {deleteResult === "success" ? "Movie deleted successfully!" : "Failed to delete the movie."}
                                </p>
                                <button 
                                    onClick={closeDeleteResultPopup} 
                                    className="px-4 py-2 mt-2 text-gray-400 bg-gray-700 rounded hover:bg-gray-600 focus:ring focus:ring-gray-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {updateResult && (
                        <div className="fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-60">
                            <div className={`p-6 bg-gray-900 rounded-lg shadow-lg text-center transform transition-transform duration-300 ease-in-out scale-105 ${
                                updateResult === "success" ? "text-green-400" : "text-red-400"
                            }`}>
                                <p className="mb-4 text-lg font-semibold">
                                    {updateResult === "success" ? "Approval status updated successfully!" : "Failed to update approval status."}
                                </p>
                                <button 
                                    onClick={closeUpdateResultPopup} 
                                    className="px-4 py-2 mt-2 text-gray-400 bg-gray-700 rounded hover:bg-gray-600 focus:ring focus:ring-gray-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    <section>
                        <PopupDrama isVisible={isModalVisible} hideModal={hideModal} movieId={selectedMovieId} handleDelete={handleDelete} handleUpdateApproval={handleUpdateApproval}/>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default CmsDrama;