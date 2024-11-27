import React, { useState, useEffect, useMemo } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import Footer from "../components/Footer";
import { useQuery, useQueryClient } from "react-query";
import PaginationAdmin from "../components/PaginationAdmin";
import awardDataService from "../services/award.service";
import Select from "react-select";
import countryDataService from "../services/country.service";
import "../css/style.css";
import { FaPlus, FaTrash } from "react-icons/fa";

const CmsAward = () => {
    const queryClient = useQueryClient();

    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("");
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newAward, setNewAward] = useState({
        award_name: "",
        year: "",
        country_id: "",
    });
    const [selectedAwards, setSelectedAwards] = useState([]);
    const [awardToDelete, setAwardToDelete] = useState(null);
    const [currentEditAward, setCurrentEditAward] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const [newAwardName, setNewAwardName] = useState({});

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

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

    const { data, isLoading, isError } = useQuery(
        ["awards", { searchTerm, currentPage }],
        async () => {
            if (searchTerm) {
                const response = await awardDataService.searchByAwardName(searchTerm, currentPage, entriesPerPage);
                return response.data;
            } else {
                const response = await awardDataService.getPaginatedAwards(currentPage, entriesPerPage);
                return response.data;
            }
        },
        {
            keepPreviousData: true, // Biar data sebelumnya tetap ditampilkan selama refetch
            refetchOnWindowFocus: false, // Hindari refetch saat kembali ke window
        }
    );

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
    };

    
    const getCountryNameById = (id) => {
        const country = countries.data.find((country) => country.country_id === id);
        return country ? country.country_name : "Unknown";
    };
    
    const handleAwardNameChange = (award_id, value) => {
    setNewAwardName((prevNames) => ({
        ...prevNames,
        [award_id]: value,
    }));
};
    

    const awards = useMemo(() => {
        return Array.isArray(data) ? data : data?.data || [];
    }, [data]);

    const countryOptions = Array.isArray(countries.data)
        ? countries.data.map((country) => ({
              value: country.country_id,
              label: country.country_name,
          }))
        : [];

    const totalEntries = data?.totalEntries || 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAward((prevAward) => ({
            ...prevAward,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentEditAward) {
                await awardDataService.update(currentEditAward[0], newAward);
                setPopupType("success");
                setPopupMessage("Award berhasil diperbarui!");
            } else {
                await awardDataService.create(newAward);
                setPopupType("success");
                setPopupMessage("Award berhasil ditambahkan!");
            }
            
            setIsModalOpen(false);
            setNewAwardName("");
            setNewAward({ award_name: "", year: "", country_id: "" });
            setCurrentEditAward(null);
            
            queryClient.invalidateQueries("awards");
        } catch (error) {
            setPopupType("error");
            setPopupMessage(
                "Gagal melakukan tindakan: " +
                    (error.response?.data?.message ||
                        "Kesalahan tidak diketahui")
            );
        } finally {
            setIsPopupVisible(true);
            setTimeout(() => setIsPopupVisible(false), 3000);
        }
    };

    const handleUpdateName = async (id) => { 
        try {
            await awardDataService.updateName(id, { award_name: newAwardName[id] });
            setPopupType("success");
            setPopupMessage("Award berhasil diperbarui!");
        } catch (error) {
            setPopupType("error");
            setPopupMessage("Gagal melakukan tindakan: " + (error.response?.data?.message || "Kesalahan tidak diketahui"));
        } finally {
            queryClient.invalidateQueries("awards");
        }
    };

    const handleDelete = async () => {
        try {
            if (awardToDelete) {
                await awardDataService.delete(awardToDelete);
                setPopupType("success");
                setPopupMessage("Award berhasil dihapus!");
                setAwardToDelete(null);
            } else {
                await Promise.all(
                    selectedAwards.map((awardId) =>
                        awardDataService.delete(awardId)
                    )
                );
                setPopupType("success");
                setPopupMessage("Award berhasil dihapus!");
                setSelectedAwards([]);
            }
        } catch (error) {
            setPopupType("error");
            setPopupMessage(
                "Gagal menghapus award: " +
                    (error.response?.data ||
                        "Kesalahan tidak diketahui")
            );
        } finally {
            setIsConfirmDeleteOpen(false);
            queryClient.invalidateQueries("awards");
            setIsPopupVisible(true);
            setTimeout(() => setIsPopupVisible(false), 3000);
        }
    };

    const handleCheckboxChange = (awardId) => {
        setSelectedAwards((prevSelected) =>
            prevSelected.includes(awardId)
                ? prevSelected.filter((id) => id !== awardId)
                : [...prevSelected, awardId]
        );
    };

    const handleEditAward = (award) => {
        setCurrentEditAward([award]);
        setNewAward({
            award_name: award.award_name,
            year: award.year,
            country_id: award.country_id,
        });
        setCurrentEditAward([award.award_id]);
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
            setSearchResults(awards);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, awards]);

    if (isLoading || countryLoading) return <p>Loading data...</p>;
    if (isError || countryError) return <p>Error loading data</p>;

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
                                placeholder="Search awards..."
                                className="w-full px-4 py-2 text-gray-300 bg-gray-900 border border-gray-700 rounded-md md:w-auto focus:ring focus:ring-orange-500"
                            />

                            {/* Buttons on the Right */}
                            <div className="flex flex-col items-center w-full space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:w-auto">
                                <button
                                    onClick={() => setIsConfirmDeleteOpen(true)}
                                    className="flex items-center justify-start w-full px-4 py-2 text-white bg-red-500 rounded-md md:justify-center hover:bg-red-600 md:w-auto"
                                    disabled={selectedAwards.length === 0}
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
                                        {currentEditAward
                                            ? "Edit Award"
                                            : "Tambahkan Award Baru"}
                                    </h2>
                                    <form onSubmit={handleSubmit}>
                                        {/* Input Fields */}
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="award_name"
                                                    className="block font-medium text-gray-300"
                                                >
                                                    Award Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="award_name"
                                                    name="award_name"
                                                    value={newAward.award_name}
                                                    onChange={handleInputChange}
                                                    className="block w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="year"
                                                    className="block font-medium text-gray-300"
                                                >
                                                    Year
                                                </label>
                                                <input
                                                    type="text"
                                                    id="year"
                                                    name="year"
                                                    value={newAward.year}
                                                    onChange={handleInputChange}
                                                    className="block w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
                                                    required
                                                />
                                            </div>
                                            <div>
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
                                                        (country) => country.value === newAward.country_id
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
                                        {/* Buttons */}
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
                                                        setSelectedAwards(
                                                            awards.map(
                                                                (award) =>
                                                                    award.award_id
                                                            )
                                                        );
                                                    } else {
                                                        setSelectedAwards([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="px-4 py-2 border-b border-gray-600">
                                            No
                                        </th>
                                        <th className="w-1/6 px-4 py-2 text-left border-b border-gray-600">
                                            Year
                                        </th>
                                        <th className="w-1/6 px-4 py-2 text-left border-b border-gray-600">
                                            Country Name
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600 min-w-[300px]">
                                            Award Name
                                        </th>
                                        <th className="w-1/6 px-4 py-2 text-left border-b border-gray-600">
                                            Actions
                                        </th>
                                        <th className="w-2/6 px-4 py-2 text-left border-b border-gray-600">
                                            Updated At
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedTerm ? (
                                        searchResults.length > 0 ? (
                                            searchResults.map((award, index) => (
                                                <tr key={award.award_id} className={`bg-gray-800 ${index % 2 === 0 ? 'odd:bg-gray-700' : ''}`}>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        <input
                                                            type="checkbox"
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    award.award_id
                                                                )
                                                            }
                                                            checked={selectedAwards.includes(
                                                                award.award_id
                                                            )}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {award.year}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {getCountryNameById(award.country_id)}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        <input
                                                            type="text"
                                                            defaultValue={award.award_name}
                                                            onChange={(e) => setNewAwardName(e.target.value )}
                                                            onBlur={() => handleUpdateName(award.award_id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleUpdateName(award.award_id);
                                                                    e.target.blur();
                                                                }
                                                            }}
                                                            className="w-full bg-transparent border-none focus:ring-0"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-left border-b border-gray-600">
                                                        <button
                                                            onClick={() =>
                                                                handleEditAward(award)
                                                            }
                                                            className="mr-2 text-blue-500 hover:text-blue-600"
                                                        >
                                                            <i className="fas fa-edit"></i> 
                                                        </button>
                                                        |
                                                        <button
                                                            onClick={() => {
                                                                setAwardToDelete(award.award_id);
                                                                setIsConfirmDeleteOpen(true);
                                                            }}
                                                            className="ml-2 text-red-500 hover:text-red-600"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-600">
                                                        {new Date(award.updated_at).toLocaleString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-4 py-2 text-center"
                                                >
                                                    No results found.
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        awards.map((award, index) => (
                                            <tr key={award.award_id} className={`bg-gray-800 ${index % 2 === 0 ? 'odd:bg-gray-700' : ''}`}>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                award.award_id
                                                            )
                                                        }
                                                        checked={selectedAwards.includes(
                                                            award.award_id
                                                        )}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {award.year}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {getCountryNameById(award.country_id)}
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <input
                                                        type="text"
                                                        value={newAwardName[award.award_id] || award.award_name}
                                                        onChange={(e) => handleAwardNameChange(award.award_id, e.target.value)}
                                                        onBlur={() => handleUpdateName(award.award_id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUpdateName(award.award_id);
                                                                e.target.blur();
                                                            }
                                                        }}
                                                        className="w-full bg-transparent border-none focus:ring-0"
                                                    />


                                                </td>
                                                <td className="px-4 py-2 text-left border-b border-gray-600">
                                                    <button
                                                        onClick={() =>
                                                            handleEditAward(award)
                                                        }
                                                        className="mr-2 text-blue-500 hover:text-blue-600"
                                                    >
                                                        <i className="fas fa-edit"></i> 
                                                    </button>
                                                    |
                                                    <button
                                                        onClick={() => {
                                                            setAwardToDelete(award.award_id);
                                                            setIsConfirmDeleteOpen(true);
                                                        }}
                                                        className="ml-2 text-red-500 hover:text-red-600"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {new Date(award.updated_at).toLocaleString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
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
                            {awardToDelete
                                ? "Apakah Anda yakin ingin menghapus award ini?"
                                : "Apakah Anda yakin ingin menghapus award yang dipilih?"}
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

export default CmsAward;
