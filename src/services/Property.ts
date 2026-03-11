import axios from "axios";
import { api } from "../config/apiEndpoints";
import { getDataUrl } from "../core/utils/dataUrls";
import {
  PropertyTableResultViewModel,
  PropertyViewModel,
} from "../models/Properties";

export const PropertyServices = {
  create: async function (property: PropertyViewModel) {
    const createUrl = `${api.BASE_URL}${api.PROPERTIES_ENDPOINT}`;

    return axios.post(createUrl, property);
  },

  getList: async function (page: number = 1, pageSize: number = 10) {
    let dataUrl = getDataUrl(
      api.BASE_URL,
      api.PROPERTIES_ENDPOINT,
      page,
      pageSize
    );

    return axios.get(dataUrl).then((response) => {
      return response.data as Promise<PropertyTableResultViewModel>;
    });
  },

  getById: async function (id: number) {
    const dataUrl = `${api.BASE_URL}${api.PROPERTIES_ENDPOINT}/${id}`;

    try {
      const response = await axios.get(dataUrl);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching Propertu by ID", error);
      return null;
    }
  },

  delete: async function (id: number) {
    const deleteUrl = `${api.BASE_URL}${api.PROPERTIES_ENDPOINT}/${id}`;
    try {
      const response = await axios.delete(deleteUrl);
      if (response.status === 204) {
        return { success: true, message: "Property Deleted Successfuly" };
      }

      return axios.delete(deleteUrl).then((response) => {
        return response.data;
      });
    } catch (error) {
      console.log("Error Deleting Property", error);
    }
  },
};
