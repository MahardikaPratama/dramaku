const Award = require('../models/award');


exports.getAll = async (req, res) => {
    try {
        const awards = await Award.getAll();
        res.json(awards);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getPaginatedAwards = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows, rowCount } = await Award.getPaginatedAwards(
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
        const award = await Award.getById(req.params.id);
        res.json(award);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.searchByAwardName = async (req, res) => {
    try {
        const { keyword = '', page = 1, limit = 10 } = req.query;

        const { rows, rowCount } = await Award.searchByAwardName(keyword, page, limit);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }

        res.json({
            data: rows,
            totalEntries: rowCount,
        });
    } catch (error) {
        console.error("Error searching awards:", error.message);
        res.status(500).json({ message: "Error searching award", error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const award = await Award.create({
            award_name: req.body.award_name,
            year: req.body.year,           // Tambahkan properti year
            country_id: req.body.country_id // Tambahkan properti country_id
        });

        res.status(201).json(award); // Ubah `Award` menjadi `award`
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const award = await Award.update(req.params.id, {
            award_id: req.body.award_id, 
            award_name: req.body.award_name,
            year: req.body.year,          // Perbaikan: pastikan year berasal dari req.body.year
            country_id: req.body.country_id // Pastikan juga country_id disertakan jika diperlukan
        });

        res.json(award);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.updateName = async (req, res) => {
    try {
        const award_name = req.body.award_name || req.body.get('award_name'); 
        console.log("Nama award yang diupdate: ", award_name);
        const award = await Award.updateName(req.params.id, { award_name });
        res.json(award);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.delete = async (req, res) => {
    try {
        await Award.delete(req.params.id);
        res.json({ message: "Award deleted successfully!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getTotalAwards = async (req, res) => {
    try {
        const totalAwards = await Award.getTotalAwards();
        res.json(totalAwards);
    } catch (error) {
        res.status(500).send(error.message);
    }
};