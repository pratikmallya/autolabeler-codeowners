import {Context} from '@actions/github/lib/context'
import * as github from '@actions/github'
import * as oktorest from '@octokit/rest'
import {Label} from './getLabelsFromOwners'

export async function applyLabels(
  context: Context,
  octokit: github.GitHub,
  labels: Label[]
): Promise<oktorest.Response<oktorest.IssuesAddLabelsResponse>> {
  // create labels if they don't exist
  const p: Promise<oktorest.Response<oktorest.IssuesCreateLabelResponse>>[] = []
  try {
    for (const label of labels) {
      p.push(
        octokit.issues.createLabel({
          owner: context.issue.owner,
          repo: context.issue.repo,
          name: label.name,
          color: label.color
        })
      )
    }
    await Promise.all(p)
  } catch (error) {
    // if 422, label already exists
    if (error.status !== 422) {
      throw error
    }
  }

  // apply labels to the PR
  return octokit.issues.addLabels({
    owner: context.issue.owner,
    repo: context.issue.repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    issue_number: context.issue.number,
    labels: labels.map(elem => elem.name)
  })
}
