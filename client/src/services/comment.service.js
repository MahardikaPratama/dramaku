import http from "../http-common";

class CommentDataService {
    getAll() {
        return http.get(`/comments`);
    }

    getPaginatedComments(page, limit) { // Fixed typo
        return http.get(`/comments/paginated?page=${page}&limit=${limit}`);
    }

    getById(id) {
        return http.get(`/comments/${id}`);
    }

    getByMovie(movie_id) {
        return http.get(`/comments/movie/${movie_id}`);
    }

    getApprovedOnly() {
        return http.get(`/comments/approved`);
    }

    filterApprovalStatus(approval_status, page, limit) {
        console.log("CommentDataService filterApprovalStatus approval_status: ", approval_status);
        return http.get(`/comments/approval?approval_status=${approval_status}&page=${page}&limit=${limit}`);
    }

    create(data) {
        const dataWithStatus = { ...data, approval_status: "UNAPPROVED" };
        return http.post(`/comments`, dataWithStatus);
    }

    update(id, data) {
        console.log("CommentDataService update id: ", id);
        console.log("CommentDataService update data: ", data);
        return http.put(`/comments/${id}`, data);
    }

    updateByUserAndMovie(user_id, movie_id, data) {
        return http.put(`/comments/user/${user_id}/movie/${movie_id}`, data);
    }

    delete(id) {
        return http.delete(`/comments/${id}`);
    }

    getTotalComments() {
        return http.get(`/comments/count`);
    }

    approve(comment_id) {
        return http.patch(`/comments/${comment_id}/approval`, { approval_status: "APPROVED" }); // Matches PATCH method
    }

    updateStatus(commentId, updateData) {
        return http.patch(`/comments/${commentId}/approval`, updateData); // Ensure it uses PATCH
    }
}

const commentDataService = new CommentDataService();
export default commentDataService;
