autolabeler-codeowners
======================

Adds labels to PR's based on ``CODEOWNERS``. Useful in monorepos where there 
can be a ton of concurrent users and it might get hard to find the
relevant PR for a particular team.

Tasklist
--------
https://github.com/code-owners/codeowners-api

- read payload from webhook
  - might be easier to query the PR object for all the changed files

- transform payload into list of CODEOWNERS
- transform list of CODEOWNERS into labels
- add labels to the repo
  - create labels if they don't exist 
