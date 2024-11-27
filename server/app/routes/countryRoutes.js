const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const upload = require('../middleware/upload');

router.get('/count', countryController.getTotalCountries);
router.get('/search', countryController.searchByCountryName);
router.get('/', countryController.getAll); 
router.get('/:id', countryController.getById);
router.post('/', upload.single('flag'), countryController.create);
router.put('/:id', upload.single('flag'), countryController.update);
router.put('/:id/name', countryController.updateName);

router.delete('/:id', countryController.delete);

module.exports = router;

