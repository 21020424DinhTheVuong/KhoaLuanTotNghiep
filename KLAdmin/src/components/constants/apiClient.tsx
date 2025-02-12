import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3300/admin", // Replace with your server URL
    withCredentials: true
});
export default apiClient