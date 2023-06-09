import {
  fmtVariableList,
} from './variables'
import { VariableList } from '../types'

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

