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
        'count_all',
      ])
    )
    expect(expIds).toHaveLength(8)
  })

  test('with base value', () => {
    const valueExpressions = fmtValueExpressions(
      {
        varBBy100: {
          type: 'continuous',
          value: 'varB / 100',
        },
      },
      variables
    )

    expect(Object.keys(valueExpressions)).toEqual([
      'count_all',
      'varA',
      'varB',
      'varB_sum',
      'varB_avg',
      'varB_min',
      'varB_max',
      'varC',
      'varBBy100',
    ])

    expect(valueExpressions.varBBy100).toEqual({
      id: 'varBBy100',
      label: 'varBBy100',
      type: 'continuous',
      value: 'varB / 100',
    })
  })
})
