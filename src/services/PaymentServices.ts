import axios from "axios";
import { api } from "../config/apiEndpoints";
import { getDataUrl } from "../core/utils/dataUrls";
import { QueuesListResultViewModel, QueuesViewModel } from "../models/Queues";

const API_URL = "http://127.0.0.1:8000/api/queues";

export const PaymentsServices = {
  create: async function (client: QueuesViewModel) {
    const createUrl = `${api.BASE_URL}${api.CLIENT_ENDPOINT}`;

    return axios.post(createUrl, client);
  },

  getList: async function (page: number = 1, pageSize: number = 10) {
    let dataUrl = getDataUrl(api.BASE_URL, api.CLIENT_ENDPOINT, page, pageSize);

    return axios.get(dataUrl).then((response) => {
      return response.data as Promise<QueuesListResultViewModel>;
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

  getById: async function (id: number) {
    const dataUrl = `${api.BASE_URL}${api.CLIENT_ENDPOINT}/${id}`;

    try {
      const response = await axios.get(dataUrl);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching Client by ID", error);
      return null;
    }
  },

  delete: async function (id: number) {
    const deleteUrl = `${api.BASE_URL}${api.CLIENT_ENDPOINT}/${id}`;
    try {
      const response = await axios.delete(deleteUrl);
      if (response.status === 204) {
        return { success: true, message: "Client Deleted Successfuly" };
      }

      return axios.delete(deleteUrl).then((response) => {
        return response.data;
      });
    } catch (error) {
      console.log("Error Deleting Property", error);
    }
  },
};
