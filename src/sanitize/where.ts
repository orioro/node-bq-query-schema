import { QueryWhere, QueryWhereInput, Schema } from '../types'
import { isPlainObject } from 'lodash'

export function sanitizeWhere(
  schema: Schema,
  where: QueryWhereInput
): QueryWhere | null {
  if (!isPlainObject(where)) {
    throw new TypeError('where must be a plain object')
  }

  const whereExpIds = Object.keys(where)

  if (whereExpIds.length === 0) {
    return null
  }

  whereExpIds.forEach((expId) => {
    const whereExp = schema.whereExpressions[expId]

    if (!Boolean(whereExp)) {
      throw new Error(`Invalid where whereExpId: ${expId}`)
    }

    const targetValue = where[expId]
    const targetValueType =
      whereExp.valueExpression.type === 'categorical' ? 'string' : 'number'

    if (Array.isArray(targetValue)) {
      targetValue.forEach((tv) => {
        if (typeof tv !== targetValueType) {
          throw new TypeError(
            `targetValue must be of type ${targetValueType}, found ${typeof tv}`
          )
        }
      })
    } else {
      if (typeof targetValue !== targetValueType) {
        throw new TypeError(
          `targetValue must be of type ${targetValueType}, found ${typeof targetValue}`
        )
      }
    }
  })

  return where
}
