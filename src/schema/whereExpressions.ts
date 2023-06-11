import type {
  ExpressionListInput,
  ValueExpression,
  ValueExpressionList,
  WhereExpression,
} from '../types'
import { fmtExpressionList } from './util'
import { test, cascadeFilter, Alternative } from '@orioro/cascade'

function _exp(suffix: string, cmp: string) {
  return function (valueExp: ValueExpression) {
    const expId = `${valueExp.id}_${suffix}`

    return {
      id: expId,
      value: `${valueExp.value} ${cmp} (@${expId})`,
      valueExpression: valueExp
    }
  }
}

const COMMON_EXPS: Alternative[] = [
  _exp('eq', '='),
  _exp('notEq', '!='),
  _exp('in', 'IN UNNEST'),
  _exp('notIn', 'NOT IN UNNEST'),
].map((fmt) => [(valueExp) => !valueExp.noWhere, fmt])

const CONTINUOUS_EXPS: Alternative[] = [
  _exp('gt', '>'),
  _exp('lt', '<'),
  _exp('gte', '>='),
  _exp('lte', '<='),
].map((fmt) => [
  (valueExp) => !valueExp.noWhere && valueExp.type === 'continuous',
  fmt,
])

const EXPRESSION_FORMATTERS: Alternative[] = [
  ...COMMON_EXPS,
  ...CONTINUOUS_EXPS,
]

function _fromValueExpressions(valueExpressions: ValueExpressionList) {
  const whereExpressions = Object.keys(valueExpressions).reduce(
    (acc, valueExpressionId) => {
      return [
        ...acc,
        ...cascadeFilter(
          test,
          EXPRESSION_FORMATTERS,
          valueExpressions[valueExpressionId]
        ).map((fmt) => fmt(valueExpressions[valueExpressionId])),
      ]
    },
    []
  )

  return whereExpressions.reduce(
    (acc, expression) => ({
      ...acc,
      [expression.id]: expression,
    }),
    {}
  )
}

export function fmtWhereExpressions(
  base: ExpressionListInput = {},
  valueExpressions: ValueExpressionList
) {
  return fmtExpressionList<WhereExpression>({
    ..._fromValueExpressions(valueExpressions),
    ...base,
  })
}
