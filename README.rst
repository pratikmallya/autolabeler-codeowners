autolabeler-codeowners
======================

Adds labels to PR's based on ``CODEOWNERS``. Useful in monorepos where there 
can be a ton of concurrent users and it might get hard to find the
relevant PR for a particular team.

Example usage
-------------

The following is a fully functional `Github Workflow`_. Note that 
``githubToken`` is a `Github secret`_ that needs to be added to the Github repo.

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
