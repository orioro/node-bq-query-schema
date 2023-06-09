import { QueryFrom, Schema } from '../types'

export function sanitizeFrom(schema: Schema, from: QueryFrom): QueryFrom {
  if (typeof from !== 'string') {
    throw new TypeError(`from must be of type string`)
  }

  const dataSource = schema.dataSources[from]

  if (!dataSource || !dataSource.value) {
    throw new Error(`Invalid data dataSource ${from}`)
  }

  return from
}
