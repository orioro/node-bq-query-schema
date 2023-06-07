import {
  fmtSchema,
  fmtValueExpressions,
  fmtVariableList,
  fmtWhereExpressions,
} from './schema'
import { VariableList } from './types'

const variables: VariableList = {
  varA: {
    id: 'varA',
    label: 'Variable A',
    type: 'categorical',
    options: [{ value: 'valueA' }, { value: 'valueB' }, { value: 'valueC' }],
  },
  varB: {
    id: 'varB',
    label: 'Variable B',
    type: 'categorical',
    options: [{ value: 'valueA' }, { value: 'valueB' }, { value: 'valueC' }],
  },
  varC: {
    id: 'varC',
    type: 'continuous',
  },
  varE: {
    id: 'varE',
    type: 'categorical',
    noSelect: true,
  },
  varF: {
    id: 'varF',
    type: 'categorical',
    noWhere: true,
  },
  varG: {
    id: 'varG',
    type: 'categorical',
    noGroupBy: true,
  },
  varH: {
    id: 'varH',
    type: 'categorical',
    noOrderBy: true,
  },
}

const dataSources = {
  sourceA: {
    id: 'sourceA',
    label: 'sourceA',
    source: 'source',
  },
}

describe('fmtVariableList', () => {
  test('basic', () => {
    expect(
      fmtVariableList({
        varA: { type: 'categorical' },
        varB: { type: 'continuous' },
        varC: {
          type: 'categorical',
          options: [{ value: 'valueA', label: 'Value A' }],
        },
      })
    ).toEqual({
      varA: {
        id: 'varA',
        label: 'varA',
        type: 'categorical',
        options: [],
      },
      varB: {
        id: 'varB',
        label: 'varB',
        type: 'continuous',
      },
      varC: {
        id: 'varC',
        label: 'varC',
        type: 'categorical',
        options: [{ value: 'valueA', label: 'Value A' }],
      },
    })
  })
})

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
    const valueExpressions = fmtValueExpressions(variables)

    expect(Object.keys(valueExpressions)).toEqual(['varA', 'varB', 'varC'])

    expect(valueExpressions).toMatchObject({
      varA: {
        id: 'varA',
        expression: 'varA',
      },
      varB: {
        id: 'varB',
        expression: 'varB',
      },
      varC: {
        id: 'varC',
        expression: 'varC',
      },
    })
  })

  test('with base value', () => {
    const valueExpressions = fmtValueExpressions(variables, {
      count_total: {
        expression: 'count(*)',
      },
    })

    expect(Object.keys(valueExpressions)).toEqual([
      'count_total',
      'varA',
      'varB',
      'varC',
    ])

    expect(valueExpressions.count_total).toEqual({
      id: 'count_total',
      label: 'count_total',
      expression: 'count(*)'
    })
  })
})

describe.skip('fmtWhereExpressions', () => {
  test('whereExpressions', () => {
    const whereExpressions = fmtWhereExpressions(variables)

    expect(Object.keys(whereExpressions)).toEqual([
      'varA',
      'varB',
      // 'varC',
    ])

    expect(whereExpressions).toMatchObject({
      varA: {
        id: 'varA',
        expression: 'varA IN UNNEST(@varA)',
      },
      varB: {
        id: 'varB',
        expression: 'varB IN UNNEST(@varB)',
      },
    })
  })
})
