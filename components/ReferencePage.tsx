
import React, { useState, useEffect, useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { CompanionSection } from './reference/CompanionSection';
import { WeaponSection } from './reference/WeaponSection';
import { BeastSection } from './reference/BeastSection';
import { VehicleSection } from './reference/VehicleSection';
import { ReferenceBuildSummary } from './reference/ReferenceBuildSummary';
import type { 
    CompanionSelections, 
    WeaponSelections, 
    BeastSelections, 
    VehicleSelections, 
    BuildType, 
    AllBuilds, 
    SavedBuildData 
} from '../types';

// Add type declaration for html2canvas from CDN
declare global {
  interface Window {
    html2canvas: any;
  }
}

const STORAGE_KEY = 'seinaru_magecraft_builds';

const BUILD_TYPES: BuildType[] = ['companions', 'weapons', 'beasts', 'vehicles'];

const INITIAL_COMPANION: CompanionSelections = { category: null, relationship: null, traits: new Set(), perks: new Map(), powerLevel: null, bpSpent: 0 };
const INITIAL_WEAPON: WeaponSelections = { category: [], perks: new Map(), traits: new Set(), bpSpent: 0 };
const INITIAL_BEAST: BeastSelections = { category: [], size: null, perks: new Map(), traits: new Set(), bpSpent: 0 };
const INITIAL_VEHICLE: VehicleSelections = { category: [], perks: new Map(), traits: new Set(), bpSpent: 0 };

export const ReferencePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const ctx = useCharacterContext();
    const [activeTab, setActiveTab] = useState<BuildType>('companions');
    
    // Selections State
    const [companionSelections, setCompanionSelections] = useState<CompanionSelections>(INITIAL_COMPANION);
    const [weaponSelections, setWeaponSelections] = useState<WeaponSelections>(INITIAL_WEAPON);
    const [beastSelections, setBeastSelections] = useState<BeastSelections>(INITIAL_BEAST);
    const [vehicleSelections, setVehicleSelections] = useState<VehicleSelections>(INITIAL_VEHICLE);

    // Metadata State
    const [allBuilds, setAllBuilds] = useState<AllBuilds>({ companions: {}, weapons: {}, beasts: {}, vehicles: {} });
    const [currentName, setCurrentName] = useState('');
    const [pointsSpent, setPointsSpent] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [template, setTemplate] = useState<'default' | 'temple' | 'vortex' | 'terminal'>('default');
    const [isTransparent, setIsTransparent] = useState(false); // Transparency mode for peeking
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const previewSectionRef = useRef<HTMLDivElement>(null);

    // Refresh builds whenever buildsRefreshTrigger changes (e.g. after a load)
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const normalized: AllBuilds = {
                    companions: parsed.companions || {},
                    weapons: parsed.weapons || {},
                    beasts: parsed.beasts || {},
                    vehicles: parsed.vehicles || {}
                };
                setAllBuilds(normalized);
            } catch (e) {
                console.error("Failed to load builds", e);
            }
        }
    }, [ctx.buildsRefreshTrigger]); // Listen to trigger

    const saveBuildsToStorage = (builds: AllBuilds) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
        setAllBuilds(builds);
        // Trigger a refresh in context to update costs if applicable
        ctx.refreshBuildCosts();
    };

    const handleSave = () => {
        if (!currentName.trim()) {
            alert("Please enter a name for this build.");
            return;
        }
        
        let dataToSave: any;
        if (activeTab === 'companions') dataToSave = { ...companionSelections, perks: Array.from(companionSelections.perks.entries()), traits: Array.from(companionSelections.traits), specialWeaponMap: Array.from(companionSelections.specialWeaponMap || []), signaturePowerMap: Array.from(companionSelections.signaturePowerMap || []), darkMagicianMap: Array.from(companionSelections.darkMagicianMap || []), powerLevelMap: Array.from(companionSelections.powerLevelMap || []) };
        else if (activeTab === 'weapons') dataToSave = { ...weaponSelections, perks: Array.from(weaponSelections.perks.entries()), traits: Array.from(weaponSelections.traits), attunedSpellMap: Array.from(weaponSelections.attunedSpellMap || []) };
        else if (activeTab === 'beasts') dataToSave = { ...beastSelections, perks: Array.from(beastSelections.perks.entries()), traits: Array.from(beastSelections.traits), magicalBeastMap: Array.from(beastSelections.magicalBeastMap || []) };
        else if (activeTab === 'vehicles') dataToSave = { ...vehicleSelections, perks: Array.from(vehicleSelections.perks.entries()), traits: Array.from(vehicleSelections.traits) };

        const buildData: SavedBuildData = {
            version: 1,
            data: dataToSave
        };

        const newBuilds = { ...allBuilds };
        newBuilds[activeTab][currentName] = buildData;
        
        saveBuildsToStorage(newBuilds);
        alert(`Saved ${activeTab.slice(0, -1)} "${currentName}"!`);
    };

    const loadDataIntoView = (type: BuildType, data: any) => {
        if (type === 'companions') {
            setCompanionSelections({
                ...data,
                traits: new Set(data.traits),
                perks: new Map(data.perks),
                specialWeaponMap: new Set(data.specialWeaponMap),
                signaturePowerMap: new Set(data.signaturePowerMap),
                darkMagicianMap: new Set(data.darkMagicianMap),
                powerLevelMap: new Set(data.powerLevelMap)
            });
        } else if (type === 'weapons') {
            setWeaponSelections({
                ...data,
                traits: new Set(data.traits),
                perks: new Map(data.perks),
                attunedSpellMap: new Set(data.attunedSpellMap)
            });
        } else if (type === 'beasts') {
            setBeastSelections({
                ...data,
                traits: new Set(data.traits),
                perks: new Map(data.perks),
                magicalBeastMap: new Set(data.magicalBeastMap)
            });
        } else if (type === 'vehicles') {
            setVehicleSelections({
                ...data,
                traits: new Set(data.traits),
                perks: new Map(data.perks)
            });
        }
    };

    const handleLoad = (name: string) => {
        const build = allBuilds[activeTab][name];
        if (!build) return;
        
        const data = build.data;
        setCurrentName(name);
        loadDataIntoView(activeTab, data);
    };

    const handleDelete = (name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        const newBuilds = { ...allBuilds };
        delete newBuilds[activeTab][name];
        saveBuildsToStorage(newBuilds);
        if (currentName === name) {
            handleReset();
        }
    };

    const handleReset = () => {
        setCurrentName('');
        if (activeTab === 'companions') setCompanionSelections(INITIAL_COMPANION);
        else if (activeTab === 'weapons') setWeaponSelections(INITIAL_WEAPON);
        else if (activeTab === 'beasts') setBeastSelections(INITIAL_BEAST);
        else if (activeTab === 'vehicles') setVehicleSelections(INITIAL_VEHICLE);
    };

    const handleBpSpentChange = (amount: number) => {
         if (activeTab === 'companions') setCompanionSelections(prev => ({...prev, bpSpent: amount}));
         else if (activeTab === 'weapons') setWeaponSelections(prev => ({...prev, bpSpent: amount}));
         else if (activeTab === 'beasts') setBeastSelections(prev => ({...prev, bpSpent: amount}));
         else if (activeTab === 'vehicles') setVehicleSelections(prev => ({...prev, bpSpent: amount}));
    };

    const handleExport = () => {
        if (!currentName) {
            alert("Please save or name the build before exporting.");
            return;
        }
        
        let payload: any;
        if (activeTab === 'companions') payload = { ...companionSelections, perks: Array.from(companionSelections.perks.entries()), traits: Array.from(companionSelections.traits), specialWeaponMap: Array.from(companionSelections.specialWeaponMap || []), signaturePowerMap: Array.from(companionSelections.signaturePowerMap || []), darkMagicianMap: Array.from(companionSelections.darkMagicianMap || []), powerLevelMap: Array.from(companionSelections.powerLevelMap || []) };
        else if (activeTab === 'weapons') payload = { ...weaponSelections, perks: Array.from(weaponSelections.perks.entries()), traits: Array.from(weaponSelections.traits), attunedSpellMap: Array.from(weaponSelections.attunedSpellMap || []) };
        else if (activeTab === 'beasts') payload = { ...beastSelections, perks: Array.from(beastSelections.perks.entries()), traits: Array.from(beastSelections.traits), magicalBeastMap: Array.from(beastSelections.magicalBeastMap || []) };
        else if (activeTab === 'vehicles') payload = { ...vehicleSelections, perks: Array.from(vehicleSelections.perks.entries()), traits: Array.from(vehicleSelections.traits) };

        // Dependency gathering
        const buildsToExport: { type: BuildType, name: string, data: SavedBuildData }[] = [];
        
        // Add main build
        buildsToExport.push({
            type: activeTab,
            name: currentName,
            data: { version: 1, data: payload }
        });

        // If Companion, check for referenced Beast/Weapon
        if (activeTab === 'companions') {
            const comp = companionSelections;
            // Check Beast
            if (comp.inhumanFormBeastName) {
                const beastBuild = allBuilds.beasts[comp.inhumanFormBeastName];
                if (beastBuild) {
                    buildsToExport.push({ type: 'beasts', name: comp.inhumanFormBeastName, data: beastBuild });
                }
            }
            // Check Weapon
            if (comp.specialWeaponName) {
                const weaponBuild = allBuilds.weapons[comp.specialWeaponName];
                if (weaponBuild) {
                    buildsToExport.push({ type: 'weapons', name: comp.specialWeaponName, data: weaponBuild });
                }
            }
        }

        const exportData = {
            seinaruMeta: "multi-export", // Updated to multi-export
            mainBuild: { type: activeTab, name: currentName },
            builds: buildsToExport
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${activeTab}_${currentName.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonStr = event.target?.result as string;
                if (ctx.setDebugFileContent) ctx.setDebugFileContent(jsonStr);
                if (ctx.addDebugLog) ctx.addDebugLog(`Reference Import: ${file.name} (${jsonStr.length} bytes)`);

                const json = JSON.parse(jsonStr);
                
                // Handle new multi-export format
                if (json.seinaruMeta === "multi-export" && json.builds && Array.isArray(json.builds)) {
                    const newAllBuilds = { ...allBuilds };
                    let importCount = 0;

                    json.builds.forEach((b: any) => {
                        if (b.type && b.name && b.data && BUILD_TYPES.includes(b.type)) {
                            newAllBuilds[b.type as BuildType][b.name] = b.data;
                            importCount++;
                        }
                    });
                    
                    saveBuildsToStorage(newAllBuilds);
                    
                    // If a main build is specified, load it into view
                    if (json.mainBuild && json.mainBuild.type && json.mainBuild.name) {
                        const targetName = json.mainBuild.name;
                        const targetType = json.mainBuild.type as BuildType;
                        const mainData = newAllBuilds[targetType][targetName]?.data;
                        
                        if (mainData) {
                            setActiveTab(targetType);
                            setCurrentName(targetName);
                            loadDataIntoView(targetType, mainData);
                            alert(`Imported ${importCount} builds. Loaded "${targetName}".`);
                        } else {
                            alert(`Imported ${importCount} builds.`);
                        }
                    } else {
                        alert(`Imported ${importCount} builds.`);
                    }
                    return;
                }

                // Handle legacy single-export format
                if (json.seinaruMeta === "single-export" && json.type && json.payload) {
                    const type = json.type as BuildType;
                    const name = json.name;
                    const payload = json.payload;

                    if (!BUILD_TYPES.includes(type)) {
                        alert(`Unknown build type: ${type}`);
                        return;
                    }

                    if (allBuilds[type][name]) {
                        if (!confirm(`Overwrite existing "${name}"?`)) return;
                    }

                    const newAllBuilds: AllBuilds = {
                        ...allBuilds,
                        [type]: {
                            ...allBuilds[type],
                            [name]: payload,
                        },
                    };

                    saveBuildsToStorage(newAllBuilds);
                    alert(`Imported "${name}" into ${type}!`);
                    setActiveTab(type);
                    setCurrentName(name);
                    loadDataIntoView(type, payload.data);
                    return;
                }

                alert("Invalid file format.");

            } catch (err: any) {
                console.error(err);
                alert("Failed to parse file.");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleDownloadImage = async () => {
        if (!summaryRef.current || !window.html2canvas) {
            alert('Image generation feature is not ready. Please try again in a moment.');
            return;
        }

        try {
            const bgColor = template === 'temple' ? '#f8f5f2' : '#000000';
            const canvas = await window.html2canvas(summaryRef.current, {
                backgroundColor: bgColor, 
                useCORS: true,
                scale: 2,
            });
            
            const link = document.createElement('a');
            link.download = `seinaru-build-${template}-${currentName || 'Untitled'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error("Error generating build image:", error);
            alert("Sorry, there was an error generating the build image.");
        }
    };

    const scrollToPreview = () => {
        if (previewSectionRef.current) {
            previewSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleImageUpdate = (imageStr: string) => {
        if (activeTab === 'companions') setCompanionSelections(prev => ({ ...prev, customImage: imageStr }));
        else if (activeTab === 'weapons') setWeaponSelections(prev => ({ ...prev, customImage: imageStr }));
        else if (activeTab === 'beasts') setBeastSelections(prev => ({ ...prev, customImage: imageStr }));
        else if (activeTab === 'vehicles') setVehicleSelections(prev => ({ ...prev, customImage: imageStr }));
    };

    const currentSelections = activeTab === 'companions' ? companionSelections : activeTab === 'weapons' ? weaponSelections : activeTab === 'beasts' ? beastSelections : vehicleSelections;
    const isSunForgerActive = ctx.selectedStarCrossedLovePacts.has('sun_forgers_boon');

    const netPoints = pointsSpent - discount;

    return (
        <div className={`fixed inset-0 bg-[#0a101f] z-[100] overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${isTransparent ? 'opacity-15 pointer-events-none' : 'opacity-100'}`}>
             {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a101f]/95 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center pointer-events-auto">
                <div className="flex items-center gap-4">
                    <h2 className="font-cinzel text-2xl text-white tracking-widest">REFERENCE PAGE</h2>
                    <div className="flex bg-black/40 rounded p-1">
                        {BUILD_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => {
                                    setActiveTab(type);
                                    setCurrentName('');
                                }}
                                className={`px-4 py-2 text-sm font-bold uppercase rounded transition-all ${activeTab === type ? 'bg-cyan-900/50 text-cyan-200 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                            Total Points
                        </p>
                        <p className="text-2xl font-bold font-mono text-green-400">
                            {netPoints}
                        </p>
                        {discount > 0 && <p className="text-[10px] text-green-500">(Discounted Points: {discount})</p>}
                    </div>
                    {/* Transparency Toggle */}
                    <button 
                        onClick={() => setIsTransparent(!isTransparent)} 
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                        title={isTransparent ? "Restore View" : "Peek Behind"}
                    >
                         {isTransparent ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                             </svg>
                         ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                             </svg>
                         )}
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Sidebar: Saved Builds */}
                <aside className="w-full lg:w-96 bg-black/20 border-r border-gray-800 p-4 shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider">Saved {activeTab}</h3>
                        <button onClick={handleImportClick} className="text-xs text-cyan-400 hover:text-cyan-200 underline">Import</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                    </div>
                    <div className="space-y-2">
                        {Object.keys(allBuilds[activeTab]).map(buildName => (
                            <div key={buildName} className="flex justify-between items-center group p-2 rounded hover:bg-white/5 cursor-pointer" onClick={() => handleLoad(buildName)}>
                                <span className={`text-sm ${currentName === buildName ? 'text-cyan-300 font-bold' : 'text-gray-300'} break-all pr-2`}>{buildName}</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(buildName); }}
                                    className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2 flex-shrink-0"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        {Object.keys(allBuilds[activeTab]).length === 0 && (
                            <p className="text-xs text-gray-600 italic text-center py-4">No saved builds.</p>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-grow p-4 lg:p-8">
                     {/* Control Bar */}
                    <div className="mb-8 flex flex-wrap gap-4 items-center bg-black/40 p-4 rounded-lg border border-gray-800">
                        <input 
                            type="text" 
                            value={currentName} 
                            onChange={(e) => setCurrentName(e.target.value)} 
                            placeholder="Build Name..." 
                            className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500 flex-grow"
                        />
                        <button onClick={handleSave} className="px-4 py-2 bg-green-900/40 text-green-300 border border-green-700 rounded hover:bg-green-800/50 transition-colors">Save</button>
                        <button onClick={handleReset} className="px-4 py-2 bg-gray-800 text-gray-300 border border-gray-600 rounded hover:bg-gray-700 transition-colors">Reset</button>
                        <button onClick={handleExport} className="px-4 py-2 bg-blue-900/40 text-blue-300 border border-blue-700 rounded hover:bg-blue-800/50 transition-colors">Export</button>
                        <button onClick={scrollToPreview} className="px-4 py-2 bg-purple-900/40 text-purple-300 border border-purple-700 rounded hover:bg-purple-800/50 transition-colors">Download IMG</button>
                    
                        {isSunForgerActive && (
                            <div className="flex items-center gap-2 ml-auto border-l border-gray-700 pl-4">
                                <span className="text-xs text-yellow-500 font-bold uppercase">Sun Forger's Boon</span>
                                <div className="flex items-center bg-gray-900 rounded p-1">
                                    <button onClick={() => handleBpSpentChange(Math.max(0, (currentSelections as any).bpSpent - 1))} className="px-2 text-gray-400 hover:text-white">-</button>
                                    <span className="px-2 text-yellow-300 font-mono text-sm">{(currentSelections as any).bpSpent} BP</span>
                                    <button onClick={() => handleBpSpentChange((currentSelections as any).bpSpent + 1)} className="px-2 text-gray-400 hover:text-white">+</button>
                                </div>
                                <span className="text-xs text-gray-500">= -{(currentSelections as any).bpSpent * 2} Pts</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Sections */}
                    {activeTab === 'companions' && <CompanionSection setPoints={setPointsSpent} selections={companionSelections} setSelections={setCompanionSelections} />}
                    {activeTab === 'weapons' && <WeaponSection setPoints={setPointsSpent} setDiscount={setDiscount} selections={weaponSelections} setSelections={setWeaponSelections} />}
                    {activeTab === 'beasts' && <BeastSection setPoints={setPointsSpent} selections={beastSelections} setSelections={setBeastSelections} />}
                    {activeTab === 'vehicles' && <VehicleSection setPoints={setPointsSpent} selections={vehicleSelections} setSelections={setVehicleSelections} />}

                    {/* Preview Summary */}
                    <div className="mt-12 pt-8 border-t border-gray-800 scroll-mt-32" ref={previewSectionRef}>
                         <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                            <h3 className="font-cinzel text-xl text-gray-500 text-center md:text-left">PREVIEW</h3>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                {/* Template Selector */}
                                <div className="flex bg-black/40 rounded p-1 border border-gray-700">
                                    <button onClick={() => setTemplate('default')} className={`px-3 py-1 text-xs rounded transition-colors ${template === 'default' ? 'bg-cyan-900/60 text-cyan-200' : 'text-gray-500 hover:text-gray-300'}`}>Arcane</button>
                                    <button onClick={() => setTemplate('temple')} className={`px-3 py-1 text-xs rounded transition-colors ${template === 'temple' ? 'bg-amber-900/60 text-amber-200' : 'text-gray-500 hover:text-gray-300'}`}>Temple</button>
                                    <button onClick={() => setTemplate('vortex')} className={`px-3 py-1 text-xs rounded transition-colors ${template === 'vortex' ? 'bg-purple-900/60 text-purple-200' : 'text-gray-500 hover:text-gray-300'}`}>Vortex</button>
                                    <button onClick={() => setTemplate('terminal')} className={`px-3 py-1 text-xs rounded transition-colors ${template === 'terminal' ? 'bg-green-900/60 text-green-200' : 'text-gray-500 hover:text-gray-300'}`}>Terminal</button>
                                </div>
                                {/* Download Button */}
                                <button 
                                    onClick={handleDownloadImage}
                                    className="flex items-center gap-2 px-4 py-2 bg-cyan-900/30 border border-cyan-500/50 rounded text-cyan-200 hover:bg-cyan-800/50 hover:text-white transition-all text-xs font-bold font-cinzel"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    SAVE IMAGE
                                </button>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto" ref={summaryRef}>
                            <ReferenceBuildSummary 
                                type={activeTab} 
                                name={currentName || 'Untitled'} 
                                selections={currentSelections} 
                                pointsSpent={netPoints}
                                discount={discount}
                                isSunForgerActive={isSunForgerActive}
                                template={template}
                                onImageUpload={handleImageUpdate}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
