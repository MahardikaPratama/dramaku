const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Define routes
router.get('/count', commentController.getTotalComments);
router.get('/approved', commentController.getApprovedOnly);
router.get('/', commentController.getAll);
router.get('/paginated', commentController.getPaginatedCommments);
router.get('/approval', commentController.filterApprovalStatus);
router.get('/:id', commentController.getById);
router.get('/movie/:movie_id', commentController.getByMovie);
router.post('/', authenticateToken, commentController.create);
router.put('/:id', commentController.update);
router.put('/user/:user_id/movie/:movie_id', commentController.updateByUserAndMovie);
router.patch('/:id/approval', commentController.updateApprovalStatus); // Use PATCH for partial updates like status
router.delete('/:id', commentController.delete);

module.exports = router;
