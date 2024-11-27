const pool = require('../config/db');

const Movie = {
    // Get All Movies with Pagination
    getAllMovies: async (page, limit) => {
        try {
            const offset = (page - 1) * limit;

            // Hitung total jumlah film
            const totalMovies = await pool.query(`SELECT COUNT(*) FROM movies`);
            const totalCount = parseInt(totalMovies.rows[0].count, 10);

            // Ambil data film dengan rata-rata rating
            const res = await pool.query(
                `SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres, 
                    COALESCE(STRING_AGG(DISTINCT a.actor_name, ', '), 'No Actor') AS actors,
                    m.synopsis, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status,
                    m.approval_status, 
                    m.updated_at
                FROM movies m 
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id 
                LEFT JOIN genres g ON mg.genre_id = g.genre_id 
                LEFT JOIN acted_in ai ON m.movie_id = ai.movie_id 
                LEFT JOIN actors a ON ai.actor_id = a.actor_id
                WHERE m.approval_status = 'APPROVED' 
                GROUP BY m.movie_id, m.title, m.year, m.synopsis, m.movie_rate, m.views, m.poster_url, m.release_status 
                ORDER BY m.updated_at DESC 
                LIMIT $1 OFFSET $2`, 
                [limit, offset]
            );

            return {
                movies: res.rows,  // Data film
                totalCount: totalCount // Jumlah total data
            };
        } catch (error) {
            throw new Error('Failed to get all movies: ' + error.message);
        }
    },

    getAllMoviesCMS: async (page, limit) => {
        try {
            const offset = (page - 1) * limit;

            // Hitung total jumlah film
            const totalMovies = await pool.query(`SELECT COUNT(*) FROM movies`);
            const totalCount = parseInt(totalMovies.rows[0].count, 10);

            // Ambil data film dengan rata-rata rating
            const res = await pool.query(
                `SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres, 
                    COALESCE(STRING_AGG(DISTINCT a.actor_name, ', '), 'No Actor') AS actors,
                    m.synopsis, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status,
                    m.approval_status, 
                    m.updated_at
                FROM movies m 
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id 
                LEFT JOIN genres g ON mg.genre_id = g.genre_id 
                LEFT JOIN acted_in ai ON m.movie_id = ai.movie_id 
                LEFT JOIN actors a ON ai.actor_id = a.actor_id 
                GROUP BY m.movie_id, m.title, m.year, m.synopsis, m.movie_rate, m.views, m.poster_url, m.release_status 
                ORDER BY m.updated_at DESC 
                LIMIT $1 OFFSET $2`, 
                [limit, offset]
            );

            return {
                movies: res.rows,  // Data film
                totalCount: totalCount // Jumlah total data
            };
        } catch (error) {
            throw new Error('Failed to get all movies: ' + error.message);
        }
    },

    getAllMoviesCMSUser: async (user_id, page, limit) => {
        try {
            console.log("user_id", user_id);
            const offset = (page - 1) * limit;
            const queryParams = [user_id, limit, offset];

            const totalMovies = await pool.query(
                `SELECT COUNT(*) FROM movies WHERE user_id = $1`, 
                [user_id]
            );
            const totalCount = parseInt(totalMovies.rows[0].count, 10);
    
            const res = await pool.query(
                `SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres, 
                    COALESCE(STRING_AGG(DISTINCT a.actor_name, ', '), 'No Actor') AS actors,
                    m.synopsis, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status,
                    m.approval_status, 
                    m.updated_at
                FROM movies m 
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id 
                LEFT JOIN genres g ON mg.genre_id = g.genre_id 
                LEFT JOIN acted_in ai ON m.movie_id = ai.movie_id 
                LEFT JOIN actors a ON ai.actor_id = a.actor_id 
                WHERE m.user_id = $1
                GROUP BY m.movie_id, m.title, m.year, m.synopsis, m.movie_rate, m.views, m.poster_url, m.release_status 
                ORDER BY m.updated_at DESC 
                LIMIT $2 OFFSET $3`, 
                queryParams
            );
    
            return {
                movies: res.rows,
                totalCount: totalCount
            };
        } catch (error) {
            throw new Error('Failed to get all movies: ' + error.message);
        }
    },
    

    // Search Movies with Pagination
    searchMovies: async (keyword, page, limit) => {
        try {
            const offset = (page - 1) * limit;
            const res = await pool.query(
                `SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres, 
                    COALESCE(STRING_AGG(DISTINCT a.actor_name, ', '), 'No Actor') AS actors,
                    m.synopsis, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status,
                    m.approval_status,
                    m.updated_at, 
                COUNT(*) OVER() AS total_count  -- Menghitung total data
                FROM movies m
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
                LEFT JOIN acted_in ai ON m.movie_id = ai.movie_id
                LEFT JOIN actors a ON ai.actor_id = a.actor_id
                WHERE 
                    (m.title ILIKE $1 OR 
                    m.alternative_title ILIKE $1 OR 
                    a.actor_name ILIKE $1) 
                AND 
                    m.approval_status = 'APPROVED'
                GROUP BY m.movie_id, m.title, m.year, m.movie_rate, m.views, m.poster_url, m.release_status
                ORDER BY m.updated_at DESC 
                LIMIT $2 OFFSET $3`,
                [`%${keyword}%`, limit, offset]
            );
            return {
                movies: res.rows,  // Data hasil pencarian
                totalCount: res.rows.length > 0 ? res.rows[0].total_count : 0  // Jumlah total data
            };
        } catch (error) {
            throw new Error('Failed to search movies: ' + error.message);
        }
    },
        

    // Model method to filter and sort movies with pagination
    filterSortMovies: async (filters, sort_by, page, limit) => {
        try {
            // Inisialisasi query dasar
            let query = `
                SELECT
                    m.movie_id,
                    m.title,
                    m.year,
                    COALESCE(STRING_AGG(g.genre_name, ', '), 'No Genre') AS genres,
                    m.movie_rate,
                    m.views,
                    m.poster_url,
                    m.release_status,
                    m.approval_status,
                    m.updated_at,
                    COUNT(*) OVER() AS total_count  -- Menghitung total data
                FROM movies m
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
            `;

            // Inisialisasi array untuk menyimpan kondisi WHERE dan parameter
            let conditions = [];
            let queryParams = [];

            // Tambahkan kondisi berdasarkan filter yang diterima
            if (filters.year) {
                queryParams.push(filters.year);
                conditions.push(`m.year = $${queryParams.length}`);
            }

            if (filters.genre_name) {
                queryParams.push(filters.genre_name);
                conditions.push(`g.genre_name = $${queryParams.length}`);
            }

            if (filters.release_status) {
                queryParams.push(filters.release_status);
                conditions.push(`m.release_status = $${queryParams.length}`);
            }

            if (filters.platform_name) {
                queryParams.push(filters.platform_name);
                conditions.push(`EXISTS (
                    SELECT 1 
                    FROM available_on mp 
                    JOIN platforms p ON mp.platform_id = p.platform_id 
                    WHERE mp.movie_id = m.movie_id 
                    AND p.platform_name = $${queryParams.length}
                )`);
            }

            if (filters.award) {
                queryParams.push(filters.award);
                conditions.push(`EXISTS (
                    SELECT 1 
                    FROM awarded ma 
                    JOIN awards a ON ma.award_id = a.award_id 
                    WHERE ma.movie_id = m.movie_id 
                    AND a.award_name = $${queryParams.length}
                )`);
            }

            if (filters.country_name) {
                queryParams.push(filters.country_name);
                conditions.push(`m.country_id = (SELECT country_id FROM countries WHERE country_name = $${queryParams.length})`);
            }            

            conditions.push(`m.approval_status = 'APPROVED'`);

            // Gabungkan kondisi WHERE jika ada
            if (conditions.length > 0) {
                query += ` WHERE ` + conditions.join(' AND ');
            }

            // Grupkan berdasarkan movie_id untuk menghindari duplikasi
            query += ` GROUP BY 
                m.movie_id, m.title, m.year, m.movie_rate, m.views,
                m.poster_url, m.release_status
            `;

            // Tambahkan sorting jika ada
            if (sort_by) {
                switch (sort_by) {
                    case 'A-Z':
                        query += ` ORDER BY m.title ASC`;
                        break;
                    case 'Z-A':
                        query += ` ORDER BY m.title DESC`;
                        break;
                    case 'Rating ↑':
                        query += ` ORDER BY m.movie_rate ASC`;
                        break;
                    case 'Rating ↓':
                        query += ` ORDER BY m.movie_rate DESC`;
                        break;
                    case 'Year ↑':
                        query += ` ORDER BY m.year ASC`;
                        break;
                    case 'Year ↓':
                        query += ` ORDER BY m.year DESC`;
                        break;
                    default:
                        query += ` ORDER BY m.updated_at DESC`;
                }
            }

            // Tambahkan LIMIT dan OFFSET
            const offset = (page - 1) * limit;
            queryParams.push(limit, offset);
            query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

            // Eksekusi query
            const res = await pool.query(query, queryParams);

            return {
                movies: res.rows,  // Data film
                totalCount: res.rows.length > 0 ? res.rows[0].total_count : 0  // Jumlah total data
            };

        } catch (error) {
            throw new Error('Failed to filter and sort movies: ' + error.message);
        }
    },

    filterByStatus: async (approval_status, page, limit) => {
        console.log("Approval status:", approval_status);
        try {
            const offset = (page - 1) * limit;
            
            // Buat array query parameters dengan urutan yang sesuai
            const queryParams = [approval_status, limit, offset];
    
            const res = await pool.query(
                `SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres, 
                    COALESCE(STRING_AGG(DISTINCT a.actor_name, ', '), 'No Actor') AS actors, 
                    m.synopsis, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status,
                    m.approval_status, 
                    m.updated_at,
                    COUNT(*) OVER() AS total_count
                FROM movies m
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
                LEFT JOIN acted_in ai ON m.movie_id = ai.movie_id
                LEFT JOIN actors a ON ai.actor_id = a.actor_id
                WHERE m.approval_status = $1
                GROUP BY 
                    m.movie_id, m.title, m.year, m.synopsis, m.movie_rate, m.views, 
                    m.poster_url, m.release_status, m.updated_at, m.approval_status
                ORDER BY m.updated_at DESC
                LIMIT $2 OFFSET $3`,
                queryParams
            );

            console.log("Movies:", res.rows);
    
            return {
                movies: res.rows,
                totalCount: res.rows.length > 0 ? parseInt(res.rows[0].total_count) : 0
            };
        } catch (error) {
            throw new Error('Failed to filter movies by status: ' + error.message);
        }
    },

    filterByStatusUser: async (user_id, approval_status, page, limit) => {
        console.log("Approval status:", approval_status);
        try {
            const offset = (page - 1) * limit;
            const queryParams = [user_id, approval_status, limit, offset];
    
            const res = await pool.query(
                `SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres, 
                    COALESCE(STRING_AGG(DISTINCT a.actor_name, ', '), 'No Actor') AS actors, 
                    m.synopsis, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status,
                    m.approval_status, 
                    m.updated_at,
                    COUNT(*) OVER() AS total_count
                FROM movies m
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
                LEFT JOIN acted_in ai ON m.movie_id = ai.movie_id
                LEFT JOIN actors a ON ai.actor_id = a.actor_id
                WHERE m.user_id = $1 AND m.approval_status = $2
                GROUP BY 
                    m.movie_id, m.title, m.year, m.synopsis, m.movie_rate, m.views, 
                    m.poster_url, m.release_status, m.updated_at, m.approval_status
                ORDER BY m.updated_at DESC
                LIMIT $3 OFFSET $4`,
                queryParams
            );
    
            console.log("Movies:", res.rows);
    
            return {
                movies: res.rows,
                totalCount: res.rows.length > 0 ? parseInt(res.rows[0].total_count) : 0
            };
        } catch (error) {
            throw new Error('Failed to filter movies by status: ' + error.message);
        }
    },
    
    
    
    searchByTitle: async (title, page, limit) => {
        try {
            const offset = (page - 1) * limit;
            const res = await pool.query(
                `SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres, 
                    COALESCE(STRING_AGG(DISTINCT a.actor_name, ', '), 'No Actor') AS actors, 
                    m.synopsis, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status,
                    m.approval_status, 
                    m.updated_at,
                    COUNT(*) OVER() AS total_count
                FROM movies m
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
                LEFT JOIN acted_in ai ON m.movie_id = ai.movie_id
                LEFT JOIN actors a ON ai.actor_id = a.actor_id
                WHERE m.title ILIKE $1
                GROUP BY 
                    m.movie_id, m.title, m.year, m.synopsis, m.movie_rate, m.views, 
                    m.poster_url, m.release_status, m.updated_at
                ORDER BY m.updated_at DESC
                LIMIT $2 OFFSET $3`,
                [`%${title}%`, limit, offset] 
            );
    
    
            return {
                movies: res.rows,
                totalCount: res.rows.length > 0 ? res.rows[0].total_count : 0
            };
        } catch (error) {
            throw new Error('Failed to search movies by title: ' + error.message);
        }
    },    
    
    searchByTitleUser: async (user_id, title, page, limit) => {
        try {
            const offset = (page - 1) * limit;
            const queryParams = [user_id, `%${title}%`, limit, offset];
    
            const res = await pool.query(
                `SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres, 
                    COALESCE(STRING_AGG(DISTINCT a.actor_name, ', '), 'No Actor') AS actors, 
                    m.synopsis, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status,
                    m.approval_status, 
                    m.updated_at,
                    COUNT(*) OVER() AS total_count
                FROM movies m
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
                LEFT JOIN acted_in ai ON m.movie_id = ai.movie_id
                LEFT JOIN actors a ON ai.actor_id = a.actor_id
                WHERE m.user_id = $1 AND m.title ILIKE $2
                GROUP BY 
                    m.movie_id, m.title, m.year, m.synopsis, m.movie_rate, m.views, 
                    m.poster_url, m.release_status, m.updated_at
                ORDER BY m.updated_at DESC
                LIMIT $3 OFFSET $4`,
                queryParams
            );
    
            return {
                movies: res.rows,
                totalCount: res.rows.length > 0 ? res.rows[0].total_count : 0
            };
        } catch (error) {
            throw new Error('Failed to search movies by title: ' + error.message);
        }
    },
    
    
    getMovieById: async (id) => {
        try {
            const res = await pool.query(`
                SELECT m.movie_id, m.title, m.year, m.synopsis, m.alternative_title, m.link_trailer, m.country_id, m.approval_status, 
                COALESCE(STRING_AGG(DISTINCT g.genre_name, ', '), 'No Genre') AS genres,
                COALESCE(STRING_AGG(DISTINCT p.platform_name, ', '), 'No Platform') AS platforms, 
                m.movie_rate, 
                m.views, m.poster_url, m.release_status
                FROM movies m 
                LEFT JOIN categorized_as mg ON m.movie_id = mg.movie_id 
                LEFT JOIN genres g ON mg.genre_id = g.genre_id
                LEFT JOIN available_on ap ON m.movie_id = ap.movie_id
                LEFT JOIN platforms p ON ap.platform_id = p.platform_id
                LEFT JOIN comments c ON m.movie_id = c.movie_id -- Bergabung dengan tabel comments
                WHERE m.movie_id = $1
                GROUP BY m.movie_id, m.title, m.year, m.synopsis, m.alternative_title, m.link_trailer, m.country_id, m.approval_status, 
                         m.views, m.poster_url, m.release_status
            `, [id]);
    
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to get movie by id: ' + error.message);
        }
    },
    

    getMovieBySameGenre: async (movie_id) => {
        try {
            const res = await pool.query(`
                SELECT DISTINCT m.movie_id, m.title, m.year, m.movie_rate, m.views, m.poster_url, m.release_status
                FROM movies m
                JOIN categorized_as mg ON m.movie_id = mg.movie_id
                JOIN genres g ON mg.genre_id = g.genre_id
                WHERE g.genre_id IN (
                    SELECT g2.genre_id
                    FROM categorized_as mg2
                    JOIN genres g2 ON mg2.genre_id = g2.genre_id
                    WHERE mg2.movie_id = $1
                )
                AND m.movie_id != $1
                ORDER BY m.title ASC
            `, [movie_id]);
    
            return res.rows;
        } catch (error) {
            throw new Error('Failed to get movies by same genre: ' + error.message);
        }
    },    
    
    createMovie: async (data) => {
        try {
            // Ambil role pengguna berdasarkan user_id
            const roleRes = await pool.query(
                'SELECT role FROM users WHERE user_id = $1',
                [data.user_id]
            );
    
            // Tentukan approval_status berdasarkan role
            const approval_status = roleRes.rows[0].role === 'ADMIN' ? 'APPROVED' : 'UNAPPROVED';
    
            const res = await pool.query(
                "INSERT INTO movies (poster_url, title, alternative_title, movie_rate, views, year, synopsis, release_status, approval_status, link_trailer, country_id, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
                [
                    data.poster_url,
                    data.title,
                    data.alternative_title,
                    parseFloat(data.movie_rate),
                    BigInt(data.views),
                    parseInt(data.year, 10),
                    data.synopsis,
                    data.release_status,
                    approval_status,  // Gunakan approval_status yang ditentukan
                    data.link_trailer,
                    data.country_id,
                    data.user_id
                ]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to create movie: ' + error.message);
        }
    },
    
    
    updateApprovalStatus: async (id) => {
        console.log("ID diterima di updateApprovalStatus:", id);
        try {
            const res = await pool.query(
                "UPDATE movies SET approval_status = 'APPROVED', updated_at = CURRENT_TIMESTAMP WHERE movie_id = $1 RETURNING *",
                [id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to update approval status: ' + error.message);
        }
    },
    
    update: async (id, data) => {
        try {
            const res = await pool.query(
                "UPDATE movies SET poster_url = $1, title = $2, alternative_title = $3, movie_rate = $4, views = $5, year = $6, synopsis = $7, release_status = $8, link_trailer = $9, country_id = $10, updated_at = CURRENT_TIMESTAMP WHERE movie_id = $11 RETURNING *",
                [
                    data.poster_url,
                    data.title,
                    data.alternative_title,
                    parseFloat(data.movie_rate),
                    BigInt(data.views),
                    parseInt(data.year, 10),
                    data.synopsis,
                    data.release_status,
                    data.link_trailer,
                    data.country_id,
                    id
                ]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to update movie: ' + error.message);
        }
    },
    

    createAvailability: async (data) => {
        try {
            const res = await pool.query(
                `INSERT INTO available_on (movie_id, platform_id) 
                 VALUES ($1, $2) 
                 ON CONFLICT (movie_id, platform_id) DO NOTHING`,
                [data.movie_id, data.platform_id]
            );
            return res.rowCount > 0 ? { success: true } : { success: false, message: 'Already exists' };
        } catch (error) {
            throw new Error("Failed to create available_on: " + error.message);
        }
    },
    


    getAvailabilityByMovieId: async (movie_id) => {
        try {
            const res = await pool.query(
                `SELECT
                    p.platform_id,
                    p.platform_name
                FROM available_on ap
                JOIN platforms p ON ap.platform_id = p.platform_id
                WHERE ap.movie_id = $1`,
                [movie_id]
            );
            return res.rows;
        } catch (error) {
            throw new Error('Failed to get availability by movie id: ' + error.message);
        }
    },

    createCategorizedAs: async (data) => {
        try {
            const res = await pool.query(
                `INSERT INTO categorized_as (movie_id, genre_id) 
                 VALUES ($1, $2) 
                 ON CONFLICT (movie_id, genre_id) DO NOTHING`,
                [data.movie_id, data.genre_id]
            );
    
            // Cek apakah rowCount lebih dari 0 untuk memastikan data baru berhasil ditambahkan
            return res.rowCount > 0 
                ? { success: true, message: 'Data inserted successfully' } 
                : { success: false, message: 'Data already exists' };
    
        } catch (error) {
            throw new Error("Failed to create categorized_as: " + error.message);
        }
    },
    


    getCategorizedAsByMovieId: async (movie_id) => {
        try {
            const res = await pool.query(
                `SELECT
                    g.genre_id,
                    g.genre_name
                FROM categorized_as mg
                JOIN genres g ON mg.genre_id = g.genre_id
                WHERE mg.movie_id = $1`,
                [movie_id]
            );
            return res.rows;
        } catch (error) {
            throw new Error('Failed to get categorized as by movie id: ' + error.message);
        }
    },

    createAwarded: async (data) => {
        try {
            const res = await pool.query(
                `INSERT INTO awarded (movie_id, award_id) 
                 VALUES ($1, $2) 
                 ON CONFLICT (movie_id, award_id) DO NOTHING`,
                [data.movie_id, data.award_id]
            );
    
            // Mengembalikan pesan sesuai apakah data baru ditambahkan atau sudah ada
            return res.rowCount > 0 
                ? { success: true, message: 'Data inserted successfully' } 
                : { success: false, message: 'Data already exists' };
    
        } catch (error) {
            throw new Error("Failed to create awarded: " + error.message);
        }
    },
    

    getAwardedByMovieId: async (movie_id) => {
        try {
            const res = await pool.query(
                `SELECT
                    a.award_id,
                    a.award_name
                FROM awarded ma
                JOIN awards a ON ma.award_id = a.award_id
                WHERE ma.movie_id = $1`,
                [movie_id]
            );
            return res.rows;
        } catch (error) {
            throw new Error('Failed to get awarded by movie id: ' + error.message);
        }
    },

    createActedIn: async (data) => {
        try {
            const res = await pool.query(
                `INSERT INTO acted_in (movie_id, actor_id) 
                 VALUES ($1, $2) 
                 ON CONFLICT (movie_id, actor_id) DO NOTHING`,
                [data.movie_id, data.actor_id]
            );
    
            // Mengembalikan pesan sesuai apakah data baru ditambahkan atau sudah ada
            return res.rowCount > 0 
                ? { success: true, message: 'Data inserted successfully' } 
                : { success: false, message: 'Data already exists' };
    
        } catch (error) {
            throw new Error("Failed to create acted_in: " + error.message);
        }
    },
    


    getActedInByMovieId: async (movie_id) => {
        try {
            const res = await pool.query(
                `SELECT
                    a.actor_id,
                    a.actor_name,
                    a.foto_url
                FROM acted_in ai
                JOIN actors a ON ai.actor_id = a.actor_id
                WHERE ai.movie_id = $1`,
                [movie_id]
            );
            return res.rows;
        } catch (error) {
            throw new Error('Failed to get acted in by movie id: ' + error.message);
        }
    },


    delete: async (id) => {
        const client = await pool.connect(); // Mengambil koneksi dari pool
        try {
            await client.query('BEGIN'); // Memulai transaksi
    
            // Menghapus data dari lima tabel
            await client.query('DELETE FROM available_on WHERE movie_id = $1', [id]);
            await client.query('DELETE FROM categorized_as WHERE movie_id = $1', [id]);
            await client.query('DELETE FROM awarded WHERE movie_id = $1', [id]);
            await client.query('DELETE FROM acted_in WHERE movie_id = $1', [id]);
            const res = await client.query('DELETE FROM movies WHERE movie_id = $1', [id]);
    
            await client.query('COMMIT'); // Menyelesaikan transaksi
            return res.rowCount; // Mengembalikan jumlah baris yang terhapus
        } catch (error) {
            await client.query('ROLLBACK'); // Mengembalikan transaksi jika terjadi kesalahan
            throw new Error('Failed to delete movie: ' + error.message);
        } finally {
            client.release(); // Melepaskan koneksi kembali ke pool
        }
    },    
    addToWishlist: async (user_id, movie_id) => {
        try {
            const res = await pool.query(
                'INSERT INTO wishlists (user_id, movie_id) VALUES ($1, $2) RETURNING *',
                [user_id, movie_id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to add movie to wishlist: ' + error.message);
        }
    },

    removeFromWishlist: async (user_id, movie_id) => {
        try {
            const res = await pool.query(
                'DELETE FROM wishlists WHERE user_id = $1 AND movie_id = $2 RETURNING *',
                [user_id, movie_id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to remove movie from wishlist: ' + error.message);
        }
    },

    getWishlist: async (user_id) => {
        if (!user_id) {
            throw new Error('User ID is required');
        }
    
        try {
            const query = `
                SELECT 
                    m.movie_id, 
                    m.title, 
                    m.year, 
                    m.movie_rate, 
                    m.views, 
                    m.poster_url, 
                    m.release_status
                FROM 
                    movies m
                JOIN 
                    wishlists w ON m.movie_id = w.movie_id
                WHERE 
                    w.user_id = $1
            `;
            
            const res = await pool.query(query, [user_id]);
            return res.rows;
        } catch (error) {
            // Log the error to console for debugging (optional)
            console.error('Database query error:', error);
            throw new Error('Failed to get wishlist: ' + error.message);
        }
    },

    getTotals: async () => {
        try {
            const res = await pool.query(`
                SELECT 
                    (SELECT COUNT(*) FROM movies) AS total_movies,
                    (SELECT COUNT(*) FROM countries) AS total_countries,
                    (SELECT COUNT(*) FROM awards) AS total_awards,
                    (SELECT COUNT(*) FROM genres) AS total_genres,
                    (SELECT COUNT(*) FROM actors) AS total_actors,
                    (SELECT COUNT(*) FROM comments) AS total_comments,
                    (SELECT COUNT(*) FROM users) AS total_users
            `);
            
            return {
                totalMovies: parseInt(res.rows[0].total_movies, 10),
                totalCountries: parseInt(res.rows[0].total_countries, 10),
                totalAwards: parseInt(res.rows[0].total_awards, 10),
                totalGenres: parseInt(res.rows[0].total_genres, 10),
                totalActors: parseInt(res.rows[0].total_actors, 10),
                totalComments: parseInt(res.rows[0].total_comments, 10),
                totalUsers: parseInt(res.rows[0].total_users, 10),
            };
        } catch (error) {
            throw new Error('Failed to get totals: ' + error.message);
        }
    }       

};

module.exports = Movie;
