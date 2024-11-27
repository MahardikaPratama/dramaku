import http from "../http-common";

class AwardDataService {
    getAll() {
        return http.get("/awards");
    }

    getPaginatedAwards(page = 1, limit = 10) {
        return http.get(`/awards/paginated?page=${page}&limit=${limit}`);
    }
    
    getById(id) {
        return http.get(`/awards/${id}`);
    }

    searchByAwardName(keyword, page = 1, limit = 10) {
        console.log("keyword", keyword);
        return http.get(`/awards/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    create(data) {
        console.log("Data award yang ditambah: ", data);
        return http.post(`/awards`, data);
    }

    update(id, data) {
        return http.put(`/awards/${id}`, data);
    }

    updateName(id, data) {
        return http.put(`/awards/${id}/name`, data);
    }

    delete(id) {
        return http.delete(`/awards/${id}`);
    }

    getTotalAwards() {
        return http.get(`/awards/count`);
    }
}

const awardDataService = new AwardDataService();
export default awardDataService;
