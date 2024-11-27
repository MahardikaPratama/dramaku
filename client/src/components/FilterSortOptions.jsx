import React, { useState } from "react";
import { useQuery } from "react-query";
import DropdownSearch from "./DropdownSearch";
import genreDataService from "../services/genre.service";
import awardDataService from "../services/award.service";
import platformDataService from "../services/platform.service";

const FilterSortOptions = ({ onFilterChange, onSortChange }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // Fetch genres using React Query
    const {
        data: genres = [],
        isLoading: genresLoading,
        isError: genresError,
    } = useQuery("genres", async () => {
        const response = await genreDataService.getAll();
        return response.data;
    });

    // Fetch awards using React Query
    const {
        data: awards = [],
        isLoading: awardsLoading,
        isError: awardsError,
    } = useQuery("awards", async () => {
        const response = await awardDataService.getAll();
        return response.data;
    });

    // Fetch platforms using React Query
    const {
        data: platforms = [],
        isLoading: platformsLoading,
        isError: platformsError,
    } = useQuery("platforms", async () => {
        const response = await platformDataService.getAll();
        return response.data;
    });

    const handleFilterButtonClick = () => {
        setIsFilterVisible((prev) => !prev);
    };

    const handleClearFilterButtonClick = () => {
        onFilterChange({ target: { name: "year", value: "" } });
        onFilterChange({ target: { name: "genre_name", value: "" } });
        onFilterChange({ target: { name: "release_status", value: "" } });
        onFilterChange({ target: { name: "platform_name", value: "" } });
        onFilterChange({ target: { name: "award", value: "" } });
        onSortChange({ target: { name: "sort", value: "" } });
    };

    const filterOptions = {
        sort: [
            { value: "title-asc", label: "A-Z" },
            { value: "title-desc", label: "Z-A" },
            { value: "rating-asc", label: "Rating ↑" },
            { value: "rating-desc", label: "Rating ↓" },
            { value: "year-asc", label: "Year ↑" },
            { value: "year-desc", label: "Year ↓" },
        ],
    };

    // Check loading state and errors
    if (genresLoading || awardsLoading || platformsLoading)
        return <p>Loading data...</p>;
    if (genresError || awardsError || platformsError)
        return <p>Error loading data</p>;

    return (
        <div className="w-full p-4">
            {/* Filter and Sort Buttons */}
            <button
                id="filter-button"
                className={`p-2 text-gray-400 md:hidden focus:outline-none ${isFilterVisible ? "hidden" : ""}`}
                onClick={handleFilterButtonClick}
            >
                <i className="text-2xl fas fa-filter"></i>
            </button>

            <button
                id="clear-filter-button"
                className={`relative p-2 text-gray-400 focus:outline-none ${isFilterVisible ? "" : "hidden"}`}
                onClick={handleClearFilterButtonClick}
                aria-label="Clear filters"
            >
                <i className="text-2xl fas fa-filter"></i>
                <i
                    className="absolute top-0 right-0 text-xs text-gray-500 fas fa-times"
                    style={{ transform: "rotate(45deg)" }}
                ></i>
            </button>

            {/* Filter and Sort Options */}
            <div className={`flex-col mb-4 space-y-4 filter-content md:flex lg:space-y-0 lg:flex-row lg:space-x-4 ${isFilterVisible ? "" : "hidden"}`}>
                {/* Filter Options */}
                <div className="flex flex-col w-full space-y-2 lg:flex-row lg:items-center lg:space-x-2 lg:w-auto">
                    <span className="w-full text-gray-300 lg:w-auto">Filtered by:</span>
                    <div className="grid w-full grid-cols-2 gap-2 lg:flex lg:space-x-2">
                        {/* Dropdown Year */}
                        <DropdownSearch
                            label="Year"
                            options={[...Array(25).keys()].map((i) => 2000 + i)}
                            onChange={onFilterChange}
                            name="year"
                            className="w-full lg:w-auto"
                        />
                        {/* Dropdown Genre */}
                        <DropdownSearch
                            label="Genre"
                            options={genres?.data?.map((genre) => genre.genre_name)}
                            onChange={onFilterChange}
                            name="genre_name"
                            className="w-full lg:w-auto"
                        />
                        {/* Dropdown Status */}
                        <DropdownSearch
                            label="Status"
                            options={["ONGOING", "COMPLETED", "UPCOMING"]}
                            onChange={onFilterChange}
                            name="release_status"
                            className="w-full lg:w-auto"
                        />
                        {/* Dropdown Availability */}
                        <DropdownSearch
                            label="Availability"
                            options={platforms.map((platform) => platform.platform_name)}
                            onChange={onFilterChange}
                            name="platform_name"
                            className="w-full lg:w-auto"
                        />
                        {/* Dropdown Award */}
                        <DropdownSearch
                            label="Award"
                            options={awards.map((award) => award.award_name)}
                            onChange={onFilterChange}
                            name="award"
                            className="w-full lg:w-auto"
                        />
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex flex-col w-full space-y-2 lg:flex-row lg:items-center lg:space-x-2 lg:w-auto">
                    <span className="text-gray-300">Sorted by:</span>
                    <DropdownSearch
                        label="Sort"
                        options={filterOptions.sort.map((option) => option.label)}
                        onChange={onSortChange}
                        name="sort"
                        className="w-full lg:w-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterSortOptions;
