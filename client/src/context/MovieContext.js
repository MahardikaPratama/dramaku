// src/context/MovieContext.js
import React, { createContext, useContext, useState } from 'react';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedTerm, setSearchedTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);
    const [filterOptions, setFilterOptions] = useState({
        year: '',
        genre_name: '',
        release_status: '',
        platform_name: '',
        award: '',
        country_name: ''
    });
    const [sortOption, setSortOption] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    return (
        <MovieContext.Provider value={{
            searchTerm,
            setSearchTerm,
            searchedTerm,
            setSearchedTerm,
            currentPage,
            setCurrentPage,
            entriesPerPage,
            filterOptions,
            setFilterOptions,
            sortOption,
            setSortOption,
            countryFilter,
            setCountryFilter,
            searchResults,
            setSearchResults
        }}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => {
    return useContext(MovieContext);
};
