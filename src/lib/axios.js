import axios from "axios"

export const axiosInstance = axios.create({
    baseURL:import.meta.env.MODE==="development" ? "http://localhost:8000/api":"https://mingleup-backend.onrender.com/api",
    withCredentials:true
})