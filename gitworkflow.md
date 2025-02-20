# Git Workflow

Below I describe my personal git workflow. There are of course many ways of doing this but this is what works for me. Since I'm just describing my workflow, there will be some repetition of commands.

### Workflow Steps

0. Currently on `main` branch.
1. Verify that local `main` has the latest changes from the remote before beginning work on the feature --> `git pull`.
2. Now create the feature branch off of `main` --> `git checkout -b my_feat_branch`. This creates a new local branch with name `my_feat_branch`, and automatically checks it out.
3. _Do some work on `my_feat_branch`._
4. Stage the changes for committing -> `git add <relative_file_path_of_changes>`. E.g. setting `relative_file_path_of_changes` to `.` will add all files in the working directory recursively. You can view the staged and unstaged changes on the branch using `git status`.
5. Commit the staged changes `git commit -m "my commit message"`.
6. Repeat steps 3, 4, and 5 until the branch is ready to be reviewed.
   - Note, you'll want to keep your branch up to date with changes being made to `main`. To do this you can...
     1. Checkout main --> `git checkout main`
     2. Pull remote changes --> `git pull`
     3. Checkout the feature branch --> `git checkout my_feat_branch`
     4. Merge updated main into feature branch --> `git merge main`
   - When merging main into your feature branch, you may encounter merge conflicts.
7. Create an upstream/remote copy of the branch and push all commits to it --> `git push --set-upstream origin my_feat_branch`. Going forward, you'll only need to use `git push` on this branch to push any additional commits from the local to the remote.
8. Open PR on GitHub from `my_feat_branch` to `main`.
9. Once approved, click the big green merge button! There are a couple of options for this, but I would recommend either...
   1. Squash and Merge
   2. Squash and Rebase
10. Pull most recent changes made to `main` (which now include the changes from the feature branch).
    1. `git checkout main`
    2. `git pull`
11. Cleanup the old feature branch --> `git branch -D my_feat_branch`.
12. Goto step 0.

### Some other useful tips and commands

- `origin` = the remote repository that the local project was originally cloned from. It's possible to fork a repo, which is why this could change, but I've never done this personally.
- `git fetch origin` = fetches the current state of all branches and also fetches branches that
- `git log` = displays the list of all commits on the current branch. Press `q` to exit.
- Generally, I prefer not to work on the same branch as someone else (it somehow always leads to issues). Instead, if multiple people are working on a feature together, I prefer to use the same process as above, except each person branches off of the feature branch instead of the `main`. PRs are then made from each dev's personal feature branch to the shared feature branch:

        main --> feature_branch --> bobs_feature_branch
                                --> mias_feature_branch
