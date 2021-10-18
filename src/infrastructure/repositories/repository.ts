import { injectable, unmanaged } from 'inversify';
import { Collection, FilterQuery, ObjectID } from 'mongodb';
import {
  IRepository,
  Select,
  Sort,
} from '../../domain/models/interfaces/repository';
import { getValidObjectId } from '../../utils/utils';
import db from '../database';

/**
 * This Repository class is the base repository. It is an abstract class because it can only be
 * extended. This class is written to support mongodb. properly which means it will look different
 * if you use use any other orm or database driver.

 */
@injectable()
export default class Repository<T> implements IRepository<T> {
  private readonly collection: Collection;

  constructor(@unmanaged() collection: string) {
    this.collection = db.getCollection(collection);
  }

  public async get(id: ObjectID, select: Select = {}): Promise<T | null> {
    const objectId = getValidObjectId(id);

    const collection = this.collection;

    const doc: T | null = await collection.findOne<T>(
      { _id: objectId },
      select
    );

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

    const collection = this.collection;
    const doc = (await collection.insertOne(data)).ops[0] as T;

    return doc;
  }

  public async updateById(ids: ObjectID | ObjectID[], data: Partial<T>) {
    let objectIds = [];

    if (Array.isArray(ids)) {
      objectIds = ids.map((id) => getValidObjectId(id));
    } else {
      objectIds = [getValidObjectId(ids as ObjectID)];
    }

    const collection = this.collection;
    await collection.updateOne({ _id: { $in: objectIds } }, { $set: data });
  }

  public async remove(filter: FilterQuery<T>, multi: boolean): Promise<void> {
    const collection = this.collection;
    if (multi) {
      await collection.deleteMany(filter);
    } else {
      await collection.deleteOne(filter);
    }
  }

  public async removeById(ids: ObjectID | ObjectID[]): Promise<void> {
    let objectIds = [];

    if (Array.isArray(ids)) {
      objectIds = ids.map((id) => getValidObjectId(id));
    } else {
      objectIds = [getValidObjectId(ids as ObjectID)];
    }

    const collection = this.collection;
    await collection.deleteMany({ _id: { $in: objectIds } });
  }
}
