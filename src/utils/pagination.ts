export interface Pagination<T> {
    data: T[];
    limit: number;
    pageNumber: number;
    next: string;
    previous: string;
  }
  