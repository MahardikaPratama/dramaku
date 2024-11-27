import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaginationHome from '../components/PaginationHome';

describe('PaginationHome Component', () => {
    const defaultProps = {
        currentPage: 1,
        totalPages: 5,
        totalEntries: 50,
        entriesPerPage: 10,
        onPageChange: jest.fn(),
    };

    beforeEach(() => {
        defaultProps.onPageChange.mockClear(); // Reset mock before each test
    });

    test('Menampilkan PaginationHome dengan rentang entri yang benar', () => {
        render(<PaginationHome {...defaultProps} />);
    
        // Periksa konten elemen secara spesifik
        const container = screen.getByText((_, element) =>
            element.textContent === 'Showing 1 to 10 of 50 Entries'
        );
        expect(container).toBeInTheDocument();
    });
    

    test('Menampilkan rentang yang benar untuk halaman selain pertama', () => {
        render(<PaginationHome {...defaultProps} currentPage={2} />);
    
        const container = screen.getByText((_, element) =>
            element.textContent === 'Showing 11 to 20 of 50 Entries'
        );
        expect(container).toBeInTheDocument();
    });
    

    test('Menonaktifkan tombol "First" dan "Prev" pada halaman pertama', () => {
        render(<PaginationHome {...defaultProps} />);

        // Tombol "First" dan "Prev" harus dinonaktifkan
        expect(screen.getByText('First')).toBeDisabled();
        expect(screen.getByText('Prev')).toBeDisabled();
    });

    test('Mengaktifkan tombol "Next" dan "Last" pada halaman pertama', () => {
        render(<PaginationHome {...defaultProps} />);

        // Tombol "Next" dan "Last" harus aktif
        expect(screen.getByText('Next')).not.toBeDisabled();
        expect(screen.getByText('Last')).not.toBeDisabled();
    });

    test('Memanggil fungsi onPageChange ketika tombol "Next" diklik', () => {
        render(<PaginationHome {...defaultProps} />);

        // Klik tombol "Next"
        fireEvent.click(screen.getByText('Next'));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
    });

    test('Tidak memanggil fungsi onPageChange untuk halaman tidak valid', () => {
        render(<PaginationHome {...defaultProps} />);
    
        // Dapatkan tombol "Prev" dan pastikan tombolnya dinonaktifkan
        const prevButton = screen.getByText('Prev');
        expect(prevButton).toBeDisabled();
    
        // Klik tombol "Prev", yang seharusnya tidak memicu onPageChange
        fireEvent.click(prevButton);
    
        // Pastikan onPageChange tidak dipanggil
        expect(defaultProps.onPageChange).not.toHaveBeenCalled();
    });    

    test('Menonaktifkan tombol "Next" dan "Last" pada halaman terakhir', () => {
        render(<PaginationHome {...defaultProps} currentPage={5} />);

        // Tombol "Next" dan "Last" harus dinonaktifkan
        expect(screen.getByText('Next')).toBeDisabled();
        expect(screen.getByText('Last')).toBeDisabled();
    });

    test('Mengaktifkan tombol "First" dan "Prev" pada halaman terakhir', () => {
        render(<PaginationHome {...defaultProps} currentPage={5} />);

        // Tombol "First" dan "Prev" harus aktif
        expect(screen.getByText('First')).not.toBeDisabled();
        expect(screen.getByText('Prev')).not.toBeDisabled();
    });
});