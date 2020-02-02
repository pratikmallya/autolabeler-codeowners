import Codeowners from 'codeowners'

export async function getCodeOwnersFromPaths(
  paths: string[]
): Promise<Set<string>> {
  const repos = new Codeowners()
  const owners: Set<string> = new Set()
  for (const path of paths) {
    const owner = repos.getOwner(path)
    for (const o of owner) {
      owners.add(o)
    }
  }
  return owners
}
