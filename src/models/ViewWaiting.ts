import { ResultViewModel } from "./common/ResultViewModel";
import { TableViewModel } from "./common/TableViewModel";

export interface WaitingViewModel {
  id: number;
  que_number: number;
  first_name: string;
  middle_initial: string;
  last_name: string;
  contact_number: number;
  queue_date: Date;
  service_name: string;
  priorit: string;
  status: string;
  issued_at: Date | null; // Added null for optional dates
  called_at: Date | null;
  completed_at: Date | null;
}

export interface WaitingTableResultViewModel
  extends TableViewModel, ResultViewModel {
  data: WaitingViewModel[];
}

export interface WaitingResultViewModel extends ResultViewModel {
  data: WaitingViewModel;
}

export interface WaitingListResultViewModel extends ResultViewModel {
  data: WaitingViewModel[];
}

export const WaitingDefaultValue: WaitingViewModel = {
  // Renamed from clientDefaultValue
  id: 0,
  que_number: 0,
  first_name: "",
  middle_initial: "",
  last_name: "",
  contact_number: 0,
  queue_date: new Date(), // Fixed: added new Date()
  service_name: "",
  priorit: "",
  status: "",
  issued_at: null, // Fixed: use null instead of Date type
  called_at: null,
  completed_at: null,
};

export const WaitingTableDefaultValue: WaitingTableResultViewModel = {
  data: [],
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  isSuccess: true,
  errorMessages: [],
};
