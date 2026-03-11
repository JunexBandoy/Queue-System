import { QueuesViewModel } from "../models/Queues";
import { api } from "./Api";

export const QueuesServices = {
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

  getAllWaiting: async () => {
    try {
      const res = await api.get("/api/queues/waiting/me");
      return res.data?.data ?? [];
    } catch (e) {
      console.error("Error fetching waiting queues", e);
      return [];
    }
  },

  getAllServing: async () => {
    try {
      const res = await api.get("/api/queues/serving/me");
      return res.data?.data ?? [];
    } catch (e) {
      console.error("Error fetching serving queues", e);
      return [];
    }
  },

  updateStatus: async (id: number) => {
    return api.put(`/api/queues/${id}/status`);
  },

  CancelStatus: async (id: number) => {
    return api.put(`/api/queues/${id}/cancel`);
  },

  DoneStatus: async (id: number) => {
    return api.put(`/api/queues/${id}/done`);
  },

  Transfer: async (id: number, serviceId: number) => {
    return api.put(`/api/queues/${id}/transfer`, {
      service_id: serviceId,
    });
  },
};
