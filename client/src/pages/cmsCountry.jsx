import React, { useState, useEffect, useMemo } from "react";
import SidebarAdmin from '../components/SidebarAdmin';
import Footer from '../components/Footer';
import { useQuery, useQueryClient } from "react-query";
import PaginationAdmin from '../components/PaginationAdmin';
import countryDataService from "../services/country.service";
import '../css/style.css';
import { FaPlus, FaTrash } from "react-icons/fa";
import Loading from "../components/Loading";  
import Error from "../components/Error";   

const CmsCountry = () => {
    const queryClient = useQueryClient();

    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false); 
    const [popupMessage, setPopupMessage] = useState(""); 
    const [popupType, setPopupType] = useState("");
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newCountry, setNewCountry] = useState({
        country_id: "",
        country_name: "",
        flag: null,
    });
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [countryToDelete, setCountryToDelete] = useState(null);
    const [currentEditCountry, setCurrentEditCountry] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedTerm, setSearchedTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const [newCountryName, setNewCountryName] = useState('');

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const { data, isLoading, isError, } = useQuery(
        ['countries', { searchTerm, currentPage }],
        async () => {
            console.log("Fetching countries with:", { searchTerm, currentPage });
            if (searchTerm) {
                const response = await countryDataService.searchByCountryName(searchTerm, currentPage, entriesPerPage);
                return response.data;
            } else {
                const response = await countryDataService.getAll(currentPage, entriesPerPage);
                return response.data;
            }
        },
        {
            keepPreviousData: true,
        }
    );

    const countries = useMemo(() => {
        return Array.isArray(data) ? data : (data?.data || []);
    }, [data]);

    console.log("Countries:", countries);

    const totalEntries = data?.totalEntries || 0;


    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);


    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewCountry({
            ...newCountry,
            [name]: files ? files[0] : value, 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentEditCountry) {
                await countryDataService.update(currentEditCountry[0], newCountry); // Update country
                setPopupType("success");
                setPopupMessage("Negara berhasil diperbarui!");
            } else {
                await countryDataService.create(newCountry); // Create new country
                setPopupType("success");
                setPopupMessage("Negara berhasil ditambahkan!");
            }

            // Close modal and reset form
            setIsModalOpen(false);
            setNewCountry({ country_id: "", country_name: "", flag: null });
            setCurrentEditCountry(null);
            queryClient.invalidateQueries("countries");
        } catch (error) {
            setPopupType("error");
            setPopupMessage("Gagal melakukan tindakan: " + (error.response?.data?.message || "Kesalahan tidak diketahui"));
        } finally {
            setIsPopupVisible(true);
            setTimeout(() => setIsPopupVisible(false), 3000);
        }
    };

    const handleUpdateName = async (id) => {
        try {
            await countryDataService.updateName(id, { country_name: newCountryName });
            setPopupType("success");
            setPopupMessage("Nama negara berhasil diperbarui!");
        } catch (error) {
            setPopupType("error");
            setPopupMessage("Gagal memperbarui nama negara: " + (error.response?.data?.message || "Kesalahan tidak diketahui"));
        } finally {
            queryClient.invalidateQueries("countries");
        }
    };


    const handleDelete = async () => {
        try {
            if (countryToDelete) {
                await countryDataService.delete(countryToDelete); // Menghapus negara yang dipilih
                setPopupType("success");
                setPopupMessage("Negara berhasil dihapus!");
                setCountryToDelete(null); // Reset ID negara yang dihapus
            } else {
                // Menghapus beberapa negara
                await Promise.all(selectedCountries.map(countryId => countryDataService.delete(countryId)));
                setPopupType("success");
                setPopupMessage("Negara berhasil dihapus!");
                setSelectedCountries([]);
            }
        } catch (error) {
            setPopupType("error");
            setPopupMessage("Gagal menghapus negara: " + (error.response?.data || "Kesalahan tidak diketahui"));
        } finally {
            setIsConfirmDeleteOpen(false);
            queryClient.invalidateQueries("countries"); // Memperbarui data negara
            setIsPopupVisible(true);
            setTimeout(() => setIsPopupVisible(false), 6000);
        }
    };
    

    const handleCheckboxChange = (countryId) => {
        setSelectedCountries((prevSelected) => 
            prevSelected.includes(countryId)
                ? prevSelected.filter(id => id !== countryId) 
                : [...prevSelected, countryId] 
        );
    };

    const handleEditCountry = (country) => {
        setCurrentEditCountry(country);
        setNewCountry({
            country_id: country.country_id,
            country_name: country.country_name,
            flag: country.null,
        });
        setCurrentEditCountry([country.country_id]);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchedTerm('');
        } else {
            setSearchedTerm(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm) {
            setSearchResults(countries);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, countries]);

    
    if (isLoading) return <Loading />;
    if (isError) return <Error />;

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
                                placeholder="Search countries..."
                                className="w-full px-4 py-2 text-gray-300 bg-gray-900 border border-gray-700 rounded-md md:w-auto focus:ring focus:ring-orange-500"
                            />

                            {/* Buttons on the Right */}
                            <div className="flex flex-col items-center w-full space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:w-auto">
                                <button
                                    onClick={() => setIsConfirmDeleteOpen(true)}
                                    className="flex items-center justify-start w-full px-4 py-2 text-white bg-red-500 rounded-md md:justify-center hover:bg-red-600 md:w-auto"
                                    disabled={selectedCountries.length === 0}
                                >
                                    <FaTrash className="mr-2" /> Hapus Data
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center justify-start w-full px-4 py-2 text-white bg-orange-500 rounded-md md:justify-center hover:bg-orange-600 md:w-auto"
                                >
                                    <FaPlus className="mr-2" /> Tambahkan Data Baru
                                </button>
                            </div>
                        </div>


                        {/* Modal for form */}
                        {isModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                                <div className="p-6 bg-gray-900 rounded-md shadow-lg">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-300">{currentEditCountry ? "Edit Negara" : "Tambahkan Negara Baru"}</h2>
                                    <form onSubmit={handleSubmit}>
                                    <div>
                                            <label htmlFor="country_id" className="block font-medium text-gray-300">
                                                Country ID
                                            </label>
                                            <input
                                                type="text"
                                                id="country_id"
                                                name="country_id"
                                                value={newCountry.country_id}
                                                onChange={handleInputChange}
                                                className="block w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
                                                required
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="country_name" className="block font-medium text-gray-300">
                                                Country Name
                                            </label>
                                            <input
                                                type="text"
                                                id="country_name"
                                                name="country_name"
                                                value={newCountry.country_name}
                                                onChange={handleInputChange}
                                                className="block w-full p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
                                                required
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="flag" className="block font-medium text-gray-300">
                                                Flag (Upload Image)
                                            </label>
                                            <input
                                                type="file"
                                                id="flag"
                                                name="flag"
                                                accept="image/*"
                                                onChange={handleInputChange}
                                                className="block w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:ring focus:ring-orange-500"
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)} // Close modal on cancel
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
                                <div className={`p-4 text-gray-300 rounded-md shadow-lg  ${popupType === "success" ? "bg-green-500" : "bg-red-500"}`}>
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
                                                    setSelectedCountries(countries.map((country) => country.country_id))
                                                } else {
                                                    setSelectedCountries([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="px-4 py-2 text-left border-b border-gray-600">Country ID</th>
                                    <th className="px-4 py-2 text-left border-b border-gray-600">Country Name</th>
                                    <th className="px-4 py-2 text-left border-b border-gray-600">Flag</th>
                                    <th className="px-4 py-2 text-left border-b border-gray-600">Actions</th>
                                    <th className="px-4 py-2 text-left border-b border-gray-600">Update At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedTerm ? (
                                    searchResults.length > 0 ? (
                                        searchResults.map((country, index) => (
                                            <tr key={country.country_id} className={`bg-gray-800 ${index % 2 === 0 ? 'odd:bg-gray-700' : ''}`}>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCountries.includes(country.country_id)}
                                                        onChange={() => handleCheckboxChange(country.country_id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">{country.country_id}</td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <input
                                                        type="text"
                                                        defaultValue={country.country_name} // Menampilkan nama awal
                                                        onChange={(e) => setNewCountryName(e.target.value)} // Update state saat teks diubah
                                                        onBlur={() => handleUpdateName(country.country_id)} // Update nama saat kehilangan fokus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUpdateName(country.country_id); // Update nama saat menekan Enter
                                                                e.target.blur(); // Hilangkan fokus untuk menghindari pemanggilan ganda
                                                            }
                                                        }}
                                                        className="w-full bg-transparent border-none focus:ring-0"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    <img src={country.flag_url} alt={`${country.country_name} flag`} className="w-10 h-6" />
                                                </td>
                                                <td className="px-4 py-2 text-left border-b border-gray-600">
                                                    <button 
                                                        className="mr-2 text-blue-500 hover:text-blue-600"
                                                        onClick={() => handleEditCountry(country)} // Edit country
                                                    >
                                                        <i className="fas fa-edit"></i> 
                                                    </button>
                                                    |
                                                    <button 
                                                        className="ml-2 text-red-500 hover:text-red-600" 
                                                        onClick={() => {
                                                            setCountryToDelete([country.country_id]);
                                                            setIsConfirmDeleteOpen(true);
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-600">
                                                    {new Date(country.updated_at).toLocaleString('id-ID', {
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
                                            <td colSpan="6" className="px-4 py-4 text-center text-gray-400">
                                                No results found for <span className="text-orange-600">"{searchedTerm}"</span>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    countries.map((country, index) => (
                                        <tr key={country.country_id} className={`bg-gray-800 ${index % 2 === 0 ? 'odd:bg-gray-700' : ''}`}>
                                            <td className="px-4 py-2 border-b border-gray-600">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCountries.includes(country.country_id)}
                                                    onChange={() => handleCheckboxChange(country.country_id)}
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-600">{country.country_id}</td>
                                            <td className="px-4 py-2 border-b border-gray-600">
                                                <input
                                                    type="text"
                                                    defaultValue={country.country_name} // Menampilkan nama awal
                                                    onChange={(e) => setNewCountryName(e.target.value)} // Update state saat teks diubah
                                                    onBlur={() => handleUpdateName(country.country_id)} // Update nama saat kehilangan fokus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleUpdateName(country.country_id); // Update nama saat menekan Enter
                                                            e.target.blur(); // Hilangkan fokus untuk menghindari pemanggilan ganda
                                                        }
                                                    }}
                                                    className="w-full bg-transparent border-none focus:ring-0"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-600">
                                                <img src={country.flag_url} alt={`${country.country_name} flag`} className="w-10 h-6" />
                                            </td>
                                            <td className="px-4 py-2 text-left border-b border-gray-600">
                                                <button 
                                                    className="mr-2 text-blue-500 hover:text-blue-600"
                                                    onClick={() => handleEditCountry(country)}
                                                >
                                                    <i className="fas fa-edit"></i> 
                                                </button>
                                                |
                                                <button 
                                                    className="ml-2 text-red-500 hover:text-red-600" 
                                                    onClick={() => {
                                                        setCountryToDelete([country.country_id]);
                                                        setIsConfirmDeleteOpen(true);
                                                    }}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-600">
                                                {new Date(country.updated_at).toLocaleString('id-ID', {
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
            {/* Modal Konfirmasi Hapus */}
            {isConfirmDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="p-6 text-gray-300 bg-gray-900 rounded-md shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">Konfirmasi Hapus Data</h2>
                        <p className="mb-6">{countryToDelete ? "Apakah Anda yakin ingin menghapus negara ini?" : "Apakah Anda yakin ingin menghapus negara yang dipilih?"}</p>
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

export default CmsCountry;
