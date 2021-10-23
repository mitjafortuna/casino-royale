import { FilterQuery } from 'mongodb';
import { IModel } from './model';

/**
 * Base repository interface.
 */
export interface IRepository<T extends IModel> {
  /**
   * Receives an ID and fetch data from database by that ID.
   *
   * @param _id Id of the document
   * @param select Field to project properties. This is optional.
   */
  get(_id: string): Promise<T | null>;

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
    page?: number
  ): Promise<T[]>;

  /**
   * Edits documents from database for given ID. This method receives one ID
   * Insert one item in the collection.
   *
   * @param data Object that you want to store
   */
  create(data: Partial<T>): Promise<T>;

  /**
   *  If record with ID does not exist it throws `NotFoundError`.
   * @param _id 
   * @param data 
   */
  updateById(_id: string, data: Partial<T>): Promise<void>;

  /**
   * It finds all the matching documents by the given filter and removes them.
   *
   * @param filter FilterQuery
   */
  remove(filter: FilterQuery<T>, multi: boolean): Promise<void>;

  /**
   * Remove documents from database for given ID. This method receives one ID
   * If record with ID does not exist it throws `NotFoundError`.
   *
   * @param ids string
   */
  removeById(_id: string): Promise<void>;
}
