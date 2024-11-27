const pool = require('../config/db');

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
        const { username, email, password = null } = data;
        try {
            // Menambahkan pengguna ke dalam tabel `users`
            await pool.query(
                'INSERT INTO users (username, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
                [username, email, password, 'USER']
            );
    
            // Mengambil data pengguna yang baru saja dimasukkan
            const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return res.rows[0];
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

    updateProfile: async (user_id, data) => {
        console.log("user_id: ", user_id);
        console.log("data username: ", data.username);
        console.log("data foto_profil_url: ", data.foto_profil_url);
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
    }
    
};

module.exports = User;
