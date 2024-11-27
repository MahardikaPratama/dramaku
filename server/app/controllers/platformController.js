const Platform = require('../models/platform');

exports.getAll = async (req, res) => {
    try {
        const platforms = await Platform.getAll();
        res.json(platforms);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getById = async (req, res) => {
    try {
        const platform = await Platform.getById(req.params.id);
        res.json(platform);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.create = async (req, res) => {
    try {
        const platform = await Platform.create(req.body);
        res.status(201).json(platform);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const platform = await Platform.update(req.params.id, req.body);
        res.json(platform);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Platform.delete(req.params.id);
        res.status(204).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};