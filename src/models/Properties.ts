import { CategoryViewModel } from "./Category";
import { ResultViewModel } from "./common/ResultViewModel";
import { TableViewModel } from "./common/TableViewModel";
import * as Yup from "yup";

export interface PropertyViewModel {
  id: number;
  hostId: number;
  listingName: string;
  description: string;
  categoryId: number;
  categoryName: PropertyCategoryViewModel[];
  address: string;
  price: number;
  guestCapacity: number;
  propertyImages: string[];
  propertySpecs: string[];
}

export interface PropertyCategoryViewModel {
  id: number;
  propertyId: number;
  categoryName: CategoryViewModel;
}

export interface PropertyTableResultViewModel
  extends TableViewModel,
    ResultViewModel {
  data: PropertyViewModel[];
}

export interface PropertyResultViewModel extends ResultViewModel {
  data: PropertyViewModel;
}

export interface PropertyListResultViewModel extends ResultViewModel {
  data: PropertyViewModel[];
}

export const propertyDefaultValue: PropertyViewModel = {
  id: 0,
  hostId: 0,
  listingName: "",
  description: "",
  categoryId: 0,
  categoryName: [],
  address: "",
  price: 0,
  guestCapacity: 0,
  propertyImages: [],
  propertySpecs: [],
};

export const propertyTableDefaultValue: PropertyTableResultViewModel = {
  data: [],
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  isSuccess: true,
  errorMessages: [],
};

export const propertyValidationSchema = Yup.object({
  listingName: Yup.string().required("Title is required"),
  description: Yup.string(),
  address: Yup.string(),
});

