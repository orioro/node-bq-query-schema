import { DataSourceExpression, Schema, SchemaInput } from '../types'

import { isPlainObject } from 'lodash'

import { fmtExpressionList } from './util'
import { fmtVariableList } from './variables'
import { fmtValueExpressions } from './valueExpressions'
import { fmtWhereExpressions } from './whereExpressions'
import { fmtOrderByExpressions } from './orderByExpressions'

export function fmtSchema(schemaInput: SchemaInput): Schema {
  if (!isPlainObject(schemaInput)) {
    throw new TypeError('Schema must be a plain object')
  }

  const variables = fmtVariableList(schemaInput.variables)
  const valueExpressions = fmtValueExpressions(
    schemaInput.valueExpressions,
    variables
  )
  const whereExpressions = fmtWhereExpressions(
    schemaInput.whereExpressions,
    valueExpressions
  )
  const orderByExpressions = fmtOrderByExpressions(valueExpressions)

  return {
    ...schemaInput,
    variables,
    valueExpressions,
    dataSources: fmtExpressionList<DataSourceExpression>(
      schemaInput.dataSources
    ),
    whereExpressions,
    orderByExpressions,
    limit: typeof schemaInput.limit === 'number' ? schemaInput.limit : 1000,
  }
}
