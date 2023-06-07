import type {
  VariableId,
  QueryFilterBy,
  DataViewSchema,
} from '../../../lib/schema'

export function prepareWhere(filterBy: QueryFilterBy): string | null {
  const clauses = Object.keys(filterBy).map(
    (variableId) => `${variableId} IN UNNEST(@${variableId})`
  )

  return clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : null
}

export function prepareFrom(schema: DataViewSchema): string {
  const { projectId, datasetId, tableId } = schema.bigQuery

  return `FROM \`${projectId}.${datasetId}.${tableId}\``
}
