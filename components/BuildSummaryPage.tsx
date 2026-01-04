
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

// Add type declaration for html2canvas from CDN
declare global {
  interface Window {
    html2canvas: any;
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

        setShowDownloadMenu(false);
        setIsGenerating(true);
        const bgColor = template === 'temple' ? '#f8f5f2' : '#000000';
        const timestamp = new Date().toISOString().slice(0,10);

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
                // Do NOT set height or windowHeight. Let html2canvas calculate height automatically based on content.
                windowWidth: captureWidth, 
                onclone: (clonedDoc: Document) => {
                    const clonedElement = clonedDoc.querySelector('[data-capture-target]') as HTMLElement;
                    if (clonedElement) {
                        // Ensure container can expand freely
                        clonedElement.style.overflow = 'visible';
                        clonedElement.style.height = 'auto';
                        clonedElement.style.maxHeight = 'none';
                        clonedElement.style.minHeight = '100%';
                        clonedElement.style.width = `${captureWidth}px`;
                    
                        // Inject style to raise text by 7.5px (default)
                        const style = clonedDoc.createElement('style');
                        style.innerHTML = `
                            h1, h2, h3, h4, h5, h6, p, label, button, a, div > span:not(.absolute) {
                                position: relative;
                                top: -7.5px;
                            }
                        `;
                        clonedDoc.head.appendChild(style);

                        // Special exceptions for Trait titles to raise them by 10px
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
                        
                        // Apply Milgrath visual shift ONLY during capture
                        const milgrathElements = clonedElement.querySelectorAll('.milgrath-override-content');
                        milgrathElements.forEach((el: any) => {
                            el.style.position = 'relative';
                            el.style.top = '-5px'; 
                        });
                    }
                    
                    // Force background color on body to prevent transparency artifacts
                    const clonedBody = clonedDoc.body;
                    clonedBody.style.backgroundColor = bgColor;
                    clonedBody.style.width = `${captureWidth}px`;
                }
            };

            // Fix for Vortex Layout needing extra space and specific width
            if (template === 'vortex') {
                options.windowWidth = 2600;
            }

            const mainCanvas = await window.html2canvas(element, options);
            
            downloadImage(mainCanvas, `seinaru-build-${template}-${timestamp}.png`);

            // 2. Capture References if requested
            if (includeReference) {
                const hasReferenceContent = Object.values(referenceBuilds).some(cat => Object.keys(cat).length > 0);
                
                if (hasReferenceContent) {
                    // Show appendix so we can capture elements
                    setShowReferenceAppendix(true);
                    // Artificial delay to ensure DOM is fully repainted before capture loops begin
                    await new Promise(resolve => setTimeout(resolve, 800)); 

                    const appendixElement = document.getElementById('reference-appendix');
                    if (appendixElement) {
                         const refItems = appendixElement.querySelectorAll('.reference-capture-item');
                         for (let i = 0; i < refItems.length; i++) {
                             const item = refItems[i] as HTMLElement;
                             const name = item.dataset.name || `ref-${i}`;
                             const type = item.dataset.type || 'misc';
                             
                             // Calculate dimensions for reference card
                             const rect = item.getBoundingClientRect();
                             const refWidth = Math.max(rect.width, 900); // Ensure width
                             
                             const refCanvas = await window.html2canvas(item, {
                                 backgroundColor: bgColor,
                                 useCORS: true,
                                 scale: 2,
                                 logging: false,
                                 windowWidth: refWidth,
                                 onclone: (clonedDoc: Document) => {
                                     // Similar expansion logic for reference cards
                                     const clonedNode = clonedDoc.querySelector(`[data-name="${name}"]`) as HTMLElement;
                                     if (clonedNode) {
                                        clonedNode.style.height = 'auto';
                                        clonedNode.style.overflow = 'visible';
                                     }

                                     // Inject style to raise text by 7.5px
                                     const style = clonedDoc.createElement('style');
                                     style.innerHTML = `
                                         h1, h2, h3, h4, h5, h6, p, label, button, a, div > span:not(.absolute) {
                                             position: relative;
                                             top: -7.5px;
                                         }
                                     `;
                                     clonedDoc.head.appendChild(style);
                                 }
                             });
                             
                             downloadImage(refCanvas, `seinaru-${type}-${name}-${template}.png`);
                             
                             // Add delay between downloads
                             await new Promise(r => setTimeout(r, 300));
                         }
                    }
                    
                    // Hide after done
                    setShowReferenceAppendix(false);
                } else {
                     alert("No reference builds found to download.");
                }
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
        const buildName = prompt("Enter a name for this build:");
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
            putRequest.onsuccess = () => alert(`Build "${buildName}" saved successfully!`);
            putRequest.onerror = () => alert(`Error saving build: ${putRequest.error?.message}`);
        };
    };

    const handleSaveToFile = () => {
        const serializableCtx = ctx.serializeState();
        const refBuilds = localStorage.getItem(STORAGE_KEY) || '{}';
        const fullSaveData = {
            character: serializableCtx,
            reference: JSON.parse(refBuilds),
            version: '1.0'
        };
        const blob = new Blob([JSON.stringify(fullSaveData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `seinaru_build_export_${new Date().toISOString().slice(0,10)}.json`;
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-cinzel text-2xl text-white tracking-widest drop-shadow-md">YOUR BUILD</h2>
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
                     {/* Add data-capture-target attribute to be found by onclone */}
                     <div ref={summaryContentRef} data-capture-target="true" className={`min-h-full flex flex-col ${containerBgClass}`}>
                        <div className="flex-grow">
                            {template === 'default' && (
                                <div className="p-8 bg-[#0a0f1e] min-h-full relative overflow-hidden">
                                    {/* Using a cleaner gradient instead of blur to avoid render issues */}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(22,78,99,0.3)_0%,transparent_70%)] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                    <ArcaneLayout sections={sections} />
                                </div>
                            )}
                            {template === 'temple' && <TempleLayout sections={sections} />}
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
                            {template === 'terminal' && <TerminalLayout sections={sections} />}

                            {/* Reference Appendix - Rendered only when downloading if requested */}
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
                                                            // Normalize data for display
                                                            const normalizedData = {
                                                                ...buildData,
                                                                perks: buildData.perks instanceof Map ? buildData.perks : new Map(Array.isArray(buildData.perks) ? buildData.perks : []),
                                                                traits: buildData.traits instanceof Set ? buildData.traits : new Set(Array.isArray(buildData.traits) ? buildData.traits : []),
                                                                // Convert all Map-like arrays back to Maps/Sets if needed by sub-components
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
                                                                        // No interactive image upload in static render
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

                        {/* Points Summary Breakdown - Inside Image Capture Area */}
                        <div className={`w-full p-4 flex justify-center items-center gap-6 text-xs font-mono tracking-wide ${
                            template === 'temple' ? 'bg-[#f4f1ea] border-t border-amber-900/20 text-slate-600' : 
                            template === 'terminal' ? 'bg-black border-t border-green-500/50 text-green-500' :
                            template === 'vortex' ? 'bg-black text-gray-500 pt-2 pb-8' :
                            'bg-[#0a0f1e] border-t border-cyan-900/30 text-gray-400'
                        }`}>
                            <div className="flex gap-2">
                               <span className={`${template === 'terminal' ? 'text-green-400' : template === 'temple' ? 'text-amber-800' : 'text-purple-400'} font-bold`}>BP:</span> 
                               <span className={`${template === 'terminal' ? 'text-green-300' : template === 'temple' ? 'text-slate-800' : 'text-purple-200'}`}>+{ctx.bpGained + 100}</span>
                               <span className="opacity-50">/</span>
                               <span className="text-red-400">-{ctx.bpSpent}</span>
                            </div>
                            <span className="opacity-30">|</span>
                            <div className="flex gap-2">
                               <span className={`${template === 'terminal' ? 'text-green-400' : template === 'temple' ? 'text-green-700' : 'text-green-400'} font-bold`}>FP:</span> 
                               <span className={`${template === 'terminal' ? 'text-green-300' : template === 'temple' ? 'text-slate-800' : 'text-green-200'}`}>+{ctx.fpGained + 100}</span>
                               <span className="opacity-50">/</span>
                               <span className="text-red-400">-{ctx.fpSpent}</span>
                            </div>
                            {(ctx.kpGained > 0 || ctx.kpSpent > 0) && (
                                <>
                                    <span className="opacity-30">|</span>
                                    <div className="flex gap-2">
                                       <span className={`${template === 'terminal' ? 'text-green-400' : template === 'temple' ? 'text-pink-600' : 'text-pink-400'} font-bold`}>KP:</span> 
                                       <span className={`${template === 'terminal' ? 'text-green-300' : template === 'temple' ? 'text-slate-800' : 'text-pink-200'}`}>+{ctx.kpGained}</span>
                                       <span className="opacity-50">/</span>
                                       <span className="text-red-400">-{ctx.kpSpent}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer Action Bar */}
                <footer className="relative z-[150] bg-[#0a0f1e]/95 border-t border-cyan-900/50 flex flex-col">
                    <div className="p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
                        {/* Template Switcher */}
                        <div className="relative">
                            <button 
                                onClick={() => {
                                    setShowTemplateSelector(!showTemplateSelector);
                                    setShowDownloadMenu(false);
                                }}
                                className="flex items-center gap-2 px-5 py-2 font-cinzel text-sm text-white font-bold bg-cyan-800/80 border-2 border-cyan-500 rounded-lg hover:bg-cyan-600 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                            >
                                <TemplateIcon />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[8px] text-cyan-400 font-normal tracking-wider mb-0.5">DOWNLOAD STYLE</span>
                                    <span>{
                                        template === 'temple' ? 'Divine (Temple)' :
                                        template === 'vortex' ? 'Spiral (Vortex)' :
                                        template === 'terminal' ? 'Cyber (Terminal)' :
                                        'Arcane (Default)'
                                    }</span>
                                </div>
                            </button>

                            {/* Template Popup */}
                            {showTemplateSelector && (
                                <div className="absolute bottom-full left-0 mb-2 w-48 bg-black/95 border border-gray-700 rounded-lg shadow-xl overflow-hidden animate-fade-in-up z-50">
                                    <button onClick={() => { setTemplate('default'); setShowTemplateSelector(false); }} className={`w-full text-left px-4 py-3 text-xs font-cinzel hover:bg-white/10 ${template === 'default' ? 'text-cyan-400' : 'text-gray-300'}`}>
                                        Arcane (Default)
                                    </button>
                                    <button onClick={() => { setTemplate('temple'); setShowTemplateSelector(false); }} className={`w-full text-left px-4 py-3 text-xs font-cinzel hover:bg-white/10 ${template === 'temple' ? 'text-amber-400' : 'text-gray-300'}`}>
                                        Temple (Divine)
                                    </button>
                                    <button onClick={() => { setTemplate('vortex'); setShowTemplateSelector(false); }} className={`w-full text-left px-4 py-3 text-xs font-cinzel hover:bg-white/10 ${template === 'vortex' ? 'text-purple-400' : 'text-gray-300'}`}>
                                        Vortex (Spiral)
                                    </button>
                                    <button onClick={() => { setTemplate('terminal'); setShowTemplateSelector(false); }} className={`w-full text-left px-4 py-3 text-xs font-mono hover:bg-white/10 ${template === 'terminal' ? 'text-green-400' : 'text-gray-300'}`}>
                                        Terminal (Cyber)
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                            <button 
                                onClick={handleSaveToFile}
                                className="hidden lg:flex items-center justify-center gap-2 px-4 py-3 font-cinzel text-xs font-bold bg-slate-800 border border-slate-600 rounded text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-400 transition-all"
                                title="Download JSON File"
                            >
                                <FileExportIcon /> 
                                <span>EXPORT JSON</span>
                            </button>

                            <button 
                                onClick={handleSaveToBrowser}
                                className="hidden lg:flex items-center justify-center gap-2 px-4 py-3 font-cinzel text-xs font-bold bg-slate-800 border border-slate-600 rounded text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-400 transition-all"
                            >
                                <SaveDiskIcon /> 
                                <span>BROWSER SAVE</span>
                            </button>
                            
                            {/* Improved Download Menu */}
                            <div className="relative">
                                <button 
                                    onClick={() => {
                                        setShowDownloadMenu(!showDownloadMenu);
                                        setShowTemplateSelector(false);
                                    }}
                                    className="flex items-center justify-center gap-2 px-8 py-3 font-cinzel text-sm font-bold bg-cyan-900/30 border border-cyan-500 rounded text-cyan-200 hover:bg-cyan-800/50 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                                >
                                    <DownloadIcon /> 
                                    <span>DOWNLOAD IMG</span>
                                </button>
                                
                                {showDownloadMenu && (
                                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-black/95 border border-cyan-500/30 rounded-lg shadow-2xl overflow-hidden animate-fade-in-up z-50">
                                        <div className="p-2 border-b border-white/5 bg-white/5">
                                            <p className="text-[10px] text-gray-400 font-cinzel text-center tracking-widest uppercase">Select Option</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDownload(false)} 
                                            className="w-full text-left px-4 py-3 hover:bg-cyan-900/20 group transition-colors"
                                        >
                                            <span className="block text-xs font-bold text-cyan-300 group-hover:text-white font-cinzel">Build Only</span>
                                            <span className="block text-[10px] text-gray-500 group-hover:text-gray-400">Main Summary Image Only</span>
                                        </button>
                                        <div className="h-px bg-white/5 mx-2"></div>
                                        <button 
                                            onClick={() => handleDownload(true)} 
                                            className="w-full text-left px-4 py-3 hover:bg-purple-900/20 group transition-colors"
                                        >
                                            <span className="block text-xs font-bold text-purple-300 group-hover:text-white font-cinzel">Build + Reference</span>
                                            <span className="block text-[10px] text-gray-500 group-hover:text-gray-400">Multiple Images (Main + Refs)</span>
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
            `}</style>
        </div>
    );
};
