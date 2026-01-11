
/**
 * Video Link Reverter Script
 * 
 * Usage: node tools/revert-videos.js
 * 
 * This script fixes video links that were accidentally converted to local paths.
 * It changes: /images/HASH.mp4 -> https://i.imgur.com/HASH.mp4
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Regex: Local Video Path -> Remote Imgur
const LOCAL_VIDEO_REGEX = /["']\/images\/([a-zA-Z0-9]+)\.mp4["']/g;

function scanDirectory(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDirectory(fullPath, fileList);
        } else if ((fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) && !fullPath.includes('node_modules')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

async function main() {
    console.log("🚀 Reverting Local Video Links to Imgur...");

    let filesToScan = [];
    if (fs.existsSync(path.join(ROOT_DIR, 'App.tsx'))) filesToScan.push(path.join(ROOT_DIR, 'App.tsx'));
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'constants'))];
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'components'))];

    let revertedCount = 0;

    for (const filePath of filesToScan) {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChange = false;

        if (LOCAL_VIDEO_REGEX.test(content)) {
            // We use replace with a function to preserve quotes (["'])
            content = content.replace(LOCAL_VIDEO_REGEX, (match, hash) => {
                revertedCount++;
                const quote = match[0]; // Capture the quote used ( ' or " )
                return `${quote}https://i.imgur.com/${hash}.mp4${quote}`;
            });
            hasChange = true;
        }

        if (hasChange) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Restored videos in: ${path.basename(filePath)}`);
        }
    }

    console.log(`\n✅ Complete. Reverted ${revertedCount} video links.`);
}

main();
