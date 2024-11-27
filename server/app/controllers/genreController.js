const Genre = require('../models/genre');

exports.getAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows, rowCount } = await Genre.getPaginatedGenres(
            offset,
            limit
        );
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
        const genre = await Genre.getById(req.params.id);
        res.json(genre);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.searchByGenreName = async (req, res) => {
    try {
        const { keyword = '', page = 1, limit = 10 } = req.query;

        const { rows, rowCount } = await Genre.searchByGenreName(keyword, page, limit);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }

        res.json({
            data: rows,
            totalEntries: rowCount,
        });
    } catch (error) {
        res.status(500).json({ message: "Error searching genre", error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const genre = await Genre.create({
            genre_name: req.body.genre_name
        });

        res.status(201).json(genre);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const genre = await Genre.update(req.params.id, req.body);
        res.json(genre);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateName = async (req, res) => {
    try {
        const genre_name = req.body.genre_name || req.body.get('genre_name'); 
        const genre = await Genre.updateName(req.params.id, { genre_name });
        res.json(genre);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.delete = async (req, res) => {
    try {
        await Genre.delete(req.params.id);
        res.json({ message: "Genre deleted successfully!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getTotalGenres = async (req, res) => {
    try {
        const totalGenres = await Genre.getTotalGenres();
        res.json(totalGenres);
    } catch (error) {
        res.status(500).send(error.message);
    }
};