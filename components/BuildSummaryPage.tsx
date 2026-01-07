import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import * as Constants from '../constants';
import { useBuildSummaryData } from '../hooks/useBuildSummaryData';
import { ArcaneLayout } from './build-summary/ArcaneLayout';
import { TempleLayout } from './build-summary/TempleLayout';
import { VortexLayout } from './build-summary/VortexLayout';
import { TerminalLayout } from './build-summary/TerminalLayout';
import { SaveDiskIcon, FileExportIcon, DownloadIcon, TemplateIcon } from './build-summary/BuildSummaryShared';
import { ReferenceBuildSummary } from './reference/ReferenceBuildSummary';
import type { AllBuilds, BuildType } from '../types';

type TemplateType = 'default' | 'temple' | 'vortex' | 'terminal';
const STORAGE_KEY = 'seinaru_magecraft_builds';

// Add type declaration for html2canvas, JSZip and FileSaver from CDN
declare global {
  interface Window {
    html2canvas: any;
    JSZip: any;
    saveAs: any;
    showDirectoryPicker?: () => Promise<any>;
  }
}

// -- Helper: Quick Point Calculation for Reference Items --
const calculateReferencePoints = (type: BuildType, data: any): number => {
    let total = 0;
    const { category, size, perks, traits, bpSpent, magicalBeastCount } = data;
    
    // Normalize perks to Map if it's an array/object
    const perkMap = perks instanceof Map ? perks : new Map(Array.isArray(perks) ? perks : []);
    const traitSet = traits instanceof Set ? traits : new Set(Array.isArray(traits) ? traits : []);
    const categories = Array.isArray(category) ? category : (category ? [category] : []);

    if (type === 'companions') {
        const allItems = [...Constants.COMPANION_CATEGORIES, ...Constants.COMPANION_RELATIONSHIPS, ...Constants.COMPANION_PERSONALITY_TRAITS, ...Constants.COMPANION_PERKS, ...Constants.COMPANION_POWER_LEVELS];
        if (data.category) total += allItems.find(i => i.id === data.category)?.cost ?? 0;
        if (data.relationship) total += allItems.find(i => i.id === data.relationship)?.cost ?? 0;
        if (data.powerLevel) total += allItems.find(i => i.id === data.powerLevel)?.cost ?? 0;
        traitSet.forEach((t: string) => { total += allItems.find(i => i.id === t)?.cost ?? 0; });
        perkMap.forEach((count: number, id: string) => {
            const perk = allItems.find(i => i.id === id);
            if (perk) {
                if (id === 'signature_power') total += (count > 0 ? 5 + (count - 1) * 10 : 0);
                else total += (perk.cost ?? 0) * count;
            }
        });
    } else if (type === 'weapons') {
        // No category cost
        perkMap.forEach((count: number, id: string) => {
            const perk = Constants.WEAPON_PERKS.find(p => p.id === id);
            if (perk) total += (perk.cost ?? 0) * count;
        });
        if (perkMap.has('chatterbox')) {
            traitSet.forEach((t: string) => total += Constants.COMPANION_PERSONALITY_TRAITS.find(i => i.id === t)?.cost ?? 0);
        }
    } else if (type === 'beasts') {
        categories.forEach((c: string) => total += Constants.BEAST_CATEGORIES.find(i => i.id === c)?.cost ?? 0);
        if (size) total += Constants.BEAST_SIZES.find(i => i.id === size)?.cost ?? 0;
        perkMap.forEach((count: number, id: string) => {
            if (id === 'magical_beast') return;
            const perk = Constants.BEAST_PERKS.find(p => p.id === id);
            let cost = perk?.cost ?? 0;
            if (id === 'unnerving_appearance' && perkMap.has('undead_perk')) cost = 0;
            if (id === 'steel_skin' && perkMap.has('automaton_perk')) cost = 0;
            total += cost * count;
        });
        if (magicalBeastCount) total += magicalBeastCount * 15;
        if (perkMap.has('chatterbox_beast')) {
            traitSet.forEach((t: string) => total += Constants.COMPANION_PERSONALITY_TRAITS.find(i => i.id === t)?.cost ?? 0);
        }
    } else if (type === 'vehicles') {
        categories.forEach((c: string) => total += Constants.VEHICLE_CATEGORIES.find(i => i.id === c)?.cost ?? 0);
        perkMap.forEach((count: number, id: string) => {
            const perk = Constants.VEHICLE_PERKS.find(p => p.id === id);
            let cost = perk?.cost ?? 0;
            if (id === 'chatterbox_vehicle' && categories.includes('car')) cost = 0;
            if (id === 'hellfire_volley' && (categories.includes('tank') || categories.includes('mecha'))) cost = 0;
            total += cost * count;
        });
        if (perkMap.has('chatterbox_vehicle')) {
            traitSet.forEach((t: string) => total += Constants.COMPANION_PERSONALITY_TRAITS.find(i => i.id === t)?.cost ?? 0);
        }
    }

    // Apply Sun Forger Discount
    total -= (bpSpent || 0) * 2;
    return total;
};

// -- Loading Overlay Component --
const GeneratingOverlay: React.FC<{ template: TemplateType }> = ({ template }) => {
    let colorClass = "text-cyan-100";
    let borderClass = "border-cyan-500/30 border-t-cyan-400";
    let bgClass = "bg-cyan-500/20";
    let subTextClass = "text-cyan-500/60";

    if (template === 'temple') {
        colorClass = "text-amber-100";
        borderClass = "border-amber-500/30 border-t-amber-400";
        bgClass = "bg-amber-500/20";
        subTextClass = "text-amber-500/60";
    } else if (template === 'vortex') {
        colorClass = "text-purple-100";
        borderClass = "border-purple-500/30 border-t-purple-400";
        bgClass = "bg-purple-500/20";
        subTextClass = "text-purple-500/60";
    } else if (template === 'terminal') {
        colorClass = "text-green-100";
        borderClass = "border-green-500/30 border-t-green-400";
        bgClass = "bg-green-500/20";
        subTextClass = "text-green-500/60";
    }

    return (
        <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto cursor-wait animate-fade-in">
            <div className="relative mb-8">
                <div className={`w-24 h-24 border-4 ${borderClass} rounded-full animate-spin`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-12 h-12 ${bgClass} rounded-full animate-pulse`}></div>
                </div>
                {/* Rotating Ring Reverse */}
                <div className={`absolute -inset-4 border border-dashed ${borderClass} rounded-full opacity-30 animate-spin-slow-reverse`}></div>
            </div>
            
            <h3 className={`font-cinzel text-2xl ${colorClass} tracking-[0.3em] uppercase animate-pulse mb-2 text-center`}>
                Inscribing Builds...
            </h3>
            <p className={`${subTextClass} font-mono text-xs uppercase tracking-wider`}>
                Please wait while the construct is finalized
            </p>
        </div>
    );
};

export const BuildSummaryPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const ctx = useCharacterContext();
    const summaryContentRef = useRef<HTMLDivElement>(null);
    const { sections } = useBuildSummaryData(ctx);
    // FIX: Replaced setTemplate with useState to fix 'used before declaration' error
    const [template, setTemplate] = useState<TemplateType>('default');
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // State for Reference Page Append
    const [referenceBuilds, setReferenceBuilds] = useState<AllBuilds>({ companions: {}, weapons: {}, beasts: {}, vehicles: {} });
    const [showReferenceAppendix, setShowReferenceAppendix] = useState(false);

    // Load Reference Builds
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setReferenceBuilds({
                    companions: parsed.companions || {},
                    weapons: parsed.weapons || {},
                    beasts: parsed.beasts || {},
                    vehicles: parsed.vehicles || {}
                });
            } catch (e) {
                console.error("Failed to load builds", e);
            }
        }
    }, []);

    const currentBuildName = "My Build"; // Placeholder
    const pointsSpent = 100 - ctx.blessingPoints; 
    const isSunForgerActive = ctx.selectedStarCrossedLovePacts.has('sun_forgers_boon');

    // -- Helper: Generate Filename with User Input --
    const generateDownloadFilename = () => {
        const wantToName = window.confirm(ctx.language === 'ko' ? "파일 이름을 지정하시겠습니까?" : "Do you want to enter a build name for this file?");
        let fileNameBase = "";
        
        if (wantToName) {
            const inputName = window.prompt(ctx.language === 'ko' ? "이름 입력:" : "Enter build name:");
            if (inputName && inputName.trim()) {
                 const safeName = inputName.trim().replace(/[\\/:*?"<>|]/g, '_'); // Sanitize illegal chars
                 fileNameBase = `Build_${safeName}`;
            }
        }

        if (!fileNameBase) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            fileNameBase = `Build_${year}-${month}-${day}_${hours}-${mins}-${secs}`;
        }
        return fileNameBase;
    };

    const downloadImage = (canvas: HTMLCanvasElement, filename: string) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleDownload = async (includeReference: boolean) => {
        if (!summaryContentRef.current || !window.html2canvas) {
            alert('Image generation feature is not ready. Please try again in a moment.');
            return;
        }

        if (includeReference && (!window.JSZip || !window.saveAs)) {
            alert('Zip libraries not loaded. Please refresh or check connection.');
            return;
        }

        // Generate Filename first so we don't interrupt the spinner later
        const baseName = generateDownloadFilename();

        setShowDownloadMenu(false);
        setIsGenerating(true);
        const bgColor = template === 'temple' ? '#f8f5f2' : '#000000';

        try {
            // Wait for fonts to be ready to ensure text renders correctly
            await document.fonts.ready;

            // 1. Capture Main Build
            // Ensure appendix is hidden first to get a clean main build image
            if (showReferenceAppendix) {
                setShowReferenceAppendix(false);
                await new Promise(resolve => setTimeout(resolve, 300)); // Allow DOM update
            }
            
            const element = summaryContentRef.current;
            
            // Calculate a sufficiently wide viewport to prevent text wrapping if font fallback occurs
            const captureWidth = Math.max(element.scrollWidth, 1600); 

            const options: any = {
                backgroundColor: bgColor, 
                useCORS: true,
                scale: 2,
                logging: false,
                windowWidth: captureWidth, 
                onclone: (clonedDoc: Document) => {
                    const clonedElement = clonedDoc.querySelector('[data-capture-target]') as HTMLElement;
                    if (clonedElement) {
                        clonedElement.style.overflow = 'visible';
                        clonedElement.style.height = 'auto';
                        clonedElement.style.maxHeight = 'none';
                        clonedElement.style.minHeight = '100%';
                        clonedElement.style.width = `${captureWidth}px`;
                    
                        const style = clonedDoc.createElement('style');
                        style.innerHTML = `
                            h1, h2, h3, h4, h5, h6, p, label, button, a, div > span:not(.absolute) {
                                position: relative;
                                top: -7.5px;
                            }
                            .vortex-stage-number {
                                top: -22.5px !important;
                            }
                            .build-summary-count-badge {
                                transform: translateY(-7px) !important;
                            }
                        `;
                        clonedDoc.head.appendChild(style);

                        const traitsToAdjust = [
                            "LOADED (Parent only)", "GREAT CHEF", "CREATIVE SAVANT", 
                            "BLESSED (Female only)", "BADASS", "BRILLIANT", "ROLE MODEL", 
                            "DOTING", "PEAS IN A POD", "STACKED", "HANDYMAN", "BOMBSHELL", 
                            "STRICT (Parent/Older Sibling only)", "DISOBEDIENT (Younger Sibling only)", 
                            "PHYSICALLY DISABLED", "MENTALLY DISABLED", "ABUSIVE (Parent only)",
                            "FORGIVING (Parent/Older Sibling only)"
                        ];
                        
                        const allElements = clonedElement.querySelectorAll('*');
                        allElements.forEach((el: any) => {
                            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                                const text = el.innerText;
                                if (traitsToAdjust.some(t => text.includes(t))) {
                                    el.style.top = '-10px';
                                }
                            }
                        });
                        
                        const milgrathElements = clonedElement.querySelectorAll('.milgrath-override-content');
                        milgrathElements.forEach((el: any) => {
                            el.style.position = 'relative';
                            el.style.top = '-5px'; 
                        });
                    }
                    
                    const clonedBody = clonedDoc.body;
                    clonedBody.style.backgroundColor = bgColor;
                    clonedBody.style.width = `${captureWidth}px`;
                }
            };

            if (template === 'vortex') {
                options.windowWidth = 2600;
            }

            const mainCanvas = await window.html2canvas(element, options);
            const mainBlob = await new Promise<Blob | null>(resolve => mainCanvas.toBlob(resolve, 'image/png'));
            
            if (!includeReference) {
                downloadImage(mainCanvas, `${baseName}.png`);
            } else {
                const zip = new window.JSZip();
                
                if (mainBlob) {
                    zip.file("Full_Build.png", mainBlob);
                }

                const hasReferenceContent = Object.values(referenceBuilds).some(cat => Object.keys(cat).length > 0);
                
                if (hasReferenceContent) {
                    setShowReferenceAppendix(true);
                    await new Promise(resolve => setTimeout(resolve, 800)); 

                    const appendixElement = document.getElementById('reference-appendix');
                    if (appendixElement) {
                         const refItems = appendixElement.querySelectorAll('.reference-capture-item');
                         for (let i = 0; i < refItems.length; i++) {
                             const item = refItems[i] as HTMLElement;
                             const refName = item.dataset.name || `ref-${i}`;
                             const rect = item.getBoundingClientRect();
                             const refWidth = Math.max(rect.width, 900);
                             
                             const refCanvas = await window.html2canvas(item, {
                                 backgroundColor: bgColor,
                                 useCORS: true,
                                 scale: 2,
                                 logging: false,
                                 windowWidth: refWidth,
                                 onclone: (clonedDoc: Document) => {
                                     const clonedNode = clonedDoc.querySelector(`[data-name="${refName}"]`) as HTMLElement;
                                     if (clonedNode) {
                                        clonedNode.style.height = 'auto';
                                        clonedNode.style.overflow = 'visible';
                                     }
                                     const style = clonedDoc.createElement('style');
                                     style.innerHTML = `
                                         h1, h2, h3, h4, h5, h6, p, label, button, a, div > span:not(.absolute) {
                                             position: relative;
                                             top: -7.5px;
                                         }
                                         .build-summary-count-badge {
                                            transform: translateY(-7px) !important;
                                         }
                                     `;
                                     clonedDoc.head.appendChild(style);
                                 }
                             });
                             const refBlob = await new Promise<Blob | null>(resolve => refCanvas.toBlob(resolve, 'image/png'));
                             if (refBlob) {
                                 const safeRefName = refName.replace(/[\/\\?%*:|"<>]/g, '_');
                                 zip.file(`${safeRefName}.png`, refBlob);
                             }
                             await new Promise(r => setTimeout(r, 100));
                         }
                    }
                }
                const zipContent = await zip.generateAsync({ type: "blob" });
                window.saveAs(zipContent, `${baseName}.zip`);
            }
        } catch (error) {
            console.error("Error generating images:", error);
            alert("Error generating images. Please try again.");
        } finally {
            setIsGenerating(false);
            setShowReferenceAppendix(false);
        }
    };
    
    const handleSaveToBrowser = () => {
        const buildName = prompt(ctx.language === 'ko' ? "저장할 빌드의 이름을 입력하세요:" : "Enter a name for this build:");
        if (!buildName || buildName.trim() === '') return;
        const serializableCtx = ctx.serializeState();
        const refBuilds = localStorage.getItem(STORAGE_KEY) || '{}';
        const fullSaveData = {
            name: buildName,
            timestamp: new Date().toISOString(),
            character: serializableCtx,
            reference: JSON.parse(refBuilds),
            version: '1.0'
        };
        const dbRequest = indexedDB.open('SeinaruMagecraftFullSaves', 1);
        dbRequest.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('saves')) {
                db.createObjectStore('saves', { keyPath: 'name' });
            }
        };
        dbRequest.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction('saves', 'readwrite');
            const store = transaction.objectStore('saves');
            const putRequest = store.put(fullSaveData);
            putRequest.onsuccess = () => alert(ctx.language === 'ko' ? `"${buildName}" 빌드가 브라우저에 저장되었습니다!` : `Build "${buildName}" saved successfully!`);
            putRequest.onerror = () => alert(`Error saving build: ${putRequest.error?.message}`);
        };
    };

    const handleSaveToFile = () => {
        const filename = generateDownloadFilename();

        const serializableCtx = ctx.serializeState();
        const refBuilds = localStorage.getItem(STORAGE_KEY) || '{}';
        const fullSaveData = {
            // FIX: Use serializableCtx instead of non-existent mainState
            character: serializableCtx,
            reference: JSON.parse(refBuilds),
            version: '1.0'
        };
        const blob = new Blob([JSON.stringify(fullSaveData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImageUpload = (base64: string) => {
        setCustomImage(base64);
    };

    const containerBgClass = template === 'temple' ? 'bg-[#f8f5f2]' : (template === 'default' ? 'bg-[#0a0f1e]' : 'bg-black');
    
    // Theme colors for Appendix Header
    const appendixHeaderClass = 
        template === 'terminal' ? 'text-green-500 border-green-500/50' :
        template === 'temple' ? 'text-amber-800 border-amber-800/30' :
        template === 'vortex' ? 'text-purple-400 border-purple-500/50' : 
        'text-cyan-200 border-cyan-500/50';

    const appendixDividerClass =
        template === 'terminal' ? 'border-green-900/50' :
        template === 'temple' ? 'border-amber-900/20' :
        template === 'vortex' ? 'border-purple-900/50' :
        'border-cyan-900/30';

    return (
        <div className="fixed inset-0 bg-[#000000]/95 backdrop-blur-md z-[101] p-0 md:p-4 flex justify-center items-center" role="dialog" aria-modal="true">
            {isGenerating && <GeneratingOverlay template={template} />}

            <div className="bg-[#0a0f1e] w-full max-w-[1600px] h-full rounded-none md:rounded-2xl shadow-2xl border border-cyan-900/50 flex flex-col relative overflow-hidden">
                
                {/* Header */}
                <header className="relative z-[150] flex justify-between items-center p-4 border-b border-cyan-900/50 bg-[#0a0f1e]/90 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-950 rounded-lg border border-cyan-700/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-cinzel text-2xl text-white tracking-widest drop-shadow-md">
                                {ctx.language === 'ko' ? "당신의 빌드" : "YOUR BUILD"}
                            </h2>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="group flex items-center justify-center w-8 h-8 rounded-full border border-gray-700 hover:border-red-500 transition-colors"
                        aria-label="Close Summary"
                    >
                        <span className="text-gray-400 group-hover:text-red-500 text-xl leading-none">&times;</span>
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-grow overflow-y-auto bg-black relative">
                     <div ref={summaryContentRef} data-capture-target="true" className={`min-h-full flex flex-col ${containerBgClass}`}>
                        <div className="flex-grow">
                            {template === 'default' && (
                                <div className="p-8 bg-[#0a0f1e] min-h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(22,78,99,0.3)_0%,transparent_70%)] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                    <ArcaneLayout sections={sections} language={ctx.language} />
                                </div>
                            )}
                            {template === 'temple' && <TempleLayout sections={sections} language={ctx.language} />}
                            {template === 'vortex' && (
                                <VortexLayout 
                                    sections={sections} 
                                    ctx={ctx} 
                                    name={currentBuildName}
                                    type="Full Character" 
                                    pointsSpent={pointsSpent}
                                    visualSrc={customImage || "/images/Z6tHPxPB-symbol-transparent.png"}
                                    onImageUpload={handleImageUpload}
                                />
                            )}
                            {template === 'terminal' && <TerminalLayout sections={sections} language={ctx.language} />}

                            {showReferenceAppendix && (
                                <div id="reference-appendix" className={`mt-20 pt-16 pb-20 border-t-4 border-double ${appendixDividerClass} px-10`}>
                                    <div className="text-center mb-16">
                                        <h2 className={`font-cinzel text-4xl font-bold tracking-[0.2em] uppercase border-b-2 inline-block pb-4 ${appendixHeaderClass}`}>
                                            Reference Library
                                        </h2>
                                    </div>
                                    
                                    <div className="flex flex-col gap-24">
                                        {(['companions', 'weapons', 'beasts', 'vehicles'] as BuildType[]).map(type => {
                                            const builds = referenceBuilds[type];
                                            const buildKeys = Object.keys(builds);
                                            if (buildKeys.length === 0) return null;

                                            return (
                                                <div key={type} className="w-full">
                                                     <h3 className={`font-cinzel text-2xl mb-8 tracking-widest uppercase opacity-80 ${template === 'terminal' ? 'text-green-600' : template === 'temple' ? 'text-amber-900' : 'text-white'}`}>
                                                        {type}
                                                    </h3>
                                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                                        {buildKeys.map(key => {
                                                            const buildData = builds[key].data;
                                                            const normalizedData = {
                                                                ...buildData,
                                                                perks: buildData.perks instanceof Map ? buildData.perks : new Map(Array.isArray(buildData.perks) ? buildData.perks : []),
                                                                traits: buildData.traits instanceof Set ? buildData.traits : new Set(Array.isArray(buildData.traits) ? buildData.traits : []),
                                                                specialWeaponMap: new Set(buildData.specialWeaponMap || []),
                                                                signaturePowerMap: new Set(buildData.signaturePowerMap || []),
                                                                darkMagicianMap: new Set(buildData.darkMagicianMap || []),
                                                                powerLevelMap: new Set(buildData.powerLevelMap || []),
                                                                attunedSpellMap: new Set(buildData.attunedSpellMap || []),
                                                                magicalBeastMap: new Set(buildData.magicalBeastMap || []),
                                                            };
                                                            
                                                            const cost = calculateReferencePoints(type, normalizedData);

                                                            return (
                                                                <div key={key} className="w-full reference-capture-item" data-name={key} data-type={type}>
                                                                    <ReferenceBuildSummary
                                                                        type={type}
                                                                        name={key}
                                                                        selections={normalizedData}
                                                                        pointsSpent={cost}
                                                                        isSunForgerActive={isSunForgerActive}
                                                                        template={template}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Points Summary Breakdown */}
                        <div className={`w-full p-4 flex justify-center items-center gap-8 text-xs font-mono tracking-wide ${
                            template === 'temple' ? 'bg-[#f4f1ea] border-t border-amber-900/20 text-slate-600' : 
                            template === 'terminal' ? 'bg-black border-t border-green-500/50 text-green-500' :
                            template === 'vortex' ? 'bg-black text-gray-500 pt-2 pb-8' :
                            'bg-[#0a0f1e] border-t border-cyan-900/30 text-gray-400'
                        }`}>
                            <div className="flex items-baseline gap-2">
                               <span className={`${template === 'terminal' ? 'text-green-400' : template === 'temple' ? 'text-amber-800' : template === 'vortex' ? 'text-purple-400' : 'text-cyan-400'} font-bold`}>
                                   {ctx.language === 'ko' ? "축복 점수:" : "BP:"}
                               </span> 
                               <span className={`text-lg font-bold ${template === 'terminal' ? 'text-green-300' : template === 'temple' ? 'text-slate-900' : 'text-white'}`}>{ctx.blessingPoints}</span>
                               <span className="opacity-60 text-[10px]">(+{ctx.bpGained + 100} / -{ctx.bpSpent})</span>
                            </div>
                            <span className="opacity-30">|</span>
                            <div className="flex items-baseline gap-2">
                               <span className={`${template === 'terminal' ? 'text-green-400' : template === 'temple' ? 'text-green-700' : template === 'vortex' ? 'text-green-400' : 'text-green-400'} font-bold`}>
                                   {ctx.language === 'ko' ? "행운 점수:" : "FP:"}
                               </span> 
                               <span className={`text-lg font-bold ${template === 'terminal' ? 'text-green-300' : template === 'temple' ? 'text-slate-900' : 'text-white'}`}>{ctx.fortunePoints}</span>
                               <span className="opacity-60 text-[10px]">(+{ctx.fpGained + 100} / -{ctx.fpSpent})</span>
                            </div>
                            {(ctx.kpGained > 0 || ctx.kpSpent > 0) && (
                                <>
                                    <span className="opacity-30">|</span>
                                    <div className="flex items-baseline gap-2">
                                       <span className={`${template === 'terminal' ? 'text-green-400' : template === 'temple' ? 'text-pink-600' : template === 'vortex' ? 'text-pink-400' : 'text-pink-400'} font-bold`}>
                                           {ctx.language === 'ko' ? "쿠리-오단 점수:" : "KP:"}
                                       </span> 
                                       <span className={`text-lg font-bold ${template === 'terminal' ? 'text-green-300' : template === 'temple' ? 'text-slate-900' : 'text-white'}`}>{ctx.kuriPoints}</span>
                                       <span className="opacity-60 text-[10px]">(+{ctx.kpGained} / -{ctx.kpSpent})</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer Action Bar - ENHANCED FOR VISIBILITY */}
                <footer className="relative z-[150] bg-[#0a0f1e] border-t-2 border-cyan-500/50 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <div className="p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                        {/* Template Switcher */}
                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setShowTemplateSelector(!showTemplateSelector);
                                    setShowDownloadMenu(false);
                                }}
                                className="flex items-center gap-3 px-6 py-3 font-mono text-base text-white font-bold bg-slate-900 border-2 border-cyan-500/80 rounded-xl hover:bg-cyan-900 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all active:scale-95"
                            >
                                <TemplateIcon />
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-1">
                                        {ctx.language === 'ko' ? "이미지 스타일" : "IMAGE STYLE"}
                                    </span>
                                    <span className="font-mono text-sm">{
                                        template === 'temple' ? 'Temple (Divine)' :
                                        template === 'vortex' ? 'Vortex (Spiral)' :
                                        template === 'terminal' ? 'Terminal (Cyber)' :
                                        'Arcane (Default)'
                                    }</span>
                                </div>
                            </button>

                            {showTemplateSelector && (
                                <div className="absolute bottom-full left-0 mb-3 w-56 bg-black border-2 border-cyan-500 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up z-[200]">
                                    <button onClick={() => { setTemplate('default'); setShowTemplateSelector(false); }} className={`w-full text-left px-5 py-4 text-xs font-mono font-bold hover:bg-white/10 ${template === 'default' ? 'text-cyan-300 bg-cyan-900/20' : 'text-gray-400'}`}>
                                        Arcane (Default)
                                    </button>
                                    <button onClick={() => { setTemplate('temple'); setShowTemplateSelector(false); }} className={`w-full text-left px-5 py-4 text-xs font-mono font-bold hover:bg-white/10 ${template === 'temple' ? 'text-amber-400 bg-amber-900/20' : 'text-gray-400'}`}>
                                        Temple (Divine)
                                    </button>
                                    <button onClick={() => { setTemplate('vortex'); setShowTemplateSelector(false); }} className={`w-full text-left px-5 py-4 text-xs font-mono font-bold hover:bg-white/10 ${template === 'vortex' ? 'text-purple-400 bg-purple-900/20' : 'text-gray-400'}`}>
                                        Vortex (Spiral)
                                    </button>
                                    <button onClick={() => { setTemplate('terminal'); setShowTemplateSelector(false); }} className={`w-full text-left px-5 py-4 text-xs font-mono font-bold hover:bg-white/10 ${template === 'terminal' ? 'text-green-400 bg-green-900/20' : 'text-gray-400'}`}>
                                        Terminal (Cyber)
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-center md:justify-end">
                            {/* JSON Export */}
                            <button 
                                onClick={handleSaveToFile}
                                className="flex items-center justify-center gap-3 px-6 py-4 font-mono text-sm font-bold bg-slate-800 border-2 border-slate-600 rounded-xl text-slate-100 hover:bg-slate-700 hover:text-white hover:border-slate-300 transition-all active:scale-95 shadow-lg"
                                title="Download JSON File"
                            >
                                <FileExportIcon /> 
                                <span>{ctx.language === 'ko' ? "JSON 내보내기" : "EXPORT JSON"}</span>
                            </button>

                            {/* Browser Save */}
                            <button 
                                onClick={handleSaveToBrowser}
                                className="flex items-center justify-center gap-3 px-6 py-4 font-mono text-sm font-bold bg-indigo-900/40 border-2 border-indigo-500 rounded-xl text-indigo-100 hover:bg-indigo-800 hover:text-white hover:border-indigo-300 transition-all active:scale-95 shadow-lg"
                            >
                                <SaveDiskIcon /> 
                                <span>{ctx.language === 'ko' ? "브라우저 저장" : "BROWSER SAVE"}</span>
                            </button>
                            
                            {/* Download Image Menu */}
                            <div className="relative">
                                <button 
                                    onClick={() => {
                                        setShowDownloadMenu(!showDownloadMenu);
                                        setShowTemplateSelector(false);
                                    }}
                                    className="flex items-center justify-center gap-3 px-8 py-4 font-mono text-base font-bold bg-cyan-600 border-2 border-cyan-400 rounded-xl text-white hover:bg-cyan-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all active:scale-95 shadow-xl"
                                >
                                    <DownloadIcon /> 
                                    <span>{ctx.language === 'ko' ? "이미지 다운로드" : "DOWNLOAD IMG"}</span>
                                </button>
                                
                                {showDownloadMenu && (
                                    <div className="absolute bottom-full right-0 mb-3 w-64 bg-black border-2 border-cyan-400 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden animate-fade-in-up z-[200]">
                                        <div className="p-3 border-b border-white/10 bg-white/5">
                                            <p className="text-[10px] text-cyan-400 font-mono text-center font-bold tracking-widest uppercase">DOWNLOAD_OPTIONS</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDownload(false)} 
                                            className="w-full text-left px-5 py-4 hover:bg-cyan-900/40 group transition-colors"
                                        >
                                            <span className="block text-sm font-bold text-white font-mono uppercase">Build Only</span>
                                            <span className="block text-[10px] text-cyan-500/70 group-hover:text-cyan-300">Single PNG file</span>
                                        </button>
                                        <div className="h-px bg-white/10 mx-2"></div>
                                        <button 
                                            onClick={() => handleDownload(true)} 
                                            className="w-full text-left px-5 py-4 hover:bg-purple-900/40 group transition-colors"
                                        >
                                            <span className="block text-sm font-bold text-white font-mono uppercase">Build + Reference</span>
                                            <span className="block text-[10px] text-purple-500/70 group-hover:text-purple-300">Full ZIP archive</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            
            <style>{`
                 @keyframes spin-slow-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-slow-reverse {
                    animation: spin-slow-reverse 6s linear infinite;
                }
                .text-shadow-glow {
                    text-shadow: 0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3);
                }
            `}</style>
        </div>
    );
};
