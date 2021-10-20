import { Pagination } from './pagination';

export function paginate<T>(
  documents: T[],
  path: string,
  limit?: number,
  pageNumber?: number
): Pagination<T> | T[] {
  if (limit && pageNumber) {
    return {
      data: documents,
      limit,
      pageNumber,
      next:
        documents?.length < limit
          ? ''
          : `${process.env.BASE_URL}${path}?limit=${limit}&page=${
              pageNumber + 1
            }`,
      previous:
        pageNumber > 1
          ? `${process.env.BASE_URL}${path}?limit=${limit}&page=${
              pageNumber - 1
            }`
          : '',
    };
  }
  return documents;
}
