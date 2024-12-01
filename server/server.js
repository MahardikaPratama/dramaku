const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./passport");
const jwt = require("jsonwebtoken");
const movieRoutes = require("./app/routes/movieRoutes");
const actorRoutes = require("./app/routes/actorRoutes");
const userRoutes = require("./app/routes/userRoutes");
const awardRoutes = require("./app/routes/awardRoutes");
const commentRoutes = require("./app/routes/commentRoutes");
const countryRoutes = require("./app/routes/countryRoutes");
const genreRoutes = require("./app/routes/genreRoutes");
const platformRoutes = require("./app/routes/platformRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: [
            "https://dramaku.vercel.app",
            "http://localhost:3000",
            "https://dramaku-web.vercel.app",
            "https://movie-dramaku.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === "production", // true hanya jika production
            maxAge: 1000 * 60 * 60 * 24, // 1 hari
        },
    })
);


// Passport initialization
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

// Google OAuth Routes
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Create JWT access token
        const token = jwt.sign(
            {
                user_id: req.user.user_id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Send token as a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            sameSite: "None",
        });

        // Redirect to frontend
        res.redirect("https://dramaku.vercel.app/");
    }
);

// CORS error handling (optional for debugging)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://dramaku.vercel.app");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Server listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
