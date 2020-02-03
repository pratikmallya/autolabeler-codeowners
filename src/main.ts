import * as core from '@actions/core'
import {getChangedFiles} from './getChangedFiles'
import * as github from '@actions/github'
import {getCodeOwnersFromPaths} from './getCodeOwnersFromPaths'
import {getLabelsFromOwners, Label} from './getLabelsFromOwners'
import {applyLabels} from './applyLabels'

async function run(): Promise<void> {
  try {
    const client = new github.GitHub(core.getInput('githubToken'))

    // get all paths (file paths) changed in the PR
    const paths: string[] = await getChangedFiles(github.context, client)
    core.info(`Obtained paths: ${paths}`)

    // paths -> set of codeowners for the paths
    const owners: Set<string> = await getCodeOwnersFromPaths(paths)
    core.info(`Obtained owners for paths: ${owners}`)

    // set of codeowners -> set of labels
    const labels: Set<Label> = await getLabelsFromOwners(owners)
    core.info(`Obtained labels for change: ${labels}`)

    // apply the set of labels to the PR
    await applyLabels(github.context, client, labels)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
