const User = require('../models/user');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Konfigurasi transporter email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Mendapatkan semua user
exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { users, totalEntries } = await User.getAll(page, limit);
        res.json({
            users,
            totalEntries
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// Mendapatkan user berdasarkan ID
exports.getById = async (req, res) => {
    try {
        const user = await User.getById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// Mendapatkan user berdasarkan email
exports.getByEmail = async (req, res) => {
    try {
        const user = await User.getByEmail(req.params.email);
        console.log(user); 
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Mencari user berdasarkan username
exports.searchUserByUsername = async (req, res) => {
    try {
        const { username = '', page = 1, limit = 10 } = req.query;
        const { users, totalEntries } = await User.searchUserByUsername(username, page, limit);
        if (users.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }

        res.json({
            users,
            totalEntries
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Membuat user baru
exports.create = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

// Mengupdate user
exports.update = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.update(req.params.id, { username, email, password: hashedPassword });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        
        const foto_profil_url = req.file ? req.file.path : null;
        const updatedUser = await User.updateProfile(req.params.id, { 
            username: req.body.username, 
            foto_profil_url: foto_profil_url
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


// Mengupdate role user
exports.updateRole = async (req, res) => {
    try {
        const updatedUser = await User.updateRole(req.params.id, req.body.role);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating user role", error });
    }
};

// Mengupdate status suspend user
exports.updateStatusSuspend = async (req, res) => {
    try {
        const updatedUser = await User.updateStatusSuspend(req.params.id, req.body.is_suspended);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating user status", error });
    }
};

// Menghapus user
exports.deleteUsers = async (req, res) => {
    try {
        const result = await User.deleteUsers(req.params.id);
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

// Register user with token that expires in 3 minutes
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        // Send verification email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is: ${newUser.verification_token}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Registration successful, check your email for verification code.' });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Registration failed', error });
    }
};

// Verify email with timezone-aware token expiration
exports.verifyEmail = async (req, res) => {
    const { email, verification_token } = req.body;
    try {
        const user = await User.getByEmail(email);
        if (!user || user.verification_token !== verification_token) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const currentTime = new Date();
        const expirationTime = new Date(user.verification_token_expiration);

        if (expirationTime.getTime() < currentTime.getTime()) {
            return res.status(400).json({ message: 'Token expired, please request a new one.' });
        }

        await User.updateVerify(user.user_id, { is_verified: true, verification_token: null, verification_token_expiration: null });
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: 'Verification failed', error });
    }
};

// Resend verification token with timezone-aware token expiration
exports.handleResendVerification = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.getByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: "User already verified" });
        }

        const newToken = await User.updateVerificationToken(user.user_id);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Resend Email Verification',
            text: `Your new verification code is: ${newToken}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Verification code resent, please check your email.' });
    } catch (error) {
        console.error("Error resending verification code:", error);
        res.status(500).json({ message: 'Error resending verification code', error });
    }
};


// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.getByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.is_suspended) {
            return res.status(403).json({ message: "User is suspended" });
        }
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' } // Token kadaluarsa setelah 1 hari
            );
            console.log(token);

            // Simpan token di HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,  // Tidak dapat diakses dari JavaScript
                secure: process.env.NODE_ENV === "production",
                sameSite: 'None', // Mencegah serangan CSRF
                maxAge: 86400000, // Token berlaku selama 1 jam
            });

            return res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// Logout user
exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        expires: new Date(0), // Kadaluarsa langsung
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

exports.getProfile = async (req, res) => {
    try {
        // Mendapatkan token dari cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        // Memverifikasi token JWT secara asinkron menggunakan promisify
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Mendapatkan user berdasarkan ID yang terdekode dari token
        const user = await User.getById(decoded.user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Mengirimkan data user sebagai profil
        return res.status(200).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            foto_profil_url: user.foto_profil_url,
        });

    } catch (error) {
        // Cek apakah error disebabkan oleh token yang tidak valid
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }

        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Error fetching profile", error });
    }
};

exports.getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await Award.getTotalUsers();
        res.json(totalUsers);
    } catch (error) {
        res.status(500).send(error.message);
    }
};