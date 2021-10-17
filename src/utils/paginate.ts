import { Pagination } from './pagination';

export function paginate<T>(
  documents: T[],
  limit: number,
  pageNumber: number,
  path: string
): Pagination<T> {
  return {
    data: documents,
    limit,
    pageNumber,
    next:
      documents?.length < limit
        ? ''
        : `${process.env.BASE_URL}${path}?page=${pageNumber + 1}`,
    previous:
      pageNumber > 1
        ? `${process.env.BASE_URL}${path}?page=${pageNumber - 1}`
        : '',
  };
}
