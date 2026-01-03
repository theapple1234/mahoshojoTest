
import React, { useEffect, useRef, useState } from 'react';
import { useCharacterContext } from '../context/CharacterContext';

const STORAGE_KEY = 'seinaru_magecraft_builds';
const DB_NAME = 'SeinaruMagecraftFullSaves';
const DB_VERSION = 2; // Bump version for new store
const SLOTS_PER_PAGE = 10;
const TOTAL_PAGES = 10;

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
);

const BGM_OPTIONS = [
    { id: 'GzIXfP0rkMk', name: 'Original', icon: <SparklesIcon /> },
    { id: 'IhQy946A64g', name: 'Mystical', icon: <MoonIcon /> },
    { id: 'iKwA2ymPsS4', name: 'Melancholic', icon: <CloudIcon /> }
];

interface SaveSlot {
    id: number;
    name: string;
    timestamp: string;
    character: any;
    reference: any;
    version: string;
}

export const SettingsModal: React.FC = () => {
    const { 
        isSettingsOpen, toggleSettings, 
        language, setLanguage,
        isPhotosensitivityDisabled, setPhotosensitivityDisabled,
        fontSize, setFontSize,
        volume, setVolume,
        bgmVideoId, setBgmVideoId,
        serializeState,
        loadFullBuild,
        openBuildSummary,
        addDebugLog,
        setDebugFileContent,
        refreshBuildCosts 
    } = useCharacterContext();

    const [currentView, setCurrentView] = useState<'main' | 'slots'>('main');
    const [slotMode, setSlotMode] = useState<'save' | 'load'>('save');
    const [currentPage, setCurrentPage] = useState(1);
    const [slotsData, setSlotsData] = useState<Record<number, SaveSlot>>({});
    
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isSettingsOpen) {
            setIsVisible(true);
        } else {
            timeout = setTimeout(() => {
                setIsVisible(false);
                setCurrentView('main');
                setNotification(null);
            }, 500);
        }
        return () => clearTimeout(timeout);
    }, [isSettingsOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (currentView === 'slots') {
                    setCurrentView('main');
                } else {
                    toggleSettings();
                }
            }
        };
        if (isSettingsOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSettingsOpen, toggleSettings, currentView]);

    const initDB = () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('saves')) {
                    db.createObjectStore('saves', { keyPath: 'name' }); // Legacy
                }
                if (!db.objectStoreNames.contains('save_slots')) {
                    db.createObjectStore('save_slots', { keyPath: 'id' }); // New Slots
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const fetchSlots = async () => {
        try {
            const db = await initDB();
            const tx = db.transaction('save_slots', 'readonly');
            const store = tx.objectStore('save_slots');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const slots = request.result as SaveSlot[];
                const slotMap: Record<number, SaveSlot> = {};
                slots.forEach(slot => {
                    slotMap[slot.id] = slot;
                });
                setSlotsData(slotMap);
            };
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    const handleSaveToSlot = async (slotId: number) => {
        const existing = slotsData[slotId];
        if (existing) {
            if (!confirm(language === 'en' ? `Overwrite Slot ${slotId}?` : `${slotId}번 슬롯을 덮어쓰시겠습니까?`)) return;
        }

        const buildName = prompt(language === 'en' ? "Enter a name for this save:" : "저장할 파일의 이름을 입력하세요:");
        if (!buildName) return;

        const mainState = serializeState();
        const refBuilds = localStorage.getItem(STORAGE_KEY) || '{}';
        
        const saveData: SaveSlot = {
            id: slotId,
            name: buildName,
            timestamp: new Date().toISOString(),
            character: mainState,
            reference: JSON.parse(refBuilds),
            version: '1.0'
        };

        try {
            const db = await initDB();
            const tx = db.transaction('save_slots', 'readwrite');
            const store = tx.objectStore('save_slots');
            await new Promise<void>((resolve, reject) => {
                const req = store.put(saveData);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
            
            showNotification(language === 'en' ? "Game saved!" : "게임 저장됨!");
            fetchSlots();
        } catch (error: any) {
            showNotification("Error saving: " + error.message, 'error');
        }
    };

    const handleLoadFromSlot = (slotId: number) => {
        const slot = slotsData[slotId];
        if (!slot) return;
        
        try {
            // Restore Reference
            if (slot.reference) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(slot.reference));
                refreshBuildCosts();
            }
            // Restore Character
            if (slot.character) {
                loadFullBuild(slot.character);
            }
            
            showNotification(language === 'en' ? "Game Loaded!" : "게임 로드됨!");
            toggleSettings(); // Close modal on load
        } catch (error: any) {
            showNotification("Error loading: " + error.message, 'error');
        }
    };

    const handleDeleteSlot = async (slotId: number) => {
        if (!confirm(language === 'en' ? "Delete this save?" : "이 저장을 삭제하시겠습니까?")) return;
        
        try {
            const db = await initDB();
            const tx = db.transaction('save_slots', 'readwrite');
            const store = tx.objectStore('save_slots');
            await new Promise<void>((resolve, reject) => {
                const req = store.delete(slotId);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
            fetchSlots();
            showNotification(language === 'en' ? "Deleted." : "삭제됨.");
        } catch (error: any) {
            showNotification("Error deleting: " + error.message, 'error');
        }
    };

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveToFile = () => {
        const mainState = serializeState();
        const refBuilds = localStorage.getItem(STORAGE_KEY) || '{}';
        const fullSaveData = {
            character: mainState,
            reference: JSON.parse(refBuilds),
            version: '1.0'
        };
        const blob = new Blob([JSON.stringify(fullSaveData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `seinaru_save_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showNotification(language === 'en' ? "File exported!" : "파일이 내보내졌습니다!");
    };

    const handleLoadFromFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = e.target?.result as string;
                const data = JSON.parse(json);
                if (data.reference) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.reference));
                    refreshBuildCosts();
                }
                if (data.character) {
                    loadFullBuild(data.character);
                }
                showNotification(language === 'en' ? "File Loaded!" : "파일 로드됨!");
                toggleSettings();
            } catch (error: any) {
                showNotification("Error loading file.", 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; 
    };

    if (!isVisible) return null;

    const SettingsHeader: React.FC<{ title: string }> = ({ title }) => (
        <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
            <span className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold whitespace-nowrap">
                {title}
            </span>
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
        </div>
    );

    const renderMainView = () => (
        <div className="space-y-4">
            {/* General Settings */}
            <section>
                <SettingsHeader title={language === 'en' ? 'General' : '일반 설정'} />
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-gray-300 font-sans text-xs font-medium tracking-wide">
                            {language === 'en' ? 'Language' : '언어'}
                        </span>
                        <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                            <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${language === 'en' ? 'bg-cyan-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>ENG</button>
                            <button onClick={() => setLanguage('ko')} className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${language === 'ko' ? 'bg-cyan-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>KOR</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-gray-300 font-sans text-xs font-medium tracking-wide">
                            {language === 'en' ? 'Font Size' : '글자 크기'}
                        </span>
                        <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                            <button onClick={() => setFontSize('regular')} className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${fontSize === 'regular' ? 'bg-cyan-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>REG</button>
                            <button onClick={() => setFontSize('large')} className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${fontSize === 'large' ? 'bg-cyan-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>LRG</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex flex-col pr-4">
                            <span className="text-gray-300 font-sans text-xs font-medium tracking-wide">
                                {language === 'en' ? 'Disable Photosensitive Effects' : '광과민성 연출 비활성화'}
                            </span>
                        </div>
                        <button onClick={() => setPhotosensitivityDisabled(!isPhotosensitivityDisabled)} className={`relative w-8 h-4 rounded-full transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 shrink-0 ${isPhotosensitivityDisabled ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                            <span className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-300 shadow-sm ${isPhotosensitivityDisabled ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Audio Settings */}
            <section>
                <SettingsHeader title={language === 'en' ? 'Audio' : '오디오 설정'} />
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-sans text-xs font-medium tracking-wide">
                            {language === 'en' ? 'Master Volume' : '마스터 볼륨'}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400">{volume}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"/>
                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-gray-300 font-sans text-xs font-medium tracking-wide">
                            {language === 'en' ? 'Background Music' : '배경 음악'}
                        </span>
                        <div className="flex gap-2">
                            {BGM_OPTIONS.map((bgm) => (
                                <button key={bgm.id} onClick={() => setBgmVideoId(bgm.id)} className={`p-2 rounded-md transition-all border flex items-center justify-center ${bgmVideoId === bgm.id ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200' : 'bg-black/20 border-gray-700 text-gray-500 hover:bg-white/5 hover:text-gray-300'}`} title={bgm.name}>
                                    {bgm.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Management */}
            <section>
                <SettingsHeader title={language === 'en' ? 'Data' : '데이터 관리'} />
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <button 
                        onClick={() => { setSlotMode('save'); setCurrentView('slots'); fetchSlots(); }}
                        className="group relative overflow-hidden p-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-cyan-500/50 transition-all flex flex-col items-center gap-1"
                    >
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        <span className="text-[9px] font-medium text-gray-300 group-hover:text-white">{language === 'en' ? 'Browser Save' : '브라우저 저장'}</span>
                    </button>
                    
                    <button 
                        onClick={handleSaveToFile}
                        className="group relative overflow-hidden p-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-cyan-500/50 transition-all flex flex-col items-center gap-1"
                    >
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span className="text-[9px] font-medium text-gray-300 group-hover:text-white">{language === 'en' ? 'Export File' : '파일 내보내기'}</span>
                    </button>

                    <button 
                        onClick={() => { setSlotMode('load'); setCurrentView('slots'); fetchSlots(); }}
                        className="group relative overflow-hidden p-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-green-500/50 transition-all flex flex-col items-center gap-1"
                    >
                         <svg className="w-4 h-4 text-gray-400 group-hover:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" /></svg>
                        <span className="text-[9px] font-medium text-gray-300 group-hover:text-white">{language === 'en' ? 'Browser Load' : '브라우저 로드'}</span>
                    </button>

                    <button 
                        onClick={handleLoadFromFile}
                        className="group relative overflow-hidden p-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-green-500/50 transition-all flex flex-col items-center gap-1"
                    >
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m-4-4v12" /></svg>
                        <span className="text-[9px] font-medium text-gray-300 group-hover:text-white">{language === 'en' ? 'Load File' : '파일 불러오기'}</span>
                    </button>

                    <button onClick={() => { openBuildSummary(); toggleSettings(); }} className="col-span-2 group relative overflow-hidden p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-gray-900 via-[#0f172a] to-cyan-900/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-row items-center justify-center gap-3 mt-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                        <div className="p-2 rounded-full bg-cyan-950/50 border border-cyan-500/30 group-hover:border-cyan-400/50 group-hover:bg-cyan-900/50 transition-colors"><svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                        <div className="flex flex-col items-start">
                            <span className={`font-cinzel font-bold text-sm text-cyan-100 tracking-wider group-hover:text-white transition-colors group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]`}>{language === 'en' ? 'DOWNLOAD BUILD IMAGE' : '빌드 이미지 다운로드'}</span>
                            <span className="text-[9px] text-cyan-500/70 font-mono tracking-tight group-hover:text-cyan-400/80">{language === 'en' ? 'Save as PNG' : 'PNG로 저장'}</span>
                        </div>
                    </button>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleFileChange} />
                </div>
            </section>
        </div>
    );

    const renderSlotsView = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4 shrink-0">
                <button 
                    onClick={() => setCurrentView('main')}
                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className={`text-lg font-cinzel ${slotMode === 'save' ? 'text-cyan-200' : 'text-green-200'}`}>
                    {slotMode === 'save' 
                        ? (language === 'en' ? 'Select Slot to Save' : '저장할 슬롯 선택') 
                        : (language === 'en' ? 'Select Slot to Load' : '불러올 슬롯 선택')}
                </h3>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                {Array.from({ length: SLOTS_PER_PAGE }).map((_, idx) => {
                    const slotIndex = (currentPage - 1) * SLOTS_PER_PAGE + idx + 1;
                    const slot = slotsData[slotIndex];
                    const isOccupied = !!slot;

                    return (
                        <div 
                            key={slotIndex} 
                            className={`
                                relative border rounded-lg p-3 flex items-center gap-4 transition-all
                                ${isOccupied 
                                    ? (slotMode === 'load' ? 'bg-green-900/10 border-green-800/50 hover:bg-green-900/20 hover:border-green-500/50 cursor-pointer' : 'bg-cyan-900/10 border-cyan-800/50 hover:bg-cyan-900/20 hover:border-cyan-500/50 cursor-pointer') 
                                    : (slotMode === 'save' ? 'bg-black/20 border-dashed border-gray-700 hover:border-gray-500 hover:bg-white/5 cursor-pointer' : 'bg-black/20 border-dashed border-gray-800 opacity-50 cursor-not-allowed')
                                }
                            `}
                            onClick={() => {
                                if (slotMode === 'save') handleSaveToSlot(slotIndex);
                                else if (isOccupied) handleLoadFromSlot(slotIndex);
                            }}
                        >
                            <div className={`text-xl font-mono font-bold w-8 text-center ${isOccupied ? 'text-white' : 'text-gray-600'}`}>
                                {slotIndex.toString().padStart(2, '0')}
                            </div>
                            
                            <div className="flex-grow min-w-0">
                                {isOccupied ? (
                                    <>
                                        <h4 className="text-sm font-bold text-gray-200 truncate">{slot.name}</h4>
                                        <p className="text-[10px] text-gray-500 font-mono">
                                            {new Date(slot.timestamp).toLocaleString()}
                                        </p>
                                    </>
                                ) : (
                                    <span className="text-sm text-gray-500 italic">
                                        {language === 'en' ? 'Empty Slot' : '빈 슬롯'}
                                    </span>
                                )}
                            </div>

                            {isOccupied && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slotIndex); }}
                                    className="p-2 rounded text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5 shrink-0">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs border border-gray-700 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                >
                    Prev
                </button>
                <span className="text-xs font-mono text-gray-500">
                    Page {currentPage} / {TOTAL_PAGES}
                </span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
                    disabled={currentPage === TOTAL_PAGES}
                    className="px-3 py-1 text-xs border border-gray-700 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-500 ${isSettingsOpen ? 'bg-black/60 backdrop-blur-md opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'}`}>
            <div className={`relative bg-[#0b101b] border border-cyan-500/30 w-full max-w-lg rounded-2xl shadow-[0_0_40px_rgba(8,145,178,0.2)] flex flex-col overflow-hidden max-h-[85vh] ${isSettingsOpen ? 'animate-fade-in-up-modal' : 'animate-fade-out-down-modal'}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

                <div className="relative z-10 px-6 py-3 border-b border-white/5 flex items-center justify-center bg-black/20 shrink-0">
                    <div className="flex flex-col items-center w-full">
                        <h2 className={`text-lg sm:text-xl text-white tracking-[0.2em] drop-shadow-md ${language === 'en' ? 'font-cinzel' : 'font-sans font-bold'}`}>
                            {language === 'en' ? 'SETTINGS' : '설정'}
                        </h2>
                        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-1"></div>
                    </div>
                    <button onClick={toggleSettings} className="absolute right-6 text-white/40 hover:text-cyan-400 transition-colors text-2xl leading-none" aria-label="Close">&times;</button>
                </div>

                <div className="relative z-10 p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {currentView === 'main' ? renderMainView() : renderSlotsView()}
                </div>

                {notification && (
                    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg backdrop-blur-md border transition-all animate-fade-in-up-toast z-50 flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100 shadow-green-900/20' : 'bg-red-900/90 border-red-500 text-red-100 shadow-red-900/20'}`}>
                        <span className="font-cinzel font-bold text-sm tracking-wide">{notification.message}</span>
                    </div>
                )}

                {currentView === 'main' && (
                    <div className="relative z-10 p-3 bg-black/80 border-t border-cyan-900/30 text-center shrink-0">
                        <p className="font-cinzel text-[9px] text-cyan-500/80 tracking-[0.3em] mb-1 font-bold">CREDITS</p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-[9px] text-gray-300 font-mono tracking-wide">
                            <span className="flex items-center gap-2"><span className="text-gray-500 uppercase">Original by</span> <strong className="text-white hover:text-cyan-400 transition-colors">NXTUB</strong></span>
                            <span className="hidden sm:inline text-gray-700">•</span>
                            <span className="flex items-center gap-2"><span className="text-gray-500 uppercase">Interactive by</span> <strong className="text-white hover:text-cyan-400 transition-colors">SAVIAPPLE</strong></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
