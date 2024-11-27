const Actor = require('../models/actor');

// Mendapatkan semua aktor
exports.getAll = async (req, res) => {
    try {
        const actors = await Actor.getAll();
        res.json(actors);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Mendapatkan aktor dengan pagination
exports.getPaginatedActors = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows, rowCount } = await Actor.getPaginatedActors(offset, limit);
        res.json({
            data: rows,
            totalEntries: rowCount,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getByMovie = async (req, res) => {
    try {
        const actors = await Actor.getByMovie(req.params.movie_id);
        if (!actors) {
            return res.status(404).json({ message: "Aktor tidak ditemukan untuk film ini" });
        }
        res.json(actors);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Mencari aktor berdasarkan nama
exports.searchByActorName = async (req, res) => {
    try {
        const { keyword = '', page = 1, limit = 10 } = req.query;

        const { rows, rowCount } = await Actor.searchByActorName(keyword, page, limit);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Tidak ada hasil yang ditemukan" });
        }

        res.json({
            data: rows,
            totalEntries: rowCount,
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// Mendapatkan aktor berdasarkan ID
exports.getById = async (req, res) => {
    try {
        const actor = await Actor.getById(req.params.id);

        if (!actor) {
            return res.status(404).json({ message: "Aktor tidak ditemukan" });
        }

        res.json(actor);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Membuat aktor baru
exports.create = async (req, res) => {
    try {
        // Periksa jika file tidak ada
        if (!req.file) {
            return res.status(400).json({ message: "File foto tidak dapat diunggah" });
        }

        const foto_url = req.file.path; // Akses path hanya jika file ada

        const actor = await Actor.create({
            actor_name: req.body.actor_name,
            birth_date: req.body.birth_date,
            foto_url: foto_url,
        });

        res.status(201).json(actor); // Mengembalikan data aktor baru dalam format JSON
    } catch (error) {
        res.status(500).json({ message: "Terjadi masalah saat membuat aktor baru", error: error.message });
    }
};

// Memperbarui aktor berdasarkan ID
exports.update = async (req, res) => {
    try {
        // Periksa jika file tidak ada
        if (!req.file) {
            return res.status(400).json({ message: "File foto tidak dapat diunggah" });
        }

        const foto_url = req.file.path; // Akses path hanya jika file ada

        const actor = await Actor.update(req.params.id, {
            actor_name: req.body.actor_name,
            birth_date: req.body.birth_date,
            foto_url: foto_url,
        });

        if (!actor) {
            return res.status(404).json({ message: "Aktor tidak ditemukan" });
        }

        res.json(actor); // Mengembalikan data aktor yang telah diperbarui
    } catch (error) {
        res.status(500).json({ message: "Terjadi masalah saat memperbarui aktor", error: error.message });
    }
};

// Memperbarui nama aktor berdasarkan ID
exports.updateName = async (req, res) => {
    try {
        const actor = await Actor.updateName(req.params.id, { actor_name: req.body.actor_name });

        if (!actor) {
            return res.status(404).json({ message: "Aktor tidak ditemukan" });
        }

        res.json(actor); // Mengembalikan data aktor yang telah diperbarui
    } catch (error) {
        res.status(500).json({ message: "Terjadi masalah saat memperbarui nama aktor", error: error.message });
    }
};


// Menghapus aktor berdasarkan ID
exports.delete = async (req, res) => {
    try {
        const actor = await Actor.delete(req.params.id);

        if (!actor) {
            return res.status(404).json({ message: "Aktor tidak ditemukan" });
        }

        res.status(200).json({ message: "Aktor berhasil dihapus" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Mendapatkan total aktor
exports.getTotalActors = async (req, res) => {
    try {
        const totalActors = await Actor.getTotalActors();
        res.json(totalActors);
    } catch (error) {
        res.status(500).send({ message: "Terjadi kesalahan saat mengambil total aktor", error: error.message });
    }
};
