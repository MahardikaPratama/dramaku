const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

router.get('/count', genreController.getTotalGenres);
router.get('/search', genreController.searchByGenreName);
router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);
router.post('/', genreController.create);
router.put('/:id', genreController.update);
router.put('/:id/name', genreController.updateName);


router.delete('/:id', genreController.delete);

module.exports = router;