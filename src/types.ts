export type VariableId = string

export type VariableType = 'categorical' | 'continuous'
export type Variable = {
  id: VariableId
  type: VariableType
  label?: string
  noSelect?: boolean
  noWhere?: boolean
  noGroupBy?: boolean
  noOrderBy?: boolean
  [key: string]: any
}

export type Option = {
  label?: string
  value: string
  [key: string]: any
}

export type OptionInput = string | Option

export type CategoricalVariable = Variable & {
  type: 'categorical'
  options: Option[]
}

export type VariableList = {
  [key: string]: Variable | CategoricalVariable
}

export type VariableInput =
  | {
      type: VariableType
      label?: string
      noSelect?: boolean
      noWhere?: boolean
      noGroupBy?: boolean
      noOrderBy?: boolean
    }
  | Variable
  | CategoricalVariable

export type VariableListInput = {
  [key: string]: VariableInput
}

type Expression = {
  id: string
  value: string
  type: VariableType
  label?: string
  auto?: boolean
  [key: string]: any
}

export type ExpressionListInput = {
  [key: string]:
    | string
    | {
        id?: string
        label?: string
        value: string
        type: VariableType
      }
}

export type ExpressionList<TExpType = Expression> = {
  [key: string]: TExpType
}

//
// SELECT
//
export type ValueExpression = Expression
export type ValueExpressionList = ExpressionList<ValueExpression>

//
// FROM
//
export type DataSourceExpression = Expression
export type DataSourceExpressionList = ExpressionList<DataSourceExpression>

export type WhereExpression = Expression
export type WhereExpressionList = ExpressionList<WhereExpression>

export type GroupByExpression = Expression
export type GroupByExpressionList = ExpressionList<GroupByExpression>

export type OrderByExpression = Expression
export type OrderByExpressionList = ExpressionList<GroupByExpression>

export type Schema = {
  variables: VariableList
  dataSources: DataSourceExpressionList
  valueExpressions: ValueExpressionList
  whereExpressions: WhereExpressionList
  limit: number
}

export type SchemaInput = {
  variables: VariableListInput
  dataSources: ExpressionListInput
  valueExpressions?: ExpressionListInput
  whereExpressions?: ExpressionListInput
  limit?: number
}

export type QuerySelect = string[]
export type QuerySelectInput = string | QuerySelect

export type QueryFrom = string

export type QueryGroupBy = string[]
export type QueryGroupByInput = string | QueryGroupBy

export type QueryWhere = {
  [key: string]: string | string[] | number | number[]
}
export type QueryWhereInput = {
  [key: string]: string | string[] | number | number[]
}

export type QueryOrderBy = string[]
export type QueryOrderByInput = string | QueryOrderBy

export type QueryParams = {
  select: QuerySelect
  from: QueryFrom
  where: QueryWhere | null
  groupBy: QueryGroupBy | null
  orderBy: QueryOrderBy | null
}
export type QueryParamsInput = {
  select: QuerySelectInput
  from: QueryFrom
  where?: QueryWhereInput
  groupBy?: QueryGroupByInput
  orderBy?: QueryOrderByInput
}
