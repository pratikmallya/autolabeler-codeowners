import {getLabelsFromOwners} from '../src/getLabelsFromOwners'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {Label} from '../src/getLabelsFromOwners'

test('labels names are same as owners', async () => {
  const rest = await getLabelsFromOwners(["@Org/kelsey", "@gatsby"])
  expect(Set(rest)).toEqual(Set(["@Org/kelsey", "@gatsby"]))
})
