export interface PaginationRes<T> {
  data: T[];
  resultCount: number;
  totalCount: number;
  currentPage: number;
  limit: number;
  pagesCount: number;
}
