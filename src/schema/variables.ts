import {
  Variable,
  VariableInput,
  VariableList,
  VariableListInput,
} from '../types'

function fmtVariable(
  variableId: string,
  variableInput: VariableInput
): Variable {
  return (
    typeof variableInput === 'string'
      ? {
          id: variableId,
          label: variableId,
          type: variableInput,
        }
      : {
          ...(variableInput as { [key: string]: string }),
          id: variableId,
          label: variableInput.label || variableId,
        }
  ) as Variable
}

export function fmtVariableList(
  variablesInput: VariableListInput
): VariableList {
  return Object.keys(variablesInput).reduce((acc, variableId) => {
    return {
      ...acc,
      [variableId]: fmtVariable(variableId, variablesInput[variableId]),
    }
  }, {})
}
