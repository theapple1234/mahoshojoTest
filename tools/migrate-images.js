
/**
 * Image & Video Migration Script with Verification (ESM Version)
 * 
 * Usage: node tools/migrate-images.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_IMG_DIR = path.join(ROOT_DIR, 'public', 'images');
const URL_PREFIX = '/images';

// Regex: Capture Hash and Filename from ImgBB URL
const IMAGE_REGEX = /https:\/\/i\.ibb\.co\/([a-zA-Z0-9]+)\/([\w%\-]+)\.(jpg|png|jpeg|gif)/g;
// Regex: Capture ID from Imgur MP4 URL
const VIDEO_REGEX = /https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.mp4/g;

// CLI Interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// Ensure Directory
if (!fs.existsSync(PUBLIC_IMG_DIR)) {
    fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });
}

// --- Helpers ---

async function downloadFile(url, filename) {
    const filePath = path.join(PUBLIC_IMG_DIR, filename);

    if (fs.existsSync(filePath)) {
        return 'skipped'; // Already exists
    }

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.error(`\n❌ Failed to download: ${url} (Status: ${res.statusCode})`);
                res.resume();
                resolve('failed');
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve('downloaded');
            });

            fileStream.on('error', (err) => {
                fs.unlink(filePath, () => {}); // Delete partial file
                console.error(`\n❌ File write error ${filename}:`, err.message);
                resolve('failed');
            });
        }).on('error', (err) => {
            console.error(`\n❌ Network error ${url}:`, err.message);
            resolve('failed');
        });
    });
}

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

// --- Main Phases ---

async function scanPhase() {
    console.log("🔍 Phase 1: Scanning files...");
    let allMatches = [];
    let filesToScan = [];

    // Gather all target files
    if (fs.existsSync(path.join(ROOT_DIR, 'App.tsx'))) filesToScan.push(path.join(ROOT_DIR, 'App.tsx'));
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'constants'))];
    filesToScan = [...filesToScan, ...scanDirectory(path.join(ROOT_DIR, 'components'))];

    for (const filePath of filesToScan) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Scan for Images (ImgBB)
        const imageMatches = [...content.matchAll(IMAGE_REGEX)];
        if (imageMatches.length > 0) {
            imageMatches.forEach(m => {
                allMatches.push({
                    filePath,
                    fullUrl: m[0],
                    type: 'image',
                    uniqueFilename: `${m[1]}-${m[2]}.${m[3]}`
                });
            });
        }

        // Scan for Videos (Imgur)
        const videoMatches = [...content.matchAll(VIDEO_REGEX)];
        if (videoMatches.length > 0) {
            videoMatches.forEach(m => {
                allMatches.push({
                    filePath,
                    fullUrl: m[0],
                    type: 'video',
                    uniqueFilename: `${m[1]}.mp4`
                });
            });
        }
    }
    return allMatches;
}

async function executionPhase(matches) {
    console.log(`\n🚀 Phase 2: Processing ${matches.length} matches...`);
    
    let processedCount = 0;
    let downloadCount = 0;
    let replacementCount = 0;
    const total = matches.length;

    // We process sequentially to allow accurate progress tracking
    // Group by file to minimize file I/O
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
            // 1. Download
            const status = await downloadFile(item.fullUrl, item.uniqueFilename);
            if (status === 'downloaded') downloadCount++;
            
            // 2. Replace in content string
            if (content.includes(item.fullUrl)) {
                content = content.replace(item.fullUrl, `${URL_PREFIX}/${item.uniqueFilename}`);
                fileChanged = true;
                replacementCount++;
            }
            
            processedCount++;
            process.stdout.write(`\rProgress: ${processedCount} / ${total} (Downloads: ${downloadCount})`);
        }

        if (fileChanged) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
    console.log(`\n\n✅ Execution Complete.`);
    console.log(`- Total Downloads: ${downloadCount}`);
    console.log(`- Total Replacements: ${replacementCount}`);
}

async function verificationPhase() {
    console.log("\n🕵️  Phase 3: Verification");
    
    const matches = await scanPhase();
    
    // Check: Are there any remote links left in code?
    const remainingLinks = matches.length;
    
    console.log(`-------------------------------------------`);
    console.log(`Remaining remote links (ImgBB/Imgur) in code: ${remainingLinks}`);
    
    if (remainingLinks === 0) {
        console.log(`✅ SUCCESS: No remote media links found in source code.`);
        return true;
    } else {
        console.log(`⚠️  WARNING: ${remainingLinks} links were NOT converted.`);
        matches.forEach(m => console.log(`   - ${path.basename(m.filePath)}: ${m.fullUrl}`));
        return false;
    }
}

async function main() {
    let loop = true;

    while (loop) {
        // 1. Scan
        const matches = await scanPhase();
        const totalItems = matches.length;

        console.log(`\n📊 Total Targets Identified: ${totalItems}`);

        if (totalItems === 0) {
            console.log("No media to migrate. Entering verification...");
        } else {
            // 2. Execute
            await executionPhase(matches);
        }

        // 3. Verify loop
        let verifying = true;
        while (verifying) {
            const answer = await askQuestion("\nRun verification check now? (Y/N/Quit): ");
            const choice = answer.trim().toUpperCase();

            if (choice === 'Y') {
                const isClean = await verificationPhase();
                if (!isClean) {
                    const retry = await askQuestion("Incomplete migration detected. Retry download & replacement? (Y/N): ");
                    if (retry.trim().toUpperCase() === 'Y') {
                        verifying = false; // Break verify loop, restart main loop
                        loop = true; 
                    } else {
                        console.log("Exiting with remaining items.");
                        verifying = false;
                        loop = false;
                    }
                } else {
                    console.log("All clear. Exiting.");
                    verifying = false;
                    loop = false;
                }
            } else if (choice === 'Q' || choice === 'QUIT') {
                verifying = false;
                loop = false;
            } else {
                verifying = false;
                loop = false;
            }
        }
    }
    
    rl.close();
}

main();
