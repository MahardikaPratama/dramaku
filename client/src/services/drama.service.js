import http from "../http-common";

class DramaDataService {
    getAll() {
        return http.get(`/dramas`);
    }
    
    getById(id) {
        return http.get(`/dramas/${id}`);
    }

    create(data) {
        return http.post(`/dramas`, data);
    }

    update(id, data) {
        return http.put(`/dramas/${id}`, data);
    }

    delete(id) {
        return http.delete(`/dramas/${id}`);
    }
}

const dramaDataService = new DramaDataService();
export default dramaDataService;
