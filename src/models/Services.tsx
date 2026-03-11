import * as Yup from "yup";
import { ResultViewModel } from "./common/ResultViewModel";

export interface ServiceViewModel {
  id: number;
  service_code: number; // auto-generated, frontend does not set
  service_name: string;
  is_active: number;
  creatd_at: Date | null;
  updated_at: Date | null;
}

// Initial values for Formik form
export const initialValues: ServiceViewModel = {
  id: 0,
  service_code: 0, // leave empty, backend will fill
  service_name: "",
  is_active: 0,
  creatd_at: null,
  updated_at: null,
};

export interface QueuesResultViewModel extends ResultViewModel {
  data: ServiceViewModel;
}

export interface QueuesListResultViewModel extends ResultViewModel {
  data: ServiceViewModel[];
}

export const queuesDefaultValue: ServiceViewModel = {
  id: 0,
  service_code: 0,
  service_name: "",
  is_active: 0,
  creatd_at: null,
  updated_at: null,
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
