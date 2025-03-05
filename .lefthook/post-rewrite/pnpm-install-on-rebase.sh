#!/bin/bash
# .lefthook/post-rewrite/pnpm-install-on-rebase.sh

# either "amend" or "rebase"
rewrite_type="$1"

# list of all changed files between the rebase and after the rebase
changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

# function to check if a particular file was changed
file_has_changed() {
  echo "$changed_files" | grep -q "$1"
}

# if this is a rebase and pnpm-lock.yaml has changed
if [ "$rewrite_type" = "rebase" ] && file_has_changed "pnpm-lock.yaml"; then
  # then run pnpm install
  pnpm install --frozen-lockfile
fi
