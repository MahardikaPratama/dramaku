const pool = require("../config/db");

const Country = {
    getAll: async () => {
        try {
            const res = await pool.query(
                "SELECT * FROM countries ORDER BY updated_at ASC NULLS LAST"
            );
            return res.rows;
        } catch (error) {
            throw new Error("Failed to get all countries: " + error.message);
        }
    },
    getById: async (id) => {
        try {
            const res = await pool.query(
                "SELECT * FROM countries WHERE country_id = $1",
                [id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to get country by id: " + error.message);
        }
    },

    getPaginatedCountries: async (offset, limit) => {
        try {
            const res = await pool.query(
                "SELECT * FROM countries ORDER BY updated_at DESC LIMIT $1 OFFSET $2",
                [limit, offset]
            );
            const countRes = await pool.query("SELECT COUNT(*) FROM countries"); // Get total count
            return { rows: res.rows, rowCount: countRes.rows[0].count };
        } catch (error) {
            throw new Error(
                "Failed to get paginated countries: " + error.message
            );
        }
    },

    searchByCountryName: async (keyword, page = 1, limit = 10) => {
        try {
            const offset = (page - 1) * limit;
            const res = await pool.query(
                "SELECT * FROM countries WHERE country_name ILIKE '%' || $1 || '%' ORDER BY updated_at DESC LIMIT $2 OFFSET $3",
                [keyword, limit, offset]
            );
    
            const countRes = await pool.query(
                "SELECT COUNT(*) FROM countries WHERE country_name ILIKE '%' || $1 || '%'",
                [keyword]
            );
    
            return { rows: res.rows, rowCount: parseInt(countRes.rows[0].count, 10) };
        } catch (error) {
            throw new Error("Failed to search countries by country name: " + error.message);
        }
    },    
    
    create: async (data) => {
        try {
            const res = await pool.query(
                "INSERT INTO countries (country_id, country_name, flag_url, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
                [data.country_id, data.country_name, data.flag_url]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to create country: " + error.message);
        }
    },
    
    update: async (id, data) => {
        try {
            const res = await pool.query(
                "UPDATE countries SET country_id = $1, country_name = $2, flag_url = $3, updated_at = CURRENT_TIMESTAMP WHERE country_id = $4 RETURNING *",
                [data.country_id, data.country_name, data.flag_url, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to update country: " + error.message);
        }
    },
    
    updateName: async (id, data) => {
        try {
            const res = await pool.query(
                "UPDATE countries SET country_name = $1, updated_at = CURRENT_TIMESTAMP WHERE country_id = $2 RETURNING *",
                [data.country_name, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error("Failed to update country: " + error.message);
        }
    },
    
    delete: async (id) => {
        console.log("Deleting country with ID: ", id);
        try {
            // Memeriksa referensi di tabel movies
            const movieCheckRes = await pool.query(
                "SELECT * FROM movies WHERE country_id = $1",
                [id]
            );
    
            if (movieCheckRes.rowCount > 0) {
                throw new Error(
                    "Negara ini masih memiliki daftar movie yang terkait. Silakan hapus movie terlebih dahulu sebelum menghapus negara ini."
                );
            }
    
            // Memeriksa referensi di tabel awards
            const awardCheckRes = await pool.query(
                "SELECT * FROM awards WHERE country_id = $1",
                [id]
            );
    
            if (awardCheckRes.rowCount > 0) {
                throw new Error(
                    "Negara ini masih memiliki daftar award yang terkait. \n\nSilakan hapus award terlebih dahulu sebelum menghapus negara ini."
                );
            }
            
            // Menghapus negara
            const deleteRes = await pool.query(
                "DELETE FROM countries WHERE country_id = $1",
                [id]
            );
    
            console.log(`Deleted ${deleteRes.rowCount} country(s) with ID: ${id}`);
            return deleteRes.rowCount;
        } catch (error) {
            console.error("Error deleting country: ", error);
            throw new Error(error.message);
        }
    },
    

    getTotalCountries: async () => {
        try {
            const res = await pool.query('SELECT COUNT(*) FROM countries');
            return parseInt(res.rows[0].count, 10);
        } catch (error) {
            throw new Error('Failed to get total countries: ' + error.message);
        }
    }
};

module.exports = Country;
