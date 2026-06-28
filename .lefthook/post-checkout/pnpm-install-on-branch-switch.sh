#!/bin/bash
# .lefthook/post-checkout/pnpm-install-on-branch-switch.sh

# the commit hash before the checkout
prev_head="$1"
# the commit hash after the checkout
new_head="$2"
# 0 means "file checkout", 1 means "branch switch"
flag="$3"
# the commit hash used by git when checking out a worktree
worktree_prev_head="0000000000000000000000000000000000000000"

# load shared hook functions
# shellcheck source=.lefthook/lib/file-has-changed.sh
source ".lefthook/lib/file-has-changed.sh"

# if this is a file checkout, exit
if [ "$flag" != "1" ]; then
  exit 0
fi

# if we're checking out the same commit, exit
if [ "$prev_head" = "$new_head" ]; then
  exit 0
fi

# branch name will be an empty string if we're in a detached head
branch_name="$(git branch --show-current)"
# if we're in a detached head, exit
if [ -z "$branch_name" ]; then
  exit 0
fi

# if we're checking out a worktree, or pnpm-lock.yaml has changed
if [ "$prev_head" = "$worktree_prev_head" ] || file_has_changed "$prev_head" "$new_head" "pnpm-lock.yaml"; then
  # then run pnpm install non-interactively
  CI=true pnpm install --frozen-lockfile
fi
