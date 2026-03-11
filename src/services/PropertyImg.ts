import axios from "axios";
import { api } from "../config/apiEndpoints";
import { getDataUrl } from "../core/utils/dataUrls";
import { PropertyImageViewModel, PropertyImgTableResultViewModel } from "../models/PropertiesImg";

export const PropertyImgServices = {
  create: async function (propertyImg: PropertyImageViewModel) {
    const createUrl = `${api.BASE_URL}${api.PROPERTIES_IMG_ENDPOINT}`;

    return axios.post(createUrl, propertyImg);
  },

  getList: async function (page: number = 1, pageSize: number = 10) {
    let dataUrl = getDataUrl(
      api.BASE_URL,
      api.PROPERTIES_IMG_ENDPOINT,
      page,
      pageSize
    );

    return axios.get(dataUrl).then((response) => {
      return response.data as Promise<PropertyImgTableResultViewModel>;
    });
  },

  getById: async function (id: number) {
    const getUrl = `${api.AUTH_BASE_URL}${api.PROPERTIES_IMG_ENDPOINT}/${id}`;

    try {
      const response = await axios.get(getUrl);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching PropertyImg by ID", error);
      return null;
    }
  },

  delete: async function (id: number) {
    const deleteUrl = `${api.BASE_URL}${api.PROPERTIES_IMG_ENDPOINT}/${id}`;
    try {
      const response = await axios.delete(deleteUrl);
      if (response.status === 204) {
        return { success: true, message: "Property Image Deleted Successfuly" };
      }

      return axios.delete(deleteUrl).then((response) => {
        return response.data;
      });
    } catch (error) {
      console.log("Error Deleting Property", error);
    }
  },
};
