
/**
 * 이미지 마이그레이션 스크립트 (ESM 버전)
 * 
 * 사용법:
 * 1. 프로젝트 루트에서 실행: node tools/migrate-images.js
 * 
 * 기능:
 * - constants, components 폴더 및 App.tsx를 스캔합니다.
 * - ImgBB 이미지 URL에서 고유 Hash를 추출합니다.
 * - public/images/[HASH]-[FILENAME] 형식으로 저장하여 이름 충돌을 방지합니다.
 * - 소스 코드의 URL을 로컬 경로로 일괄 변경합니다.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// ESM 환경에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 설정
const ROOT_DIR = path.resolve(__dirname, '..');

const TARGET_PATHS = [
    path.join(ROOT_DIR, 'constants'),
    path.join(ROOT_DIR, 'components'),
    path.join(ROOT_DIR, 'App.tsx')
]; 
const PUBLIC_IMG_DIR = path.join(ROOT_DIR, 'public', 'images');
const URL_PREFIX = '/images';

// 정규식: ImgBB URL에서 Hash와 Filename을 그룹으로 캡처
const IMAGE_REGEX = /https:\/\/i\.ibb\.co\/([a-zA-Z0-9]+)\/([\w%\-]+)\.(jpg|png|jpeg|gif)/g;

// 폴더 생성
if (!fs.existsSync(PUBLIC_IMG_DIR)) {
    fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });
}

async function downloadImage(url, filename) {
    const filePath = path.join(PUBLIC_IMG_DIR, filename);

    if (fs.existsSync(filePath)) {
        // 이미 존재하면 건너뜀 (중복 다운로드 방지)
        return;
    }

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.error(`❌ 다운로드 실패: ${url} (Status: ${res.statusCode})`);
                res.resume();
                resolve();
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✅ 저장됨: ${filename}`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filePath, () => {});
                console.error(`❌ 파일 쓰기 에러 ${filename}:`, err.message);
                resolve();
            });
        }).on('error', (err) => {
            console.error(`❌ 네트워크 에러 ${url}:`, err.message);
            resolve();
        });
    });
}

async function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // 매치된 모든 이미지 찾기
    const matches = [...content.matchAll(IMAGE_REGEX)];
    
    if (matches.length === 0) return;

    console.log(`\n📄 처리 중: ${path.basename(filePath)} (발견된 이미지: ${matches.length}개)`);

    const downloadPromises = [];

    for (const m of matches) {
        const fullUrl = m[0];
        const hash = m[1];
        const name = m[2];
        const ext = m[3];
        
        // 충돌 방지를 위해 해시를 파일명 앞에 붙임
        const uniqueFilename = `${hash}-${name}.${ext}`;
        
        downloadPromises.push(downloadImage(fullUrl, uniqueFilename));
    }

    // 다운로드 완료 대기
    await Promise.all(downloadPromises);

    // 코드 내 URL 교체
    const newContent = content.replace(IMAGE_REGEX, (fullUrl, hash, name, ext) => {
        hasChanges = true;
        const uniqueFilename = `${hash}-${name}.${ext}`;
        return `${URL_PREFIX}/${uniqueFilename}`;
    });

    if (hasChanges) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✨ 코드 업데이트 완료: ${path.basename(filePath)}`);
    }
}

async function scanAndProcess(targetPath) {
    if (!fs.existsSync(targetPath)) return;
    
    const stat = fs.statSync(targetPath);

    if (stat.isDirectory()) {
        const files = fs.readdirSync(targetPath);
        for (const file of files) {
            const fullPath = path.join(targetPath, file);
            await scanAndProcess(fullPath); // 재귀 호출
        }
    } else if (stat.isFile() && (targetPath.endsWith('.ts') || targetPath.endsWith('.tsx'))) {
        await processFile(targetPath);
    }
}

async function main() {
    console.log("🚀 이미지 마이그레이션 시작 (ESM 모드)...");
    console.log(`📂 저장 경로: ${PUBLIC_IMG_DIR}`);
    
    for (const targetPath of TARGET_PATHS) {
        if (fs.existsSync(targetPath)) {
            await scanAndProcess(targetPath);
        } else {
            console.warn(`⚠️  경로를 찾을 수 없음: ${targetPath}`);
        }
    }
    
    console.log("\n🎉 모든 작업이 완료되었습니다! 이제 Vercel에 배포해도 이미지가 안전합니다.");
}

main();
