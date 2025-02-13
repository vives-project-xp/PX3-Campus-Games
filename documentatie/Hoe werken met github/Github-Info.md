## General GitHub Guide

### **BEFORE COMMIT 1 PUSH? CHECK STATUS:**
```bash
git status
```

### **COMMIT & PUSH**
Modify files, then add, commit, and push:
```bash
git add .
git commit -m "Added chat functionality"
git push origin *your-branch-name* 
```
if **git push** does not work, try "git pull" first, then push again:
```bash
git pull
git push origin *your-branch-name*
```

### **USING BRANCHES**
- To see all branches in your project:
  ```bash
  git branch
  ```
- To create a new branch:
  ```bash
  git branch *your-branch-name*
  ```
- To start working in your new branch:
  ```bash
  git checkout *your-branch-name*
  ```
  *(work in new branch, Git 2.23+ shortcut:)*
  ```bash
  git switch *your-branch-name*
  ```

### **MERGING BRANCHES**
1. Switch to *your-branch-name*:
   ```bash
   git checkout *your-branch-name*
   ```
2. Ensure you have the latest version of *your-branch-name*:
   ```bash
   git pull origin *your-branch-name*
   ```
3. Merge your branch:
   ```bash
   git merge *your-branch-name*
   ```
4. Push the updated *your-branch-name*:
   ```bash
   git push origin *your-branch-name*
   ```

### **DELETE A BRANCH**
- Locally:
  ```bash
  git branch -d *your-branch-name*
  ```
- On GitHub:
  ```bash
  git push origin --delete *your-branch-name*
  ```

### **HANDLING MERGE CONFLICTS**
If you get a merge conflict (e.g., `CONFLICT (content): Merge conflict in *folder/file*`):

#### **1. Overwrite local changes with remote version (All local changes lost):**
```bash
git reset --hard origin/*your-branch-name*
git pull
```

#### **2. Pull latest changes but keep local modifications:**
```bash
git stash
git pull
git stash pop
```

#### **3. (FORCE) Make local branch identical to remote branch (All local changes are lost):**
```bash
git fetch --all
git reset --hard origin/*your-branch-name*
```


### **Additional (Important) Things**

#### **1. VIEW COMMIT HISTORY:**
```bash
git log
```

#### **2.REVERT CHANGES/COMMIT:**
```bash
git revert *commit-id*
```


### **Additional Tips**
✅ **Use clear branch names** (e.g., `feature-login`, `bugfix-scoreboard`).

✅ **Commit often** – Small commits help track changes.

✅ **Pull from `main` frequently** to avoid conflicts.

✅ **Use pull requests (PRs)** – Let teammates review before merging.

✅ **Communicate with your team** – Prevents conflicts when working on the same files.
