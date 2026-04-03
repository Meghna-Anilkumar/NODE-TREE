import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Node, CreateNodePayload } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => {
    console.log(`${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error(`${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const nodeService = {
  getRootNodes: async (): Promise<Node[]> => {
    const response = await api.get("/nodes/roots");
    const result = response.data.data || response.data;
    return result;
  },

  createNode: async (payload: CreateNodePayload): Promise<Node> => {
    const response = await api.post("/nodes", payload);
    const node = response.data.data || response.data;
    const normalized = { ...node, children: node.children || [] };
    return normalized;
  },

  getChildren: async (parentId: string): Promise<Node[]> => {
    const response = await api.get(`/nodes/${parentId}/children`);
    const result = response.data.data || response.data;
    return result;
  },

  deleteNode: async (id: string): Promise<void> => {
    await api.delete(`/nodes/${id}`);
  },
};