import { Alternative, cascadeFilter, test } from '@orioro/cascade'
import type {
  ExpressionList,
  ExpressionListInput,
  ValueExpression,
  Variable,
  VariableList,
} from '../types'
import { fmtExpressionList } from './util'
import { pick } from 'lodash'

const VARIABLE_TRANSFER_PROPS = [
  // 'noSelect',
  'type',
  'noWhere',
  'noGroupBy',
  'noOrderBy',
]

type PlainObj = {
  [key: string]: any
}

function _exp(
  suffix: string,
  value: (variable: Variable) => string,
  opts: PlainObj = {}
) {
  return function (variable: Variable): ValueExpression {
    const expId = `${variable.id}_${suffix}`

    return {
      id: expId,
      value: value(variable),
      ...pick(variable, VARIABLE_TRANSFER_PROPS),
      ...opts,
    }
  }
}

const COMMON: Alternative[] = [
  (variable) => ({
    id: variable.id,
    value: variable.id,
    ...pick(variable, VARIABLE_TRANSFER_PROPS),
  }),
].map((fmt) => [(variable) => !variable.noSelect, fmt])

const CONTINUOUS: Alternative[] = [
  _exp('sum', (variable) => `SUM(${variable.id})`, {
    noWhere: true,
  }),
  _exp('avg', (variable) => `AVG(${variable.id})`, {
    noWhere: true,
  }),
  _exp('min', (variable) => `MIN(${variable.id})`, {
    noWhere: true,
  }),
  _exp('max', (variable) => `MAX(${variable.id})`, {
    noWhere: true,
  }),
].map((fmt) => [
  (variable) => !variable.noSelect && variable.type === 'continuous',
  fmt,
])

const EXPRESSION_FORMATTERS: Alternative[] = [...COMMON, ...CONTINUOUS]

function _variableExpressions(variables: VariableList) {
  const valueExpressions = Object.keys(variables).reduce(
    (acc, varId) => [
      ...acc,
      ...cascadeFilter(test, EXPRESSION_FORMATTERS, variables[varId]).map(
        (fmt) => fmt(variables[varId])
      ),
    ],
    []
  )

  return valueExpressions.reduce(
    (acc, exp) => ({
      ...acc,
      [exp.id]: exp,
    }),
    {}
  )
}

function _commonExpressions() {
  return {
    count_all: {
      id: 'count_all',
      value: 'count(*)',
      type: 'continuous',
      noWhere: true,
    },
  }
}

export function fmtValueExpressions(
  base: ExpressionListInput = {},
  variables: VariableList
): ExpressionList<ValueExpression> {
  return fmtExpressionList<ValueExpression>({
    ...base,
    ..._variableExpressions(variables),
    ..._commonExpressions(),
  })
}
