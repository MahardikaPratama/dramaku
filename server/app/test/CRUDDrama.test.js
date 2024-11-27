const movieController = require('../controllers/movieController');
const Movie = require('../models/movie');

// Mock Movie model
jest.mock('../models/movie');

describe('CRUD Drama', () => {
    let req, res;

    // Inisialisasi mock request dan response sebelum setiap pengujian
    beforeEach(() => {
        req = {
            params: {},
            query: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    // Pengujian untuk fungsi getAllMoviesCMS
    describe('getAllMoviesCMS', () => {
        it('harus mengembalikan semua film dengan format yang benar', async () => {
            const movies = [
                {
                    movie_id: 1,
                    title: "Mencuri Raden Saleh",
                    year: 2022,
                    movie_rate: 4.5,
                    views: 2220000
                }
            ];
            const totalCount = 1;
            req.query.page = 1;
            req.query.limit = 10;

            Movie.getAllMoviesCMS.mockResolvedValue({ movies, totalCount });

            await movieController.getAllMoviesCMS(req, res);

            expect(Movie.getAllMoviesCMS).toHaveBeenCalledWith(
                parseInt(req.query.page, 10),
                parseInt(req.query.limit, 10)
            );
            expect(res.json).toHaveBeenCalledWith({
                movies,
                totalPages: Math.ceil(totalCount / req.query.limit),
                currentPage: parseInt(req.query.page, 10),
                totalCount
            });
        });

        it('harus menangani kesalahan jika page atau limit tidak valid', async () => {
            req.query.page = 'invalid';
            req.query.limit = 'invalid';

            await movieController.getAllMoviesCMS(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Parameter page atau limit tidak valid');
        });

        it('harus menangani kesalahan database', async () => {
            const errorMessage = 'Kesalahan saat mengambil data film';
            req.query.page = 1;
            req.query.limit = 10;

            Movie.getAllMoviesCMS.mockRejectedValue(new Error(errorMessage));

            await movieController.getAllMoviesCMS(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(errorMessage);
        });
    });

    // Pengujian untuk fungsi getAllMoviesCMSUser
    describe('getAllMoviesCMSUser', () => {
        it('harus mengembalikan semua film berdasarkan user_id dengan format yang benar', async () => {
            req.query.user_id = 1000;
            req.query.page = 1;
            req.query.limit = 10;

            const movies = [
                {
                    movie_id: 1,
                    title: "Mencuri Raden Saleh",
                    year: 2022,
                    movie_rate: 4.5,
                    views: 2220000
                }
            ];
            const totalCount = 1;

            Movie.getAllMoviesCMSUser.mockResolvedValue({ movies, totalCount });

            await movieController.getAllMoviesCMSUser(req, res);

            expect(Movie.getAllMoviesCMSUser).toHaveBeenCalledWith(
                req.query.user_id,
                parseInt(req.query.page, 10),
                parseInt(req.query.limit, 10)
            );
            expect(res.json).toHaveBeenCalledWith({
                movies,
                totalPages: Math.ceil(totalCount / req.query.limit),
                currentPage: parseInt(req.query.page, 10),
                totalCount
            });
        });

        it('harus menangani kesalahan jika user_id tidak diberikan', async () => {
            req.query.page = 1;
            req.query.limit = 10;

            await movieController.getAllMoviesCMSUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('User ID diperlukan');
        });

        it('harus menangani kesalahan database saat mengambil data berdasarkan user_id', async () => {
            req.query.user_id = 1000;
            req.query.page = 1;
            req.query.limit = 10;

            const errorMessage = 'Kesalahan database';
            Movie.getAllMoviesCMSUser.mockRejectedValue(new Error(errorMessage));

            await movieController.getAllMoviesCMSUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Gagal mendapatkan film untuk user: ' + errorMessage);
        });
    });

    // Pengujian untuk createMovie
    describe('createMovie', () => {
        // Test case 1: Memeriksa validasi data film valid
        it('harus berhasil membuat film baru dengan tipe data yang benar', async () => {
            const newMovie = {
                movie_id: 1,
                poster_url: 'https://example.com/poster.jpg',
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID',
                user_id: 1000,
                created_at: expect.any(Date),
                updated_at: expect.any(Date)
            };

            req.file = { path: 'https://example.com/poster.jpg' };

            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID',
                user_id: 1000
            };

            Movie.createMovie = jest.fn().mockResolvedValue(newMovie);

            await movieController.createMovie(req, res);

            expect(Movie.createMovie).toHaveBeenCalledWith({
                poster_url: 'https://example.com/poster.jpg',
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID',
                user_id: 1000,
                updated_at: expect.any(Date)
            });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newMovie);
        });

        // Test case 2: Memeriksa jika views bukan angka
        it('harus menangani kesalahan tipe data views yang bukan angka', async () => {
            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 'dua juta', // Bukan angka
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID',
                user_id: 1000
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Tipe data tidak valid: views harus berupa angka.');
        });

        // Test case 3: Memeriksa jika movie_rate tidak berada dalam rentang 0-5 dan bukan berupa angka (jika ada)
        it('harus menangani kesalahan jika movie_rate tidak berada dalam rentang 0-5 dan bukan berupa angka (jika ada)', async () => {
            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 6, // Salah rentang
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID',
                user_id: 1000
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('movie_rate harus berada dalam rentang 0-5.');
        });
            

        // Test case 4: Memeriksa jika year bukan angka
        it('harus menangani kesalahan jika year bukan angka', async () => {
            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 'two thousand twenty-two', // Salah tipe data
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID',
                user_id: 1000
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Tahun (year) harus berupa angka.');
        });

        // Test case 5: Memeriksa jika release_status tidak valid
        it('harus menangani kesalahan jika release_status tidak valid', async () => {
            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'FINISHED', // Salah status
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID',
                user_id: 1000
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('release_status harus salah satu dari: "COMPLETED", "UPCOMING", atau "ONGOING".');
        });

        // Test case 6: Memeriksa jika approval_status tidak valid
        it('harus menangani kesalahan jika approval_status tidak valid', async () => {
            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'PENDING', // Salah status
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID',
                user_id: 1000
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('approval_status harus salah satu dari: "APPROVED" atau "UNAPROVED".');
        });

        // Test case 7: Memeriksa jika country_id memiliki panjang lebih dari 2 karakter dan bukan string
        it('harus menangani kesalahan jika country_id memiliki panjang lebih dari 2 karakter dan bukan string', async () => {
            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'IDN', // 
                user_id: 1000
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('country_id harus berupa string dengan panjang 2 karakter.');
        });
        // Test case 8: Memeriksa jika dan user_id bukan angka
        it('harus menangani kesalahan jika user_id bukan angka', async () => {
            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'https://www.youtube.com/watch?v=example',
                country_id: 'ID', 
                user_id: 'one thousand', // Salah tipe
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("user_id harus berupa angka.");
        });

        // Test case 9: Memeriksa jika link_trailer bukan URL yang valid
        it('harus menangani kesalahan jika link_trailer bukan URL yang valid', async () => {
            req.body = {
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 4.5,
                views: 2220000,
                year: 2022,
                synopsis: 'Synopsis of the movie...',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: 'not a url', // Salah URL
                country_id: 'ID',
                user_id: 1000
            };

            await movieController.createMovie(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('link_trailer harus berupa URL yang valid.');
        });
    });

    // Pengujian untuk createAvailability
    describe('createAvailability', () => {
        let req, res;

        beforeEach(() => {
            req = { body: {} }; // Mock request
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };
        });

        it('harus membuat availability baru untuk beberapa platform', async () => {
            const newAvailability = [
                { movie_id: 1, platform_id: 1 },
                { movie_id: 1, platform_id: 2 }
            ];

            req.body = {
                movie_id: 1,
                platform_ids: [1, 2]
            };

            Movie.createAvailability = jest
                .fn()
                .mockResolvedValueOnce(newAvailability[0])
                .mockResolvedValueOnce(newAvailability[1]);

            await movieController.createAvailability(req, res);

            expect(Movie.createAvailability).toHaveBeenCalledTimes(2);
            expect(Movie.createAvailability).toHaveBeenCalledWith({ movie_id: 1, platform_id: 1 });
            expect(Movie.createAvailability).toHaveBeenCalledWith({ movie_id: 1, platform_id: 2 });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newAvailability);
        });

        it('harus mengembalikan 400 jika input tidak valid', async () => {
            req.body = { movie_id: 1 }; // Tidak ada platform_ids

            await movieController.createAvailability(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Input tidak valid: movie_id dan platform_ids diperlukan.");
        });

        it('harus menangani kesalahan dari model', async () => {
            const errorMessage = "Kesalahan koneksi database";

            req.body = { movie_id: 1, platform_ids: [1, 2] };

            Movie.createAvailability = jest.fn().mockRejectedValue(new Error(errorMessage));

            await movieController.createAvailability(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Gagal membuat availability: " + errorMessage);
        });
    });

    describe('createCategorizedAs', () => {
        let req, res;

        beforeEach(() => {
            req = { body: {} }; // Mock request
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };
        });

        it('harus membuat categorized_as baru untuk beberapa genre', async () => {
            const newCategorizedAs = [
                { movie_id: 1, genre_id: 1 },
                { movie_id: 1, genre_id: 2 }
            ];

            req.body = {
                movie_id: 1,
                genre_ids: [1, 2]
            };

            Movie.createCategorizedAs = jest
                .fn()
                .mockResolvedValueOnce(newCategorizedAs[0])
                .mockResolvedValueOnce(newCategorizedAs[1]);

            await movieController.createCategorizedAs(req, res);

            expect(Movie.createCategorizedAs).toHaveBeenCalledTimes(2);
            expect(Movie.createCategorizedAs).toHaveBeenCalledWith({ movie_id: 1, genre_id: 1 });
            expect(Movie.createCategorizedAs).toHaveBeenCalledWith({ movie_id: 1, genre_id: 2 });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newCategorizedAs);
        });

        it('harus mengembalikan 400 jika input tidak valid', async () => {
            req.body = { movie_id: 1 };

            await movieController.createCategorizedAs(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Input tidak valid: movie_id dan genre_ids diperlukan.");
        });

        it('harus menangani kesalahan dari model', async () => {
            const errorMessage = "Kesalahan database";
            req.body = { movie_id: 1, genre_ids: [1, 2] };

            Movie.createCategorizedAs = jest.fn().mockRejectedValue(new Error(errorMessage));

            await movieController.createCategorizedAs(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Gagal membuat categorized_as: " + errorMessage);
        });
    });

    describe('createAwarded', () => {
        let req, res;

        beforeEach(() => {
            req = { body: {} };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };
        });

        it('harus membuat awarded baru untuk beberapa penghargaan', async () => {
            const newAwarded = [
                { movie_id: 1, award_id: 1 },
                { movie_id: 1, award_id: 2 }
            ];

            req.body = {
                movie_id: 1,
                award_ids: [1, 2]
            };

            Movie.createAwarded = jest
                .fn()
                .mockResolvedValueOnce(newAwarded[0])
                .mockResolvedValueOnce(newAwarded[1]);

            await movieController.createAwarded(req, res);

            expect(Movie.createAwarded).toHaveBeenCalledTimes(2);
            expect(Movie.createAwarded).toHaveBeenCalledWith({ movie_id: 1, award_id: 1 });
            expect(Movie.createAwarded).toHaveBeenCalledWith({ movie_id: 1, award_id: 2 });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newAwarded);
        });

        it('harus mengembalikan 400 jika input tidak valid', async () => {
            req.body = { movie_id: 1 };

            await movieController.createAwarded(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Input tidak valid: movie_id dan award_ids diperlukan.");
        });

        it('harus menangani kesalahan dari model', async () => {
            const errorMessage = "Kesalahan database";
            req.body = { movie_id: 1, award_ids: [1, 2] };

            Movie.createAwarded = jest.fn().mockRejectedValue(new Error(errorMessage));

            await movieController.createAwarded(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Gagal membuat awarded: " + errorMessage);
        });
    });

    describe('createActedIn', () => {
        let req, res;

        beforeEach(() => {
            req = { body: {} };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };
        });

        it('harus membuat acted_in baru untuk beberapa aktor', async () => {
            const newActedIn = [
                { movie_id: 1, actor_id: 1 },
                { movie_id: 1, actor_id: 2 }
            ];

            req.body = {
                movie_id: 1,
                actor_ids: [1, 2]
            };

            Movie.createActedIn = jest
                .fn()
                .mockResolvedValueOnce(newActedIn[0])
                .mockResolvedValueOnce(newActedIn[1]);

            await movieController.createActedIn(req, res);

            expect(Movie.createActedIn).toHaveBeenCalledTimes(2);
            expect(Movie.createActedIn).toHaveBeenCalledWith({ movie_id: 1, actor_id: 1 });
            expect(Movie.createActedIn).toHaveBeenCalledWith({ movie_id: 1, actor_id: 2 });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newActedIn);
        });

        it('harus mengembalikan 400 jika input tidak valid', async () => {
            req.body = { movie_id: 1 };

            await movieController.createActedIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Input tidak valid: movie_id dan actor_ids diperlukan.");
        });

        it('harus menangani kesalahan dari model', async () => {
            const errorMessage = "Kesalahan database";
            req.body = { movie_id: 1, actor_ids: [1, 2] };

            Movie.createActedIn = jest.fn().mockRejectedValue(new Error(errorMessage));

            await movieController.createActedIn(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Gagal membuat acted_in: " + errorMessage);
        });
    });

    describe('updateApprovalStatus', () => {
        // Test case 1: Memeriksa validasi approval_status yang benar
        it('harus berhasil mengupdate status approval film jika approval_status valid', async () => {
            req.params = { id: 1 };
            req.body = { approval_status: 'APPROVED' };
    
            const updatedMovie = { id: 1, approval_status: 'APPROVED' };
    
            // Mocking Movie.updateApprovalStatus untuk mengembalikan updatedMovie
            Movie.updateApprovalStatus = jest.fn().mockResolvedValue(updatedMovie);
    
            await movieController.updateApprovalStatus(req, res);
    
            expect(Movie.updateApprovalStatus).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(updatedMovie);  // Cek bahwa json berisi updatedMovie
        });
    });
    

    describe('updateMovie', () => {
        // Test case 1: Memeriksa validasi film yang valid
        it('harus berhasil mengupdate film dengan data yang valid', async () => {
            req.params = { id: 1 }; // ID film
            req.body = {
                title: 'Mencuri Raden Saleh',
                year: 2022,
                alternative_title: 'Stealing Raden Saleh',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
            };
        
            // Mock untuk Movie.update
            const updatedMovie = {
                movie_id: 1,
                title: 'Mencuri Raden Saleh',
                year: 2022,
                alternative_title: 'Stealing Raden Saleh',
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                poster_url: null, // Karena poster_url tidak diisi
                movie_rate: 0.0,  // Nilai default
                views: 0,         // Nilai default
                link_trailer: null,
                country_id: null,
                user_id: null,
                updated_at: new Date(),
            };
        
            // Mock fungsi update untuk mengembalikan data yang diperbarui
            Movie.update = jest.fn().mockResolvedValue(updatedMovie);
        
            // Panggil controller
            await movieController.updateMovie(req, res);
        
            // Verifikasi bahwa Movie.update dipanggil dengan parameter yang benar
            expect(Movie.update).toHaveBeenCalledWith(1, {
                poster_url: undefined,
                title: 'Mencuri Raden Saleh',
                alternative_title: 'Stealing Raden Saleh',
                movie_rate: 0.0,
                views: 0,
                year: 2022,
                synopsis: undefined,
                release_status: 'COMPLETED',
                approval_status: 'APPROVED',
                link_trailer: undefined,
                country_id: undefined,
                user_id: undefined,
                updated_at: expect.any(Date),
            });
        
            // Verifikasi respons JSON dengan data yang diperbarui
            expect(res.json).toHaveBeenCalledWith(updatedMovie);
        });        
    
        // Test case 2: Memeriksa kesalahan jika title tidak ada
        it('harus menangani kesalahan jika title tidak ada', async () => {
            req.params = { id: 1 };
            req.body = { year: 2022 };
    
            await movieController.updateMovie(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Judul film (title) wajib diisi.');
        });
    
        // Test case 3: Memeriksa kesalahan jika year bukan angka
        it('harus menangani kesalahan jika year bukan angka', async () => {
            req.params = { id: 1 };
            req.body = { title: 'Mencuri Raden Saleh', year: 'two thousand twenty-two' }; // Bukan angka
    
            await movieController.updateMovie(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Tahun (year) harus berupa angka.');
        });
    
        // Test case 4: Memeriksa kesalahan jika release_status tidak valid
        it('harus menangani kesalahan jika release_status tidak valid', async () => {
            req.params = { id: 1 };
            req.body = { title: 'Mencuri Raden Saleh', year: 2022, release_status: 'FINISHED' }; // Salah status
    
            await movieController.updateMovie(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('release_status harus salah satu dari: "COMPLETED", "UPCOMING", atau "ONGOING".');
        });
    
        // Test case 5: Memeriksa kesalahan jika approval_status tidak valid
        it('harus menangani kesalahan jika approval_status tidak valid', async () => {
            req.params = { id: 1 };
            req.body = { title: 'Mencuri Raden Saleh', year: 2022, approval_status: 'PENDING' }; // Salah status
    
            await movieController.updateMovie(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('approval_status harus salah satu dari: "APPROVED" atau "UNAPROVED".');
        });
    });

    // Pengujian untuk deleteMovie
    describe('deleteMovie', () => {
        beforeEach(() => {
            req = { params: { id: 1 } }; // ID film yang ingin dihapus
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };
        });

        it('harus berhasil menghapus film', async () => {
            // Mock fungsi model
            Movie.delete = jest.fn().mockResolvedValue();

            // Panggil controller
            await movieController.deleteMovie(req, res);

            // Periksa apakah fungsi model dipanggil dengan argumen yang benar
            expect(Movie.delete).toHaveBeenCalledWith(1);

            // Periksa respons JSON
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Film berhasil dihapus' });
        });

        it('harus menangani error saat menghapus film', async () => {
            const errorMessage = 'Gagal menghapus film';

            // Mock fungsi model untuk melempar error
            Movie.delete = jest.fn().mockRejectedValue(new Error(errorMessage));

            // Panggil controller
            await movieController.deleteMovie(req, res);

            // Periksa apakah status 500 dipanggil dengan pesan error
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(errorMessage);
        });
    });

});
