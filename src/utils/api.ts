import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    validateStatus: (s) => s === 200 || s === 401,
})

export default api