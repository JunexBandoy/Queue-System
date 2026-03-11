import * as Yup from "yup";
import { ResultViewModel } from "./common/ResultViewModel";

export interface QueuesViewModel {
  id: number;
  que_number: string; // auto-generated, frontend does not set
  first_name: string;
  middle_name: string;
  last_name: string;
  contact_number: number;
  queue_date: string | Date; // from form
  service_id: number; // from form
  priorit: string; // from form
  status: string; // default 'waiting'
  issued_at: Date | null; // backend sets
  called_at: Date | null;
  completed_at: Date | null;
}

// Initial values for Formik form
export const initialValues: QueuesViewModel = {
  id: 0,
  que_number: "", // leave empty, backend will fill
  first_name: "",
  middle_name: "",
  last_name: "",
  contact_number: 0,
  queue_date: new Date(),
  service_id: 0,
  priorit: "",
  status: "",
  issued_at: null,
  called_at: null,
  completed_at: null,
};

export interface QueuesResultViewModel extends ResultViewModel {
  data: QueuesViewModel;
}

export interface QueuesListResultViewModel extends ResultViewModel {
  data: QueuesViewModel[];
}

export const queuesDefaultValue: QueuesViewModel = {
  id: 0,
  que_number: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  contact_number: 0,
  queue_date: new Date(),
  service_id: 0,
  priorit: "",
  status: "waiting",
  issued_at: null,
  called_at: null,
  completed_at: null,
};

// Validation schema for Formik
// Remove queue_number because backend generates it automatically
export const validationSchema = Yup.object().shape({
  queue_date: Yup.date().required("Queue date is required"),
  service_id: Yup.number()
    .min(1, "Please select a service")
    .required("Service is required"),
  priority: Yup.string()
    .oneOf(["senior", "pwd", "regular"])
    .required("Priority is required"),
});
