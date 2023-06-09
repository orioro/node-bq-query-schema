import { ExpressionList, ExpressionListInput } from '../types'

export function fmtExpressionList<TExpType>(
  input: ExpressionListInput
): ExpressionList<TExpType> {
  return Object.keys(input).reduce((acc, id) => {
    const expInput = input[id]
    const value =
      typeof expInput === 'string' ? expInput : expInput.value
    const label = typeof expInput === 'string' ? id : expInput.label || id

    if (id === 'distinctWordCount') {
      console.log(expInput)
    }

    return {
      ...acc,
      [id]: {
        id,
        label,
        value,
        ...(typeof expInput === 'object' ? expInput : {}),
      },
    }
  }, {})
}
