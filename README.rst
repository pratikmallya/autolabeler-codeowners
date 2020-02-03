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
* install dev deps using ``npm install --save-dev``
* run ``npm run test``

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
- commit to branch  ``git commit -am "ADD: readying for release"``
- push branch
- update `Github Marketplace`_

.. _Github Marketplace: https://github.com/marketplace/actions/autolabeler-codeowners
