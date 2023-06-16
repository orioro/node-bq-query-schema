import { fmtVariableList } from './variables'

describe('fmtVariableList', () => {
  test('basic', () => {
    expect(
      fmtVariableList({
        varA: { type: 'categorical' },
        varB: { type: 'continuous' },
        varC: {
          type: 'categorical',
        },
        varD: 'continuous',
      })
    ).toEqual({
      varA: {
        id: 'varA',
        label: 'varA',
        type: 'categorical',
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
      },
      varD: {
        id: 'varD',
        label: 'varD',
        type: 'continuous',
      },
    })
  })
})
