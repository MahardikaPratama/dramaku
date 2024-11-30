import axios from "axios";

export default axios.create({
    baseURL: "https://server-production-80b2.up.railway.app/api", // Ganti dengan URL produksi backend
    headers: {
        "Content-type": "application/json",
    },
    withCredentials: true, 
});
