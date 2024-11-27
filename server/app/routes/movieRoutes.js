const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Route untuk mendapatkan jumlah total film
router.get('/count', movieController.getTotals);

// Route untuk mendapatkan semua film di CMS
router.get('/cms', movieController.getAllMoviesCMS);

// Route untuk mendapatkan semua film di CMS User
router.get('/cms/user', movieController.getAllMoviesCMSUser);

// Route untuk mencari film dengan paginasi
router.get('/search', movieController.searchMovies);

// Route untuk mencari film berdasarkan judul
router.get('/searchByTitle', movieController.searchByTitle);

// Route untuk mencari film berdasarkan judul
router.get('/searchByTitle/user', movieController.searchByTitleUser);

// Route untuk filter dan sort film
router.get('/filter-sort', movieController.filterSortMovies);

// Route untuk filter film berdasarkan status
router.get('/filter-status', movieController.filterByStatus);

// Route untuk filter film berdasarkan status
router.get('/filter-status/user', movieController.filterByStatusUser);

// Route untuk mendapatkan film dengan genre yang sama
router.get('/same-genre/:movie_id', movieController.getMovieBySameGenre);

// Route untuk mendapatkan availability berdasarkan movie_id
router.get('/availability/:movie_id', movieController.getAvailabilityByMovieId);

// Route untuk mendapatkan genre film berdasarkan ID
router.get('/categorized-as/:movie_id', movieController.getCategorizedAsByMovieId);

// Route untuk mendapatkan penghargaan film berdasarkan ID
router.get('/awarded/:movie_id', movieController.getAwardedByMovieId);

// Route untuk mendapatkan aktor film berdasarkan ID
router.get('/acted-in/:movie_id', movieController.getActedInByMovieId);

// Route untuk mendapatkan wishlist pengguna berdasarkan user_id
router.get('/wishlist/:user_id', authenticateToken, movieController.getWishlist);

// Route untuk mendapatkan semua film dengan paginasi
router.get('/', movieController.getAllMovies);

// Route untuk mendapatkan detail film berdasarkan ID (route dinamis dipindahkan ke bawah)
router.get('/:id', movieController.getMovieById);

// Route untuk menambahkan film baru dengan poster
router.post('/', upload.single('poster_url'), movieController.createMovie);

// Route untuk menambahkan platform yang tersedia untuk film tertentu
router.post('/availability', movieController.createAvailability);

// Route untuk menambahkan genre untuk film tertentu
router.post('/categorized-as', movieController.createCategorizedAs);

// Route untuk menambahkan penghargaan yang diterima film tertentu
router.post('/awarded', movieController.createAwarded);

// Route untuk menambahkan aktor yang berperan dalam film tertentu
router.post('/acted-in', movieController.createActedIn);

// Route untuk menambahkan film ke wishlist pengguna
router.post('/wishlist', authenticateToken, movieController.addToWishlist);

// Route untuk mengupdate film berdasarkan ID
router.put('/:id', upload.single('poster_url'), movieController.updateMovie);

// Route untuk mengupdate approval_status film berdasarkan ID
router.put('/approval-status/:id', movieController.updateApprovalStatus);

// Route untuk menghapus film berdasarkan ID
router.delete('/:id', movieController.deleteMovie);

// Route untuk menghapus film dari wishlist pengguna
router.delete('/wishlist/:user_id/:movie_id', authenticateToken, movieController.removeFromWishlist);

module.exports = router;
