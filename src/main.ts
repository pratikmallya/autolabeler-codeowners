import * as core from '@actions/core'
import {getChangedFiles} from './getChangedFiles'
import * as github from '@actions/github'
import { getCodeOwnersFromPaths } from './getCodeOwners'
import { getLabelsFromOwners, Label } from './getLabelsFromOwners'
import { applyLabels } from './applyLabels'

async function run(): Promise<void> {
  try {
    const octokit = new github.GitHub(core.getInput('githubToken'));

    let paths: string[] = await getChangedFiles(github.context, octokit)
    core.debug(`Obtained paths: ${paths}`)
    let owners: Set<string> = await getCodeOwnersFromPaths(paths)
    core.debug(`Obtained owners for paths: ${owners}`) 
    let labels: Label[] = await getLabelsFromOwners(owners)
    core.debug(`Obtained labels for change: ${labels}`)
    await applyLabels(github.context, octokit, labels)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

