import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { baseURL } from "../../constants";
const apiClient = axios.create({
    // baseURL: "http://192.168.1.12:3300", // Replace with your server URL 172.168.10.167
    // baseURL: "http://172.168.10.167:3300", // Replace with your server URL 172.168.10.167
    baseURL: baseURL,
    withCredentials: true
});

// const getNewAccessToken = async () => {
//     try {
//         const response = await apiClient.post("/auth/refresh-token", {
//             refreshToken: await AsyncStorage.getItem("refresh_token"),
//         });
//         const newAccessToken = response.data.accessToken;
//         await AsyncStorage.setItem("access_token", newAccessToken)
//         return newAccessToken;
//     } catch (error) {
//         console.error("Error refreshing access token:", error);
//         throw error; // Handle failure to refresh token
//     }
// };

// Intercept responses to handle 500 errors
// apiClient.interceptors.response.use(
//     (response) => {
//         // Pass through successful responses
//         return response;
//     },
//     async (error) => {
//         if (error.response && error.response.status === 500) {
//             // Handle 500 error
//             console.error("Server returned 500 error. Attempting to refresh token...");
//             try {
//                 await getNewAccessToken(); // Refresh the token
//                 // Retry the original request with updated token
//                 const originalRequest = error.config;
//                 const newAccessToken = await AsyncStorage.getItem("access_token");
//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return apiClient.request(originalRequest); // Retry the request
//             } catch (refreshError) {
//                 console.error("Failed to refresh token:", refreshError);
//                 throw refreshError; // Rethrow error to propagate failure
//             }
//         }
//         return Promise.reject(error); // Reject other errors
//     }
// );

export default apiClient;