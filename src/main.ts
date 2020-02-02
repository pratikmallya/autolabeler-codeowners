import * as core from '@actions/core'
import {getChangedFiles} from './getChangedFiles'
import * as github from '@actions/github'
import {getCodeOwnersFromPaths} from './getCodeOwners'
import {getLabelsFromOwners, Label} from './getLabelsFromOwners'
import {applyLabels} from './applyLabels'

async function run(): Promise<void> {
  try {
    const client = new github.GitHub(core.getInput('githubToken'))

    // get all files changed in the PR
    const paths: string[] = await getChangedFiles(github.context, client)
    core.debug(`Obtained paths: ${paths}`)

    // files -> set of codeowners for the files
    const owners: Set<string> = await getCodeOwnersFromPaths(paths)
    core.debug(`Obtained owners for paths: ${owners}`)

    // set of codeowners -> set of labels
    const labels: Label[] = await getLabelsFromOwners(owners)
    core.debug(`Obtained labels for change: ${labels}`)

    // apply the set of labels to the PR
    await applyLabels(github.context, client, labels)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
