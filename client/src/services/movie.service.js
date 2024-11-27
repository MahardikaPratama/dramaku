import http from "../http-common";

class MovieDataService {
    getAllMovies(page = 1, limit = 20) {
        return http.get(`/movies?page=${page}&limit=${limit}`);
    }

    getAllMoviesCMS(page = 1, limit = 10) {
        return http.get(`/movies/cms?page=${page}&limit=${limit}`);
    }

    getAllMoviesCMSUser(user_id, page = 1, limit = 10) {
        return http.get(`/movies/cms/user?user_id=${user_id}&page=${page}&limit=${limit}`);
    }
    
    searchMovies(keyword, page = 1, limit = 20) {
        console.log("keyword:", keyword);
        return http.get(`/movies/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    }

    searchByTitle(title, page = 1, limit = 10) {
        console.log("Title:", title);
        return http.get(`/movies/searchByTitle?title=${title}&page=${page}&limit=${limit}`);
    }

    searchByTitleUser(user_id, title, page = 1, limit = 10) {
        console.log("Title:", title);
        return http.get(`/movies/searchByTitle/user?user_id=${user_id}&title=${title}&page=${page}&limit=${limit}`);
    }

    filterSortMovies(filters, sort, page = 1, limit = 20) {
        // Menyiapkan parameter query
        const params = {
            ...filters, 
            sort_by: sort, 
            page,
            limit
        };
        console.log("Filter-Sort Params:", params);
        return http.get(`/movies/filter-sort`, { params });
    }

    filterByStatus(status, page = 1, limit = 10) {
        return http.get(`/movies/filter-status?approval_status=${status}&page=${page}&limit=${limit}`);
    }

    filterByStatusUser(user_id, status, page = 1, limit = 10) {
        return http.get(`/movies/filter-status/user?user_id=${user_id}&approval_status=${status}&page=${page}&limit=${limit}`);
    }

    getMovieById(id) {
        return http.get(`/movies/${id}`);
    }

    getMovieBySameGenre(id) {
        return http.get(`/movies/same-genre/${id}`);  
    }

    getAvailabilityByMovieId(id) {
        return http.get(`/movies/availability/${id}`);
    }

    getCategorizedAs(id) {
        return http.get(`/movies/categorized-as/${id}`);
    }

    getAwarded(id) {
        return http.get(`/movies/awarded/${id}`);
    }

    getActedIn(id) {
        return http.get(`/movies/acted-in/${id}`);
    }
    // Method untuk membuat film baru dengan poster
    createMovie(data) {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('alternative_title', data.alternative_title);
        formData.append('movie_rate', data.movie_rate || 0.0);
        formData.append('views', data.views || 0);
        formData.append('year', data.year);
        formData.append('synopsis', data.synopsis);
        formData.append('release_status', data.release_status);
        formData.append('approval_status', data.approval_status || "UNAPPROVED");
        formData.append('link_trailer', data.link_trailer);
        formData.append('country_id', data.country_id);
        formData.append('user_id', data.user_id);

        // Menambahkan file poster jika ada
        if (data.poster_url) formData.append('poster_url', data.poster_url);

        return http.post('/movies', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    // Method untuk menambahkan ketersediaan platform untuk film
    createAvailability(data) {
        return http.post('/movies/availability', {
            movie_id: data.movie_id,
            platform_ids: data.platform_ids,
        });
    }

    // Method untuk menambahkan genre ke film
    createCategorizedAs(data) {
        return http.post('/movies/categorized-as', {
            movie_id: data.movie_id,
            genre_ids: data.genre_ids,
        });
    }

    // Method untuk menambahkan penghargaan pada film
    createAwarded(data) {
        return http.post('/movies/awarded', {
            movie_id: data.movie_id,
            award_ids: data.award_ids,
        });
    }

    // Method untuk menambahkan aktor yang berperan dalam film
    createActedIn(data) {
        return http.post('/movies/acted-in', {
            movie_id: data.movie_id,
            actor_ids: data.actor_ids,
        });
    }

    updateMovie(id, data) {
        console.log("Data Update:", data);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('alternative_title', data.alternative_title);
        formData.append('movie_rate', data.movie_rate || 0.0);
        formData.append('views', data.views || 0);
        formData.append('year', data.year);
        formData.append('synopsis', data.synopsis);
        formData.append('release_status', data.release_status);
        formData.append('approval_status', data.approval_status || "UNAPPROVED");
        formData.append('link_trailer', data.link_trailer);
        formData.append('country_id', data.country_id);
        formData.append('user_id', data.user_id);

        // Menambahkan file poster jika ada
        if (data.poster_url) formData.append('poster_url', data.poster_url);

        return http.put(`/movies/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

    }

    updateApprovalStatus(id) {
        console.log("Approval Status ID:", id);
        return http.put(`/movies/approval-status/${id}`);
    }

    deleteMovie(id) {
        return http.delete(`/movies/${id}`);
    }

    addToWishlist(user_id, movie_id) {
        console.log("Menambahkan ke Wishlist:", user_id, movie_id);
        return http.post(`/movies/wishlist`, { user_id, movie_id });
    }

    removeFromWishlist(user_id, movie_id) {
        console.log("Menghapus dari Wishlist:", user_id, movie_id);
        return http.delete(`/movies/wishlist/${user_id}/${movie_id}`);
    }

    getWishlist(user_id) {
        return http.get(`/movies/wishlist/${user_id}`);
    }

    getTotals() {
        return http.get(`/movies/count`);
    }

}

const movieDataService = new MovieDataService();
export default movieDataService;
