const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRole('ADMIN'), cmsController.getCMS);

module.exports = router;