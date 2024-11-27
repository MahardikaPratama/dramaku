import http from "../http-common";

class UserDataService {
    getAll(page = 1, limit = 10) {
        return http.get(`/users?page=${page}&limit=${limit}`);
    }
    
    getById(id) {
        return http.get(`/users/${id}`);
    }

    searchUserByUsername(username, page, limit) {
        return http.get(`/users/search?username=${username}&page=${page}&limit=${limit}`);
    }

    create(data) {
        return http.post(`/users`, data);
    }

    update(id, data) {
        return http.put(`/users/${id}`, data);
    }

    updateProfile(id, data) {
        const formData = new FormData();
        formData.append('username', data.username);
        if (data.foto_profil_url) {
            formData.append('foto_profil_url', data.foto_profil_url);
        } else {
            formData.append('foto_profil_url', data.foto_profil_url); 
        }
        return http.put(`/users/${id}/profile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    updateRole(id, role) {
        return http.put(`/users/${id}/role`, role);
    }

    updateStatusSuspend(id, is_suspended) {
        return http.put(`/users/${id}/suspend`, is_suspended);
    }

    delete(id) {
        return http.delete(`/users/${id}`);
    }

    register(data) {    
        console.log(data);
        return http.post(`/users/register`, data);
    }

    login(data) {
        return http.post(`/users/login`, data);
    }

    logout() {
        return http.post(`/users/logout`);
    }

    getProfile() {
        return http.get(`/users/profile`);
    }

    getByEmail(email) {
        return http.get(`/users/email/${email}`);
    }  

    verifyEmail(data) {
        return http.post('/users/verify-email', data);
    }    

    resendVerificationToken(email) {
        return http.post('/users/resend-token', { email });
    }  

    getTotalUsers() {
        return http.get(`/users/count`);
    }
    
}

const userDataService = new UserDataService();
export default userDataService;
