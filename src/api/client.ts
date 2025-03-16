import axios from "axios"
const apiUrl = import.meta.env.VITE_API_BASE_URL;
export const apiClient = axios.create({
  baseURL: apiUrl,
});