
/**
 * Link Updater Script (Updates to WebP)
 * 
 * Usage: node tools/optimize-images.js
 * 
 * This script scans .ts and .tsx files and performs text replacements:
 * 1. Converts Remote ImgBB links (https://i.ibb.co/HASH/NAME.ext) -> Local WebP (/images/HASH-NAME.webp)
 * 2. Converts Local Image links (/images/HASH-NAME.jpg|png) -> Local WebP (/images/HASH-NAME.webp)
 * 
 * Note: This assumes the .webp files already exist in public/images/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Regex 1: Remote ImgBB -> WebP
// Capture Group 1: Hash, Group 2: Filename
const REMOTE_REGEX = /https:\/\/i\.ibb\.co\/([a-zA-Z0-9]+)\/([\w%\-]+)\.(jpg|png|jpeg|gif)/g;

// Regex 2: Local Images (jpg/png) -> WebP
// Capture Group 1: Hash, Group 2: Filename
const LOCAL_REGEX = /\/images\/([a-zA-Z0-9]+)-([\w%\-]+)\.(jpg|png|jpeg|gif)/g;

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
    console.log("🚀 Starting Link Update (Switching to WebP)...");

    let filesToScan = [];
    if (fs.existsSync(path.join(ROOT_DIR, 'App.tsx'))) filesToScan.push(path.join(ROOT_DIR, 'App.tsx'));
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'constants'))];
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'components'))];

    let remoteReplaced = 0;
    let localReplaced = 0;

    for (const filePath of filesToScan) {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChange = false;

        // 1. Replace Remote ImgBB links
        if (REMOTE_REGEX.test(content)) {
            content = content.replace(REMOTE_REGEX, (match, hash, filename) => {
                remoteReplaced++;
                return `/images/${hash}-${filename}.webp`;
            });
            hasChange = true;
        }

        // 2. Replace existing Local links (if they are not already webp)
        if (LOCAL_REGEX.test(content)) {
            content = content.replace(LOCAL_REGEX, (match, hash, filename) => {
                localReplaced++;
                return `/images/${hash}-${filename}.webp`;
            });
            hasChange = true;
        }

        if (hasChange) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${path.basename(filePath)}`);
        }
    }

    console.log(`\n✅ Complete.`);
    console.log(`- Remote Links Converted: ${remoteReplaced}`);
    console.log(`- Local Extensions Updated: ${localReplaced}`);
}

main();
