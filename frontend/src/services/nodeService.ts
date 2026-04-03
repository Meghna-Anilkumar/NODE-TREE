import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Node, CreateNodePayload } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const nodeService = {
  getRootNodes: async (): Promise<Node[]> => {
    const response = await api.get("/nodes/tree");
    return response.data.data || response.data;  
  },

  createNode: async (payload: CreateNodePayload): Promise<Node> => {
    const response = await api.post("/nodes", payload);
    return response.data.data || response.data;
  },

  updateNode: async (id: string, name: string): Promise<Node> => {
    const response = await api.put(`/nodes/${id}`, { name });
    return response.data.data || response.data;
  },

  deleteNode: async (id: string): Promise<void> => {
    await api.delete(`/nodes/${id}`);
  },
};