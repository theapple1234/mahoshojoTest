
/**
 * Simple Image & Video Migration Script (ESM Version) - Path Update Only
 * 
 * Usage: node tools/migrate-images-simple.js
 * 
 * Logic:
 * 1. Scan files for ibb.co (images) and imgur (mp4) links.
 * 2. Replace them with local paths (assuming files exist).
 * 3. Verify results.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_IMG_DIR = path.join(ROOT_DIR, 'public', 'images');
const URL_PREFIX = '/images';
const IMAGE_REGEX = /https:\/\/i\.ibb\.co\/([a-zA-Z0-9]+)\/([\w%\-]+)\.(jpg|png|jpeg|gif)/g;
const VIDEO_REGEX = /https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.mp4/g;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

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

async function scanPhase() {
    console.log("🔍 Phase 1: Scanning files...");
    let allMatches = [];
    let filesToScan = [];

    if (fs.existsSync(path.join(ROOT_DIR, 'App.tsx'))) filesToScan.push(path.join(ROOT_DIR, 'App.tsx'));
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'constants'))];
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'components'))];

    for (const filePath of filesToScan) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Images
        const imageMatches = [...content.matchAll(IMAGE_REGEX)];
        if (imageMatches.length > 0) {
            imageMatches.forEach(m => {
                allMatches.push({
                    filePath,
                    fullUrl: m[0],
                    uniqueFilename: `${m[1]}-${m[2]}.${m[3]}`
                });
            });
        }

        // Videos
        const videoMatches = [...content.matchAll(VIDEO_REGEX)];
        if (videoMatches.length > 0) {
            videoMatches.forEach(m => {
                allMatches.push({
                    filePath,
                    fullUrl: m[0],
                    uniqueFilename: `${m[1]}.mp4`
                });
            });
        }
    }
    return allMatches;
}

async function executionPhase(matches) {
    console.log(`\n🚀 Phase 2: Updating paths for ${matches.length} matches...`);
    
    let processedCount = 0;
    let replacementCount = 0;
    let missingFileCount = 0;
    const total = matches.length;

    const fileGroups = matches.reduce((acc, curr) => {
        if (!acc[curr.filePath]) acc[curr.filePath] = [];
        acc[curr.filePath].push(curr);
        return acc;
    }, {});

    for (const filePath of Object.keys(fileGroups)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let fileChanged = false;
        const items = fileGroups[filePath];

        for (const item of items) {
            // Check if file exists locally (just for reporting)
            const localPath = path.join(PUBLIC_IMG_DIR, item.uniqueFilename);
            if (!fs.existsSync(localPath)) {
                missingFileCount++;
            }

            if (content.includes(item.fullUrl)) {
                content = content.replace(item.fullUrl, `${URL_PREFIX}/${item.uniqueFilename}`);
                fileChanged = true;
                replacementCount++;
            }
            
            processedCount++;
            process.stdout.write(`\rProgress: ${processedCount} / ${total}`);
        }

        if (fileChanged) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
    console.log(`\n\n✅ Execution Complete.`);
    console.log(`- Replacements: ${replacementCount}`);
    if (missingFileCount > 0) {
        console.log(`⚠️  Warning: ${missingFileCount} referenced media files are missing from ${PUBLIC_IMG_DIR}`);
    }
}

async function verificationPhase() {
    console.log("\n🕵️  Phase 3: Verification");
    const matches = await scanPhase();
    const remainingLinks = matches.length;
    
    console.log(`-------------------------------------------`);
    console.log(`Remaining remote links: ${remainingLinks}`);
    
    if (remainingLinks === 0) {
        console.log(`✅ SUCCESS: Source code has no remote links.`);
        return true;
    } else {
        console.log(`⚠️  WARNING: ${remainingLinks} links remain.`);
        return false;
    }
}

async function main() {
    let loop = true;

    while (loop) {
        const matches = await scanPhase();
        const totalItems = matches.length;
        console.log(`\n📊 Total Links Found: ${totalItems}`);

        if (totalItems > 0) {
            await executionPhase(matches);
        } else {
            console.log("No remote links found to update.");
        }

        let verifying = true;
        while (verifying) {
            const answer = await askQuestion("\nRun verification check? (Y/N/Quit): ");
            const choice = answer.trim().toUpperCase();

            if (choice === 'Y') {
                const isClean = await verificationPhase();
                if (!isClean) {
                    const retry = await askQuestion("Retry replacement process? (Y/N): ");
                    if (retry.trim().toUpperCase() === 'Y') {
                        verifying = false;
                        loop = true;
                    } else {
                        verifying = false;
                        loop = false;
                    }
                } else {
                    verifying = false;
                    loop = false;
                }
            } else {
                verifying = false;
                loop = false;
            }
        }
    }
    
    rl.close();
}

main();
