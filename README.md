# bestjobs.github.io Happy New Year!
Portal for bestjobs @ GitHub

This repository is rendered online at http://bestjobs.github.io, it contains a listing of repositories that are open source and maintained by bestjobs teams.


NOT yet ready!!!
Adding a new repo to the listing

In order to have your repository show up at http://bestjobs.github.io, a minor change to orgs.js is required.

    To add a single repository add a new entry to orgs.js, specify the Github organization name and the repository name (separate them with a /), and set the type to repo, an example can be seen below:

  {
      "name": "RuntimeTools/appmetrics",
      "type": "repo"
  }

    To add all the repositories in a Github organization add a new entry to orgs.js, specify the Github organization name, and set the type to org, an example can be seen below:

  {
      "name": "bestjobsResilient",
      "type": "org"
  }

To test changes locally

From within the top level folder of the cloned repository run:

$ python -m SimpleHTTPServer 8000

Then open the following URL in a browser:

http://localhost:8000/

Quick Git tutorial

    Clone the repository and checkout a new branch

$ git clone https://github.com/bestjobs/bestjobs.github.io
$ git checkout -b branch_name

    Update the files you'd like to change
    Push the changes upstream

$ git add file1 file2
$ git commit -m "add your commit message here"
$ git push origin branch_name

    View your branch in Github and create a Pull Request
