
/**
 * CDN Link Updater Script
 * 
 * Usage: node tools/cds-change.js
 * 
 * This script scans .ts and .tsx files and replaces local image paths with jsDelivr CDN links.
 * It targets paths starting with /images/ and replaces them with the full CDN URL.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/theapple1234/saviapple_Seinarumagecraft_CYOA/public/images';

// Regex to find local image paths inside quotes
// Matches "/images/filename.ext" or '/images/filename.ext'
const LOCAL_PATH_REGEX = /["']\/images\/([a-zA-Z0-9\-\._]+\.\w+)["']/g;

function scanDirectory(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                scanDirectory(fullPath, fileList);
            }
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

async function main() {
    console.log("🚀 Starting CDN Link Replacement...");
    console.log(`Target CDN: ${CDN_BASE_URL}`);

    let filesToScan = [];
    
    // Gather target files
    if (fs.existsSync(path.join(ROOT_DIR, 'App.tsx'))) filesToScan.push(path.join(ROOT_DIR, 'App.tsx'));
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'constants'))];
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'components'))];
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'context'))];
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'hooks'))];

    let replacedCount = 0;
    let filesChanged = 0;

    for (const filePath of filesToScan) {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChange = false;

        // Perform replacement
        if (LOCAL_PATH_REGEX.test(content)) {
            content = content.replace(LOCAL_PATH_REGEX, (match, filename) => {
                replacedCount++;
                const quote = match[0]; // Capture ' or "
                return `${quote}${CDN_BASE_URL}/${filename}${quote}`;
            });
            hasChange = true;
        }

        if (hasChange) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${path.basename(filePath)}`);
            filesChanged++;
        }
    }

    console.log(`\n✅ Complete.`);
    console.log(`- Files Updated: ${filesChanged}`);
    console.log(`- Links Replaced: ${replacedCount}`);
}

main();
