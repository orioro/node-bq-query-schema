import {
  CategoricalVariable,
  ExpressionList,
  ExpressionListInput,
  Option,
  OptionInput,
  Schema,
  SchemaInput,
  ValueExpressionList,
  Variable,
  VariableInput,
  VariableList,
  VariableListInput,
} from '../types'
import { isPlainObject } from 'lodash'

export function fmtOption(optionInput: OptionInput): Option {
  const option =
    typeof optionInput === 'string'
      ? { value: optionInput, label: optionInput }
      : optionInput

  return {
    ...option,
    label: option.label || option.value,
  }
}

function fmtVariable(variable: Variable): Variable | CategoricalVariable {
  switch (variable.type) {
    case 'categorical': {
      return {
        ...variable,
        options: Array.isArray(variable.options)
          ? variable.options.map((option) => fmtOption(option))
          : [],
      }
    }
    case 'continuous': {
      return variable
    }
    default: {
      throw new Error(`Invalid variable type ${variable.type}`)
    }
  }
}

export function fmtVariableList(
  variablesInput: VariableListInput
): VariableList {
  return Object.keys(variablesInput).reduce((acc, variableId) => {
    const variableBase = {
      id: variableId,
      label: variablesInput[variableId].label || variableId,
      ...variablesInput[variableId],
    }

    return {
      ...acc,
      [variableId]: fmtVariable(variableBase),
    }
  }, {})
}
