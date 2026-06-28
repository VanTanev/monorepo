#!/bin/bash
# .lefthook/lib/file-has-changed.sh

# function to check if a particular file was changed between two commits
file_has_changed() {
  local prev_head="$1"
  local new_head="$2"
  local filename="$3"

  git diff-tree -r --name-only --no-commit-id "$prev_head" "$new_head" | grep -Fxq -- "$filename"
}
