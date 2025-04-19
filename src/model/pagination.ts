export interface PaginationResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // 현재 페이지
  size: number; // 페이지 사이즈
  first: boolean;
  last: boolean;
  empty: boolean;
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}
