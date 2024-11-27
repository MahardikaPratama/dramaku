const Comment = require('../models/comment');

exports.getAll = async (req, res) => {
    try {
        const comments = await Comment.getAll();
        res.json(comments);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getPaginatedCommments = async (req, res) => {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    try {
        const { rows, rowCount } = await Comment.getPaginatedCommments(offset, limit);
        res.json({
            data: rows,
            totalEntries: rowCount,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.getById = async (req, res) => {
    try {
        const comment = await Comment.getById(req.params.id);
        res.json(comment);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.getByMovie = async (req, res) => {
    try {
        const comments = await Comment.getByMovie(req.params.movie_id);
        res.json(comments);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.getApprovedOnly = async (req, res) => {
    try {
        const comments = await Comment.getApprovedOnly();
        res.json(comments);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.filterApprovalStatus = async (req, res) => {
    const { approval_status, page, limit } = req.query;
    const offset = (page - 1) * limit;
    try {
        const { rows, rowCount } = await Comment.filterApprovalStatus(approval_status, offset, limit);
        res.json({
            data: rows,
            totalEntries: rowCount,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.create = async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        res.status(201).json(comment);
    } catch (error) {
        if (error.message.includes('already commented')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).send(error.message);
        }
    }
};

exports.updateByUserAndMovie = async (req, res) => {
    const { user_id, movie_id } = req.body;
    try {
        
        const comment = await Comment.updateByUserAndMovie(user_id, movie_id, req.body);
        res.json(comment);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const comment = await Comment.update(req.params.id, req.body);
        res.json(comment);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateApprovalStatus = async (req, res) => {
    try {
        const comment = await Comment.updateApprovalStatus(req.params.id, req.body.approval_status);
        res.json(comment);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Comment.delete(req.params.id);
        res.status(204).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getTotalComments = async (req, res) => {
    try {
        const totalComments = await Comment.getTotalComments(); // Corrected to use Comment
        res.json(totalComments);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
