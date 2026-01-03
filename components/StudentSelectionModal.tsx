
import React, { useEffect, useState } from 'react';
import { CLASSMATES_DATA, CUSTOM_CLASSMATE_CHOICES_DATA, COMPANION_CATEGORIES, COMPANION_RELATIONSHIPS, COMPANION_PERSONALITY_TRAITS, COMPANION_PERKS, COMPANION_POWER_LEVELS } from '../constants';
import type { Mentee, AllBuilds, CompanionSelections } from '../types';

interface StudentSelectionModalProps {
    onClose: () => void;
    onSelect: (mentee: Mentee) => void;
    currentMenteeId: string | null;
    selectedClassmateIds: Set<string>; // To visually distinguish or filter already selected classmates from Page 2
}

const STORAGE_KEY = 'seinaru_magecraft_builds';

const calculateCompanionPoints = (selections: CompanionSelections): number => {
    let total = 0;
    const allItems = [...COMPANION_CATEGORIES, ...COMPANION_RELATIONSHIPS, ...COMPANION_PERSONALITY_TRAITS, ...COMPANION_PERKS, ...COMPANION_POWER_LEVELS];
    
    if (selections.category) total += allItems.find(i => i.id === selections.category)?.cost ?? 0;
    if (selections.relationship) total += allItems.find(i => i.id === selections.relationship)?.cost ?? 0;
    if (selections.powerLevel) total += allItems.find(i => i.id === selections.powerLevel)?.cost ?? 0;
    if (selections.traits) selections.traits.forEach(traitId => { total += allItems.find(i => i.id === traitId)?.cost ?? 0; });
    if (selections.perks) selections.perks.forEach((count, perkId) => { 
        const item = allItems.find(i => i.id === perkId);
        if (item) {
            let cost = item.cost ?? 0;
            // Simplified signature power cost logic matching ReferencePage
            if (perkId === 'signature_power' && count > 0) {
                // 5 + (count - 1) * 10
                cost = 0; // Handled by total accumulation logic if we implemented full complexity, but here we approximate or use base.
                // Re-implementing specific logic for accurate filtering:
                total += 5 + (count - 1) * 10;
                return; // Skip default addition
            }
            total += cost * count; 
        }
    });
    
    return total;
};

const hydrateCompanionData = (data: any): CompanionSelections => {
    if (data) {
        return {
            ...data,
            traits: new Set(data.traits || []),
            perks: new Map(data.perks || []),
        };
    }
    return data;
};

export const StudentSelectionModal: React.FC<StudentSelectionModalProps> = ({
    onClose,
    onSelect,
    currentMenteeId,
    selectedClassmateIds
}) => {
    const [referenceCompanions, setReferenceCompanions] = useState<{name: string, points: number, imageSrc?: string}[]>([]);
    const [selectedTier, setSelectedTier] = useState<{ id: string, limit: number, cost: number, desc: string } | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (selectedTier) setSelectedTier(null);
                else onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        
        // Load Reference Companions
        const savedBuildsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedBuildsJSON) {
            try {
                const parsedBuilds: AllBuilds = JSON.parse(savedBuildsJSON);
                const companions = parsedBuilds.companions || {};
                const list: {name: string, points: number, imageSrc?: string}[] = [];
                
                for (const name in companions) {
                    const build = companions[name];
                    if (build.version === 1) {
                        const hydratedData = hydrateCompanionData(build.data);
                        const points = calculateCompanionPoints(hydratedData);
                        list.push({ 
                            name, 
                            points,
                            imageSrc: hydratedData.customImage || undefined
                        });
                    }
                }
                setReferenceCompanions(list);
            } catch (error) {
                console.error("Failed to parse companion builds from storage:", error);
            }
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, selectedTier]);

    const parseCost = (costStr: string) => {
        const match = costStr.match(/(-?\d+)\s*FP/i);
        return match ? Math.abs(parseInt(match[1], 10)) : 0;
    };

    const handleSelectTier = (option: any) => {
        const limit = option.id === 'custom_classmate_25' ? 25 : option.id === 'custom_classmate_35' ? 35 : 50;
        const cost = parseCost(option.cost);
        setSelectedTier({
            id: option.id,
            limit,
            cost,
            desc: option.description
        });
    };

    const handleSelectReference = (comp: {name: string, points: number}) => {
        if (!selectedTier) return;
        const id = `ref:${comp.name}`; // Unique ID for reference based selection
        onSelect({ 
            id, 
            type: 'custom', 
            name: comp.name, 
            originalCost: selectedTier.cost 
        });
    };

    const handleSelectClassmate = (id: string, name: string, cost: number) => {
        onSelect({ id, type: 'classmate', name, originalCost: cost });
    };

    // Green Theme Classes
    const theme = {
        border: 'border-green-700/80',
        headerBorder: 'border-green-900/50',
        titleText: 'text-green-200',
        closeBtn: 'text-green-200/70 hover:text-white',
        infoText: 'text-green-300/80',
        selectedItem: 'border-green-400 ring-2 ring-green-400/50',
        hoverItem: 'hover:border-green-400/50',
        footerBorder: 'border-green-900/50'
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4" onClick={onClose}>
            <div className={`bg-[#0a101f] border-2 ${theme.border} rounded-xl shadow-lg w-full max-w-4xl max-h-[85vh] flex flex-col`} onClick={(e) => e.stopPropagation()}>
                <header className={`flex items-center justify-between p-4 border-b ${theme.headerBorder}`}>
                    <div className="flex items-center gap-4">
                        {selectedTier && (
                            <button onClick={() => setSelectedTier(null)} className="text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <h2 className={`font-cinzel text-2xl ${theme.titleText}`}>
                            {selectedTier ? 'ASSIGN REFERENCE BUILD' : 'SELECT A STUDENT (1 FP DISCOUNT)'}
                        </h2>
                    </div>
                    <button onClick={onClose} className={`${theme.closeBtn} text-3xl font-bold transition-colors`}>&times;</button>
                </header>
                <main className="p-6 overflow-y-auto space-y-8">
                    {!selectedTier ? (
                        <>
                            <p className="text-gray-400 text-sm italic text-center">
                                Choose a student to mentor. You receive a 1 FP discount on their base cost. 
                                This discount overrides any other discounts.
                            </p>

                            {/* Create New Section */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Create New Student</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {CUSTOM_CLASSMATE_CHOICES_DATA.map(option => {
                                        const originalCost = parseCost(option.cost);
                                        const discountedCost = Math.max(0, originalCost - 1);
                                        const isSelected = currentMenteeId === option.id;

                                        return (
                                            <div 
                                                key={option.id}
                                                onClick={() => handleSelectTier(option)}
                                                className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-800 hover:border-green-500/50 ${isSelected ? 'bg-green-900/40 border-green-400 ring-1 ring-green-400' : 'bg-gray-900/50 border-gray-700'}`}
                                            >
                                                <h4 className="font-bold text-white text-sm mb-1">{option.description}</h4>
                                                <div className="flex justify-between items-center text-xs mt-2">
                                                    <span className="text-gray-500 line-through">{originalCost} FP</span>
                                                    <span className="text-green-400 font-bold">{discountedCost} FP</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Existing Classmates Section */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Choose From Classmates</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {CLASSMATES_DATA.map(classmate => {
                                        if (selectedClassmateIds.has(classmate.id) && currentMenteeId !== classmate.id) {
                                            return null; 
                                        }

                                        const originalCost = parseCost(classmate.cost);
                                        const discountedCost = Math.max(0, originalCost - 1);
                                        const isSelected = currentMenteeId === classmate.id;

                                        return (
                                            <div 
                                                key={classmate.id}
                                                onClick={() => handleSelectClassmate(classmate.id, classmate.name, originalCost)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-green-900/40 border-green-400 ring-1 ring-green-400' : 'bg-gray-900/50 border-gray-700 hover:border-green-500/50'}`}
                                            >
                                                <img src={classmate.imageSrc} alt={classmate.name} className="w-12 h-12 rounded-full object-cover" />
                                                <div className="flex-grow">
                                                    <h4 className="font-bold text-white text-sm">{classmate.name}</h4>
                                                    <div className="flex gap-2 text-xs mt-1">
                                                        <span className="text-gray-500 line-through">{originalCost} FP</span>
                                                        <span className="text-green-400 font-bold">{discountedCost} FP</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        // Build Selection View
                        <div className="space-y-4">
                            <p className={`text-center text-sm ${theme.infoText} mb-4 italic`}>
                                Select a companion build that costs {selectedTier.limit} CP or less.
                            </p>
                            
                            <div className="space-y-3">
                                {referenceCompanions.length > 0 ? (
                                    referenceCompanions.map((comp, idx) => {
                                        const isOverLimit = comp.points > selectedTier.limit;
                                        return (
                                            <div 
                                                key={`${comp.name}-${idx}`}
                                                onClick={() => !isOverLimit && handleSelectReference(comp)}
                                                className={`p-3 bg-slate-900/70 border rounded-md flex justify-between items-center transition-colors 
                                                    ${isOverLimit 
                                                        ? 'opacity-60 cursor-not-allowed border-gray-700/50' 
                                                        : `border-gray-800 ${theme.hoverItem} cursor-pointer group`
                                                    }
                                                `}
                                                role="button"
                                                aria-disabled={isOverLimit}
                                            >
                                                <div>
                                                    <h3 className={`font-semibold transition-colors ${isOverLimit ? 'text-gray-400' : 'text-white group-hover:text-green-300'}`}>{comp.name}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {isOverLimit 
                                                            ? `Cost exceeds ${selectedTier.limit} points` 
                                                            : 'Click to assign this student'
                                                        }
                                                    </p>
                                                </div>
                                                <span className={`font-bold text-lg ${isOverLimit ? 'text-red-500' : 'text-green-400'}`}>{comp.points} CP</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-gray-500 italic py-8">
                                        No companion builds found.
                                    </p>
                                )}
                                
                                {referenceCompanions.length === 0 && (
                                     <p className="text-center text-gray-500 italic py-8 border border-dashed border-gray-700 rounded-lg">
                                        No companion builds found.<br/>
                                        Go to the Reference Page to create one.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </main>
                {selectedTier && (
                    <footer className={`p-3 border-t ${theme.footerBorder} text-center`}>
                        <button
                            onClick={() => setSelectedTier(null)}
                            className="px-4 py-2 text-sm font-cinzel bg-gray-800/50 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Back
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};
