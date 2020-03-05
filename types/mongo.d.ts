import { ObjectID, FilterQuery, UpdateQuery } from 'mongodb'

export type MongoInterface<T> = Omit<T, '_id'> & { _id?: string | ObjectID }

export interface IBulkWrite<T> {
  updateOne: {
    filter: FilterQuery<T>
    update: UpdateQuery<T>
    upsert?: boolean
  }
}
