import { QueuesViewModel } from "../models/Queues";
import { api } from "./Api";

export const Services = {
  create: async (payload: QueuesViewModel) => {
    const { id, issued_at, called_at, completed_at, ...data } = payload;

    const queue_date =
      typeof data.queue_date === "string"
        ? data.queue_date
        : data.queue_date.toISOString().split("T")[0];

    return api.post(`/api/queues/create`, {
      ...data,
      queue_date,
    });
  },

  getServices: async () => {
    try {
      const res = await api.get("/api/services");
      return res.data?.data ?? [];
    } catch (e) {
      console.error("Error fetching serving queues", e);
      return [];
    }
  },
};
