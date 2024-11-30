import axios from "axios";

export default axios.create({
    baseURL: "https://dramaku-production.up.railway.app/api", // Ganti dengan URL produksi backend
    headers: {
        "Content-type": "application/json",
    },
    withCredentials: true, 
});
