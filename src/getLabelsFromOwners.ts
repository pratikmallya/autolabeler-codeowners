import randomColor from 'randomcolor'

export interface Label {
  name: string
  color: string
}

export async function getLabelsFromOwners(
  owners: Set<string>
): Promise<Label[]> {
  const labels: Label[] = []
  for (const owner in owners) {
    labels.push({
      name: `${owner}`,
      color: randomColor()
    })
  }
  return labels
}
