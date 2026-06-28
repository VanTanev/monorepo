#!/bin/bash
# .lefthook/post-merge/pnpm-install-on-merge.sh

# load shared hook functions
# shellcheck source=.lefthook/lib/file-has-changed.sh
source ".lefthook/lib/file-has-changed.sh"

# if pnpm-lock.yaml has changed
if file_has_changed "ORIG_HEAD" "HEAD" "pnpm-lock.yaml"; then
  # then run pnpm install non-interactively
  CI=true pnpm install --frozen-lockfile
fi
