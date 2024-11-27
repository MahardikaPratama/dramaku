import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import FilterSortOptions from "../components/FilterSortOptions";
import '@testing-library/jest-dom';

import genreDataService from "../services/genre.service";
import awardDataService from "../services/award.service";
import platformDataService from "../services/platform.service";

jest.mock("../services/genre.service");
jest.mock("../services/award.service");
jest.mock("../services/platform.service");

// Mock react-icons/fa
jest.mock('react-icons/fa', () => ({
    FaChevronDown: () => <span>FaChevronDown</span>,
}));

const queryClient = new QueryClient();

const renderWithQueryClient = (ui) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe("Komponen FilterSortOptions", () => {
    const defaultProps = {
        onFilterChange: jest.fn(),
        onSortChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Menampilkan komponen FilterSortOptions', async () => {
        genreDataService.getAll.mockResolvedValue({ data: [{ genre_name: 'Action' }] });
        awardDataService.getAll.mockResolvedValue({ data: [{ award_name: 'Oscar' }] });
        platformDataService.getAll.mockResolvedValue({ data: [{ platform_name: 'Netflix' }] });

        renderWithQueryClient(<FilterSortOptions {...defaultProps} />);

        expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
        await screen.findByText('Filtered by:');
        expect(screen.getByText('Filtered by:')).toBeInTheDocument();
        expect(screen.getByText('Sorted by:')).toBeInTheDocument();
    });

    test('Menampilkan dan menyembunyikan filter saat tombol filter diklik', async () => {
        genreDataService.getAll.mockResolvedValue({ data: [{ genre_name: 'Action' }] });
        awardDataService.getAll.mockResolvedValue({ data: [{ award_name: 'Oscar' }] });
        platformDataService.getAll.mockResolvedValue({ data: [{ platform_name: 'Netflix' }] });

        renderWithQueryClient(<FilterSortOptions {...defaultProps} />);

        await screen.findByText('Filtered by:');

        const filterButton = screen.getByRole('button', { name: /filter/i });
        fireEvent.click(filterButton);

        expect(screen.getByText('Filtered by:')).not.toHaveClass('hidden');
    });

    test('Menghapus filter saat tombol clear filter diklik', async () => {
        genreDataService.getAll.mockResolvedValue({ data: [{ genre_name: 'Action' }] });
        awardDataService.getAll.mockResolvedValue({ data: [{ award_name: 'Oscar' }] });
        platformDataService.getAll.mockResolvedValue({ data: [{ platform_name: 'Netflix' }] });

        renderWithQueryClient(<FilterSortOptions {...defaultProps} />);

        await screen.findByText('Filtered by:');

        const clearFilterButton = screen.getByRole('button', { name: /clear filter/i });
        fireEvent.click(clearFilterButton);

        expect(defaultProps.onFilterChange).toHaveBeenCalledTimes(5);
        expect(defaultProps.onSortChange).toHaveBeenCalledTimes(1);
    });
});