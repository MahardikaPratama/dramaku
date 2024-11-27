import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../components/Card';

describe('Card Component', () => {
    const defaultProps = {
        title: 'Test Movie',
        year: 2021,
        genres: 'Action, Adventure',
        rating: 4.5,
        views: 1500,
        imageURL: 'https://via.placeholder.com/150',
        status: 'ONGOING',
        onClick: jest.fn(),
    };

    test('Menampilkan komponen Card dengan data yang benar', () => {
        render(<Card {...defaultProps} />);

        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        expect(screen.getByText('2021')).toBeInTheDocument();
        expect(screen.getByText('Action, Adventure')).toBeInTheDocument();
        expect(screen.getByText('Rating: 4.5/5.0')).toBeInTheDocument();
        expect(screen.getByText('1.5k views')).toBeInTheDocument();
        expect(screen.getByAltText('Poster of Test Movie')).toBeInTheDocument();
        expect(screen.getByText('ONGOING')).toBeInTheDocument();
    });

    test('Memformat jumlah views dengan benar', () => {
        const { rerender } = render(<Card {...defaultProps} views={1500} />);
        expect(screen.getByText('1.5k views')).toBeInTheDocument();

        rerender(<Card {...defaultProps} views={1500000} />);
        expect(screen.getByText('1.5M views')).toBeInTheDocument();

        rerender(<Card {...defaultProps} views={500} />);
        expect(screen.getByText('500 views')).toBeInTheDocument();
    });

    test('Menerapkan warna status yang sesuai', () => {
        const { rerender } = render(<Card {...defaultProps} status="ONGOING" />);
        expect(screen.getByText('ONGOING')).toHaveClass('bg-green-600');

        rerender(<Card {...defaultProps} status="COMPLETED" />);
        expect(screen.getByText('COMPLETED')).toHaveClass('bg-blue-600');

        rerender(<Card {...defaultProps} status="UPCOMING" />);
        expect(screen.getByText('UPCOMING')).toHaveClass('bg-red-600');

        rerender(<Card {...defaultProps} status="UNKNOWN" />);
        expect(screen.getByText('UNKNOWN')).toHaveClass('bg-gray-600');
    });

    test('Menghandle event onClick', () => {
        render(<Card {...defaultProps} />);
        fireEvent.click(screen.getByText('Test Movie'));
        expect(defaultProps.onClick).toHaveBeenCalled();
    });
});