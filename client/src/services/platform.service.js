import http from "../http-common";

class PlatformDataService {
    getAll() {
        return http.get(`/platforms`);
    }
    
    getById(id) {
        return http.get(`/platforms/${id}`);
    }

    create(data) {
        return http.post(`/platforms`, data);
    }

    update(id, data) {
        return http.put(`/platforms/${id}`, data);
    }

    delete(id) {
        return http.delete(`/platforms/${id}`);
    }
}

const platformDataService = new PlatformDataService();
export default platformDataService;
