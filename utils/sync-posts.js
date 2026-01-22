#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC = 'source/_posts_';
const DST = 'source/_posts';
const IGNORE_FILE = 'IGNORE.md';

function log(message) {
  console.log(`[sync-posts] ${message}`);
}

function parseIgnoreFile(filePath) {
  const excludes = [];
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        excludes.push(trimmed);
      }
    }
  } catch (error) {}
  return excludes;
}

try {
  if (!fs.existsSync(SRC)) {
    log(`Source ${SRC} does not exist, skip syncing`);
    process.exit(0);
  }

  if (!fs.lstatSync(SRC).isSymbolicLink()) {
    log(`Source ${SRC} exists but is not a symlink, skip syncing`);
    process.exit(0);
  }

  log(`Symlink ${SRC} detected, start syncing`);

  fs.mkdirSync(DST, { recursive: true });

  execSync(`rsync -av --delete "${SRC}/" "${DST}/"`, {
    stdio: 'inherit'
  });

  const targetIgnoreFile = path.join(DST, IGNORE_FILE);
  if (fs.existsSync(targetIgnoreFile)) {
    const ignoreItems = parseIgnoreFile(targetIgnoreFile);

    fs.unlinkSync(targetIgnoreFile);
    log(`Removed: ${IGNORE_FILE}`);

    for (const item of ignoreItems) {
      const itemPath = path.join(DST, item);
      if (fs.existsSync(itemPath)) {
        fs.rmSync(itemPath, { recursive: true });
        log(`Removed: ${item}`);
      }
    }
  }

  log('Sync completed');
} catch (error) {
  console.error(`[sync-posts] Error: ${error.message}`);
  process.exit(1);
}
