import axios from "axios";
import { api } from "./Api";

const API_URL = "https://api.dc-bis.com/api/serving";

export const ServingServices = {
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);

      // Return ONLY the array of payments
      return response.data.data; // <-- FIX ✔
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      return [];
    }
  },

  updateStatus: async (id: number) => {
    return axios.put(`${API_URL}/${id}/status`);
  },

  getAllServing: async () => {
    try {
      const res = await api.get("/api/serving");
      return res.data?.data ?? [];
    } catch (e) {
      console.error("Error fetching serving queues", e);
      return [];
    }
  },
};
