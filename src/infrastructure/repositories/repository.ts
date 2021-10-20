import { injectable, unmanaged } from 'inversify';
import { Collection, FilterQuery } from 'mongodb';
import {
  IRepository,
  Select,
  Sort,
} from '../../domain/models/interfaces/repository';
import db from '../database';
import { NotFoundError } from '../errors/app-errors';
import { v4 as uuid } from 'uuid';
import { IModel } from '../../domain/models/interfaces/model';

/**
 * This Repository class is the base repository. It is an abstract class because it can only be
 * extended. This class is written to support mongodb. properly which means it will look different
 * if you use use any other orm or database driver.

 */
@injectable()
export default class Repository<T extends IModel>
  implements IRepository<T>
{
  private readonly collection: Collection;

  constructor(@unmanaged() collection: string) {
    this.collection = db.getCollection(collection);
  }

  public async get(_id: string, select: Select = {}): Promise<T | null> {
    const collection = this.collection;

    const doc: T | null = await collection.findOne<T>({ _id: _id }, select);

    return doc;
  }

  public async find(
    filter: FilterQuery<Partial<T>> = {},
    limit = 10,
    page = 0,
    select?: Select,
    sort?: Sort
  ): Promise<T[]> {
    const collection = this.collection;
    const query = collection.find<T>(filter, select);

    if (sort) {
      query.sort(sort);
    }

    if (page > 0) {
      const skip = limit * (page - 1);
      query.skip(skip);
    }

    query.limit(limit);

    const docs = await query.toArray();

    return docs;
  }

  public async create(data: Partial<T>): Promise<T> {
    if (!data) {
      throw new Error('Empty object provided');
    }
    data._id = uuid();
    const collection = this.collection;
    const doc = (await collection.insertOne(data)).ops[0] as T;

    return doc;
  }

  public async updateById(_id: string, data: Partial<T>) {
    const collection = this.collection;
    const updateResult = await collection.updateOne(
      { _id: { $in: [_id] } },
      { $set: data }
    );
    if (updateResult.modifiedCount === 0) {
      throw new NotFoundError();
    }
  }

  public async remove(filter: FilterQuery<T>, multi: boolean): Promise<void> {
    const collection = this.collection;
    if (multi) {
      await collection.deleteMany(filter);
    } else {
      await collection.deleteOne(filter);
    }
  }

  public async removeById(_id: string): Promise<void> {
    const collection = this.collection;
    const deleteResult = await collection.deleteOne({
      _id: { $in: [_id] },
    });
    if (deleteResult.deletedCount === 0) {
      throw new NotFoundError();
    }
  }
}
