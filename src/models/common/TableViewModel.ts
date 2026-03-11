export interface TableViewModel {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}
