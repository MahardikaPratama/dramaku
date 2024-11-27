const movieController = require('../controllers/movieController');
const Movie = require('../models/movie');

// Mock Movie model
jest.mock('../models/movie');

describe('Fitur Home', () => {
    let req, res;

    // Inisialisasi request dan response mock sebelum setiap pengujian
    beforeEach(() => {
        req = {
            params: {},
            query: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    // Pengujian untuk searchMovies
    describe('searchMovies', () => {
        it('harus mengembalikan daftar film berdasarkan kata kunci pencarian', async () => {
            const movies = [{ title: 'Danur', year: 2017 }];
            const totalCount = 100;
            const { keyword = '', page = 1, limit = 10 } = req.query;

            // Mocking fungsi searchMovies
            Movie.searchMovies.mockResolvedValue({ 
                movies, 
                totalCount
            });

            await movieController.searchMovies(req, res);

            expect(Movie.searchMovies).toHaveBeenCalledWith(keyword, parseInt(page, 10), parseInt(limit, 10));
            expect(res.json).toHaveBeenCalledWith({
                movies, 
                totalPages: Math.ceil(totalCount / limit), 
                currentPage: parseInt(page, 10), 
                totalCount 
            });
        });

        it('harus menangani error jika terjadi kesalahan saat pencarian film', async () => {
            const errorMessage = 'Error searching movies';
            req.query.keyword = 'Danur';
            req.query.page = 1;
            req.query.limit = 10;
            Movie.searchMovies.mockRejectedValue(new Error(errorMessage));

            await movieController.searchMovies(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(errorMessage);
        });

        it('harus menangani kasus pagination yang invalid atau tidak sesuai', async () => {
            const movies = [{ title: 'Danur', year: 2017 }];
            const totalCount = 100;

            req.query.page = 1;
            req.query.limit = 1000; // Menggunakan limit yang sangat besar

            Movie.searchMovies.mockResolvedValue({ 
                movies, 
                totalCount
            });

            await movieController.searchMovies(req, res);

            expect(res.json).toHaveBeenCalledWith({
                movies,
                totalPages: Math.ceil(totalCount / 1000), 
                currentPage: 1, 
                totalCount 
            });
        });
    });

    // Pengujian untuk filterSortMovies
    describe('filterSortMovies', () => {
        it('harus mengembalikan daftar film berdasarkan filter dan opsi pengurutan', async () => {
            const movies = [{ title: 'Danur', year: 2017 }];
            const totalCount = 100;

            // Mock query parameters untuk filter dan sorting
            req.query = {
                year: 2017,
                genre_name: 'Horror',
                sort_by: 'title',
                page: 1,
                limit: 10
            };

            // Mocking fungsi filterSortMovies
            Movie.filterSortMovies.mockResolvedValue({ 
                movies, 
                totalCount 
            });

            await movieController.filterSortMovies(req, res);

            expect(Movie.filterSortMovies).toHaveBeenCalledWith(
                {
                    year: 2017,
                    genre_name: 'Horror'
                },
                'title', // sort_by
                1, // page
                10 // limit
            );

            expect(res.json).toHaveBeenCalledWith({
                movies,
                totalPages: Math.ceil(totalCount / 10),
                currentPage: 1,
                totalCount
            });
        });

        it('harus menangani error jika terjadi kesalahan saat filter dan pengurutan film', async () => {
            const errorMessage = 'Error filtering and sorting movies';
            req.query = {
                sort_by: 'title',
                page: 1,
                limit: 10
            };

            Movie.filterSortMovies.mockRejectedValue(new Error(errorMessage));

            await movieController.filterSortMovies(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Failed to filter and sort movies: ' + errorMessage);
        });

        it('harus menangani kasus dimana tidak ada parameter filter yang diberikan', async () => {
            const movies = [{ title: 'Danur', year: 2017 }];
            const totalCount = 100;

            // Tidak ada filter yang diterima
            req.query = {
                sort_by: 'year',
                page: 1,
                limit: 10
            };

            Movie.filterSortMovies.mockResolvedValue({
                movies,
                totalCount
            });

            await movieController.filterSortMovies(req, res);

            expect(Movie.filterSortMovies).toHaveBeenCalledWith(
                {},
                'year', // sort_by
                1, // page
                10 // limit
            );

            expect(res.json).toHaveBeenCalledWith({
                movies,
                totalPages: Math.ceil(totalCount / 10),
                currentPage: 1,
                totalCount
            });
        });
    });
});
