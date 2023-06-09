import { QueryOrderBy, QueryOrderByInput, Schema } from '../types'

function fmtOrderBy(orderBy: QueryOrderByInput): QueryOrderBy {
  return Array.isArray(orderBy) ? orderBy : [orderBy]
}

export function sanitizeOrderBy(
  schema: Schema,
  orderBy: QueryOrderByInput
): QueryOrderBy | null {
  if (!orderBy) {
    return null
  }

  const _orderBy = fmtOrderBy(orderBy)

  if (_orderBy.length === 0) {
    return null
  }

  _orderBy.forEach((valueExpId) => {
    if (typeof valueExpId !== 'string') {
      throw new TypeError('orderBy valueExpId must be of type string')
    }

    const valueExp = schema.valueExpressions[valueExpId]

    if (!valueExp) {
      throw new Error(`Invalid groupby: ${valueExpId}`)
    }

    if (valueExp.noOrderBy) {
      throw new Error(`groupby operation not allowed on ${valueExpId}`)
    }
  })

  return _orderBy
}
