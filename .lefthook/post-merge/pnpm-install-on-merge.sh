#!/bin/bash
# .lefthook/post-merge/pnpm-install-on-merge.sh

# list of all changed files between the rebase and after the rebase
changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

# function to check if a particular file was changed
file_has_changed() {
  echo "$changed_files" | grep -q "$1"
}

# if pnpm-lock.yaml has changed
if file_has_changed "pnpm-lock.yaml"; then
  # then run pnpm install
  pnpm install --frozen-lockfile
fi
