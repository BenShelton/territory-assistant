import { ObjectID } from 'mongodb'

export type MongoInterface<T> = Omit<T, '_id'> & { _id?: string | ObjectID }
