const express = require('express');
const router = express.Router();
const awardController = require('../controllers/awardController');

// Rute dengan pola khusus ditempatkan lebih awal
router.get('/count', awardController.getTotalAwards);
router.get('/search', awardController.searchByAwardName); // Rute spesifik untuk pencarian
router.get('/paginated', awardController.getPaginatedAwards); // Rute spesifik untuk paginasi
router.get('/', awardController.getAll); // Rute umum untuk semua data

// Rute dinamis ditempatkan di bagian bawah
router.get('/:id', awardController.getById); // Harus setelah rute spesifik
router.post('/', awardController.create);
router.put('/:id/name', awardController.updateName); // Rute spesifik untuk memperbarui nama
router.put('/:id', awardController.update);
router.delete('/:id', awardController.delete);

module.exports = router;
