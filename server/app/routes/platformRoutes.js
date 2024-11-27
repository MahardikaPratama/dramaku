const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platformController');

router.get('/', platformController.getAll);
router.get('/:id', platformController.getById);
router.post('/', platformController.create);
router.put('/:id', platformController.update);
router.delete('/:id', platformController.delete);

module.exports = router;