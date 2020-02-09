.. image:: https://github.com/pratikmallya/autolabeler-codeowners/workflows/build-test/badge.svg?branch=master

autolabeler-codeowners 
======================

Adds labels to PR's based on ``CODEOWNERS``. Useful in monorepos where there 
can be a ton of concurrent users and it might get hard to find the
relevant PR for a particular team.

Example usage
-------------

The following is a fully functional `Github Workflow`_. Note that a Github 
Oauth token needs to be added to the Github repo as a `Github secret`_ with 
the name ``githubToken``. 

.. code:: yaml

  on: [pull_request]
  jobs:
    autolabeler-codeowners:
      runs-on: ubuntu-latest
      name: Publish docs to confluence
      steps:
      - uses: actions/checkout@v1
      - name: publish to confluence
        uses: pratikmallya/autolabeler-codeowners@master
        with:
          githubToken: ${{ secrets.githubToken }}

.. _Github secret: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets
.. _Github Workflow: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow

Deployment
----------
The nodejs modules (in ``./node_modules``) and compiled JS (in ``./lib``) must 
be committed to the release branches but NOT to master (to keep master 
branch clean)

Testing
-------

- install dev deps using ``npm install --save-dev``
- run ``npm run test``

Known Limitations
-----------------

- *no retry logic*: In practice not a huge deal as most PR's have multiple 
  pushes and thus the workflow is triggered several times for the same PR.
- *only detects the first 100 files in a PR*. This has not been a problem in 
  practice since most PR's only make large changes within code-owned teams.
  Cross-codeowned, large changes have been rare. If this is a problem, feel 
  free to open a PR/Issue with details!
- *does not work for PR's from forked repos for private repos*: this is simply 
  because the action is not triggered by Github so there is realistically no 
  way to fix it. `Github promises to fix this by GA`_

.. _Github promises to fix this by GA: https://github.community/t5/GitHub-Actions/Github-Workflow-not-running-from-pull-request-from-forked/m-p/33484/highlight/true#M1524

Release Process
===============

(TODO: *automate*)

- checkout to the release branch e.g. ``git checkout -b release/v1``
  
  a. If release branch already exists, ``git checkout release/v1`` and then 
     pull in any new changes you need e.g. ``git merge master``

- uncomment ``./node_modules`` and ``./lib`` from ``.gitignore``, this allows us 
  to commit them
- run ``npm prune --production`` to prune the modules
- compile JS with ``npm run build``
- ``git add lib/`` to add any newly generated JS files
- commit to branch  ``git commit -am "ADD: readying for release"``
- push branch
- update `Github Marketplace`_

.. _Github Marketplace: https://github.com/marketplace/actions/autolabeler-codeowners
