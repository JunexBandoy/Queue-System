import axios from "axios";
import { api } from "../config/apiEndpoints";
import { getDataUrl } from "../core/utils/dataUrls";
import { ServingTableResultViewModel } from "../models/ViewServing";

const API_URL = "http://127.0.0.1:8000/api/serving";

export const ServingServices = {
  getList: async function (page: number = 1, pageSize: number = 10) {
    let dataUrl = getDataUrl(api.BASE_URL, api.CLIENT_ENDPOINT, page, pageSize);

    return axios.get(dataUrl).then((response) => {
      return response.data as Promise<ServingTableResultViewModel>;
    });
  },

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
};
