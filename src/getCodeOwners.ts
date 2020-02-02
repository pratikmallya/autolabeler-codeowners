import { Context } from '@actions/github/lib/context'
import Codeowners from 'codeowners';
    
export async function getCodeOwnersFromPaths(paths: string[]) {
  const repos = new Codeowners();
  let owners: Set<string> = new Set
  for (let path in paths) {
    let owner = repos.getOwner(path)
    for (let o in owner) {
      owners.add(o)
    }
  }
  return owners
}


