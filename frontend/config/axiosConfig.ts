import axios from "axios";
import type { AxiosInstance } from "axios"; 
export const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/";

export const API: AxiosInstance = axios.create({
  baseURL: baseUrl,
});