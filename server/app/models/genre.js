const pool = require("../config/db");

const Genre = {
    getAll: async () => {
        const res = await pool.query(
            "SELECT * FROM genres ORDER BY updated_at ASC NULLS LAST"
        );
        return res.rows;
    },

    getById: async (id) => {
        const res = await pool.query(
            "SELECT * FROM genres WHERE genre_id = $1",
            [id]
        );
        return res.rows[0];
    },

    getPaginatedGenres: async (offset, limit) => {
        try {
            const res = await pool.query(
                "SELECT * FROM genres ORDER BY updated_at DESC LIMIT $1 OFFSET $2",
                [limit, offset]
            );
            const countRes = await pool.query("SELECT COUNT(*) FROM genres"); // Get total count
            return { rows: res.rows, rowCount: countRes.rows[0].count };
        } catch (error) {
            throw new Error("Failed to get paginated genres: " + error.message);
        }
    },

    searchByGenreName: async (keyword, page = 1, limit = 10) => {
        try {
            const offset = (page - 1) * limit;

            // Query to search by genre_name or genre_id (case-insensitive with ILIKE)
            const res = await pool.query(
                `SELECT * FROM genres 
                 WHERE genre_name ILIKE '%' || $1 || '%'
                 ORDER BY updated_at DESC 
                 LIMIT $2 OFFSET $3`,
                [keyword, limit, offset]
            );
            // Count query for pagination
            const countRes = await pool.query(
                `SELECT COUNT(*) FROM genres 
                 WHERE genre_name ILIKE '%' || $1 || '%' `,
                [keyword]
            );

            return {
                rows: res.rows,
                rowCount: parseInt(countRes.rows[0].count, 10),
            };
        } catch (error) {
            throw new Error(
                "Failed to search genres by genre name or ID: " + error.message
            );
        }
    },

    create: async (data) => {
        try {
            const res = await pool.query(
                "INSERT INTO genres (genre_name, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
                [data.genre_name]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to create genre: " + error.message);
        }
    },

    update: async (id, data) => {
        try {
            const res = await pool.query(
                "UPDATE genres SET genre_name = $1, updated_at = CURRENT_TIMESTAMP WHERE genre_id = $2 RETURNING *",
                [data.genre_name, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to update genre: " + error.message);
        }
    },

    updateName: async (id, data) => {
        try {
            const res = await pool.query(
                "UPDATE genres SET genre_name = $1, updated_at = CURRENT_TIMESTAMP WHERE genre_id = $2 RETURNING *",
                [data.genre_name, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to update genre: " + error.message);
        }
    },

    delete: async (id) => {
        try {
            const categorizedAsCheck = await pool.query(
                "SELECT * FROM categorized_as WHERE genre_id = $1",
                [id]
            );

            if (categorizedAsCheck.rowCount > 0) {
                throw new Error("Genre masih terkait dengan movie.");
            }

            const res = await pool.query(
                "DELETE FROM genres WHERE genre_id = $1",
                [id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getTotalGenres: async () => {
        try {
            const res = await pool.query("SELECT COUNT(*) FROM genres");
            return parseInt(res.rows[0].count, 10);
        } catch (error) {
            throw new Error("Failed to get total genres: " + error.message);
        }
    },
};

module.exports = Genre;
