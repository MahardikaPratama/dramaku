const Country = require("../models/country");

exports.getAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows, rowCount } = await Country.getPaginatedCountries(
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
        const country = await Country.getById(req.params.id);
        res.json(country);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.searchByCountryName = async (req, res) => {
    try {
        const { keyword = '', page = 1, limit = 10 } = req.query;

        const { rows, rowCount } = await Country.searchByCountryName(keyword, page, limit);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }

        res.json({
            data: rows,
            totalEntries: rowCount,
        });
    } catch (error) {
        console.error("Error searching countries:", error.message);
        res.status(500).json({ message: "Error searching countries", error: error.message });
    }
};



exports.create = async (req, res) => {
    try {
        const flagUrl = req.file.path; 

        const country = await Country.create({
            country_id: req.body.country_id,  
            country_name: req.body.country_name,
            flag_url: flagUrl,
        });

        res.status(201).json(country);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const flagUrl = req.file.path;

        const country = await Country.update(req.params.id, {
            country_id: req.body.country_id, 
            country_name: req.body.country_name,
            flag_url: flagUrl,
        });

        res.json(country);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateName = async (req, res) => {
    try {
        const country_name = req.body.country_name || req.body.get('country_name'); 
        const country = await Country.updateName(req.params.id, { country_name });
        res.json(country);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.delete = async (req, res) => {
    try {
        await Country.delete(req.params.id);
        res.json({ message: "Country deleted successfully!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getTotalCountries = async (req, res) => {
    try {
        const totalCountries = await Country.getTotalCountries();
        res.json(totalCountries);
    } catch (error) {
        res.status(500).send(error.message);
    }
};