// authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware untuk memverifikasi token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.sendStatus(401); // Jika token tidak ada, unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Jika verifikasi gagal, forbidden
        req.user = user; // Simpan data user di request
        next();
    });
};

// Middleware untuk otorisasi role tertentu
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
        }
        next();
    };
};

// Export middleware
module.exports = { authenticateToken, authorizeRole };
