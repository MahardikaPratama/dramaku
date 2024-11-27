const pool = require('../config/db');

const Award = {
    getAll: async () => {
        const res = await pool.query('SELECT * FROM awards ORDER BY updated_at DESC');
        return res.rows;
    },

    getById: async (id) => {
        const res = await pool.query('SELECT * FROM awards WHERE award_id = $1', [id]);
        return res.rows[0];
    },

    getPaginatedAwards: async (offset, limit) => {
        try {
            const res = await pool.query(
                "SELECT * FROM awards ORDER BY updated_at DESC LIMIT $1 OFFSET $2",
                [limit, offset]
            );
            const countRes = await pool.query("SELECT COUNT(*) FROM awards");
            return { rows: res.rows, rowCount: parseInt(countRes.rows[0].count, 10) };
        } catch (error) {
            throw new Error("Failed to get paginated awards: " + error.message);
        }
    },
    
    searchByAwardName: async (keyword, page = 1, limit = 10) => {
        try {
            const offset = (page - 1) * limit;
            const res = await pool.query(
                "SELECT * FROM awards WHERE award_name ILIKE '%' || $1 || '%' ORDER BY updated_at DESC LIMIT $2 OFFSET $3",
                [keyword, limit, offset]
            );
            const countRes = await pool.query(
                "SELECT COUNT(*) FROM awards WHERE award_name ILIKE '%' || $1 || '%'",
                [keyword]
            );
            return { rows: res.rows, rowCount: parseInt(countRes.rows[0].count, 10) };
        } catch (error) {
            throw new Error("Failed to search awards by award name: " + error.message);
        }
    },

    create: async (data) => {
        try {
            console.log("Data award: ", data);
            const res = await pool.query(
                "INSERT INTO awards (award_name, year, country_id, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
                [data.award_name, data.year, data.country_id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to create award: " + error.message);
        }
    },
    
    update: async (id, data) => {
        try {
            const res = await pool.query(
                "UPDATE awards SET award_name = $1, year = $2, country_id = $3, updated_at = CURRENT_TIMESTAMP WHERE award_id = $4 RETURNING *",
                [data.award_name, data.year, data.country_id, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to update award: " + error.message);
        }
    },
    
    updateName: async (id, newName) => {
        try {
            console.log("Data nama award yang diupdate: ", newName.award_name);
            const res = await pool.query(
                "UPDATE awards SET award_name = $1, updated_at = CURRENT_TIMESTAMP WHERE award_id = $2 RETURNING *",
                [newName.award_name, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to update award name: " + error.message);
        }
    },
    

    delete: async (id) => {
        try {
            const awardedCheckRes = await pool.query(
                "SELECT * FROM awarded WHERE award_id = $1",
                [id]
            );

            if (awardedCheckRes.rowCount > 0) {
                throw new Error("Award ini masih memiliki daftar movie yang terkait. \n\nSilakan hapus movie terlebih dahulu sebelum menghapus award ini.");
            }

            const res = await pool.query(
                "DELETE FROM awards WHERE award_id = $1 RETURNING *",
                [id]
            );

            
            return { message: "Award deleted successfully!" };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getTotalAwards: async () => {
        try {
            const res = await pool.query('SELECT COUNT(*) FROM awards');
            return parseInt(res.rows[0].count, 10);
        } catch (error) {
            throw new Error('Failed to get total awards: ' + error.message);
        }
    }
};

module.exports = Award;
