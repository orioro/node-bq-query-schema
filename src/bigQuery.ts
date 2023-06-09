//
// https://googleapis.dev/nodejs/bigquery/latest/index.html
//
import { buildQuery } from './buildQuery'
import { QueryParamsInput, SchemaInput } from './types'

export function queryJobOptions(schema: SchemaInput, params: QueryParamsInput) {
  return {
    query: buildQuery(schema, params),

    // Only the where params are used in bigQuery
    params: params.where,
  }
}

export async function runQuery({
  client,
  schema,
  params,
  ...opts
}: {
  client: any
  schema: SchemaInput
  params: QueryParamsInput
}) {
  const [job] = await client.createQueryJob({
    ...queryJobOptions(schema, params),
    ...opts,
  })

  const result = await job.getQueryResults()

  return result
}
