import * as PUBLIC_API from './'
import { testCases } from '@orioro/jest-util'

test.skip('public api', () => {
  expect(Object.keys(PUBLIC_API)).toMatchSnapshot()
})

// describe('tests', () => {
//   testCases([['parameter', 'output "parameter"']], bqQuerySchema)
// })
