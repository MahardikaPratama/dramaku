const pool = require("../config/db");
const { updateName } = require("./country");

const Actor = {
    getAll: async () => {
        try {
            const res = await pool.query(
                "SELECT * FROM actors ORDER BY updated_at DESC"
            );
            return res.rows;
        } catch (error) {
            throw new Error("Failed to get all actors: " + error.message);
        }
    },

    getById: async (id) => {
        try {
            const res = await pool.query(
                "SELECT * FROM actors WHERE actor_id = $1",
                [id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to get actor by id: " + error.message);
        }
    },

    getPaginatedActors: async (offset, limit) => {
        try {
            const res = await pool.query(
                "SELECT * FROM actors ORDER BY updated_at DESC LIMIT $1 OFFSET $2",
                [limit, offset]
            );
            const countRes = await pool.query("SELECT COUNT(*) FROM actors"); // Get total count
            return { rows: res.rows, rowCount: countRes.rows[0].count };
        } catch (error) {
            throw new Error("Failed to get paginated actors: " + error.message);
        }
    },

    searchByActorName: async (keyword, page = 1, limit = 10) => {
        try {
            const offset = (page - 1) * limit;

            // Tambahkan wildcard langsung di parameter query
            const res = await pool.query(
                "SELECT * FROM actors WHERE actor_name ILIKE '%' || $1 || '%' ORDER BY updated_at DESC LIMIT $2 OFFSET $3",
                [keyword, limit, offset]
            );

            const countRes = await pool.query(
                "SELECT COUNT(*) FROM actors WHERE actor_name ILIKE '%' || $1 || '%'",
                [keyword]
            );

            return {
                rows: res.rows,
                rowCount: parseInt(countRes.rows[0].count, 10),
            };
        } catch (error) {
            throw new Error(
                "Failed to search actors by actor name: " + error.message
            );
        }
    },

    getByMovie: async (movie_id) => {
        try {
            const res = await pool.query(
                "SELECT * FROM actors WHERE actor_id IN (SELECT actor_id FROM acted_in WHERE movie_id = $1)",
                [movie_id]
            );
            return res.rows;
        } catch (error) {
            throw new Error("Failed to get actors by movie: " + error.message);
        }
    },
    create: async (data) => {
        try {
            const res = await pool.query(
                "INSERT INTO actors (actor_name, birth_date, foto_url, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
                [data.actor_name, data.birth_date, data.foto_url]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to create actor: " + error.message);
        }
    },
    update: async (id, data) => {
        try {
            const res = await pool.query(
                "UPDATE actors SET actor_name = $1, birth_date = $2, foto_url = $3, updated_at = CURRENT_TIMESTAMP WHERE actor_id = $4 RETURNING *",
                [data.actor_name, data.birth_date, data.foto_url, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to update actor: " + error.message);
        }
    },
    updateName: async (id, data) => {
        try {
            const res = await pool.query(
                "UPDATE actors SET actor_name = $1, updated_at = CURRENT_TIMESTAMP WHERE actor_id = $2 RETURNING *",
                [data.actor_name, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to update actor name: " + error.message);
        }
    },

    delete: async (id) => {
        try {
            const actedInCheck = await pool.query(
                "SELECT * FROM acted_in WHERE actor_id = $1",
                [id]
            );

            if (actedInCheck.rowCount > 0) {
                throw new Error("Aktor masih terkait dengan movie");
            }

            const res = await pool.query(
                "DELETE FROM actors WHERE actor_id = $1 RETURNING *",
                [id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },
    getTotalActors: async () => {
        try {
            const res = await pool.query("SELECT COUNT(*) FROM actors");
            return parseInt(res.rows[0].count, 10);
        } catch (error) {
            throw new Error("Failed to get total actors: " + error.message);
        }
    },
};

module.exports = Actor;
