import { OrderByExpressionList, ValueExpressionList } from '../types'
import { pick } from 'lodash'

export function fmtOrderByExpressions(
  valueExpressions: ValueExpressionList
): OrderByExpressionList {
  return Object.keys(valueExpressions)
    .filter((key) => !valueExpressions[key].noOrderBy)
    .reduce(
      (acc, valueExpressionId) => ({
        ...acc,
        [valueExpressionId]: {
          id: valueExpressionId,
          label: `${valueExpressions[valueExpressionId].label} ASC`,
          value: `\`${valueExpressions[valueExpressionId].id}\` ASC`
        },
        [`${valueExpressionId}_desc`]: {
          id: `${valueExpressionId}_desc`,
          label: `${valueExpressions[valueExpressionId].label} DESC`,
          value: `\`${valueExpressions[valueExpressionId].id}\` DESC`,
        },
      }),
      {}
    )
}
