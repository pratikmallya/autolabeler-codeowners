var randomColor = require('randomcolor');

export type Label = {
  name: string
  color: string
}

export async function getLabelsFromOwners(owners: Set<string>) {
  let labels: Label[] = []
  for  (let owner in owners) {
    labels.push({
      name: `codeowner-${owner}`,
      color: randomColor(),
    })
  }
  return labels
}
