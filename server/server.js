const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const session = require('express-session'); 
const passport = require("./passport");
const jwt = require('jsonwebtoken');
const movieRoutes = require("./app/routes/movieRoutes");
const actorRoutes = require("./app/routes/actorRoutes");
const userRoutes = require("./app/routes/userRoutes");
const awardRoutes = require("./app/routes/awardRoutes");
const commentRoutes = require("./app/routes/commentRoutes");
const countryRoutes = require("./app/routes/countryRoutes");
const genreRoutes = require("./app/routes/genreRoutes");
const platformRoutes = require("./app/routes/platformRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Ganti dengan URL frontend Anda
    credentials: true // Mengizinkan cookie
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Ganti dengan true jika menggunakan HTTPS
        maxAge: 1000 * 60 * 60 * 24 // Set cookie untuk bertahan 1 hari
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/genres", genreRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/actors", actorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/awards", awardRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/platforms", platformRoutes);

// Google Auth Routes
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Buat JWT access token
        const token = jwt.sign({
            user_id: req.user.user_id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Kirim token JWT ke client sebagai cookie atau header
        res.cookie('token', token, {
            httpOnly: true, // Agar cookie hanya dapat diakses oleh server
            secure: false,  // Set ini menjadi true jika menggunakan HTTPS
            maxAge: 1000 * 60 * 60 * 24 // 1 hari
        });
        res.redirect("http://localhost:3000");
    }
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ message: "Internal Server Error" });
});

// Server listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

