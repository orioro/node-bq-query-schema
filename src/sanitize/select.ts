import { QuerySelect, QuerySelectInput, Schema } from '../types'

function fmtSelect(select: QuerySelectInput): QuerySelect {
  return Array.isArray(select) ? select : [select]
}

export function sanitizeSelect(
  schema: Schema,
  select: QuerySelectInput
): QuerySelect {
  const { valueExpressions } = schema

  const _select = fmtSelect(select)

  if (_select.length === 0) {
    throw new Error(`select must have at least 1 item`)
  }

  _select.forEach((valueExpId) => {
    if (typeof valueExpId !== 'string') {
      throw new TypeError(`valueExpId must be of type string`)
    }

    const selectExpression = valueExpressions[valueExpId]

    if (!Boolean(selectExpression)) {
      throw new Error(`Invalid valueExpId: ${valueExpId}`)
    }

    if (selectExpression.noSelect) {
      throw new Error(`${valueExpId} not selectable`)
    }
  })

  return _select
}
