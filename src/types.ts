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

export type DataSource = {
  id: string
  source: string
  label?: string
}

export type DataSourceList = {
  [key: string]: DataSource
}

type Expression = {
  id: string
  expression: string
  label?: string
}

export type ExpressionListInput = {
  [key: string]:
    | string
    | {
        id?: string
        label?: string
        expression: string
      }
}

export type ExpressionList<TExpType = Expression> = {
  [key: string]: TExpType
}

export type ValueExpression = Expression
export type ValueExpressionList = ExpressionList<ValueExpression>

export type WhereExpression = Expression
export type WhereExpressionList = ExpressionList<WhereExpression>

export type GroupByExpression = Expression
export type GroupByExpressionList = ExpressionList<GroupByExpression>

export type OrderByExpression = Expression
export type OrderByExpressionList = ExpressionList<GroupByExpression>

export type Schema = {
  variables: VariableList
  dataSources: DataSourceList
  valueExpressions: ValueExpressionList
  whereExpressions: WhereExpressionList
  groupByExpressions: GroupByExpressionList
  orderByExpressions: OrderByExpressionList
  limit: number
}

export type SchemaInput = {
  variables: VariableList
  dataSources: DataSourceList
  valueExpressions?: ExpressionListInput
  whereExpressions?: ExpressionListInput
  groupByExpressions?: ExpressionListInput
  orderByExpressions?: ExpressionListInput
  limit?: number
}

export type QuerySelect = string[]
export type QuerySelectInput = string | QuerySelect

export type QueryFrom = string

export type QueryGroupBy = string[]
export type QueryGroupByInput = string | QueryGroupBy

export type QueryWhere = {
  [key: string]: string[]
}
export type QueryWhereInput = {
  [key: string]: string | string[]
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
