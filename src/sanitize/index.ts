import { sanitizeSelect } from './select'
import { sanitizeFrom } from './from'
import { sanitizeWhere } from './where'
import { sanitizeGroupBy } from './groupBy'
import type { QueryParams, QueryParamsInput, Schema } from '../types'
import { sanitizeOrderBy } from './orderBy'

export function sanitizeQueryParams(
  schema: Schema,
  params: QueryParamsInput
): QueryParams {
  const { select, from, where, groupBy, orderBy } = params

  return {
    select: sanitizeSelect(schema, select),
    from: sanitizeFrom(schema, from),
    where: where ? sanitizeWhere(schema, where) : null,
    groupBy: groupBy ? sanitizeGroupBy(schema, groupBy) : null,
    orderBy: orderBy ? sanitizeOrderBy(schema, orderBy) : null,
  }
}
