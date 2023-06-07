import {
  Schema,
  QueryParams,
  QuerySelect,
  SchemaInput,
  QueryParamsInput,
  QueryFrom,
  QueryWhere,
  QueryGroupBy,
  QueryOrderBy,
} from './types'
import { sanitizeQueryParams } from './sanitize'
import { fmtSchema } from './schema'

export function buildSelect(schema: Schema, select: QuerySelect): string {
  const statements = select.map((expressionId) => {
    const valueExpression = schema.valueExpressions[expressionId]

    return `(${valueExpression.expression}) as ${valueExpression.id}`
  })
  return `SELECT ${statements.join(', ')}`
}

export function buildFrom(schema: Schema, from: QueryFrom): string {
  return `FROM ${schema.dataSources[from].source}`
}

export function buildWhere(schema: Schema, where: QueryWhere): string {
  const statements = Object.keys(where).map((expressionId) => {
    const whereExpression = schema.whereExpressions[expressionId]

    return `(${whereExpression})`
  })

  return `WHERE ${statements.join(' AND ')}`
}

export function buildGroupBy(schema: Schema, groupBy: QueryGroupBy): string {
  const statements = groupBy.map((expId) => {
    const groupByExpression = schema.groupByExpressions[expId]

    return groupByExpression.expression
  })
  return `GROUP BY ${statements.join(', ')}`
}

export function buildOrderBy(schema: Schema, orderBy: QueryOrderBy): string {
  const statements = orderBy.map((expId) => {
    const orderByExpression = schema.orderByExpressions[expId]

    return orderByExpression.expression
  })

  return `ORDER BY ${statements.join(', ')}`
}

export function buildLimit(schema: Schema): string {
  return `LIMIT ${schema.limit}`
}

export function buildQuery(
  schemaInput: SchemaInput,
  paramsInput: QueryParamsInput
): string {
  const schema = fmtSchema(schemaInput)
  const params = sanitizeQueryParams(schema, paramsInput)

  const SELECT = buildSelect(schema, params.select)
  const FROM = buildFrom(schema, params.from)
  const WHERE = params.where ? buildWhere(schema, params.where) : null
  const GROUP_BY = params.groupBy ? buildGroupBy(schema, params.groupBy) : null
  const ORDER_BY = params.orderBy ? buildOrderBy(schema, params.orderBy) : null
  const LIMIT = buildLimit(schema)

  return [SELECT, FROM, WHERE, GROUP_BY, ORDER_BY, LIMIT]
    .filter(Boolean)
    .join(' ')
}
