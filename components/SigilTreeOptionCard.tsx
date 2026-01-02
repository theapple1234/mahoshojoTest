
import React, { useState, useEffect } from 'react';
import { COMPANION_CATEGORIES, COMPANION_RELATIONSHIPS, COMPANION_PERSONALITY_TRAITS, COMPANION_PERKS, COMPANION_POWER_LEVELS } from '../constants';
import type { AllBuilds, CompanionSelections } from '../types';

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
            // Handle Signature Power scaling cost logic if present in calculation context
            // Note: Basic calculation here uses base cost. 
            // If strictly matching ReferencePage logic is needed for Signature Power (5, then 10), 
            // logic would need to be added here, but usually base cost is sufficient for selection filter.
            if (perkId === 'signature_power' && count > 1) {
                // Approximate logic: 5 + (count-1)*10
                // Base cost is 5. So add (count-1) * 5 extra?
                // For simplicity in this modal filter, we stick to base cost calculation 
                // or replicate logic if critical. 
                // Given "NaN" fix is the priority, ensuring `count` is a number via Map fix is key.
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
            perks: new Map(data.perks || []), // Fixed: Changed from Set to Map to correctly store counts
        };
    }
    return data;
};

interface CompanionSelectionModalProps {
    currentCompanionName: string | null;
    onClose: () => void;
    onSelect: (companionName: string | null) => void;
    pointLimit?: number;
    title: string;
    categoryFilter?: string;
    validator?: (data: CompanionSelections) => boolean;
    colorTheme?: 'purple' | 'green' | 'amber' | 'cyan';
}

export const CompanionSelectionModal: React.FC<CompanionSelectionModalProps> = ({
    currentCompanionName,
    onClose,
    onSelect,
    pointLimit = Infinity,
    title,
    categoryFilter,
    validator,
    colorTheme = 'purple'
}) => {
    const [companionBuilds, setCompanionBuilds] = useState<Record<string, { points: number }>>({});

    useEffect(() => {
        const savedBuildsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedBuildsJSON) {
            try {
                const parsedBuilds: AllBuilds = JSON.parse(savedBuildsJSON);
                const companions = parsedBuilds.companions || {};
                const buildsWithPoints: Record<string, { points: number }> = {};
                
                for (const name in companions) {
                    const build = companions[name];
                    if (build.version === 1) {
                        const hydratedData = hydrateCompanionData(build.data);
                        
                        if (categoryFilter && hydratedData.category !== categoryFilter) {
                            continue;
                        }

                        if (validator && !validator(hydratedData)) {
                            continue;
                        }

                        const points = calculateCompanionPoints(hydratedData);
                        buildsWithPoints[name] = { points };
                    }
                }
                setCompanionBuilds(buildsWithPoints);
            } catch (error) {
                console.error("Failed to parse companion builds from storage:", error);
            }
        }
    }, [categoryFilter, validator]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const themeClasses = {
        purple: {
            border: 'border-purple-700/80',
            headerBorder: 'border-purple-900/50',
            titleText: 'text-purple-200',
            closeBtn: 'text-purple-200/70 hover:text-white',
            infoText: 'text-purple-300/80',
            selectedItem: 'border-purple-400 ring-2 ring-purple-400/50',
            hoverItem: 'hover:border-purple-400/50',
            footerBorder: 'border-purple-900/50'
        },
        green: {
            border: 'border-green-700/80',
            headerBorder: 'border-green-900/50',
            titleText: 'text-green-200',
            closeBtn: 'text-green-200/70 hover:text-white',
            infoText: 'text-green-300/80',
            selectedItem: 'border-green-400 ring-2 ring-green-400/50',
            hoverItem: 'hover:border-green-400/50',
            footerBorder: 'border-green-900/50'
        },
        amber: {
            border: 'border-amber-700/80',
            headerBorder: 'border-amber-900/50',
            titleText: 'text-amber-200',
            closeBtn: 'text-amber-200/70 hover:text-white',
            infoText: 'text-amber-300/80',
            selectedItem: 'border-amber-400 ring-2 ring-amber-400/50',
            hoverItem: 'hover:border-amber-400/50',
            footerBorder: 'border-amber-900/50'
        },
        cyan: {
            border: 'border-cyan-700/80',
            headerBorder: 'border-cyan-900/50',
            titleText: 'text-cyan-200',
            closeBtn: 'text-cyan-200/70 hover:text-white',
            infoText: 'text-cyan-300/80',
            selectedItem: 'border-cyan-400 ring-2 ring-cyan-400/50',
            hoverItem: 'hover:border-cyan-400/50',
            footerBorder: 'border-cyan-900/50'
        }
    };

    const currentTheme = themeClasses[colorTheme] || themeClasses.purple;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[101] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="companion-modal-title"
        >
            <div
                className={`bg-[#100c14] border-2 ${currentTheme.border} rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className={`flex items-center justify-between p-4 border-b ${currentTheme.headerBorder}`}>
                    <h2 id="companion-modal-title" className={`font-cinzel text-2xl ${currentTheme.titleText}`}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`${currentTheme.closeBtn} text-3xl font-bold transition-colors`}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <p className={`text-center text-sm ${currentTheme.infoText} mb-4 italic`}>
                        Select a companion build{pointLimit !== Infinity ? ` that costs ${pointLimit} Companion Points or less` : ''}.
                        {categoryFilter && ` Must have category: ${categoryFilter.toUpperCase()}.`}
                        {validator && ` Must meet specific criteria.`}
                    </p>
                    <div className="space-y-3">
                        {Object.keys(companionBuilds).length > 0 ? (
                            Object.keys(companionBuilds).map((name) => {
                                const { points } = companionBuilds[name];
                                const isSelected = name === currentCompanionName;
                                const isDisabled = points > pointLimit;
                                const costColor = isDisabled ? 'text-red-500' : 'text-green-400';
                                
                                return (
                                    <div
                                        key={name}
                                        onClick={() => !isDisabled && onSelect(name)}
                                        className={`p-3 bg-slate-900/70 border rounded-md flex justify-between items-center transition-colors ${
                                            isDisabled 
                                                ? 'border-gray-700 opacity-60 cursor-not-allowed'
                                                : isSelected
                                                    ? `${currentTheme.selectedItem} cursor-pointer`
                                                    : `border-gray-800 ${currentTheme.hoverItem} cursor-pointer`
                                        }`}
                                        role="button"
                                        aria-disabled={isDisabled}
                                        aria-pressed={isSelected}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-white">{name}</h3>
                                            <p className="text-xs text-gray-400">
                                                {isDisabled ? `Cost exceeds ${pointLimit} points` : 'Click to assign this companion'}
                                            </p>
                                        </div>
                                        <span className={`font-bold text-lg ${costColor}`}>
                                            {isNaN(points) ? "Error" : points} CP
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 italic py-8">
                                No compatible companion builds found. Go to the Reference Page to create one.
                            </p>
                        )}
                    </div>
                </main>
                 <footer className={`p-3 border-t ${currentTheme.footerBorder} text-center`}>
                    <button
                        onClick={() => onSelect(null)}
                        className="px-4 py-2 text-sm font-cinzel bg-gray-800/50 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Clear Assignment
                    </button>
                </footer>
            </div>
        </div>
    );
};
