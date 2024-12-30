#!/bin/bash
# .lefthook/post-checkout/pnpm-install-on-branch-switch.sh

# the commit hash before the checkout
prev_head="$1"
# the commit hash after the checkout
new_head="$2"
# 0 means "file checkout", 1 means "branch switch"
flag="$3"
# branch name will be an empty string if we're in a detached head
branch_name="$(git branch --show-current)"
# list of all changed files between the previous head and the new head
changed_files="$(git diff-tree -r --name-only --no-commit-id $prev_head $new_head)"

# function to check if a particular file was changed
file_has_changed() {
  echo "$changed_files" | grep -q "$1"
}

# if this is a branch switch, and we're not in a detached head, and pnpm-lock.yaml was changed
if [ "$flag" = "1" ] && [ -n "$branch_name" ] && file_has_changed "pnpm-lock.yaml"; then
  # then run pnpm install
  pnpm install --frozen-lockfile
fi
