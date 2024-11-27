import http from "../http-common";

class GenreDataService {
    getAll(page = 1, limit = 10) {
        return http.get(`/genres?page=${page}&limit=${limit}`);
    }

    searchByGenreName(keyword, page = 1, limit = 10) {
        return http.get(`/genres/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    }
    
    getById(id) {
        return http.get(`/genres/${id}`);
    }

    create(data) {
        console.log("Data yang ditambahkan: ", data);
        return http.post(`/genres`, data);
    }

    update(id, data) {
        console.log("update Id", id + "Data", data);
        return http.put(`/genres/${id}`, data);
    }

    updateName(id, data) {
        console.log("update nama Id", id + "Data", data);
        return http.put(`/genres/${id}/name`, {
            genre_name: data.genre_name,
        });
    }

    delete(id) {
        return http.delete(`/genres/${id}`);
    }

    getTotalGenres() {
        return http.get(`/genres/count`);
    }
}

const genreDataService = new GenreDataService();
export default genreDataService;