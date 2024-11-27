const Movie = require('../models/movie');

// Get All Movies with Pagination
exports.getAllMovies = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;  // Pagination
        const { movies, totalCount } = await Movie.getAllMovies(page, limit);
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit),  // Menghitung total halaman
            currentPage: parseInt(page, 10),  // Halaman saat ini
            totalCount  // Jumlah total data
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAllMoviesCMS = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Validasi page dan limit
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return res.status(400).send('Parameter page atau limit tidak valid');
        }

        const { movies, totalCount } = await Movie.getAllMoviesCMS(parseInt(page, 10), parseInt(limit, 10));
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page, 10),
            totalCount
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Controller untuk mendapatkan semua film di CMS User
exports.getAllMoviesCMSUser = async (req, res) => {
    try {
        const { user_id, page = 1, limit = 10 } = req.query; // Pagination dan user_id
        if (!user_id) {
            return res.status(400).send('User ID diperlukan');
        }

        const { movies, totalCount } = await Movie.getAllMoviesCMSUser(user_id, page, limit);
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit), // Menghitung total halaman
            currentPage: parseInt(page, 10), // Halaman saat ini
            totalCount // Jumlah total data
        });
    } catch (error) {
        res.status(500).send('Gagal mendapatkan film untuk user: ' + error.message);
    }
};

// Search Movies with Pagination
exports.searchMovies = async (req, res) => {
    try {
        const { keyword = '', page = 1, limit = 10 } = req.query; 
        const { movies, totalCount } = await Movie.searchMovies(keyword, page, limit);
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit),  // Menghitung total halaman
            currentPage: parseInt(page, 10),  // Halaman saat ini
            totalCount  // Jumlah total data
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


// Filtering and Sorting Movies with Pagination
exports.filterSortMovies = async (req, res) => {
    try {
        // Ambil parameter dari request
        const { year, genre_name, release_status, platform_name, award, country_name, sort_by, page = 1, limit = 10 } = req.query;

        // Buat objek filter
        const filters = {
            year,
            genre_name,
            release_status,
            platform_name,
            award,
            country_name
        };

        // Panggil fungsi model dengan filter dan sorting
        const { movies, totalCount } = await Movie.filterSortMovies(filters, sort_by, page, limit);

        // Kirimkan hasilnya
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit),  // Menghitung total halaman
            currentPage: parseInt(page, 10),  // Halaman saat ini
            totalCount  // Jumlah total data
        });
    } catch (error) {
        res.status(500).send('Failed to filter and sort movies: ' + error.message);
    }
};


exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.getMovieById(req.params.id);
        res.json(movie);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getMovieBySameGenre = async (req, res) => {
    try {
        const { movie_id } = req.params;  

        if (!movie_id) {
            return res.status(400).send('Movie ID is required');
        }

        const movies = await Movie.getMovieBySameGenre(movie_id);

        res.json(movies);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createMovie = async (req, res) => {
    try {
        // Validasi input yang wajib ada
        if (!req.body.title) {
            return res.status(400).send('Judul film (title) wajib diisi.');
        }
        if (!req.body.year) {
            return res.status(400).send('Tahun (year) wajib diisi.');
        }

        // Validasi tipe data year (harus berupa angka)
        if (isNaN(req.body.year)) {
            return res.status(400).send('Tahun (year) harus berupa angka.');
        }

        // Validasi tipe data views (harus berupa angka)
        if (req.body.views && isNaN(req.body.views)) {
            return res.status(400).send('Tipe data tidak valid: views harus berupa angka.');
        }

        // Validasi tipe data movie_rate (harus berupa angka)
        if (req.body.movie_rate && isNaN(req.body.movie_rate)) {
            return res.status(400).send('movie_rate wajib diisi dan bertipe angka.');
        }

        // Validasi movie_rate agar berada dalam rentang 0-5 dan berupa angka (jika ada) 
        if (req.body.movie_rate && (req.body.movie_rate < 0 || req.body.movie_rate > 5)) {
            return res.status(400).send('movie_rate harus berada dalam rentang 0-5.');
        }

        // Validasi alternative_title (boleh kosong, tidak wajib)
        if (req.body.alternative_title && typeof req.body.alternative_title !== 'string') {
            return res.status(400).send('Alternative title harus berupa string.');
        }

        // Validasi tipe data release_status (harus ada dan salah satu dari "COMPLETED", "UPCOMING", atau "ONGOING")
        const validReleaseStatuses = ['COMPLETED', 'UPCOMING', 'ONGOING'];
        if (req.body.release_status && !validReleaseStatuses.includes(req.body.release_status)) {
            return res.status(400).send('release_status harus salah satu dari: "COMPLETED", "UPCOMING", atau "ONGOING".');
        }

        // Validasi tipe data approval_status (harus ada dan salah satu dari "approved", "pending", atau "rejected")
        const validApprovalStatuses = ['APPROVED', 'UNAPROVED'];
        if (req.body.approval_status && !validApprovalStatuses.includes(req.body.approval_status)) {
            return res.status(400).send('approval_status harus salah satu dari: "APPROVED" atau "UNAPROVED".');
        }

        // Validasi tipe data link_trailer (jika ada, harus berupa string URL yang valid) contoh https:
        if (req.body.link_trailer && !req.body.link_trailer.startsWith('https://')) {
            return res.status(400).send("link_trailer harus berupa URL yang valid.");
        }

        // Validasi tipe data country_id (harus berupa string) dan panjangnya harus 2 karakter
        if (req.body.country_id && (typeof req.body.country_id !== 'string' || req.body.country_id.length !== 2)) {
            return res.status(400).send('country_id harus berupa string dengan panjang 2 karakter.');
        }

        // Validasi tipe datauser_id (harus berupa angka)
        if (isNaN(req.body.user_id)) {
            return res.status(400).send('user_id harus berupa angka.');
        }

        // URL untuk poster film (dari file yang diunggah)
        const poster_url = req.file ? req.file.path : '';

        // Data movie yang diterima dari request
        const movie = await Movie.createMovie({
            poster_url: poster_url,
            title: req.body.title,
            alternative_title: req.body.alternative_title,
            movie_rate: req.body.movie_rate || 0.0, // Default jika tidak ada
            views: req.body.views || 0, // Default jika tidak ada
            year: req.body.year,
            synopsis: req.body.synopsis,
            release_status: req.body.release_status,
            approval_status: req.body.approval_status,
            link_trailer: req.body.link_trailer,
            country_id: req.body.country_id,
            user_id: req.body.user_id,
            updated_at: new Date()
        });

        res.status(201).json(movie);
    } catch (error) {
        res.status(500).send("Gagal membuat film: " + error.message);
    }
};



// Create Availability
exports.createAvailability = async (req, res) => {
    try {
        const { movie_id, platform_ids } = req.body;

        // Validasi input
        if (!movie_id || !Array.isArray(platform_ids) || platform_ids.length === 0) {
            return res.status(400).send("Input tidak valid: movie_id dan platform_ids diperlukan.");
        }

        // Loop melalui platform_ids dan buat promises
        const availabilityPromises = platform_ids.map(platform_id =>
            Movie.createAvailability({ movie_id, platform_id })
        );

        // Await semua promises
        const results = await Promise.all(availabilityPromises);

        res.status(201).json(results);
    } catch (error) {
        res.status(500).send("Gagal membuat availability: " + error.message);
    }
};

// Create CategorizedAs
exports.createCategorizedAs = async (req, res) => {
    try {
        const { movie_id, genre_ids } = req.body;

        // Validasi input
        if (!movie_id || !Array.isArray(genre_ids) || genre_ids.length === 0) {
            return res.status(400).send("Input tidak valid: movie_id dan genre_ids diperlukan.");
        }

        // Loop melalui genre_ids dan buat promises
        const categorizedAsPromises = genre_ids.map(genre_id =>
            Movie.createCategorizedAs({ movie_id, genre_id })
        );

        // Await semua promises
        const results = await Promise.all(categorizedAsPromises);

        res.status(201).json(results);
    } catch (error) {
        res.status(500).send("Gagal membuat categorized_as: " + error.message);
    }
};

// Create Awarded
exports.createAwarded = async (req, res) => {
    try {
        const { movie_id, award_ids } = req.body;

        // Validasi input
        if (!movie_id || !Array.isArray(award_ids) || award_ids.length === 0) {
            return res.status(400).send("Input tidak valid: movie_id dan award_ids diperlukan.");
        }

        // Loop melalui award_ids dan buat promises
        const awardedPromises = award_ids.map(award_id =>
            Movie.createAwarded({ movie_id, award_id })
        );

        // Await semua promises
        const results = await Promise.all(awardedPromises);

        res.status(201).json(results);
    } catch (error) {
        res.status(500).send("Gagal membuat awarded: " + error.message);
    }
};

// Create ActedIn
exports.createActedIn = async (req, res) => {
    try {
        const { movie_id, actor_ids } = req.body;

        // Validasi input
        if (!movie_id || !Array.isArray(actor_ids) || actor_ids.length === 0) {
            return res.status(400).send("Input tidak valid: movie_id dan actor_ids diperlukan.");
        }

        // Loop melalui actor_ids dan buat promises
        const actedInPromises = actor_ids.map(actor_id =>
            Movie.createActedIn({ movie_id, actor_id })
        );

        // Await semua promises
        const results = await Promise.all(actedInPromises);

        res.status(201).json(results);
    } catch (error) {
        res.status(500).send("Gagal membuat acted_in: " + error.message);
    }
};

exports.updateApprovalStatus = async (req, res) => {
    try {
        // Update approval status movie
        const result = await Movie.updateApprovalStatus(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};



exports.updateMovie = async (req, res) => {
    try {
        // Validasi input yang wajib ada
        if (!req.body.title) {
            return res.status(400).send('Judul film (title) wajib diisi.');
        }
        if (!req.body.year) {
            return res.status(400).send('Tahun (year) wajib diisi.');
        }

        // Validasi tipe data year (harus berupa angka)
        if (isNaN(req.body.year)) {
            return res.status(400).send('Tahun (year) harus berupa angka.');
        }

        // Validasi alternative_title (boleh kosong, tidak wajib)
        if (req.body.alternative_title && typeof req.body.alternative_title !== 'string') {
            return res.status(400).send('Alternative title harus berupa string.');
        }

        // Validasi tipe data release_status (harus ada dan salah satu dari "COMPLETED", "UPCOMING", atau "ONGOING")
        const validReleaseStatuses = ['COMPLETED', 'UPCOMING', 'ONGOING'];
        if (req.body.release_status && !validReleaseStatuses.includes(req.body.release_status)) {
            return res.status(400).send('release_status harus salah satu dari: "COMPLETED", "UPCOMING", atau "ONGOING".');
        }

        // Validasi tipe data approval_status (harus ada dan salah satu dari "APPROVED", "UNAPROVED")
        const validApprovalStatuses = ['APPROVED', 'UNAPROVED'];
        if (req.body.approval_status && !validApprovalStatuses.includes(req.body.approval_status)) {
            return res.status(400).send('approval_status harus salah satu dari: "APPROVED" atau "UNAPROVED".');
        }

        // Validasi tipe data link_trailer (jika ada, harus berupa string URL yang valid) contoh https:
        if (req.body.link_trailer && !req.body.link_trailer.startsWith('https://')) {
            return res.status(400).send("link_trailer harus berupa URL yang valid.");
        }

        // URL untuk poster film (dari file yang diunggah)
        const poster_url = req.file ? req.file.path : req.body.poster_url;

        // Update data movie
        const result = await Movie.update(req.params.id, {
            poster_url: poster_url,
            title: req.body.title,
            alternative_title: req.body.alternative_title,
            movie_rate: req.body.movie_rate || 0.0,
            views: req.body.views || 0,
            year: req.body.year,
            synopsis: req.body.synopsis,
            release_status: req.body.release_status,
            approval_status: req.body.approval_status,
            link_trailer: req.body.link_trailer,
            country_id: req.body.country_id,
            user_id: req.body.user_id,
            updated_at: new Date()
        });
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.deleteMovie = async (req, res) => {
    try {
        await Movie.delete(req.params.id);
        res.status(200).json({ message: 'Film berhasil dihapus' }); 
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.addToWishlist = async (req, res) => {
    try {
        const { user_id, movie_id } = req.body;
        
        // Validasi input
        if (!user_id || !movie_id) {
            return res.status(400).send('Invalid input: user_id and movie_id are required.');
        }
        
        const result = await Movie.addToWishlist(user_id, movie_id);
        if (result) {
            res.status(201).json({ message: 'Movie added to wishlist' });
        } else {
            res.status(400).json({ message: 'Movie already in wishlist' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.removeFromWishlist = async (req, res) => {
    try {
        const { user_id, movie_id } = req.params;
        const result = await Movie.removeFromWishlist(user_id, movie_id);
        if (result) {
            res.status(200).json({ message: 'Movie removed from wishlist' });
        } else {
            res.status(400).json({ message: 'Movie not in wishlist' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const { user_id } = req.params;
        const movies = await Movie.getWishlist(user_id);
        res.json(movies);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// get total movies
exports.getTotals = async (req, res) => {
    try {
        const totals = await Movie.getTotals();
        res.json(totals);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.filterByStatus = async (req, res) => {
    try {
        const { approval_status, page = 1, limit = 10 } = req.query;
        const { movies, totalCount } = await Movie.filterByStatus(approval_status, page, limit);
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page, 10),
            totalCount
        });
    } catch (error) {
        res.status(500).send('Failed to filter movies by status: ' + error.message);
    }
};

// Controller untuk filter film berdasarkan status untuk User
exports.filterByStatusUser = async (req, res) => {
    try {
        const { user_id, approval_status, page = 1, limit = 10 } = req.query; // user_id ditambahkan
        if (!user_id) {
            return res.status(400).send('User ID is required');
        }

        const { movies, totalCount } = await Movie.filterByStatusUser(user_id, approval_status, page, limit);
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page, 10),
            totalCount
        });
    } catch (error) {
        res.status(500).send('Failed to filter movies by status for user: ' + error.message);
    }
};

exports.searchByTitle = async (req, res) => {
    try {
        const { title = '', page = 1, limit = 10 } = req.query; 
        const { movies, totalCount } = await Movie.searchByTitle(title, page, limit);
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit),  // Menghitung total halaman
            currentPage: parseInt(page, 10),  // Halaman saat ini
            totalCount  // Jumlah total data
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Controller untuk mencari film berdasarkan judul untuk User
exports.searchByTitleUser = async (req, res) => {
    try {
        const { user_id, title = '', page = 1, limit = 10 } = req.query; // user_id ditambahkan
        if (!user_id) {
            return res.status(400).send('User ID is required');
        }

        const { movies, totalCount } = await Movie.searchByTitleUser(user_id, title, page, limit);
        res.json({
            movies,
            totalPages: Math.ceil(totalCount / limit), // Menghitung total halaman
            currentPage: parseInt(page, 10), // Halaman saat ini
            totalCount // Jumlah total data
        });
    } catch (error) {
        res.status(500).send('Failed to search movies by title for user: ' + error.message);
    }
};

exports.getAvailabilityByMovieId = async (req, res) => {
    try {
        const { movie_id } = req.params;
        const platforms = await Movie.getAvailabilityByMovieId(movie_id);
        res.json(platforms);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getCategorizedAsByMovieId = async (req, res) => {
    try {
        const { movie_id } = req.params;
        const genres = await Movie.getCategorizedAsByMovieId(movie_id);
        res.json(genres);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAwardedByMovieId = async (req, res) => {
    try {
        const { movie_id } = req.params;
        const awards = await Movie.getAwardedByMovieId(movie_id);
        res.json(awards);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getActedInByMovieId = async (req, res) => {
    try {
        const { movie_id } = req.params;
        const actors = await Movie.getActedInByMovieId(movie_id);
        res.json(actors);
    } catch (error) {
        res.status(500).send(error.message);
    }
};