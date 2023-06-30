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

  _orderBy.forEach((expressionId) => {
    if (typeof expressionId !== 'string') {
      throw new TypeError('orderBy expressionId must be of type string')
    }

    const orderByExp = schema.orderByExpressions[expressionId]

    if (!orderByExp) {
      throw new Error(`Invalid orderBy: ${expressionId}`)
    }
  })

  return _orderBy
}
