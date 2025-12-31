#!/usr/bin/env bash

set -e

SRC="source/_posts_"
DST="source/_posts"

# 1. Check source existence
if [ ! -e "$SRC" ]; then
  echo "[sync-posts] Source $SRC does not exist, skip syncing"
  exit 0
fi

# 2. Check symbolic link
if [ ! -L "$SRC" ]; then
  echo "[sync-posts] Source $SRC exists but is not a symlink, skip syncing"
  exit 0
fi

echo "[sync-posts] Symlink $SRC detected, start syncing"

# 3. Ensure destination directory exists
mkdir -p "$DST"

# 4. Sync content (exclude .obsidian)
rsync -av --delete \
  --exclude=".obsidian/" \
  "$SRC"/ "$DST"/

echo "[sync-posts] Sync completed"
