import http from "../http-common";

class ActorDataService {
    getAll() {
        return http.get(`/actors`);
    }
    
    getPaginatedActors(page = 1, limit = 10) {
        return http.get(`/actors/paginated?page=${page}&limit=${limit}`);
    }

    getById(id) {
        return http.get(`/actors/${id}`);
    }

    searchByActorName(keyword, page = 1, limit = 10) {
        return http.get(`/actors/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    getByMovie(movie_id) {
        return http.get(`/actors/movie/${movie_id}`);
    }
    
    create(data) {
        const formData = new FormData();
        formData.append('actor_name', data.actor_name);
        formData.append('birth_date', data.birth_date);
        if (data.foto_url) formData.append('foto_url', data.foto_url);
        return http.post('/actors', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    update(id, data) {
        const formData = new FormData();
        formData.append('actor_name', data.actor_name);
        formData.append('birth_date', data.birth_date);
        if (data.foto_url) formData.append('foto_url', data.foto_url);
        return http.put(`/actors/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    updateName(id, data) {
        return http.put(`/actors/${id}/name`, {
            actor_name: data.actor_name,
        });
    }

    delete(id) {
        return http.delete(`/actors/${id}`);
    }

    getTotalActors() {
        return http.get(`/actors/count`);
    }
}

const actorDataService = new ActorDataService();
export default actorDataService;