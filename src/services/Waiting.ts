import axios from "axios";
import { getDataUrl } from "../core/utils/dataUrls";
import { WaitingTableResultViewModel } from "../models/ViewWaiting";
import { api } from "./Api";

const API_URL = "http://127.0.0.1:8000/api/waiting";

export const WaitingServices = {
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

  CancelWaitingStatus: async (id: number) => {
    return axios.put(`${API_URL}/${id}/cancel`);
  },

  getAllWaiting: async () => {
    try {
      const res = await api.get("/api/waiting");
      return res.data?.data ?? [];
    } catch (e) {
      console.error("Error fetching serving queues", e);
      return [];
    }
  },
};
