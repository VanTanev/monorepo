#!/bin/bash
# .lefthook/post-rewrite/pnpm-install-on-rebase.sh

# either "amend" or "rebase"
rewrite_type="$1"

# load shared hook functions
# shellcheck source=.lefthook/lib/file-has-changed.sh
source ".lefthook/lib/file-has-changed.sh"

# if this is a rebase and pnpm-lock.yaml has changed
if [ "$rewrite_type" = "rebase" ] && file_has_changed "ORIG_HEAD" "HEAD" "pnpm-lock.yaml"; then
  # then run pnpm install non-interactively
  CI=true pnpm install --frozen-lockfile
fi
