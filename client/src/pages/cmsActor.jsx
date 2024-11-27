import React, { useState, useEffect, useMemo } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import Footer from "../components/Footer";
import { useQuery, useQueryClient } from "react-query";
import PaginationAdmin from "../components/PaginationAdmin";
import actorDataService from "../services/actor.service";
import "../css/style.css";
import { FaPlus, FaTrash } from "react-icons/fa";

const CmsActor = () => {
    const queryClient = useQueryClient();
    const [popupTimeout, setPopupTimeout] = useState(null);
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("");
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newActor, setNewActor] = useState({
        actor_name: "",
        birth_date: "",
        foto_url: null,
    });
    const [selectedActors, setSelectedActors] = useState([]);
    const [actorToDelete, setActorToDelete] = useState(null);
    const [currentEditActor, setCurrentEditActor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const [newActorName, setNewActorName] = useState("");

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const { data, isLoading, isError } = useQuery(
        ["actors", { searchTerm, currentPage }],
        async () => {
            if (searchTerm) {
                const response = await actorDataService.searchByActorName(
                    searchTerm,
                    currentPage,
                    entriesPerPage
                );
                return response.data;
            } else {
                const response = await actorDataService.getPaginatedActors(
                    currentPage,
                    entriesPerPage
                );
                return response.data;
            }
        },
        {
            keepPreviousData: true,
        }
    );

    const actors = useMemo(() => {
        return Array.isArray(data) ? data : data?.data || [];
    }, [data]);

    const totalEntries = data?.totalEntries || 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewActor({
            ...newActor,
            [name]: files ? files[0] : value,
        });
    };

    useEffect(() => {
        return () => {
            clearTimeout(popupTimeout);
        };
    }, [popupTimeout]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentEditActor) {
                await actorDataService.update(currentEditActor, newActor); // Update actor
                setPopupType("success");
                setPopupMessage("Aktor berhasil diperbarui!");
            } else {
                await actorDataService.create(newActor); // Create new actor
                setPopupType("success");
                setPopupMessage("Aktor berhasil ditambahkan!");
            }
    
            // Reset form
            setIsModalOpen(false);
            setNewActor({ actor_name: "", birth_date: "", foto_url: null });
            setCurrentEditActor(null);
            queryClient.invalidateQueries("actors");
        } catch (error) {
            setPopupType("error");
            setPopupMessage(
                "Gagal melakukan tindakan: " +
                    (error.response?.data?.message ||
                        "Kesalahan tidak diketahui")
            );
        } finally {
            setIsPopupVisible(true);
            setPopupTimeout(setTimeout(() => setIsPopupVisible(false), 3000));
        }
    };

    const handleUpdateActorName = async (id) => {
        try {
            await actorDataService.updateName(id, { actor_name: newActorName });
            setPopupType("success");
            setPopupMessage("Nama aktor berhasil diperbarui!");
        } catch (error) {
            setPopupType("error");
            setPopupMessage(
                "Gagal memperbarui nama aktor: " +
                    (error.response?.data?.message ||
                        "Kesalahan tidak diketahui")
            );
        } finally {
            queryClient.invalidateQueries("actors");
        }
    };

    const handleDelete = async () => {
        try {
            if (actorToDelete) {
                await actorDataService.delete(actorToDelete); // Delete selected actor
                setPopupType("success");
                setPopupMessage("Aktor berhasil dihapus!");
                setActorToDelete(null);
            } else {
                await Promise.all(
                    selectedActors.map((actorId) =>
                        actorDataService.delete(actorId)
                    )
                );
                setPopupType("success");
                setPopupMessage("Aktor berhasil dihapus!");
                setSelectedActors([]);
            }
        } catch (error) {
            setPopupType("error");
            setPopupMessage(
                "Gagal menghapus aktor: " +
                    (error.response?.data ||
                        "Kesalahan tidak diketahui")
            );
        } finally {
            setIsConfirmDeleteOpen(false);
            queryClient.invalidateQueries("actors");
            setIsPopupVisible(true);
            setTimeout(() => setIsPopupVisible(false), 3000);
        }
    };

    const handleCheckboxChange = (actorId) => {
        setSelectedActors((prevSelected) =>
            prevSelected.includes(actorId)
                ? prevSelected.filter((id) => id !== actorId)
                : [...prevSelected, actorId]
        );
    };

    const handleEditActor = (actor) => {
        setCurrentEditActor(actor);
        setNewActor({
            actor_name: actor.actor_name,
            birth_date: actor.birth_date,
            foto_url: actor.foto_url,
        });
        setCurrentEditActor([actor.actor_id]);
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
            setSearchResults(actors);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, actors]);

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
                                placeholder="Search actors..."
                                className="w-full px-4 py-2 text-gray-300 bg-gray-900 border border-gray-700 rounded-md md:w-auto focus:ring focus:ring-orange-500"
                            />

                            {/* Buttons on the Right */}
                            <div className="flex flex-col items-center w-full space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:w-auto">
                                <button
                                    onClick={() => setIsConfirmDeleteOpen(true)}
                                    className="flex items-center justify-start w-full px-4 py-2 text-white bg-red-500 rounded-md md:justify-center hover:bg-red-600 md:w-auto"
                                    disabled={selectedActors.length === 0}
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
                                        {currentEditActor
                                            ? "Edit Actor"
                                            : "Tambahkan Actor Baru"}
                                    </h2>
                                    <form onSubmit={handleSubmit}>
                                        <div>
                                            <label
                                                htmlFor="actor_name"
                                                className="block font-medium text-gray-300"
                                            >
                                                Actor Name
                                            </label>
                                            <input
                                                type="text"
                                                id="actor_name"
                                                name="actor_name"
                                                value={newActor.actor_name}
                                                onChange={handleInputChange}
                                                className="block w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="birth_date"
                                                className="block font-medium text-gray-300"
                                            >
                                                Birth Date
                                            </label>
                                            <input
                                                type="date"
                                                id="birth_date"
                                                name="birth_date"
                                                value={newActor.birth_date}
                                                onChange={handleInputChange}
                                                className="block w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="foto_url"
                                                className="block font-medium text-gray-300"
                                            >
                                                Foto (Upload Image)
                                            </label>
                                            <input
                                                type="file"
                                                id="foto_url"
                                                name="foto_url"
                                                accept="image/*"
                                                onChange={handleInputChange}
                                                className="block w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
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
                                                        setSelectedActors(
                                                            actors.map(
                                                                (actor) =>
                                                                    actor.actor_id
                                                            )
                                                        );
                                                    } else {
                                                        setSelectedActors([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            No
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            Actor Name
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            Birth Date
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            Foto Actor
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            Actions
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600">
                                            Updated At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedTerm ? (
                                        searchResults.length > 0 ? (
                                            searchResults.map((actor, index) => (
                                                <tr
                                                    key={actor.actor_id}
                                                    className={`bg-gray-800 ${index % 2 === 0 ? "odd:bg-gray-700" : ""}`}
                                                >
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedActors.includes(actor.actor_id)}
                                                            onChange={() => handleCheckboxChange(actor.actor_id)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {index + 1 + (currentPage - 1) * entriesPerPage}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        <input
                                                            type="text"
                                                            defaultValue={actor.actor_name}
                                                            onChange={(e) => setNewActorName(e.target.value)}
                                                            onBlur={() => handleUpdateActorName(actor.actor_id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    handleUpdateActorName(actor.actor_id);
                                                                    e.target.blur();
                                                                }
                                                            }}
                                                            className="w-full bg-transparent border-none focus:ring-0"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {(() => {
                                                            const date = new Date(actor.birth_date);
                                                            const year = date.getFullYear();
                                                            const month = String(date.getMonth() + 1).padStart(2, "0");
                                                            const day = String(date.getDate()).padStart(2, "0");
                                                            return `${year}/${month}/${day}`;
                                                        })()}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        <img
                                                            src={actor.foto_url || "default-avatar-url.jpg"} // Gunakan URL default jika tidak ada foto
                                                            alt={actor.actor_name}
                                                            className="object-cover w-16 h-16 rounded-full"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-left border-b border-gray-600">
                                                        <button
                                                            className="mr-2 text-red-500 hover:text-red-600"
                                                            onClick={() => handleEditActor(actor)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        |
                                                        <button
                                                            className="ml-2 text-red-500 hover:text-red-600"
                                                            onClick={() => {
                                                                setActorToDelete([actor.id]);
                                                                setIsConfirmDeleteOpen(true);
                                                            }}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {new Date(actor.updated_at).toLocaleString("id-ID", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                                                    No results found for{" "}
                                                    <span className="text-orange-600">"{searchedTerm}"</span>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        actors.map((actor, index) => (
                                            <tr
                                                key={actor.actor_id}
                                                className={`bg-gray-800 ${index % 2 === 0 ? "odd:bg-gray-700" : ""}`}
                                            >
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedActors.includes(actor.actor_id)}
                                                        onChange={() => handleCheckboxChange(actor.actor_id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {index + 1 + (currentPage - 1) * entriesPerPage}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <input
                                                        type="text"
                                                        defaultValue={actor.actor_name}
                                                        onChange={(e) => setNewActorName(e.target.value)}
                                                        onBlur={() => handleUpdateActorName(actor.actor_id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleUpdateActorName(actor.actor_id);
                                                                e.target.blur();
                                                            }
                                                        }}
                                                        className="w-full bg-transparent border-none focus:ring-0"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {(() => {
                                                        const date = new Date(actor.birth_date);
                                                        const year = date.getFullYear();
                                                        const month = String(date.getMonth() + 1).padStart(2, "0");
                                                        const day = String(date.getDate()).padStart(2, "0");
                                                        return `${year}/${month}/${day}`;
                                                    })()}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <img
                                                        src={actor.foto_url} // Gunakan URL default jika tidak ada foto
                                                        alt={actor.actor_name}
                                                        className="object-cover w-16 h-16 rounded-full"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-left border-b border-gray-600">
                                                    <button
                                                        className="mr-2 text-red-500 hover:text-red-600"
                                                        onClick={() => handleEditActor(actor)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    |
                                                    <button
                                                        className="ml-2 text-red-500 hover:text-red-600"
                                                        onClick={() => {
                                                            setActorToDelete([actor.id]);
                                                            setIsConfirmDeleteOpen(true);
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {new Date(actor.updated_at).toLocaleString("id-ID", {
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
            {/* Modal Konfirmasi Hapus */}
            {isConfirmDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="p-6 text-gray-300 bg-gray-900 rounded-md shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">
                            Konfirmasi Hapus Data
                        </h2>
                        <p className="mb-6">
                            {actorToDelete
                                ? "Apakah Anda yakin ingin menghapus actor ini?"
                                : "Apakah Anda yakin ingin menghapus actor yang dipilih?"}
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

export default CmsActor;
