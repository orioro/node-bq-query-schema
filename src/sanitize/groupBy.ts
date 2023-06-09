import { QueryGroupBy, QueryGroupByInput, Schema } from '../types'

function fmtGroupBy(groupBy: QueryGroupByInput): QueryGroupBy {
  return Array.isArray(groupBy) ? groupBy : [groupBy]
}

export function sanitizeGroupBy(
  schema: Schema,
  groupBy: QueryGroupByInput
): QueryGroupBy | null {
  if (!groupBy) {
    return null
  }

  const _groupBy = fmtGroupBy(groupBy)

  if (_groupBy.length === 0) {
    return null
  }

  _groupBy.forEach((valueExpId) => {
    if (typeof valueExpId !== 'string') {
      throw new TypeError('groupBy valueExpId must be of type string')
    }

    const valueExp = schema.valueExpressions[valueExpId]


    if (!valueExp) {
      throw new Error(`Invalid groupby: ${valueExpId}`)
    }

    if (valueExp.type !== 'categorical') {
      throw new Error(
        `groupby valueExpID must be categorical. Fount: ${valueExpId} - ${valueExp.type}`
      )
    }

    if (valueExp.noGroupBy) {
      throw new Error(`groupby operation not allowed on ${valueExpId}`)
    }
  })

  return _groupBy
}
