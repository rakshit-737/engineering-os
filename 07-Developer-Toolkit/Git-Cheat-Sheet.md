# Git Cheat Sheet — Commands Under Pressure

Fast retrieval for daily flow, undo scenarios, and disaster recovery. Everything here is safe
to run unless marked ⚠ (rewrites history) — never rewrite history that's been pushed and pulled by others.

## Daily Flow

| Task | Command |
|---|---|
| What state am I in? | `git status` + `git log --oneline -10` |
| Stage selectively | `git add -p` (review each hunk: y/n/s to split) |
| Commit | `git commit -m "imperative summary"` |
| Sync with remote | `git pull --rebase && git push` |
| New branch from main | `git switch -c feature/x main` |
| See what changed | `git diff` (unstaged) / `git diff --staged` (staged) |
| Compare branch vs main | `git diff main...HEAD` (three dots = since divergence) |
| Who touched this line? | `git blame -L 40,60 file.py` |
| Search history for a string | `git log -S "someFunc" --oneline` |

## The Undo Table

Match your situation, run the command. `restore` = files, `reset` = branch pointer,
`revert` = safe undo of pushed commits, `reflog` = time machine.

| Situation | Command | Notes |
|---|---|---|
| Discard unstaged edits in one file | `git restore file.py` | edits are gone for good |
| Discard ALL unstaged edits | `git restore .` | same warning |
| Unstage a file (keep edits) | `git restore --staged file.py` | |
| Get a file as it was in a commit | `git restore --source=abc123 file.py` | |
| Fix last commit message | `git commit --amend -m "new msg"` | ⚠ if already pushed |
| Add forgotten file to last commit | `git add f; git commit --amend --no-edit` | ⚠ if already pushed |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` | |
| Undo last commit, keep changes unstaged | `git reset HEAD~1` | (mixed, the default) |
| Undo last commit, DELETE changes | `git reset --hard HEAD~1` | ⚠ destructive |
| Undo a PUSHED commit safely | `git revert abc123` | makes a new inverse commit |
| Undo a pushed merge commit | `git revert -m 1 mergesha` | `-m 1` = keep mainline side |
| "I reset --hard and lost work" | `git reflog` → find sha → `git reset --hard sha` | reflog keeps ~90 days |
| Recover a deleted branch | `git reflog` → find tip sha → `git branch name sha` | |
| Wrong branch, uncommitted work | `git stash; git switch right-branch; git stash pop` | |
| Committed on main by mistake | `git branch feat; git reset --hard origin/main; git switch feat` | commits move to `feat` |

Rule of thumb: **not pushed → reset/amend freely; pushed → revert.**

## Branch / Merge / Rebase

| Task | Command |
|---|---|
| List branches with last commit | `git branch -vv` |
| Delete merged branch | `git branch -d name` (`-D` to force) |
| Delete remote branch | `git push origin --delete name` |
| Merge feature into main | `git switch main && git merge feature` |
| Rebase feature onto fresh main | `git switch feature && git rebase main` ⚠ |
| Squash last 3 commits into one | `git reset --soft HEAD~3 && git commit` ⚠ |
| Abort a bad merge/rebase | `git merge --abort` / `git rebase --abort` |
| Continue after fixing conflicts | `git add . && git rebase --continue` |
| Take THEIR version of a conflicted file | `git checkout --theirs file && git add file` |
| Copy one commit onto this branch | `git cherry-pick abc123` |
| Push a rebased branch | `git push --force-with-lease` (never bare `--force`) |

## Stash

| Task | Command |
|---|---|
| Stash tracked changes | `git stash` |
| Stash including untracked files | `git stash -u` |
| Stash with a label | `git stash push -m "wip: auth refactor"` |
| List stashes | `git stash list` |
| Apply latest and drop it | `git stash pop` |
| Apply a specific stash, keep it | `git stash apply stash@{2}` |
| See what's in a stash | `git stash show -p stash@{0}` |
| Turn a stash into a branch | `git stash branch fix-branch stash@{0}` |

## Bisect — Find the Commit That Broke It

```bash
git bisect start
git bisect bad                 # current commit is broken
git bisect good v1.4.0         # last known good tag/sha
# git checks out the midpoint; test, then mark:
git bisect good   # or: git bisect bad
# repeat ~log2(N) times until: "abc123 is the first bad commit"
git bisect reset               # return to where you started
```

Automate it if you have a test command (exit 0 = good):

```bash
git bisect run pytest tests/test_auth.py -x
```

## Fixing Common Disasters

**Committed a secret**
```bash
# Not pushed: remove it, then
git commit --amend            # or reset and recommit
# Pushed: the secret is COMPROMISED — rotate it first, then scrub history:
git filter-repo --replace-text <(echo 'THE_SECRET==>REDACTED')   # then force-push ⚠
```

**Giant file rejected by remote (`pack exceeds maximum allowed size`)**
```bash
git rm --cached big.zip && echo big.zip >> .gitignore && git commit -m "drop big file"
# if it's in older commits: git filter-repo --path big.zip --invert-paths ⚠
```

**Detached HEAD and I made commits**
```bash
git branch rescue            # names the current commit chain
git switch rescue            # you're safe; merge or PR from here
```

**Pull says "divergent branches"**
```bash
git pull --rebase            # replay your commits on top (usual choice)
# conflicts? fix files → git add . → git rebase --continue
```

**`.gitignore` isn't ignoring a file** — it's already tracked:
```bash
git rm -r --cached path/ && git commit -m "stop tracking path/"
```

**Merge conflict panic** — nothing is lost while the conflict is open:
```bash
git status                   # lists conflicted files
# edit files: keep what's between/around <<<<<<< ======= >>>>>>> markers
git add fixed.py && git commit          # or --continue for rebase
git merge --abort            # full escape hatch, back to pre-merge state
```

## One-Time Quality-of-Life Config

```bash
git config --global pull.rebase true          # pull = fetch + rebase
git config --global rebase.autostash true     # auto-stash around rebase
git config --global alias.lg "log --oneline --graph --all -15"
git config --global core.autocrlf input       # sane line endings (true on Windows)
```
