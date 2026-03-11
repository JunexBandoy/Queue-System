import axios from "axios";
import { api } from "../config/apiEndpoints";
import { BookingsTableResultViewModel, BookingsViewModel } from "../models/Bookings";
import { getDataUrl } from "../core/utils/dataUrls";

export const BookingsServices = {
    create: async function (booking: BookingsViewModel) {
        const createUrl = `${api.BASE_URL}${api.BOOKING_ENDPOINT}`;

        return axios.post(createUrl, booking);
    },

    getList: async function () {
        let dataUrl = getDataUrl(
            api.BASE_URL,
            api.BOOKING_ENDPOINT,
        );

        return axios.get(dataUrl).then((response) => {
            return response.data as Promise<BookingsTableResultViewModel>;
        });
    },
}
