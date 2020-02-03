import {getLabelsFromOwners} from '../src/getLabelsFromOwners'
import {Label} from '../src/getLabelsFromOwners'

test('labels names are same as owners', async () => {
  expect.assertions(6)
  const inpset: Set<string> = new Set(['@Org/kelsey', '@gatsby'])
  const labels: Set<Label> = await getLabelsFromOwners(inpset)
  expect(labels).toBeDefined()
  expect(labels.size).toBe(2)
  for (const label of labels) {
    expect(inpset.has(label.name)).toBeTruthy()
    expect(isHexadecimal(label.color)).toBeTruthy()
  }
})

function isHexadecimal(input: string): boolean {
  let regexp = /^[0-9a-fA-F]+$/
  if (regexp.test(input)) {
    return true
  }
  return false
}
