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
} from './types'
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

export function fmtExpressionList<TExpType>(
  input: ExpressionListInput
): ExpressionList<TExpType> {
  return Object.keys(input).reduce((acc, id) => {
    const expInput = input[id]
    const expression = typeof expInput === 'string'
      ? expInput
      : expInput.expression
    const label = typeof expInput === 'string'
      ? id
      : expInput.label || id

    return {
      ...acc,
      [id]: {
        id,
        label,
        expression,
        ...(typeof expInput === 'object' ? expInput : {})
      },
    }
  }, {})
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

function fmtExpressionListFromVariables<TExpType>(
  [test, fmtExpression]: [
    (variables: VariableList, varId: string) => boolean,
    (variables: VariableList, varId: string) => TExpType
  ],
  variables: VariableList,
  base?: ExpressionListInput
): ExpressionList<TExpType> {
  return Object.keys(variables).reduce(
    (acc, varId) =>
      Boolean(acc[varId]) || !test(variables, varId)
        ? acc
        : {
            ...acc,
            [varId]: fmtExpression(variables, varId),
          },
    base ? fmtExpressionList<TExpType>(base) : {}
  )
}

export const fmtValueExpressions = fmtExpressionListFromVariables.bind(null, [
  (variables, varId) => !variables[varId].noSelect,
  (variables, varId) => {
    return {
      id: varId,
      label: variables[varId].label,
      expression: varId,
    }
  },
])

export const fmtWhereExpressions = fmtExpressionListFromVariables.bind(null, [
  (variables, varId) => {
    const { type, noWhere } = variables[varId]
    return type === 'categorical' && !Boolean(noWhere)
  },
  (variables, varId) => ({
    id: varId,
    label: variables[varId].label,
    expression: `${varId} IN UNNEST(@${varId})`,
  }),
])

export const fmtGroupByExpressions = fmtExpressionListFromVariables.bind(null, [
  (variables, varId) => !variables[varId].noGroupBy,
  (variables, varId) => {
    return {
      id: varId,
      label: variables[varId].label,
      expression: varId,
    }
  },
])

export const fmtOrderByExpressions = fmtExpressionListFromVariables.bind(null, [
  (variables, varId) => !variables[varId].noOrderBy,
  (variables, varId) => {
    return {
      id: varId,
      label: variables[varId].label,
      expression: varId,
    }
  },
])

export function fmtSchema(schemaInput: SchemaInput): Schema {
  if (!isPlainObject(schemaInput)) {
    throw new TypeError('Schema must be a plain object')
  }

  const variables = fmtVariableList(schemaInput.variables)

  return {
    ...schemaInput,
    variables,
    valueExpressions: fmtValueExpressions(
      schemaInput,
      schemaInput.valueExpressions
    ),
    whereExpressions: fmtWhereExpressions(
      schemaInput,
      schemaInput.whereExpressions
    ),
    groupByExpressions: fmtGroupByExpressions(
      schemaInput,
      schemaInput.groupByExpressions
    ),
    orderByExpressions: fmtOrderByExpressions(
      schemaInput,
      schemaInput.orderByExpressions
    ),
    limit: typeof schemaInput.limit === 'number' ? schemaInput.limit : 1000,
  }
}
