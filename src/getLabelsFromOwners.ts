import randomColor from 'randomcolor'

export interface Label {
  name: string
  color: string
}

export async function getLabelsFromOwners(
  owners: Set<string>
): Promise<Label[]> {
  let labels: Label[] = []
  for (const owner of owners) {
    labels.push({
      name: `${owner}`,
      color: randomColor()
    })
  }
  return labels
}
