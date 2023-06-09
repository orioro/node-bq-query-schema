import { SchemaInput } from '../types'
import { buildQuery } from './index'

describe('buildQuery', () => {
  test('minimal', () => {
    const schema: SchemaInput = {
      dataSources: {
        sourceA: 'sourceA.tableId',
      },
      variables: {
        varA: {
          type: 'categorical',
        },
      },
    }
    const params = {
      select: 'varA',
      from: 'sourceA',
    }

    const query = buildQuery(schema, params)

    expect(query).toEqual(
      'SELECT (varA) as `varA` FROM `sourceA.tableId` LIMIT 1000'
    )
  })
})

describe('buildQuery', () => {
  const schema: SchemaInput = {
    dataSources: {
      sourceA: 'sourceA.tableId',
      sourceB: 'sourceB.tableId',
      sourceC: 'sourceC.tableId',
    },
    valueExpressions: {
      count: 'count(*)',
    },
    variables: {
      varA: {
        type: 'categorical',
      },
      varB: {
        type: 'categorical',
      },
      varC: {
        type: 'continuous',
      },
    },
  }

  test('select multiple variables', () => {
    expect(
      buildQuery(schema, {
        select: ['varA', 'varC', 'count'],
        from: 'sourceB',
      })
    ).toEqual(
      'SELECT (varA) as `varA`, (varC) as `varC`, (count(*)) as `count` FROM `sourceB.tableId` LIMIT 1000'
    )
  })

  test('where', () => {
    expect(
      buildQuery(schema, {
        select: ['varA', 'varC'],
        from: 'sourceB',
        where: {
          varA_in: ['valueAA', 'valueAB'],
          varC_in: [10, 20],
        }
      })
    ).toEqual(
      [
        'SELECT (varA) as `varA`, (varC) as `varC`',
        'FROM `sourceB.tableId`',
        'WHERE (varA IN UNNEST (@varA_in)) AND (varC IN UNNEST (@varC_in))',
        'LIMIT 1000'
      ].join(' ')
    )
  })

  test('groupBy', () => {
    expect(
      buildQuery(schema, {
        select: ['count'],
        from: 'sourceB',
        groupBy: ['varB']
      })
    ).toEqual(
      'SELECT (count(*)) as `count` FROM `sourceB.tableId` GROUP BY `varB` LIMIT 1000'
    )
  })

  test('orderBy', () => {
    expect(
      buildQuery(schema, {
        select: ['varA', 'varB'],
        from: 'sourceB',
        orderBy: ['varB']
      })
    ).toEqual(
      'SELECT (varA) as `varA`, (varB) as `varB` FROM `sourceB.tableId` ORDER BY `varB` LIMIT 1000'
    )
  })
})
