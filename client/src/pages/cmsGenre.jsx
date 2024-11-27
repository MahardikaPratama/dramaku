import React, { useState, useEffect, useMemo } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import Footer from "../components/Footer";
import { useQuery, useQueryClient } from "react-query";
import PaginationAdmin from "../components/PaginationAdmin";
import genreDataService from "../services/genre.service";
import "../css/style.css";
import { FaPlus, FaTrash } from "react-icons/fa";

const CmsGenre = () => {
    const queryClient = useQueryClient();

    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("");
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newGenre, setNewGenre] = useState({
        genre_name: "",
    });
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genreToDelete, setGenreToDelete] = useState(null);
    const [currentEditGenre, setCurrentEditGenre] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const [newGenreName, setNewGenreName] = useState('');

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const { data, isLoading, isError } = useQuery(
        ['genres', { searchTerm, currentPage }],
        async () => {
            if (searchTerm) {
                const response = await genreDataService.searchByGenreName(searchTerm, currentPage, entriesPerPage);
                return response.data;
            } else {
                const response = await genreDataService.getAll(currentPage, entriesPerPage);
                return response.data;
            }
        },
        {
            keepPreviousData: true,
        }
    );

    const genres = useMemo(() => {
        return Array.isArray(data) ? data : data?.data || [];
    }, [data]);


    const totalEntries = data?.totalEntries || 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGenre((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (currentEditGenre) {
                await genreDataService.updateName(currentEditGenre[0], newGenre); // Update 
                setPopupType("success");
                setPopupMessage("Genre berhasil diperbarui!");
            } else {
                await genreDataService.create(newGenre); // Create new genre
                setPopupType("success");
                setPopupMessage("Genre berhasil ditambahkan!");
            }

            // Close modal and reset form
            setIsModalOpen(false);
            setNewGenreName("");
            setNewGenre({ genre_name: "" });
            setCurrentEditGenre(null);
            queryClient.invalidateQueries(['genres', { searchTerm, currentPage }]);
        } catch (error) {
            setPopupType("error");
            setPopupMessage(
                "Gagal melakukan tindakan: " +
                    (error.response?.data ||
                        "Kesalahan tidak diketahui")
            );
        } finally {
            setIsPopupVisible(true);
            setTimeout(() => setIsPopupVisible(false), 3000);
        }
    };

    const handleUpdateName = async (id) => {
        try {
            await genreDataService.updateName(id, { genre_name: newGenreName });
            setPopupType("success");
            setPopupMessage("Nama genre berhasil diperbarui!");
        } catch (error) {
            setPopupType("error");
            setPopupMessage("Gagal memperbarui nama genre: " + error.message);
        }
    };

    const handleDelete = async () => {
        try {
            if (genreToDelete) {
                await genreDataService.delete(genreToDelete); // Menghapus genre yang dipilih
                setPopupType("success");
                setPopupMessage("Genre berhasil dihapus!");
                setGenreToDelete(null); // Reset ID genre yang dihapus
            } else {
                // Menghapus beberapa genre
                await Promise.all(
                    selectedGenres.map((genreId) =>
                        genreDataService.delete(genreId)
                    )
                );
                setPopupType("success");
                setPopupMessage("Genre berhasil dihapus!");
                setSelectedGenres([]);
            }
        } catch (error) {
            setPopupType("error");
            setPopupMessage(
                "Gagal menghapus genre: " +
                    (error.response?.data ||
                        "Kesalahan tidak diketahui")
            );
        } finally {
            setIsConfirmDeleteOpen(false);
            queryClient.invalidateQueries("genres"); // Memperbarui data genre
            setIsPopupVisible(true);
            setTimeout(() => setIsPopupVisible(false), 3000);
        }
    };

    const handleCheckboxChange = (genreId) => {
        setSelectedGenres((prevSelected) =>
            prevSelected.includes(genreId)
                ? prevSelected.filter((id) => id !== genreId)
                : [...prevSelected, genreId]
        );
    };

    const handleEditGenre = (genre) => {
        setCurrentEditGenre(genre);
        setNewGenre({
            genre_name: genre.genre_name,
        });
        setCurrentEditGenre([genre.genre_id]);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchedTerm("");
        } else {
            setSearchedTerm(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm) {
            setSearchResults(genres);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, genres]);

    if (isLoading) return <p>Loading data...</p>;
    if (isError) return <p>Error loading data</p>;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <div className="flex flex-col flex-1 md:flex-row">
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
                        <div className="flex flex-col items-center justify-between mb-4 space-y-4 md:flex-row md:space-y-0">
                            {/* Search Bar */}
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search genres..."
                                className="w-full px-4 py-2 text-gray-300 bg-gray-900 border border-gray-700 rounded-md md:w-auto focus:ring focus:ring-orange-500"
                            />

                            {/* Buttons on the Right */}
                            <div className="flex flex-col items-center w-full space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:w-auto">
                                <button
                                    onClick={() => setIsConfirmDeleteOpen(true)}
                                    className="flex items-center justify-start w-full px-4 py-2 text-white bg-red-500 rounded-md md:justify-center hover:bg-red-600 md:w-auto"
                                    disabled={selectedGenres.length === 0}
                                >
                                    <FaTrash className="mr-2" /> Hapus Data
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center justify-start w-full px-4 py-2 text-white bg-orange-500 rounded-md md:justify-center hover:bg-orange-600 md:w-auto"
                                >
                                    <FaPlus className="mr-2" /> Tambahkan Data
                                    Baru
                                </button>
                            </div>
                        </div>

                        {/* Modal for form */}
                        {isModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                                <div className="p-6 bg-gray-900 rounded-md shadow-lg">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-300">
                                        {currentEditGenre
                                            ? "Edit Genre"
                                            : "Tambahkan Genre Baru"}
                                    </h2>
                                    <form onSubmit={handleSubmit}>
                                        <div>
                                            <label
                                                htmlFor="genre_name"
                                                className="block font-medium text-gray-300"
                                            >
                                                Genre Name
                                            </label>
                                            <input
                                                type="text"
                                                id="genre_name"
                                                name="genre_name"
                                                value={newGenre.genre_name}
                                                onChange={handleInputChange}
                                                className="block w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end mt-6">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsModalOpen(false)
                                                } // Close modal on cancel
                                                className="px-4 py-2 mr-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {isPopupVisible && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                                <div
                                    className={`p-4 text-gray-300 rounded-md shadow-lg  ${
                                        popupType === "success"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                                >
                                    {popupMessage}
                                </div>
                            </div>
                        )}

                        {/* Table and other content */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-gray-300 bg-gray-800">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedGenres(genres.map((genre) => genre.genre_id));
                                                    } else {
                                                        setSelectedGenres([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            No
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            Genre Name
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            Actions
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            Update At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedTerm ? (
                                        searchResults.length > 0 ? (
                                            searchResults.map(
                                                (genre, index) => (
                                                    <tr
                                                        key={genre.genre_id}
                                                        className={`bg-gray-800 ${
                                                            index % 2 === 0
                                                                ? "odd:bg-gray-700"
                                                                : ""
                                                        }`}
                                                    >
                                                        <td className="px-4 py-2 border-b border-gray-600">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedGenres.includes(genre.genre_id)}
                                                                onChange={() => handleCheckboxChange(genre.genre_id)}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 border-b border-gray-600">
                                                            {index + 1 + (currentPage - 1) * entriesPerPage}
                                                        </td>
                                                        <td className="px-4 py-2 border-b border-gray-600">
                                                            <input
                                                                type="text"
                                                                defaultValue={genre.genre_name}
                                                                onChange={(e) => setNewGenreName(e.target.value)}
                                                                onBlur={() => handleUpdateName(genre.genre_id)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleUpdateName(genre.genre_id);
                                                                        e.target.blur();
                                                                    }
                                                                }}
                                                                className="w-full bg-transparent border-none focus:ring-0"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 text-left border-b border-gray-600">
                                                            <button
                                                                className="mr-2 text-red-500 hover:text-red-600"
                                                                onClick={() => handleEditGenre(genre)}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            |
                                                            <button
                                                                className="ml-2 text-red-500 hover:text-red-600"
                                                                onClick={() => {
                                                                    setGenreToDelete(
                                                                        [
                                                                            genre.genre_id,
                                                                        ]
                                                                    );
                                                                    setIsConfirmDeleteOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-2 border-b border-gray-600">
                                                            {new Date(
                                                                genre.updated_at
                                                            ).toLocaleString(
                                                                "id-ID",
                                                                {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-4 py-4 text-center text-gray-400"
                                                >
                                                    No results found for{" "}
                                                    <span className="text-orange-600">
                                                        "{searchedTerm}"
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        genres.map((genre, index) => (
                                            <tr
                                                key={genre.genre_id}
                                                className={`bg-gray-800 ${
                                                    index % 2 === 0
                                                        ? "odd:bg-gray-700"
                                                        : ""
                                                }`}
                                            >
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGenres.includes(
                                                            genre.genre_id
                                                        )}
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                genre.genre_id
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {index + 1 + (currentPage - 1) * entriesPerPage}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <input
                                                        type="text"
                                                        defaultValue={genre.genre_name}
                                                        onChange={(e) => setNewGenreName(e.target.value)}
                                                        onBlur={() => handleUpdateName(genre.genre_id)}
                                                        onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleUpdateName(genre.genre_id);
                                                            e.target.blur();
                                                        }
                                                    }}
                                                    className="w-full bg-transparent border-none focus:ring-0"
                                                    />
                                                </td>

                                                <td className="px-4 py-2 text-left border-b border-gray-600">
                                                    <button
                                                        className="mr-2 text-red-500 hover:text-red-600"
                                                        onClick={() => handleEditGenre(genre)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    |
                                                    <button
                                                        className="ml-2 text-red-500 hover:text-red-600"
                                                        onClick={() => {
                                                            setGenreToDelete([
                                                                genre.genre_id,
                                                            ]);
                                                            setIsConfirmDeleteOpen(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {new Date(
                                                        genre.updated_at
                                                    ).toLocaleString("id-ID", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
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
                            entriesPerPage={entriesPerPage}
                            onPageChange={handlePageChange}
                        />
                    </section>
                </main>
            </div>

            <Footer />

            {isConfirmDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="p-6 text-gray-300 bg-gray-900 rounded-md shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">
                            Konfirmasi Hapus Data
                        </h2>
                        <p className="mb-6">
                            {genreToDelete
                                ? "Apakah Anda yakin ingin menghapus genre ini?"
                                : "Apakah Anda yakin ingin menghapus genre yang dipilih?"}
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsConfirmDeleteOpen(false)}
                                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CmsGenre;
