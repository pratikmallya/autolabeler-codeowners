import * as core from '@actions/core'
import {wait} from './wait'
import {getChangedFiles} from './getChangedFiles'
import * as github from '@actions/github'
import * as Webhooks from '@octokit/webhooks'

async function run(): Promise<void> {
  try {
    const octokit = new github.GitHub(core.getInput('githubToken'));

    let files = await getChangedFiles(github.context, octokit)

    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}


run()
