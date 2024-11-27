import http from "../http-common";

class CountryDataService {
    getAll(page = 1, limit = 10) {
        return http.get(`/countries?page=${page}&limit=${limit}`);
    }
    
    getById(id) {
        return http.get(`/countries/${id}`);
    }

    searchByCountryName(keyword, page = 1, limit = 10) {
        return http.get(`/countries/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    create(data) {
        const formData = new FormData();
        formData.append('country_id', data.country_id);  
        formData.append('country_name', data.country_name); 
        if (data.flag) formData.append('flag', data.flag); 
        console.log("File", formData.get('flag'));
        return http.post('/countries', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    update(id, data) {
        const formData = new FormData();
        formData.append('country_id', data.country_id); 
        formData.append('country_name', data.country_name);
        if (data.flag) formData.append('flag', data.flag); 
        return http.put(`/countries/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    updateName(id, data) {
        return http.put(`/countries/${id}/name`, {
            country_name: data.country_name,
        });
    }    

    delete(id) {
        return http.delete(`/countries/${id}`);
    }

    getTotalCountries() {
        return http.get(`/countries/count`);
    }
}

const countryDataService = new CountryDataService();
export default countryDataService;
