import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryButton from '../components/CountryButton';

describe('Komponen CountryButton', () => {
    const defaultProps = {
        country: 'USA',
        flagUrl: 'https://via.placeholder.com/150',
        isSelected: false,
        onClick: jest.fn(),
    };

    test('Menampilkan komponen CountryButton dengan data yang benar', () => {
        render(<CountryButton {...defaultProps} />);

        expect(screen.getByText('USA')).toBeInTheDocument();
        expect(screen.getByAltText('USA Flag')).toBeInTheDocument();
    });

    test('Menerapkan background yang benar saat tidak dipilih', () => {
        render(<CountryButton {...defaultProps} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('hover:bg-gray-700');
        expect(button).not.toHaveClass('bg-gray-700');
    });

    test('Menerapkan background yang benar saat dipilih', () => {
        render(<CountryButton {...defaultProps} isSelected={true} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-gray-700');
        expect(button).not.toHaveClass('hover:bg-gray-700');
    });

    test('Memanggil onClick dengan nilai yang benar saat tombol diklik', () => {
        render(<CountryButton {...defaultProps} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(defaultProps.onClick).toHaveBeenCalledWith('USA');
    });
});