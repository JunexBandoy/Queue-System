import { ResultViewModel } from "./common/ResultViewModel";
import { TableViewModel } from "./common/TableViewModel";
import * as Yup from "yup";

export interface CategoryViewModel {
  id: number;
  name: string;
  description: string;
}

export interface CategoryTableResultViewModel
  extends TableViewModel,
    ResultViewModel {
  data: CategoryViewModel[];
}

export interface CategoryResultViewModel extends ResultViewModel {
  data: CategoryViewModel;
}

export interface CategoryListResultViewModel extends ResultViewModel {
  data: CategoryViewModel[];
}

export const categoryDefaultValue: CategoryViewModel = {
  id: 0,
  name: "",
  description: "",
};

export const categoryTableDefaultValue: CategoryTableResultViewModel = {
  data: [],
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  isSuccess: true,
  errorMessages: [],
};

export const categoryValidationSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Category name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .trim("Category name should not have leading or trailing spaces"),

  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .transform((value) => (value === "" ? null : value)), // Convert empty string to null
});
