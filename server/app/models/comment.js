const pool = require('../config/db');

const Comment = {
    getAll: async () => {
        try {
            const res = await pool.query(
                `SELECT c.comment_id, c.comment_rata, c.detail_comment, c.approval_status, c.created_time, c.movie_id, c.user_id, u.username, m.title
                FROM comments c
                JOIN users u ON c.user_id = u.user_id
                JOIN movies m ON c.movie_id = m.movie_id
                ORDER BY c.updated_at DESC`
            );
            return res.rows;    
        } catch (error) {
            throw new Error('Failed to get all comments: ' + error.message);
        }
    },
    getById: async (id) => {
        try {
            const res = await pool.query(
                'SELECT c.comment_id, c.comment_rate, c.detail_comment, c.approval_status, c.created_time, c.movie_id, c.user_id, u.username, m.title FROM comments c JOIN users u ON c.user_id = u.user_id JOIN movies m ON c.movie_id = m.movie_id WHERE c.comment_id = $1 ORDER BY c.created_time DESC',
                [id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to get comment by id: ' + error.message);
        }
    },

    getPaginatedCommments: async (offset, limit) => {
        try {
            const res = await pool.query(
                'SELECT c.comment_id, c.comment_rate, c.detail_comment, c.approval_status, c.created_time, c.updated_at, c.movie_id, c.user_id, u.username, m.title FROM comments c JOIN users u ON c.user_id = u.user_id JOIN movies m ON c.movie_id = m.movie_id ORDER BY c.updated_at DESC LIMIT $1 OFFSET $2',
                [limit, offset]
            );
            const countRes = await pool.query('SELECT COUNT(*) FROM comments'); // Get total count
            return { rows: res.rows, rowCount: countRes.rows[0].count };
        } catch (error) {
            throw new Error('Failed to get paginated comments: ' + error.message);
        }
    },

    filterApprovalStatus: async (approval_status, offset, limit) => {
        console.log("Comment filterApprovalStatus approval_status: ", approval_status);
        try {
            const res = await pool.query(
                `SELECT c.comment_id, c.comment_rate, c.detail_comment, c.approval_status, c.created_time, c.updated_at, c.movie_id, c.user_id, u.username, m.title FROM comments c JOIN users u ON c.user_id = u.user_id JOIN movies m ON c.movie_id = m.movie_id WHERE c.approval_status = $1 ORDER BY c.updated_at DESC LIMIT $2 OFFSET $3`,
                [approval_status, limit, offset]
            );
            const countRes = await pool.query('SELECT COUNT(*) FROM comments WHERE approval_status = $1', [approval_status]); // Get total count
            return { rows: res.rows, rowCount: countRes.rows[0].count };
        } catch (error) {
            throw new Error('Failed to filter comments by approval status: ' + error.message);
        }
    },

    getByMovie: async (movie_id) => {
        try {
            const res = await pool.query(`
                SELECT c.comment_id, c.movie_id, c.user_id, c.detail_comment, c.created_time, c.updated_at, c.comment_rate, u.username, u.foto_profil_url
                FROM comments c
                JOIN users u ON c.user_id = u.user_id
                WHERE c.movie_id = $1
                AND c.approval_status = 'APPROVED'
                ORDER BY c.updated_at DESC
            `, [movie_id]);
    
            return res.rows;
        } catch (error) {
            throw new Error('Failed to get comments by movie: ' + error.message);
        }
    },   
    getApprovedOnly: async () => {
        try {
            const res = await pool.query(
                `SELECT c.comment_id, c.comment_rate, c.detail_comment, c.approval_status, c.created_time, c.updated_at, c.movie_id, c.user_id, u.username, m.title
                FROM comments c
                JOIN users u ON c.user_id = u.user_id
                JOIN movies m ON c.movie_id = m.movie_id
                WHERE c.approval_status = 'APPROVED'
                ORDER BY c.updated_at DESC`
            );
            return res.rows;    
        } catch (error) {
            throw new Error('Failed to get all comments: ' + error.message);
        }
    },
        
    create: async (data) => {
        const { comment_rate, detail_comment, user_id, movie_id } = data;
        try {
            const existingComment = await pool.query(
                'SELECT * FROM comments WHERE user_id = $1 AND movie_id = $2',
                [user_id, movie_id]
            );
            
            if (existingComment.rowCount > 0) {
                throw new Error('User has already commented on this movie. Please edit your existing comment.');
            }

            const approval_status = 'UNAPPROVED';
            const res = await pool.query(
                'INSERT INTO comments (comment_rate, detail_comment, approval_status, user_id, movie_id, created_time, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
                [comment_rate, detail_comment, approval_status, user_id, movie_id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to create comment: ' + error.message);
        }
    },


    updateByUserAndMovie: async (user_id, movie_id, data) => {
        const { comment_rate, detail_comment, approval_status } = data;
        try {
            const res = await pool.query(
                'UPDATE comments SET comment_rate = $1, detail_comment = $2, approval_status = $3 WHERE user_id = $4 AND movie_id = $5 RETURNING *',
                [comment_rate, detail_comment, approval_status, user_id, movie_id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to update comment: ' + error.message);
        }
    },

    update: async (id, data) => {
        const { comment_rate, detail_comment } = data;
        const approval_status = 'APPROVED';
        try {
            const res = await pool.query(
                'UPDATE comments SET comment_rate = $1, detail_comment = $2, approval_status = $3 WHERE comment_id = $4 RETURNING *',
                [comment_rate, detail_comment, approval_status, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to update comment: ' + error.message);
        }
    },

    updateApprovalStatus: async (id, approval_status) => {
        try {
            const res = await pool.query(
                'UPDATE comments SET approval_status = $1 WHERE comment_id = $2 RETURNING *',
                [approval_status, id]
            );
            return res.rows[0];
        } catch (error) {
            throw new Error('Failed to update approval status: ' + error.message);
        }
    },

    delete: async (id) => {
        try {
            const res = await pool.query('DELETE FROM comments WHERE comment_id = $1', [id]);
            return res.rowCount; // Mengembalikan jumlah baris yang dihapus
        } catch (error) {
            throw new Error('Failed to delete comment: ' + error.message);
        }
    },
    getTotalComments: async () => {
        try {
            const res = await pool.query('SELECT COUNT(*) FROM comments');
            return parseInt(res.rows[0].count, 10);
        } catch (error) {
            throw new Error('Failed to get total comments: ' + error.message);
        }
    }
};

module.exports = Comment;
