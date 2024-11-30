const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/count', userController.getTotalUsers);
router.get('/profile', authenticateToken, userController.getProfile); // Mendapatkan profile user
router.get('/', userController.getAll); // Mendapatkan semua user
router.get('/search', userController.searchUserByUsername); // Mencari user berdasarkan username
router.get('/:id', userController.getById); // Mendapatkan user berdasarkan ID
router.get('/email/:email', userController.getByEmail); // Mendapatkan user berdasarkan email
router.post('/', userController.create); // Membuat user baru
router.put('/:id', userController.update); // Mengupdate user
router.put('/:id/profile', upload.single('foto_profil_url'), userController.updateProfile); // Mengupdate profile user
router.put('/:id/role', userController.updateRole); // Mengupdate role user
router.put('/:id/suspend', userController.updateStatusSuspend); // Mengupdate status suspend user
router.delete('/:id', userController.deleteUsers); // Menghapus user
router.post('/register', userController.register); // Register user
router.post('/login', userController.login); // Login user
router.post('/logout', userController.logout); // Logout user
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));




module.exports = router;
