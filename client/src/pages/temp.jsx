import React, { useState, useEffect } from "react";
import PaginationHome from './PaginationHome';
import SidebarNavbar from "../components/SidebarNavbar";
import Card from "../components/Card";
import FilterSortOptions from "../components/FilterSortOptions";
import SearchCard from "../components/SearchCard";
import { useNavigate } from "react-router-dom";
import "../css/style.css";
import moviesData from "../data/movies.json";
import Footer from "../components/footer";
import Carousel from "../components/Carousel";

function temp() {
    // State untuk menyimpan nilai input pencarian
    const [searchTerm, setSearchTerm] = useState('');
    // State untuk menyimpan hasil pencarian
    const [searchResults, setSearchResults] = useState([]);
    // State untuk menyimpan term pencarian yang telah dikirim
    const [searchedTerm, setSearchedTerm] = useState('');
    // State untuk menyimpan data film
    const [movies, setMovies] = useState(moviesData);
    // State untuk filter country
    const [countryFilter, setCountryFilter] = useState('');

    // State untuk filter dan sort options
    const [filterOptions, setFilterOptions] = useState({
        year: '',
        genre: '',
        status: '',
        avaibility: '',
        award: '',
        country: ''
    });

    const [sortOption, setSortOption] = useState('');

    // Hook untuk navigasi
    const navigate = useNavigate();

    // Fungsi untuk menangani klik pada card drama
    const handleDramaClick = (id) => {
        console.log("Navigating to Detail Page with ID:", id);
        navigate(`/detail/${id}`);
    };

    // Fungsi untuk menangani perubahan input pencarian
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Jika input kosong, reset hasil pencarian dan searchedTerm
        if (value.trim() === '') {
            setSearchedTerm('');
            setSearchResults([]);
        }
    };

    // Fungsi untuk menangani pengiriman form pencarian
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // Cek jika searchTerm kosong
        if (searchTerm.trim() === '') {
            setSearchedTerm('');
            setSearchResults([]);
            return;
        }

        // Set nilai searchedTerm saat submit
        setSearchedTerm(searchTerm);

        // Filter hasil pencarian berdasarkan title film
        const filteredResults = movies.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
        setSearchResults(filteredResults);
    };

    // Fungsi untuk menangani perubahan filter
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCountryFilter = (country) => {
        setFilterOptions(prevState => ({
            ...prevState,
            country
        }));

        // Apply the country filter based on updated filterOptions
        let filteredMovies = [...moviesData];
        if (country) {
            filteredMovies = filteredMovies.filter(movie => movie.country === country);
        }
        setCountryFilter(country);
        setMovies(filteredMovies);
    };

    // Fungsi untuk menangani perubahan sort
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Fungsi untuk menerapkan filter dan sort saat tombol Submit diklik
    const handleSubmitFilterSort = () => {
        let filteredMovies = [...moviesData];
    
        if (filterOptions.year) {
            filteredMovies = filteredMovies.filter(movie => movie.year === parseInt(filterOptions.year));
        }
        if (filterOptions.genre) {
            filteredMovies = filteredMovies.filter(movie => movie.genres.includes(filterOptions.genre));
        }
        if (filterOptions.status) {
            filteredMovies = filteredMovies.filter(movie => movie.status.includes(filterOptions.status));
        }
        if (filterOptions.avaibility) {
            filteredMovies = filteredMovies.filter(movie => movie.avaibility.includes(filterOptions.avaibility));
        }
        if (filterOptions.award) {
            filteredMovies = filteredMovies.filter(movie => movie.award === filterOptions.award);
        }
    
        // Sort berdasarkan sortOption
        switch (sortOption) {
            case 'title-asc':
                filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'rating-asc':
                filteredMovies.sort((a, b) => a.rating - b.rating);
                break;
            case 'rating-desc':
                filteredMovies.sort((a, b) => b.rating - a.rating);
                break;
            case 'year-asc':
                filteredMovies.sort((a, b) => a.year - b.year);
                break;
            case 'year-desc':
                filteredMovies.sort((a, b) => b.year - a.year);
                break;
            default:
                break;
        }
    
        setMovies(filteredMovies);
    };

    useEffect(() => {
        handleSubmitFilterSort();
    }, [filterOptions, sortOption]);

    return (
        <div className="flex flex-col min-h-screen text-gray-300 bg-gray-900">
            <SidebarNavbar
                onCountryFilter={handleCountryFilter}
                currentFilter={countryFilter}
                onSearchSubmit={handleSearchSubmit}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange} />
            <div className="flex flex-col flex-1 p-4 md:flex-row sm:ml-64">
                <main className="flex-1 p-6 space-y-6 rounded-lg mt-14">
                    <Carousel />


                    <FilterSortOptions
                        onFilterChange={handleFilterChange}
                        onSortChange={handleSortChange}
                        onSubmit={handleSubmitFilterSort} />

                    {/* Menampilkan keyword pencarian setelah tombol Search diklik */}
                    {searchedTerm && (
                        <section className="flex justify-center mb-4">
                            <p className="italic text-gray-400">
                                Searched/Tagged with "{searchedTerm}"
                            </p>
                        </section>
                    )}

                    {/* Menampilkan konten default atau hasil pencarian */}
                    {searchedTerm && searchResults.length > 0 ? (
                        searchResults.map((item, index) => (
                            <section className="grid max-w-4xl grid-cols-1 gap-4 p-6 mx-auto" key={index}>
                                <SearchCard
                                    title={item.title}
                                    year={item.year}
                                    genres={item.genres}
                                    rating={item.rating}
                                    views={item.views}
                                    imageUrl={item.coverImage}
                                    status={item.status}
                                    onClick={() => handleDramaClick(item.id)} />
                            </section>
                        ))
                    ) : searchedTerm ? (
                        // Tampilan ketika tidak ada hasil pencarian
                        <div className="flex flex-col items-center justify-center mt-10">
                            <p className="text-lg font-medium text-gray-400">
                                No results found for <span className="text-orange-600">"{searchedTerm}"</span>
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Try searching with different keywords or check the spelling.
                            </p>
                        </div>
                    ) : (
                        // Tampilan default jika tidak ada pencarian
                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {movies.map((movie, index) => (
                                <Card
                                    key={index}
                                    title={movie.title}
                                    year={movie.year}
                                    genres={movie.genres}
                                    rating={movie.rating}
                                    views={movie.views}
                                    imageURL={movie.coverImage}
                                    status={movie.status}
                                    onClick={() => handleDramaClick(movie.id)} />
                            ))}
                        </section>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default temp;
