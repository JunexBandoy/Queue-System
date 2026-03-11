import { ResultViewModel } from "./common/ResultViewModel";
import { TableViewModel } from "./common/TableViewModel";
// import * as Yup from "yup";

export interface PropertyImageViewModel {
  id: number;
  propertyId: number;
  imageUrl: string;
  isPrimary: boolean;
}

export const propertyImageDefaultValue: PropertyImageViewModel = {
  id: 0,
  propertyId: 0,
  imageUrl: "",
  isPrimary: true,
}

export interface PropertyImgTableResultViewModel
  extends TableViewModel,
    ResultViewModel {
  data: PropertyImageViewModel[];
}

export interface PropertyImgResultViewModel extends ResultViewModel {
  data: PropertyImageViewModel;
}

export interface PropertyImgListResultViewModel extends ResultViewModel {
  data: PropertyImageViewModel[];
}

export const propertyImgTableDefaultValue: PropertyImgTableResultViewModel = {
  data: [],
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  isSuccess: true,
  errorMessages: [],
};

// export const propertyImgValidationSchema = Yup.object({
//   title: Yup.string().required("Title is required"),
//   description: Yup.string(),
//   address: Yup.string(),
//   city: Yup.string(),
//   country: Yup.string(),
// });

