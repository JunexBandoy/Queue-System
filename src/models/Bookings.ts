import { ResultViewModel } from "./common/ResultViewModel";
import { TableViewModel } from "./common/TableViewModel";
// import * as Yup from "yup";

export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
  NoShow = 3,
  Completed = 4,
}

export interface BookingsViewModel {
  id: number;
  propertyId: string;
  status: BookingStatus;
  guestId: number;
  startDateTime: string;
  endDateTime: string;
  notes: string;
}

export interface BookingsTableResultViewModel
  extends TableViewModel,
    ResultViewModel {
  data: BookingsViewModel[];
}

export interface BookingsResultViewModel extends ResultViewModel {
  data: BookingsViewModel;
}

export interface BookingsListResultViewModel extends ResultViewModel {
  data: BookingsViewModel[];
}

export const bookingsDefaultValue: BookingsViewModel = {
  id: 0,
  propertyId: "",
  status: BookingStatus.Pending,
  guestId: 0,
  startDateTime: "",
  endDateTime: "",
  notes: "",
};

export const bookingsTableDefaultValue: BookingsTableResultViewModel = {
  data: [],
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  isSuccess: true,
  errorMessages: [],
};

// export const propertyValidationSchema = Yup.object({
//   title: Yup.string().required("Title is required"),
//   description: Yup.string(),
//   address: Yup.string(),
//   city: Yup.string(),
//   country: Yup.string(),
// });

