import axios from "axios";
import { api } from "../config/apiEndpoints";
import {
  CategoryTableResultViewModel,
  CategoryViewModel,
} from "../models/Category";
import { getDataUrl } from "../core/utils/dataUrls";

export const CategoryServices = {
  create: async function (category: CategoryViewModel) {
    const createUrl = `${api.BASE_URL}${api.CATEGORY_ENDPOINT}`;

    return axios.post(createUrl, category);
  },

  getList: async function (page: number = 1, pageSize: number = 10) {
    let dataUrl = getDataUrl(
      api.BASE_URL,
      api.CATEGORY_ENDPOINT,
      page,
      pageSize
    );

    return axios.get(dataUrl).then((response) => {
      return response.data as Promise<CategoryTableResultViewModel>;
    });
  },

  getById: async function (id: number) {
    const getUrl = `${api.BASE_URL}${api.CATEGORY_ENDPOINT}/${id}`;

    try {
      const response = await axios.get(getUrl);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching Category by ID", error);
      return null;
    }
  },

  delete: async function (id: number) {
    const deleteUrl = `${api.BASE_URL}${api.CATEGORY_ENDPOINT}/${id}`;
    try {
      const response = await axios.delete(deleteUrl);
      if (response.status === 204) {
        return { success: true, message: "Category Deleted Successfuly" };
      }

      return axios.delete(deleteUrl).then((response) => {
        return response.data;
      });
    } catch (error) {
      console.log("Error Deleting Category", error);
    }
  },
};
