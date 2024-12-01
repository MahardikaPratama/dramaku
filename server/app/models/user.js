const pool = require('../config/db');
const crypto = require('crypto');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');

const User = {
    getAll: async (page, limit) => {
        try {
            const offset = (page - 1) * limit;
    
            const totalUsers = await pool.query('SELECT COUNT(*) FROM users WHERE user_id != $1', [1000]);
            const total = parseInt(totalUsers.rows[0].count, 10);
            const res = await pool.query('SELECT * FROM users WHERE user_id != $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3', [1000, limit, offset]);
            return { users: res.rows, totalEntries: total };
        } catch (error) {
            throw new Error('Failed to get all users: ' + error.message);
        }
    },

    getById: async (id) => {
        const res = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        return res.rows[0];
    },

    getByEmail: async (email) => {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0];
    },

    getByUsername: async (username) => {
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return res.rows[0];
    },

    searchUserByUsername: async (username, page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        const res = await pool.query(
            "SELECT * FROM users WHERE username ILIKE $1 AND user_id != $2 ORDER BY updated_at DESC LIMIT $3 OFFSET $4",
            [`%${username}%`, 100, limit, offset]
        );
        const countRes = await pool.query(
            'SELECT COUNT(*) FROM users WHERE username ILIKE $1 AND user_id != $2',
            [`%${username}%`, 'USR1']
        );
        return { users: res.rows, totalEntries: parseInt(countRes.rows[0].count, 10) };
    },

    create: async (data) => {
        const { username, email, password = null, role = 'USER', foto_profil_url = '' } = data;
        const verificationToken = crypto.randomInt(1000, 9999).toString();
        const isVerified = false;
        const verificationTokenExpiration = moment().tz('Asia/Jakarta').add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        const currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        try {
            // Insert data langsung ke tabel `users`
            await pool.query(
                `INSERT INTO users (username, email, password, role, foto_profil_url, is_verified, created_at, updated_at, verification_token, verification_token_expiration) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                    username, email, password || null, role, foto_profil_url || null, 
                    isVerified, currentTime, currentTime, verificationToken, verificationTokenExpiration
                ]
            );            
            // Mengambil data pengguna yang baru saja dimasukkan
            const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return { ...res.rows[0], verification_token: verificationToken };
        } catch (error) {
            throw new Error('Failed to create user: ' + error.message);
        }
    },
    
    

    update: async (user_id, data) => {
        const { username, email, password } = data;
        const res = await pool.query(
            'UPDATE users SET username = $1, email = $2, password = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $4 RETURNING *',
            [username, email, password, user_id]
        );
        return res.rows[0];
    },

    updateVerify: async (user_id, data) => {
        const fields = [];
        const values = [];
        let index = 1;

        for (const key in data) {
            fields.push(`${key} = $${index}`);
            values.push(data[key]);
            index++;
        }

        values.push(user_id);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${index} RETURNING *`;

        const res = await pool.query(query, values);
        return res.rows[0];
    },
    
    // Add a method to resend verification token
    updateVerificationToken: async (user_id) => {
        const newToken = crypto.randomInt(1000, 9999).toString();
        // const newExpiration = moment().tz('Asia/Jakarta').add(3, 'minutes').toISOString();
        const newExpiration = moment().tz('Asia/Jakarta').add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss'); // Set ke format WIB
  

        await pool.query(
            'UPDATE users SET verification_token = $1, verification_token_expiration = $2 WHERE user_id = $3',
            [newToken, newExpiration, user_id]
        );

        return newToken;
    },

    verifyToken: async (user_id, token) => {
        const res = await pool.query(
            'SELECT * FROM users WHERE user_id = $1 AND verification_token = $2',
            [user_id, token]
        );

        if (res.rows.length === 0) throw new Error("Invalid token");
        
        const user = res.rows[0];
        const currentTime = moment().tz('Asia/Jakarta');

        if (moment(user.verification_token_expiration).isBefore(currentTime)) {
            throw new Error("Token expired");
        }

        await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL, verification_token_expiration = NULL WHERE user_id = $1',
            [user_id]
        );
        return user;
    },

    updateProfile: async (user_id, data) => {
        const res = await pool.query(
            'UPDATE users SET username = $1, foto_profil_url = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING *',
            [data.username, data.foto_profil_url, user_id]
        );
        return res.rows[0];
    },
    
    updateRole: async (user_id, role) => {
        const res = await pool.query(
            'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
            [role, user_id]
        );
        return res.rows[0];
    },
    
    updateStatusSuspend: async (user_id, is_suspended) => {
        const res = await pool.query(
            'UPDATE users SET is_suspended = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
            [is_suspended, user_id]
        );
        return res.rows[0];
    },
        

    deleteUsers: async (id) => {
        const res = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
        return res.rowCount;
    },

    getTotalUsers: async () => {
        try {
            const res = await pool.query('SELECT COUNT(*) FROM users');
            return parseInt(res.rows[0].count, 10);
        } catch (error) {
            throw new Error('Failed to get total users: ' + error.message);
        }
    },

    updatePasswordResetToken: async (email) => {
        const resetToken = crypto.randomInt(1000, 9999).toString(); // Token 4-digit
        const resetTokenExpiration = moment().tz('Asia/Jakarta').add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        await pool.query(
            'UPDATE users SET reset_password_token = $1, reset_token_expiration = $2 WHERE email = $3',
            [resetToken, resetTokenExpiration, email]
        );

        return resetToken;
    },

    // Function to verify token
    verifyResetToken: async (email, token) => {
        const res = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND reset_password_token = $2',
            [email, token]
        );

        if (res.rows.length === 0) throw new Error("Invalid token");

        const user = res.rows[0];
        const currentTime = moment().tz('Asia/Jakarta');
        
        // Check if token is expired
        if (moment(user.reset_token_expiration).isBefore(currentTime)) {
            throw new Error("Token expired");
        }

        // Clear token after successful verification
        await pool.query(
            'UPDATE users SET reset_password_token = NULL, reset_token_expiration = NULL WHERE email = $1',
            [email]
        );

        return user; // Valid token
    },

    // Function to reset password
    resetPassword: async (email, newPassword) => {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Attempt to update the user's password and clear reset token fields
            const result = await pool.query(
                'UPDATE users SET password = $1, reset_password_token = NULL, reset_token_expiration = NULL WHERE email = $2',
                [hashedPassword, email]
            );

            return result.rowCount; // rowCount will indicate if rows were affected
        } catch (error) {
            throw new Error('Failed to reset password in the database.');
        }
    },

    // Method to update the verification/reset token
    updateVerificationResetToken: async (email) => {
        const newToken = crypto.randomInt(1000, 9999).toString();
        const newExpiration = moment().tz('Asia/Jakarta').add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        await pool.query(
            'UPDATE users SET reset_password_token = $1, reset_token_expiration = $2 WHERE email = $3',
            [newToken, newExpiration, email]
        );

        return newToken;
    }
    
};

module.exports = User;
