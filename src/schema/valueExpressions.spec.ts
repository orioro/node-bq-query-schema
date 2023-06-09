import { fmtVariableList } from './variables'
import { fmtValueExpressions } from './valueExpressions'

describe('fmtValueExpressions', () => {
  const variables = fmtVariableList({
    varA: { type: 'categorical' },
    varB: { type: 'continuous' },
    varC: {
      type: 'categorical',
      options: [{ value: 'valueA', label: 'Value A' }],
    },
  })

  test('basic', () => {
    const expressions = fmtValueExpressions({}, variables)
    const expIds = Object.keys(expressions)

    expect(expIds).toEqual(
      expect.arrayContaining([
        'varA',
        'varB',
        'varB_sum',
        'varB_avg',
        'varB_min',
        'varB_max',
        'varC',
      ])
    )
    expect(expIds).toHaveLength(7)
  })

  test('with base value', () => {
    const valueExpressions = fmtValueExpressions(
      {
        count_total: {
          type: 'continuous',
          value: 'count(*)',
        },
      },
      variables
    )

    expect(Object.keys(valueExpressions)).toEqual([
      'count_total',
      'varA',
      'varB',
      'varB_sum',
      'varB_avg',
      'varB_min',
      'varB_max',
      'varC',
    ])

    expect(valueExpressions.count_total).toEqual({
      id: 'count_total',
      label: 'count_total',
      value: 'count(*)',
      type: 'continuous',
    })
  })
})
