import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropdownSearch from '../components/DropdownSearch';

describe('Komponen DropdownSearch', () => {
    const defaultProps = {
        label: 'Pilih Opsi',
        options: ['Opsi 1', 'Opsi 2', 'Opsi 3'],
        onChange: jest.fn(),
        name: 'dropdown',
    };

    test('Menampilkan komponen DropdownSearch dengan label default', () => {
        render(<DropdownSearch {...defaultProps} />);

        expect(screen.getByText('Pilih Opsi')).toBeInTheDocument();
    });

    test('Membuka dropdown saat tombol diklik', () => {
        render(<DropdownSearch {...defaultProps} />);

        const button = screen.getByText('Pilih Opsi');
        fireEvent.click(button);

        expect(screen.getByPlaceholderText('Search Pilih Opsi')).toBeInTheDocument();
        expect(screen.getByText('Opsi 1')).toBeInTheDocument();
        expect(screen.getByText('Opsi 2')).toBeInTheDocument();
        expect(screen.getByText('Opsi 3')).toBeInTheDocument();
    });

    test('Memfilter opsi berdasarkan kata pencarian', () => {
        render(<DropdownSearch {...defaultProps} />);

        const button = screen.getByText('Pilih Opsi');
        fireEvent.click(button);

        const searchInput = screen.getByPlaceholderText('Search Pilih Opsi');
        fireEvent.change(searchInput, { target: { value: 'Opsi 2' } });

        expect(screen.queryByText('Opsi 1')).not.toBeInTheDocument();
        expect(screen.getByText('Opsi 2')).toBeInTheDocument();
        expect(screen.queryByText('Opsi 3')).not.toBeInTheDocument();
    });

    test('Memanggil onChange dengan nilai yang benar saat opsi dipilih', () => {
        render(<DropdownSearch {...defaultProps} />);

        const button = screen.getByText('Pilih Opsi');
        fireEvent.click(button);

        const option = screen.getByText('Opsi 2');
        fireEvent.click(option);

        expect(defaultProps.onChange).toHaveBeenCalledWith({ target: { name: 'dropdown', value: 'Opsi 2' } });
    });

    test('Menutup dropdown saat mengklik di luar', () => {
        render(<DropdownSearch {...defaultProps} />);

        const button = screen.getByText('Pilih Opsi');
        fireEvent.click(button);

        expect(screen.getByPlaceholderText('Search Pilih Opsi')).toBeInTheDocument();

        fireEvent.mouseDown(document);

        expect(screen.queryByPlaceholderText('Search Pilih Opsi')).not.toBeInTheDocument();
    });
});