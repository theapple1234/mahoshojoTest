
import React, { useEffect, useRef, useState } from 'react';
import { useCharacterContext } from '../context/CharacterContext';

const STORAGE_KEY = 'seinaru_magecraft_builds';
const DB_NAME = 'SeinaruMagecraftFullSaves';
const DB_VERSION = 2;
const SLOTS_PER_PAGE = 10;
const TOTAL_PAGES = 10;

// --- Icons ---
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
);
const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const VolumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);
const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
);
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const BGM_OPTIONS = [
    { id: 'GzIXfP0rkMk', name: 'The Stars', desc: 'Track A', icon: <SparklesIcon /> },
    { id: 'IhQy946A64g', name: 'The Moon', desc: 'Track B', icon: <MoonIcon /> },
    { id: 'iKwA2ymPsS4', name: 'The Cloud', desc: 'Track C', icon: <CloudIcon /> }
];

interface SaveSlot {
    id: number;
    name: string;
    timestamp: string;
    character: any;
    reference: any;
    version: string;
}

type Tab = 'general' | 'audio' | 'about';

// --- Reusable UI Components ---

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button 
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${checked ? 'bg-cyan-600 border border-cyan-400/50' : 'bg-gray-800 border border-gray-700'}`}
    >
        <span 
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} 
        />
        {checked && <span className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>}
    </button>
);

const SegmentedControl: React.FC<{ options: { value: string; label: string }[]; value: string; onChange: (val: any) => void }> = ({ options, value, onChange }) => {
    return (
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 relative w-full">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-300 relative z-10 ${value === opt.value ? 'text-white text-shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {opt.label}
                </button>
            ))}
            {/* Sliding Background */}
            <div 
                className="absolute top-1 bottom-1 bg-cyan-700/80 rounded-md transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.4)] border border-cyan-500/30"
                style={{
                    width: `${100 / options.length}%`,
                    left: `${(options.findIndex(o => o.value === value)) * (100 / options.length)}%`
                }}
            />
        </div>
    );
};

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
        refreshBuildCosts 
    } = useCharacterContext();

    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [currentView, setCurrentView] = useState<'settings' | 'slots'>('settings');
    const [slotMode, setSlotMode] = useState<'save' | 'load'>('save');
    const [currentPage, setCurrentPage] = useState(1);
    const [slotsData, setSlotsData] = useState<Record<number, SaveSlot>>({});
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Initial Animation Handling
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isSettingsOpen) {
            setIsVisible(true);
        } else {
            timeout = setTimeout(() => {
                setIsVisible(false);
                setCurrentView('settings');
                setActiveTab('general');
                setNotification(null);
            }, 400);
        }
        return () => clearTimeout(timeout);
    }, [isSettingsOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isSettingsOpen) {
                if (currentView === 'slots') setCurrentView('settings');
                else toggleSettings();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSettingsOpen, currentView, toggleSettings]);

    // --- DB Logic ---
    const initDB = () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('save_slots')) {
                    db.createObjectStore('save_slots', { keyPath: 'id' });
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
                slots.forEach(slot => { slotMap[slot.id] = slot; });
                setSlotsData(slotMap);
            };
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- Handlers ---
    const handleSaveToSlot = async (slotId: number) => {
        if (slotsData[slotId]) {
            if (!confirm(language === 'en' ? `Overwrite Slot ${slotId}?` : `${slotId}번 슬롯을 덮어쓰시겠습니까?`)) return;
        }
        const buildName = prompt(language === 'en' ? "Enter a name for this save:" : "저장할 파일의 이름을 입력하세요:");
        if (!buildName) return;

        const saveData: SaveSlot = {
            id: slotId,
            name: buildName,
            timestamp: new Date().toISOString(),
            character: serializeState(),
            reference: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
            version: '1.0'
        };

        try {
            const db = await initDB();
            const tx = db.transaction('save_slots', 'readwrite');
            await new Promise<void>((resolve, reject) => {
                const req = tx.objectStore('save_slots').put(saveData);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
            showNotification(language === 'en' ? "Saved successfully." : "저장되었습니다.");
            fetchSlots();
        } catch (error: any) {
            showNotification("Error: " + error.message, 'error');
        }
    };

    const handleLoadFromSlot = (slotId: number) => {
        const slot = slotsData[slotId];
        if (!slot) return;
        try {
            if (slot.reference) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(slot.reference));
                refreshBuildCosts();
            }
            if (slot.character) loadFullBuild(slot.character);
            showNotification(language === 'en' ? "Loaded successfully." : "로드되었습니다.");
            toggleSettings();
        } catch (error: any) {
            showNotification("Error: " + error.message, 'error');
        }
    };

    const handleDeleteSlot = async (slotId: number) => {
        if (!confirm(language === 'en' ? "Delete this save?" : "정말 삭제하시겠습니까?")) return;
        try {
            const db = await initDB();
            const tx = db.transaction('save_slots', 'readwrite');
            await new Promise<void>((resolve, reject) => {
                const req = tx.objectStore('save_slots').delete(slotId);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
            fetchSlots();
            showNotification(language === 'en' ? "Deleted." : "삭제되었습니다.");
        } catch (error: any) {
            showNotification("Error: " + error.message, 'error');
        }
    };

    const handleSaveToFile = () => {
        const fullSaveData = {
            character: serializeState(),
            reference: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
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
        showNotification(language === 'en' ? "File exported." : "파일이 내보내졌습니다.");
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (!data || typeof data !== 'object' || (!data.character && !data.reference)) throw new Error("Invalid");
                if (data.reference) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.reference));
                    refreshBuildCosts();
                }
                if (data.character) loadFullBuild(data.character);
                showNotification(language === 'en' ? "File loaded." : "파일이 로드되었습니다.");
                toggleSettings();
            } catch (error) {
                showNotification(language === 'en' ? "Invalid file." : "유효하지 않은 파일입니다.", 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    if (!isVisible) return null;

    // --- Sub-Renders ---

    const renderNav = () => (
        <div className="w-full md:w-48 flex-shrink-0 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-2 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {[
                { id: 'general', label: language === 'en' ? 'General' : '일반', icon: <CogIcon/> },
                { id: 'audio', label: language === 'en' ? 'Audio' : '오디오', icon: <VolumeIcon/> },
                { id: 'about', label: language === 'en' ? 'About' : '정보', icon: <InfoIcon/> }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left group relative overflow-hidden ${activeTab === tab.id ? 'bg-cyan-900/30 text-cyan-200 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                >
                    <span className={`relative z-10 ${activeTab === tab.id ? 'text-cyan-400' : 'group-hover:text-gray-200'}`}>{tab.icon}</span>
                    <span className={`relative z-10 text-xs font-bold uppercase tracking-wider ${activeTab === tab.id ? 'text-cyan-100' : ''}`}>{tab.label}</span>
                    {activeTab === tab.id && <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-transparent"></div>}
                </button>
            ))}
        </div>
    );

    const renderGeneral = () => (
        <div className="flex flex-col h-full gap-4 animate-fade-in-up">
            {/* Interface Settings Group */}
            <div className="flex-shrink-0">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 mb-2">
                    {language === 'en' ? 'Interface Settings' : '인터페이스 설정'}
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Language - Compact */}
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
                        <label className="text-gray-300 text-xs font-bold mb-2">{language === 'en' ? 'Language' : '언어'}</label>
                        <SegmentedControl 
                            options={[{value: 'en', label: 'Eng'}, {value: 'ko', label: '한국어'}]}
                            value={language}
                            onChange={setLanguage}
                        />
                    </div>

                    {/* Font Size - Compact */}
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
                        <label className="text-gray-300 text-xs font-bold mb-2">{language === 'en' ? 'Font Size' : '글자 크기'}</label>
                        <SegmentedControl 
                            options={[{value: 'regular', label: 'REG'}, {value: 'large', label: 'LRG'}]}
                            value={fontSize}
                            onChange={setFontSize}
                        />
                    </div>
                </div>

                {/* Photosensitivity - Horizontal Compact */}
                <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-gray-300 text-xs font-bold">
                        {language === 'en' ? 'Reduced Motion' : '광과민성 보호'}
                    </span>
                    <ToggleSwitch checked={isPhotosensitivityDisabled} onChange={() => setPhotosensitivityDisabled(!isPhotosensitivityDisabled)} />
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 w-full"></div>

            {/* Data Management Group */}
            <div className="flex-1 min-h-0 flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                    {language === 'en' ? 'Data Management' : '데이터 관리'}
                </h4>

                {/* Download Build Image - Reduced height slightly */}
                <button 
                    onClick={() => { openBuildSummary(); toggleSettings(); }}
                    className="w-full relative group overflow-hidden p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-gray-900 to-black hover:border-cyan-400/60 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex-shrink-0"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 group-hover:via-cyan-500/10 transition-all duration-500"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex flex-col items-start">
                            <span className="font-cinzel text-base font-bold text-cyan-100 tracking-wider group-hover:text-white transition-colors">{language === 'en' ? 'DOWNLOAD BUILD IMAGE' : '빌드 이미지 다운로드'}</span>
                            <span className="text-[10px] text-cyan-500/60 font-mono mt-0.5">{language === 'en' ? 'Save your character as a PNG' : 'PNG 이미지로 저장'}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform group-hover:border-cyan-400 group-hover:text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                    </div>
                </button>

                <div className="grid grid-cols-2 gap-3 flex-grow">
                     {/* Browser Storage */}
                    <div className="flex flex-col gap-2">
                         <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1 opacity-70">{language === 'en' ? 'Browser Storage' : '브라우저 저장소'}</h4>
                         <button 
                                onClick={() => { setSlotMode('save'); setCurrentView('slots'); fetchSlots(); }}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-cyan-900/20 hover:border-cyan-500/30 hover:text-cyan-100 transition-all text-gray-300 text-xs font-bold group"
                            >
                                <span>{language === 'en' ? 'Save to Slot' : '슬롯에 저장'}</span>
                                <span className="opacity-50 group-hover:opacity-100 text-cyan-400">→</span>
                        </button>
                        <button 
                                onClick={() => { setSlotMode('load'); setCurrentView('slots'); fetchSlots(); }}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-green-900/20 hover:border-green-500/30 hover:text-green-100 transition-all text-gray-300 text-xs font-bold group"
                            >
                                <span>{language === 'en' ? 'Load from Slot' : '슬롯에서 로드'}</span>
                                <span className="opacity-50 group-hover:opacity-100 text-green-400">→</span>
                        </button>
                    </div>

                    {/* Local File */}
                    <div className="flex flex-col gap-2">
                        <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1 opacity-70">{language === 'en' ? 'Local File' : '로컬 파일'}</h4>
                        <button 
                                onClick={handleSaveToFile}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-purple-900/20 hover:border-purple-500/30 hover:text-purple-100 transition-all text-gray-300 text-xs font-bold group"
                            >
                                <span>{language === 'en' ? 'Export JSON' : 'JSON 내보내기'}</span>
                                <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                        <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-orange-900/20 hover:border-orange-500/30 hover:text-orange-100 transition-all text-gray-300 text-xs font-bold group"
                            >
                                <span>{language === 'en' ? 'Import JSON' : 'JSON 불러오기'}</span>
                                <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m-4-4v12" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAudio = () => (
        <div className="space-y-6 animate-fade-in-up">
            {/* Master Volume */}
            <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-gray-300 text-sm font-bold">{language === 'en' ? 'Master Volume' : '전체 볼륨'}</label>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900">{volume}%</span>
                </div>
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-purple-500" style={{ width: `${volume}%` }}></div>
                    <input 
                        type="range" min="0" max="100" value={volume} 
                        onChange={(e) => setVolume(parseInt(e.target.value))} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* BGM Selection */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">{language === 'en' ? 'Background Music' : '배경 음악'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BGM_OPTIONS.map((bgm) => {
                        const isSelected = bgmVideoId === bgm.id;
                        return (
                            <button
                                key={bgm.id}
                                onClick={() => setBgmVideoId(bgm.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 gap-2 relative overflow-hidden group ${isSelected ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                            >
                                <div className={`text-2xl transition-transform duration-500 ${isSelected ? 'text-cyan-300 scale-110' : 'text-gray-600 group-hover:text-gray-400 group-hover:scale-110'}`}>
                                    {bgm.icon}
                                </div>
                                <div className="relative z-10 text-center">
                                    <span className={`block text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{bgm.name}</span>
                                    <span className="text-[9px] text-gray-500 block mt-0.5">{bgm.desc}</span>
                                </div>
                                {isSelected && <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderAbout = () => (
        <div className="text-center space-y-8 animate-fade-in-up py-4">
            <div>
                <h3 className="font-cinzel text-xl font-bold text-white mb-2 tracking-widest">SEINARU MAGECRAFT GIRLS</h3>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto"></div>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border border-white/5 max-w-sm mx-auto">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Original Creator</p>
                    <p className="text-sm font-bold text-cyan-300 font-cinzel">NXTUB</p>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border border-white/5 max-w-sm mx-auto">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Interactive Version</p>
                    <p className="text-sm font-bold text-purple-300 font-cinzel">SAVIAPPLE</p>
                </div>
            </div>

            <p className="text-[10px] text-gray-600 font-mono max-w-xs mx-auto">
                {language === 'en' ? 'All rights to the original content belong to their respective creators.' : '사진 등을 포함한 원작 콘텐츠의 모든 권리는 원작자에게 있습니다.'}
            </p>
        </div>
    );

    const renderSlots = () => (
        <div className="h-full flex flex-col animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
                <button 
                    onClick={() => setCurrentView('settings')}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeftIcon />
                </button>
                <div>
                    <h3 className="text-lg font-cinzel text-white tracking-wide">
                        {slotMode === 'save' ? (language === 'en' ? 'Select Slot' : '슬롯 선택') : (language === 'en' ? 'Load Game' : '게임 불러오기')}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {slotMode === 'save' ? (language === 'en' ? 'Save your progress' : '진행 상황 저장') : (language === 'en' ? 'Resume your journey' : '여정 계속하기')}
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {Array.from({ length: SLOTS_PER_PAGE }).map((_, idx) => {
                    const slotId = (currentPage - 1) * SLOTS_PER_PAGE + idx + 1;
                    const slot = slotsData[slotId];
                    const isOccupied = !!slot;
                    const borderColor = isOccupied 
                        ? (slotMode === 'save' ? 'border-amber-500/30 group-hover:border-amber-500/60' : 'border-green-500/30 group-hover:border-green-500/60') 
                        : 'border-white/5 group-hover:border-white/20';

                    return (
                        <div 
                            key={slotId}
                            onClick={() => {
                                if (slotMode === 'save') handleSaveToSlot(slotId);
                                else if (isOccupied) handleLoadFromSlot(slotId);
                            }}
                            className={`
                                group relative p-3 rounded-lg border bg-black/20 hover:bg-white/5 transition-all cursor-pointer flex items-center gap-4
                                ${borderColor}
                            `}
                        >
                            <span className="font-mono text-xs font-bold text-gray-600 group-hover:text-gray-400 w-6 text-center">
                                {slotId.toString().padStart(2, '0')}
                            </span>
                            
                            <div className="flex-1 min-w-0">
                                {isOccupied ? (
                                    <>
                                        <p className={`text-sm font-bold truncate ${slotMode === 'save' ? 'text-amber-100 group-hover:text-amber-50' : 'text-green-100 group-hover:text-green-50'}`}>
                                            {slot.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                                            {new Date(slot.timestamp).toLocaleString()}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-gray-600 italic group-hover:text-gray-500">
                                        {language === 'en' ? 'Empty Slot' : '빈 슬롯'}
                                    </p>
                                )}
                            </div>

                            {isOccupied && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slotId); }}
                                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                    title="Delete"
                                >
                                    <span className="text-lg leading-none">&times;</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="pt-4 mt-2 border-t border-white/5 flex justify-between items-center text-xs">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
                >
                    Prev
                </button>
                <span className="font-mono text-gray-600">{currentPage} / {TOTAL_PAGES}</span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
                    disabled={currentPage === TOTAL_PAGES}
                    className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
                >
                    Next
                </button>
            </div>
        </div>
    );

    // --- Main Render ---

    return (
        <div className={`fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 transition-all duration-300 ${isSettingsOpen ? 'bg-black/80 backdrop-blur-sm opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div 
                className={`
                    w-full max-w-4xl h-[600px] md:h-[500px] bg-[#0b0f17] border border-cyan-500/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row relative
                    ${isSettingsOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'} transition-all duration-300
                `}
            >
                {/* Decorative Borders */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-white/5 rounded-tl-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-white/5 rounded-br-2xl pointer-events-none"></div>
                
                {/* Notification Toast */}
                {notification && (
                    <div className={`absolute top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-xs font-bold tracking-wide border animate-fade-in-up-toast ${notification.type === 'success' ? 'bg-green-900/90 text-green-200 border-green-500/50' : 'bg-red-900/90 text-red-200 border-red-500/50'}`}>
                        {notification.message}
                    </div>
                )}

                {/* Sidebar Navigation */}
                {currentView === 'settings' && renderNav()}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-black/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-purple-900/5 pointer-events-none"></div>
                    
                    {/* Content Header (Mobile only basically, or title) */}
                    <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#0b0f17]/50">
                        <h2 className="font-cinzel text-2xl text-white tracking-widest drop-shadow-md">
                            {currentView === 'slots' ? (slotMode === 'save' ? 'SAVE' : 'LOAD') : 'SETTINGS'}
                        </h2>
                        <button onClick={toggleSettings} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                            <span className="text-2xl leading-none">&times;</span>
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">
                        {currentView === 'slots' ? renderSlots() : (
                            <>
                                {activeTab === 'general' && renderGeneral()}
                                {activeTab === 'audio' && renderAudio()}
                                {activeTab === 'about' && renderAbout()}
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
                .text-shadow-sm {
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    );
};
