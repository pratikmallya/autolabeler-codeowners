import { Context } from '@actions/github/lib/context'
import * as github from '@actions/github'
import { Label } from './getLabelsFromOwners'

export async function applyLabels(context: Context, octokit: github.GitHub, labels: Label[]) {
  // create labels if they don't exist
  let p: Promise<any>[] = []
  for (let label of labels) {
    p.push(octokit.issues.createLabel({
      owner: context.issue.owner,
      repo: context.issue.repo,
      name: label.name,
      color: label.color,
    })
    )
  }

  // TODO: ignore errors on duplicate label creation 
  // curl -v -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/pratikmallya/test/labels -d '{"name":"humbug1"}'
  // HTTP/1.1 422 Unprocessable Entity
  await Promise.all(p)
  p = []

  // apply labels to the PR
  return octokit.issues.addLabels({
      owner: context.issue.owner,
      repo: context.issue.repo,
      issue_number: context.issue.number,
      labels: labels.map(elem => elem.name),
    })

}
