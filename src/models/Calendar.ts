import { ResultViewModel } from "./common/ResultViewModel";
import { TableViewModel } from "./common/TableViewModel";
// import * as Yup from "yup";

export enum BookingType {
    Booking = 1,
    HostBlock = 2,
}

export enum CalendarId {
  BookingId = 1,
  BostBlockId = 2,
}

export enum BookingStatus {
    Booked = 1,
    Available = 2,
    Maintenance = 3,
}

export interface CalendarViewModel {
  id: CalendarId;
  type: BookingType;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  status: BookingStatus;
}

export interface CalendarTableResultViewModel
  extends TableViewModel,
    ResultViewModel {
  data: CalendarViewModel[];
}

export interface CalendarResultViewModel extends ResultViewModel {
  data: CalendarViewModel;
}

export interface CalendarListResultViewModel extends ResultViewModel {
  data: CalendarViewModel[];
}

export const calendarDefaultValue: CalendarViewModel = {
  id: CalendarId.BookingId,
  type: BookingType.Booking,
  title: "",
  description: "",
  startDateTime: "",
  endDateTime: "",
  status: BookingStatus.Available,
};

export const calendarTableDefaultValue: CalendarTableResultViewModel = {
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

