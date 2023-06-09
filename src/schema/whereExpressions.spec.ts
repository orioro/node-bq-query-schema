import { fmtVariableList } from './variables'
import { fmtValueExpressions } from './valueExpressions'
import { fmtWhereExpressions } from './whereExpressions'

describe('fmtWhereExpressions', () => {
  const categorical = fmtVariableList({
    varA: {
      type: 'categorical',
      options: [{ value: 'valueA', label: 'Value A' }],
    },
  })
  const continuous = fmtVariableList({
    varB: { type: 'continuous' },
  })

  const expected = {
    categoricalExpIds: ['varA_eq', 'varA_notEq', 'varA_in', 'varA_notIn'],
    continuousExpIds: [
      'varB_eq',
      'varB_notEq',
      'varB_in',
      'varB_notIn',
      'varB_gt',
      'varB_lt',
      'varB_gte',
      'varB_lte',
    ],
  }

  test('categorical', () => {
    const expressions = fmtWhereExpressions(
      {},
      fmtValueExpressions({}, categorical)
    )

    expect(Object.keys(expressions)).toEqual(
      expect.arrayContaining(expected.categoricalExpIds)
    )
    expect(Object.keys(expressions)).toHaveLength(
      expected.categoricalExpIds.length
    )

    expect(expressions).toMatchObject({
      varA_eq: { value: 'varA = (@varA_eq)' },
      varA_notEq: { value: 'varA != (@varA_notEq)' },
      varA_in: { value: 'varA IN UNNEST (@varA_in)' },
      varA_notIn: { value: 'varA NOT IN UNNEST (@varA_notIn)' },
    })
  })

  test('continuous', () => {
    const expressions = fmtWhereExpressions(
      {},
      fmtValueExpressions({}, continuous)
    )

    expect(Object.keys(expressions)).toEqual(
      expect.arrayContaining(expected.continuousExpIds)
    )
    expect(Object.keys(expressions)).toHaveLength(
      expected.continuousExpIds.length
    )

    expect(expressions).toMatchObject({
      varB_eq: { value: 'varB = (@varB_eq)' },
      varB_notEq: { value: 'varB != (@varB_notEq)' },
      varB_in: { value: 'varB IN UNNEST (@varB_in)' },
      varB_notIn: { value: 'varB NOT IN UNNEST (@varB_notIn)' },
      varB_gt: { value: 'varB > (@varB_gt)' },
      varB_lt: { value: 'varB < (@varB_lt)' },
      varB_gte: { value: 'varB >= (@varB_gte)' },
      varB_lte: { value: 'varB <= (@varB_lte)' },
    })
  })

  test('with base value', () => {
    const valueExpressions = fmtWhereExpressions(
      {
        custom_sum_gt: {
          type: 'continuous',
          value: 'SUM(varB) + SUM(varA) > @custom_sum_gt',
        },
      },
      fmtValueExpressions(
        {},
        {
          ...categorical,
          ...continuous,
        }
      )
    )

    expect(Object.keys(valueExpressions)).toEqual(
      expect.arrayContaining([
        ...expected.categoricalExpIds,
        ...expected.continuousExpIds,
        'custom_sum_gt',
      ])
    )
    expect(Object.keys(valueExpressions)).toHaveLength(
      [...expected.categoricalExpIds, ...expected.continuousExpIds].length + 1
    )

    expect(valueExpressions.custom_sum_gt).toEqual({
      id: 'custom_sum_gt',
      label: 'custom_sum_gt',
      value: 'SUM(varB) + SUM(varA) > @custom_sum_gt',
      type: 'continuous',
    })
  })
})
