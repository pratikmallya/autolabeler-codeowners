import {getLabelsFromOwners} from '../src/getLabelsFromOwners'
import {Label} from '../src/getLabelsFromOwners'

test('labels names are same as owners', async () => {
  expect.assertions(5)
  const rest: Label[] = await getLabelsFromOwners(
    new Set(['@Org/kelsey', '@gatsby'])
  )
  expect(rest).toBeDefined()
  expect(rest.length).toBe(2)
  expect(new Set([rest[0].name, rest[1].name])).toEqual(
    new Set(['@Org/kelsey', '@gatsby'])
  )
  expect(isHexadecimal(rest[0].color)).toBeTruthy()
  expect(isHexadecimal(rest[1].color)).toBeTruthy()
})

function isHexadecimal(input: string): boolean {
  let regexp = /^[0-9a-fA-F]+$/
  if (regexp.test(input)) {
    return true
  }
  return false
}
