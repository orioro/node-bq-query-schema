import type {
  Schema,
  QuerySelect,
  QueryWhere,
  QueryGroupBy,
  QueryParams,
  QuerySelectInput,
  QueryWhereInput,
  QueryGroupByInput,
  QueryParamsInput,
  QueryFrom,
} from './types'
import { isPlainObject } from 'lodash'

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

  _select.forEach((valueExpressionId) => {
    if (typeof valueExpressionId !== 'string') {
      throw new TypeError(`valueExpressionId must be of type string`)
    }

    if (!Boolean(valueExpressions[valueExpressionId])) {
      throw new Error(`Invalid valueExpressionId: ${valueExpressionId}`)
    }
  })

  return _select
}

export function sanitizeFrom(schema: Schema, from: QueryFrom): QueryFrom {
  if (typeof from !== 'string') {
    throw new TypeError(`from must be of type string`)
  }

  const dataSource = schema.dataSources[from]

  if (!dataSource || !dataSource.source) {
    throw new Error(`Invalid data dataSource ${from}`)
  }

  return from
}

function fmtWhere(where: QueryWhereInput): QueryWhere {
  if (!isPlainObject(where)) {
    throw new TypeError('where parameter must be of type plain object')
  }

  return Object.keys(where).reduce(
    (acc, variableId) => ({
      ...acc,
      [variableId]: Array.isArray(where[variableId])
        ? where[variableId]
        : [where[variableId]],
    }),
    {}
  )
}

export function sanitizeWhere(
  schema: Schema,
  where: QueryWhereInput
): QueryWhere | null {
  const _where = fmtWhere(where)

  const whereVarIds = Object.keys(_where)

  if (whereVarIds.length === 0) {
    return null
  }

  whereVarIds.forEach((varId) => {
    const variable = schema.variables[varId]

    if (!Boolean(variable)) {
      throw new Error(`Invalid where variableId: ${varId}`)
    }

    if (variable.type !== 'categorical') {
      throw new Error(
        `Where variable id must be categorical. Found: ${varId} - ${variable.type}`
      )
    }

    if (variable.noWhere) {
      throw new Error(`Where operation on variable not allowed: ${varId}`)
    }

    const targetValues = _where[varId]

    targetValues.forEach((targetValue) => {
      if (typeof targetValue !== 'string') {
        throw new TypeError(
          `targetValue must be of type string, found ${typeof targetValue}`
        )
      }
    })
  })

  return _where
}

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

  _groupBy.forEach((variableId) => {
    const variable = schema.variables[variableId]

    if (typeof variableId !== 'string') {
      throw new TypeError('groupBy variableId must be of type string')
    }

    if (!variable) {
      throw new Error(`Invalid groupby: ${variableId}`)
    }

    if (variable.type !== 'categorical') {
      throw new Error(
        `groupby variableID must be categorical. Fount: ${variableId} - ${variable.type}`
      )
    }

    if (variable.noGroupBy) {
      throw new Error(`groupby operation not allowed on ${variableId}`)
    }
  })

  return _groupBy
}

export function sanitizeQueryParams(
  schema: Schema,
  params: QueryParamsInput
): QueryParams {
  const { select, from, where, groupBy } = params

  return {
    select: sanitizeSelect(schema, select),
    from: sanitizeFrom(schema, from),
    where: where ? sanitizeWhere(schema, where) : null,
    groupBy: groupBy ? sanitizeGroupBy(schema, groupBy) : null,
    orderBy: null
  }
}
