const actorController = require('../controllers/actorController');
const Actor = require('../models/actor');

jest.mock('../models/actor');

describe('CRUD Aktor', () => {
    let req, res;

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

    // Test case untuk fungsi getAll
    describe('getAll', () => {
        it('harus mengembalikan daftar semua aktor yang ada dalam database', async () => {
            const actors = [{ actor_name: 'Tom Hanks' }];
            Actor.getAll.mockResolvedValue(actors);

            await actorController.getAll(req, res);

            expect(Actor.getAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(actors);
        });

        it('harus memberikan respons error jika gagal mengambil data aktor', async () => {
            const errorMessage = 'Gagal mengambil data aktor';
            Actor.getAll.mockRejectedValue(new Error(errorMessage));

            await actorController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(errorMessage);
        });
    });

    // Test untuk fungsi getPaginatedActors
    describe('getPaginatedActors', () => {
        it('harus mengembalikan aktor yang dipaginasi berdasarkan query parameter', async () => {
            const actors = [{ actor_name: 'Tom Hanks' }];
            req.query.page = 1;
            req.query.limit = 10;
            Actor.getPaginatedActors.mockResolvedValue({ rows: actors, rowCount: actors.length });

            await actorController.getPaginatedActors(req, res);

            expect(Actor.getPaginatedActors).toHaveBeenCalledWith(0, 10); // Memastikan pagination dihitung dengan benar
            expect(res.json).toHaveBeenCalledWith({ data: actors, totalEntries: actors.length });
        });

        it('harus memberikan error jika gagal mengambil data aktor yang dipaginasi', async () => {
            const errorMessage = 'Gagal mengambil data aktor dengan paginasi';
            req.query.page = 1;
            req.query.limit = 10;
            Actor.getPaginatedActors.mockRejectedValue(new Error(errorMessage));

            await actorController.getPaginatedActors(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(errorMessage);
        });
    });

    // Test untuk fungsi searchByActorName
    describe('searchByActorName', () => {
        it('harus mengembalikan aktor yang sesuai dengan kata kunci pencarian', async () => {
            const actors = [{ actor_name: 'Tom Hanks' }];
            req.query.keyword = 'Tom';
            req.query.page = 1;
            req.query.limit = 10;
            Actor.searchByActorName.mockResolvedValue({ rows: actors, rowCount: actors.length });

            await actorController.searchByActorName(req, res);

            expect(Actor.searchByActorName).toHaveBeenCalledWith('Tom', 1, 10); // Memastikan pencarian dilakukan dengan benar
            expect(res.json).toHaveBeenCalledWith({ data: actors, totalEntries: actors.length });
        });

        it('harus mengembalikan respons 404 jika tidak ada hasil ditemukan dalam pencarian aktor', async () => {
            req.query.keyword = 'Tom';
            req.query.page = 1;
            req.query.limit = 10;
            Actor.searchByActorName.mockResolvedValue({ rows: [], rowCount: 0 });

            await actorController.searchByActorName(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Tidak ada hasil yang ditemukan" }); // Memberikan informasi jelas kepada pengguna
        });

        it('harus memberikan error jika terjadi masalah pada saat pencarian aktor', async () => {
            const errorMessage = 'Terjadi masalah dalam pencarian aktor';
            req.query.keyword = 'Tom';
            req.query.page = 1;
            req.query.limit = 10;
            Actor.searchByActorName.mockRejectedValue(new Error(errorMessage));

            await actorController.searchByActorName(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(errorMessage); // Menyediakan detail error yang relevan
        });
    });

    // Test untuk fungsi getById
    describe('getById', () => {
        it('harus mengembalikan data aktor berdasarkan ID yang diberikan', async () => {
            const actor = { actor_name: 'Tom Hanks' };
            req.params.id = 1;
            Actor.getById.mockResolvedValue(actor);

            await actorController.getById(req, res);

            expect(Actor.getById).toHaveBeenCalledWith(1); // Memastikan pemanggilan dengan ID yang benar
            expect(res.json).toHaveBeenCalledWith(actor);
        });

        it('harus memberikan error jika ID aktor tidak ditemukan', async () => {
            const errorMessage = 'Aktor tidak ditemukan';
            req.params.id = 1;
            Actor.getById.mockResolvedValue(null); // Simulasi data tidak ditemukan

            await actorController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage }); // Memberikan pesan yang jelas ketika aktor tidak ditemukan
        });

        it('harus memberikan error jika terjadi masalah dalam mengambil data aktor berdasarkan ID', async () => {
            const errorMessage = 'Gagal mengambil data aktor berdasarkan ID';
            req.params.id = 1;
            Actor.getById.mockRejectedValue(new Error(errorMessage));

            await actorController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(errorMessage); // Menyediakan pesan error yang relevan
        });
    });

    // Test untuk fungsi create
    describe('create', () => {
        it('harus berhasil membuat aktor baru dan menyimpannya dalam database', async () => {
            const newActor = {
                actor_name: 'Tom Hanks',
                birth_date: '1956-07-09',
            };
            req.body = newActor;
            req.file = { path: '/uploads/tom_hanks.jpg' }; // Meniru unggahan file
            const expectedActor = { ...newActor, foto_url: req.file.path };

            Actor.create.mockResolvedValue(expectedActor);

            await actorController.create(req, res);

            expect(Actor.create).toHaveBeenCalledWith(expectedActor); // Memastikan data aktor baru disertakan dengan foto
            expect(res.status).toHaveBeenCalledWith(201); // Memastikan status yang benar untuk hasil pembuatan
            expect(res.json).toHaveBeenCalledWith(expectedActor); // Mengembalikan data aktor baru dalam format JSON
        });

        it('harus memberikan error jika gagal membuat aktor baru karena kesalahan saat mengunggah file', async () => {
            const errorMessage = "Terjadi masalah saat membuat aktor baru";
            Actor.create.mockRejectedValue(new Error(errorMessage));

            const req = {
                body: {
                    actor_name: 'John Doe',
                    birth_date: '1990-01-01',
                },
                file: undefined, // Simulasi file yang tidak ada
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await actorController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400); // Mengharapkan status 400 jika file tidak ada
            expect(res.json).toHaveBeenCalledWith({ message: "File foto tidak dapat diunggah" }); // Memberikan pesan error jika file tidak ada
        });
    });

    // Test untuk fungsi update
    describe('update', () => {
        it('harus memperbarui informasi aktor berdasarkan ID', async () => {
            const updatedActor = {
                actor_name: 'Tom Hanks',
                birth_date: '1956-07-09',
                foto_url: '/uploads/updated_tom_hanks.jpg',
            };
            req.body = updatedActor;
            req.file = { path: updatedActor.foto_url };
            req.params = { id: 1 };

            Actor.update.mockResolvedValue(updatedActor);

            await actorController.update(req, res);

            expect(Actor.update).toHaveBeenCalledWith(1, updatedActor);
            expect(res.json).toHaveBeenCalledWith(updatedActor); // Mengembalikan data aktor yang telah diperbarui
        });

        it('harus memberikan error jika gagal memperbarui aktor', async () => {
            const errorMessage = "Terjadi masalah saat memperbarui aktor";
            Actor.update.mockRejectedValue(new Error(errorMessage));

            const req = {
                body: {
                    actor_name: 'John Doe',
                    birth_date: '1990-01-01',
                },
                file: { path: '/uploads/john_doe.jpg' },
                params: { id: 1 },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await actorController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Terjadi masalah saat memperbarui aktor",
                error: expect.any(String), // Verifikasi bahwa error message dikembalikan
            });
        });
    });


    // Test untuk fungsi delete
    describe('delete', () => {
        it('harus menghapus aktor berdasarkan ID', async () => {
            req.params = { id: 1 };
            Actor.delete.mockResolvedValue(true);

            await actorController.delete(req, res);

            expect(Actor.delete).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Aktor berhasil dihapus' }); // Mengonfirmasi penghapusan sukses
        });

        it('harus memberikan error jika gagal menghapus aktor', async () => {
            const errorMessage = 'Gagal menghapus aktor';
            req.params = { id: 1 };
            Actor.delete.mockRejectedValue(new Error(errorMessage));

            await actorController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(errorMessage); // Memberikan pesan error terkait masalah penghapusan
        });
    });
});
