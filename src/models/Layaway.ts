import { ResultViewModel } from "./common/ResultViewModel";
import { TableViewModel } from "./common/TableViewModel";

export interface ClientViewModel {
  id: number;
  client_id: number;
  payment_amount: string;
  payment_date: string;
  payment_due: string;
}
export interface ClientTableResultViewModel
  extends TableViewModel,
    ResultViewModel {
  data: ClientViewModel[];
}

export interface ClientResultViewModel extends ResultViewModel {
  data: ClientViewModel;
}

export interface ClientListResultViewModel extends ResultViewModel {
  data: ClientViewModel[];
}

export const clientDefaultValue: ClientViewModel = {
  id: 0,
  client_id: 0,
  payment_amount: "",
  payment_date: "",
  payment_due: "",
};

export const clientTableDefaultValue: ClientTableResultViewModel = {
  data: [],
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  isSuccess: true,
  errorMessages: [],
};
