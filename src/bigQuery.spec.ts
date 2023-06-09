//
// https://googleapis.dev/nodejs/bigquery/latest/index.html
//
import dotenv from 'dotenv'
import { BigQuery } from '@google-cloud/bigquery'
import { runQuery } from './bigQuery'

dotenv.config()

test('runQuery', () => {
  return runQuery({
    client: new BigQuery(),
    schema: {
      dataSources: {
        shakespeare: 'bigquery-public-data.samples.shakespeare',
      },
      valueExpressions: {
        customExp: {
          value: 'word_count / 100',

          type: 'continuous',
        },
      },
      variables: {
        corpus: {
          type: 'categorical',
        },
        word: {
          type: 'categorical',
        },
        word_count: {
          type: 'continuous',
        },
      },
    },
    params: {
      from: 'shakespeare',
      select: [
        'corpus',
        'customExp',
      ],
      where: {
        customExp_gte: 5,
      },
      orderBy: 'customExp'
    },
  }).then(([data]) => {
    console.log(data)
  })
})
