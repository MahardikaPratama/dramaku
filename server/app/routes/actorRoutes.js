const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const upload = require('../middleware/upload');


router.get('/count', actorController.getTotalActors);
router.get('/search', actorController.searchByActorName);
router.get('/', actorController.getAll);
router.get('/paginated', actorController.getPaginatedActors);
router.get('/:id', actorController.getById);
router.get('/movie/:movie_id', actorController.getByMovie);
router.post('/', upload.single('foto_url'), actorController.create);
router.put('/:id', upload.single('foto_url'), actorController.update);
router.put('/:id/name', actorController.updateName);
router.delete('/:id', actorController.delete);

module.exports = router;