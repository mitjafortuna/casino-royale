import { FilterQuery, ObjectId } from 'mongodb';

/**
 * Fields you want to select. For mongodb it is a key-value pair.
 * Key is the name of the field and Value is 0 (exclude) or 1 (include).
 * Example: { username: 1, email: 1 } (Select only username and email)
 */
export interface Select {
  [key: string]: 1 | 0;
}

/**
 * Fields you want to order by. For mongodb it is a key-value pair.
 * Key is the name of the field and Value is 1 (ascending) or -1 (descending).
 * Example: { username: 1 } (Sort result by username in ascending order)
 */
export interface Sort {
  [key: string]: 1 | -1;
}

/**
 * Base repository interface.
 */
export interface IRepository<T> {
  /**
   * Receives an ID and fetch data from database by that ID.
   *
   * @param id Id of the document
   * @param select Field to project properties. This is optional.
   */
  get(id: ObjectId, select?: Select): Promise<T | null>;

  /**
   * Get documents from collection.
   *
   * @param filter Filter query
   * @param limit Document limit per page
   * @param page Current page number
   * @param [select] Fields to select
   * @param [sort] Sort order
   *
   * @returns Array of documents
   */
  find(
    filter: FilterQuery<Partial<T>>,
    limit?: number,
    page?: number,
    select?: Select,
    sort?: Sort
  ): Promise<T[]>;

  /**
   * Insert one item in the collection.
   *
   * @param data Object that you want to store
   */
  create(data: Partial<T>): Promise<T>;

  updateById(ids: ObjectId | ObjectId[], data: Partial<T>): Promise<void>;

  /**
   * It finds all the matching documents by the given filter and removes them.
   *
   * @param filter FilterQuery
   */
  remove(filter: FilterQuery<T>, multi: boolean): Promise<void>;

  /**
   * Remove documents from database by given IDs. This method receives one or more
   * IDs. Checks if the IDs are valid and proceed to delete.
   *
   * @param ids ObjectId | ObjectId[]
   */
  removeById(id: ObjectId | ObjectId[]): Promise<void>;
}
