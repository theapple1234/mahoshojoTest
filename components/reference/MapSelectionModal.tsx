import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Page3Constants from '../../constants/pageThree';
import type { ChoiceItem, MagicGrade } from '../../types';
import { renderFormattedText } from '../ui';
import { useCharacterContext } from '../../context/CharacterContext';

interface MapSelectionModalProps {
    onClose: () => void;
    onSelect: (selectedIds: Set<string>) => void;
    initialSelectedIds: Set<string>;
    title: string;
    // Logic Configuration
    pointLimit?: number; // Used if gradeCosts is provided for budget calculation
    gradeCosts?: { [key in MagicGrade]?: number }; // Cost per grade
    limits?: { [key in MagicGrade]?: number }; // e.g., { kaarn: 2, purth: 1 }
    maxTotal?: number; // If set, overrides specific limits for a total count cap
    exclusive?: boolean; // If true, picking a grade blocks others (e.g. 2 Kaarn OR 1 Purth)
    bannedGrades?: MagicGrade[]; // Grades that cannot be selected
    maxBlessings?: number; // Maximum number of unique blessings
    bannedItemIds?: string[]; // Specific IDs that cannot be selected
    mandatoryItemIds?: string[]; // IDs that are automatically selected, cannot be removed, and don't count towards limits
    customValidator?: (selectedIds: Set<string>, blessingCounts: Record<string, number>, gradeCounts: Record<string, number>) => string | null;
}

const GRADE_STYLES: Record<string, { selected: string; unselected: string; bgSelected: string }> = {
    kaarn: {
        selected: 'border-gray-400 text-gray-200 shadow-gray-500/20',
        unselected: 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300',
        bgSelected: 'bg-gray-900/80'
    },
    purth: {
        selected: 'border-green-400 text-green-200 shadow-green-500/20',
        unselected: 'border-green-800 text-green-600 hover:border-green-500 hover:text-green-400',
        bgSelected: 'bg-green-950/80'
    },
    xuth: {
        selected: 'border-red-500 text-red-200 shadow-red-500/20',
        unselected: 'border-red-900 text-red-600 hover:border-red-500 hover:text-red-400',
        bgSelected: 'bg-red-950/80'
    },
    lekolu: {
        selected: 'border-yellow-400 text-yellow-200 shadow-yellow-500/20',
        unselected: 'border-yellow-800 text-yellow-600 hover:border-yellow-400 hover:text-yellow-200',
        bgSelected: 'bg-yellow-950/80'
    },
    sinthru: {
        selected: 'border-purple-500 text-purple-200 shadow-purple-500/20',
        unselected: 'border-purple-800 text-purple-600 hover:border-purple-500 hover:text-purple-300',
        bgSelected: 'bg-purple-950/80'
    },
    default: {
        selected: 'border-gray-500 text-gray-300',
        unselected: 'border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-500',
        bgSelected: 'bg-black/80'
    }
};

const GRADE_NAMES_KO: Record<string, string> = {
    kaarn: '카른',
    purth: '퍼르스',
    xuth: '주스',
    lekolu: '레콜루',
    sinthru: '신스루'
};

export const MapSelectionModal: React.FC<MapSelectionModalProps> = ({ 
    onClose, 
    onSelect, 
    initialSelectedIds, 
    title, 
    pointLimit = 9999,
    gradeCosts = {},
    limits = {},
    maxTotal,
    exclusive = false,
    bannedGrades = [],
    maxBlessings,
    bannedItemIds = [],
    mandatoryItemIds = [],
    customValidator
}) => {
    const { language } = useCharacterContext();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
        const initial = new Set(initialSelectedIds);
        mandatoryItemIds.forEach(id => initial.add(id));
        return initial;
    });
    const [activeTab, setActiveTab] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const BLESSING_GROUPS = useMemo(() => {
        const isKo = language === 'ko';
        const C = Page3Constants;
        
        return [
            { 
                title: isKo ? "길조" : "Good Tidings", 
                items: isKo 
                    ? [...C.ESSENTIAL_BOONS_DATA_KO, ...C.MINOR_BOONS_DATA_KO, ...C.MAJOR_BOONS_DATA_KO] 
                    : [...C.ESSENTIAL_BOONS_DATA, ...C.MINOR_BOONS_DATA, ...C.MAJOR_BOONS_DATA] 
            },
            { 
                title: isKo ? "강렬한 의지" : "Compelling Will", 
                items: isKo 
                    ? [...C.TELEKINETICS_DATA_KO, ...C.METATHERMICS_DATA_KO] 
                    : [...C.TELEKINETICS_DATA, ...C.METATHERMICS_DATA] 
            },
            { 
                title: isKo ? "경험과 지혜" : "Worldly Wisdom", 
                items: isKo 
                    ? [...C.ELEANORS_TECHNIQUES_DATA_KO, ...C.GENEVIEVES_TECHNIQUES_DATA_KO] 
                    : [...C.ELEANORS_TECHNIQUES_DATA, ...C.GENEVIEVES_TECHNIQUES_DATA] 
            },
            { 
                title: isKo ? "씁쓸한 불만족" : "Bitter Dissatisfaction", 
                items: isKo 
                    ? [...C.BREWING_DATA_KO, ...C.SOUL_ALCHEMY_DATA_KO, ...C.TRANSFORMATION_DATA_KO] 
                    : [...C.BREWING_DATA, ...C.SOUL_ALCHEMY_DATA, ...C.TRANSFORMATION_DATA] 
            },
            { 
                title: isKo ? "잃어버린 희망" : "Lost Hope", 
                items: isKo 
                    ? [...C.CHANNELLING_DATA_KO, ...C.NECROMANCY_DATA_KO, ...C.BLACK_MAGIC_DATA_KO] 
                    : [...C.CHANNELLING_DATA, ...C.NECROMANCY_DATA, ...C.BLACK_MAGIC_DATA] 
            },
            { 
                title: isKo ? "무너진 평화" : "Fallen Peace", 
                items: isKo 
                    ? [...C.TELEPATHY_DATA_KO, ...C.MENTAL_MANIPULATION_DATA_KO] 
                    : [...C.TELEPATHY_DATA, ...C.MENTAL_MANIPULATION_DATA] 
            },
            { 
                title: isKo ? "품위있는 패배" : "Gracious Defeat", 
                items: isKo 
                    ? [...C.ENTRANCE_DATA_KO, ...C.FEATURES_DATA_KO, ...C.INFLUENCE_DATA_KO] 
                    : [...C.ENTRANCE_DATA, ...C.FEATURES_DATA, ...C.INFLUENCE_DATA] 
            },
            { 
                title: isKo ? "폐쇄회로" : "Closed Circuits", 
                items: isKo 
                    ? [...C.NET_AVATAR_DATA_KO, ...C.TECHNOMANCY_DATA_KO, ...C.NANITE_CONTROL_DATA_KO] 
                    : [...C.NET_AVATAR_DATA, ...C.TECHNOMANCY_DATA, ...C.NANITE_CONTROL_DATA] 
            },
            { 
                title: isKo ? "정당한 창조" : "Righteous Creation", 
                items: isKo 
                    ? [...C.RIGHTEOUS_CREATION_SPECIALTIES_DATA_KO, ...C.RIGHTEOUS_CREATION_MAGITECH_DATA_KO, ...C.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA_KO, ...C.RIGHTEOUS_CREATION_METAMAGIC_DATA_KO] 
                    : [...C.RIGHTEOUS_CREATION_SPECIALTIES_DATA, ...C.RIGHTEOUS_CREATION_MAGITECH_DATA, ...C.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, ...C.RIGHTEOUS_CREATION_METAMAGIC_DATA] 
            },
            { 
                title: isKo ? "불행한 사랑" : "Star Crossed Love", 
                items: isKo 
                    ? C.STAR_CROSSED_LOVE_PACTS_DATA_KO 
                    : C.STAR_CROSSED_LOVE_PACTS_DATA 
            },
        ];
    }, [language]);

    const currentCost = useMemo(() => {
        let total = 0;
        selectedIds.forEach(id => {
            if (mandatoryItemIds.includes(id)) return; // Don't count cost for mandatory items

            let item: ChoiceItem | undefined;
            for (const group of BLESSING_GROUPS) {
                const found = group.items.find(i => i.id === id);
                if (found) {
                    item = found;
                    break;
                }
            }
            if (item && item.grade) {
                const cost = gradeCosts[item.grade] ?? 0; 
                total += cost;
            }
        });
        return total;
    }, [selectedIds, gradeCosts, mandatoryItemIds, BLESSING_GROUPS]);

    // Calculate current counts per grade
    const counts = useMemo(() => {
        const c: Record<string, number> = { kaarn: 0, purth: 0, xuth: 0, lekolu: 0, sinthru: 0 };
        selectedIds.forEach(id => {
            if (mandatoryItemIds.includes(id)) return; // Exclude mandatory items from grade counts

            let item: ChoiceItem | undefined;
            for (const group of BLESSING_GROUPS) {
                const found = group.items.find(i => i.id === id);
                if (found) {
                    item = found;
                    break;
                }
            }
            if (item && item.grade) {
                c[item.grade] = (c[item.grade] || 0) + 1;
            }
        });
        return c;
    }, [selectedIds, mandatoryItemIds, BLESSING_GROUPS]);

    const blessingCounts = useMemo(() => {
        const c: Record<string, number> = {};
        selectedIds.forEach(id => {
            if (mandatoryItemIds.includes(id)) return; // Exclude mandatory items from blessing counts

            for (const group of BLESSING_GROUPS) {
                if (group.items.some(i => i.id === id)) {
                    c[group.title] = (c[group.title] || 0) + 1;
                    break;
                }
            }
        });
        return c;
    }, [selectedIds, mandatoryItemIds, BLESSING_GROUPS]);

    const handleToggle = (item: ChoiceItem) => {
        setError(null);
        if (mandatoryItemIds.includes(item.id)) return; // Cannot toggle mandatory items

        const grade = item.grade as MagicGrade;
        if (!grade) return;
        if (bannedGrades.includes(grade)) return;
        if (bannedItemIds.includes(item.id)) return;

        const itemCost = gradeCosts[grade] ?? 0;

        setSelectedIds(prev => {
            const newSet = new Set(prev);
            
            if (newSet.has(item.id)) {
                newSet.delete(item.id);
            } else {
                // Cost Check
                if (pointLimit !== 9999 && currentCost + itemCost > pointLimit) return prev;

                // Max Total Check (excludes mandatory in selectedIds.size check calculation below if we want, but usually maxTotal applies to picks)
                // Let's count non-mandatory items for maxTotal
                const currentNonMandatoryCount = Array.from(newSet).filter(id => !mandatoryItemIds.includes(id)).length;
                if (maxTotal !== undefined && currentNonMandatoryCount >= maxTotal) return prev;

                // Check Exclusive Logic
                if (exclusive) {
                    const hasOtherGrades = Object.keys(limits).some(g => g !== grade && counts[g] > 0);
                    if (hasOtherGrades) return prev;
                }

                // Check Specific Limit (only if maxTotal is not set)
                if (maxTotal === undefined) {
                    const limit = limits[grade] ?? 999;
                    if (counts[grade] >= limit) return prev;
                }
                
                // Max Blessings Check
                if (maxBlessings !== undefined) {
                    const currentBlessingCount = Object.keys(blessingCounts).length;
                    let isNewBlessing = true;
                    // Check if item belongs to an existing blessing
                    for (const group of BLESSING_GROUPS) {
                        if (group.items.some(i => i.id === item.id)) {
                            if (blessingCounts[group.title]) isNewBlessing = false;
                            break;
                        }
                    }
                    if (isNewBlessing && currentBlessingCount >= maxBlessings) return prev;
                }

                newSet.add(item.id);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        if (customValidator) {
            const errorMsg = customValidator(selectedIds, blessingCounts, counts);
            if (errorMsg) {
                setError(errorMsg);
                return;
            }
        }
        onSelect(selectedIds);
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Helper to calculate non-mandatory count for total display
    const nonMandatoryCount = selectedIds.size - Array.from(selectedIds).filter(id => mandatoryItemIds.includes(id)).length;
    
    // Label font size class based on language
    const labelClass = language === 'ko' ? "text-sm font-bold uppercase tracking-wider mr-2" : "text-xs font-bold uppercase tracking-wider mr-2";

    // Text Sizes
    const cardTitleClass = language === 'ko' ? "text-xs" : "text-[10px]";
    const cardBadgeClass = language === 'ko' ? "text-[10px]" : "text-[9px]";
    const tooltipTextClass = language === 'ko' ? "text-[11px]" : "text-[10px]";

    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-cyan-500/30 w-full max-w-7xl h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl relative">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black/50">
                    <div>
                        <h2 className="font-cinzel text-2xl text-white tracking-widest flex items-center gap-3">
                            <span className="text-cyan-400 text-3xl">❖</span> {title}
                        </h2>
                        {error && (
                            <p className="text-xs text-red-400 font-bold mt-1 animate-pulse whitespace-pre-line">{error}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Blessings Limit Display */}
                        {maxBlessings !== undefined && (
                             <div className={`px-4 py-2 rounded border bg-black/40 flex items-center ${Object.keys(blessingCounts).length > maxBlessings ? 'border-red-500 text-red-400' : 'border-purple-500/50 text-purple-300'}`}>
                                <span className={labelClass}>{language === 'ko' ? "축복" : "Blessings"}</span>
                                <span className="font-mono text-lg">{Object.keys(blessingCounts).length} / {maxBlessings}</span>
                            </div>
                        )}

                        {/* Dynamic Capacity Display */}
                        {maxTotal !== undefined ? (
                            <div className={`px-4 py-2 rounded border bg-black/40 flex items-center ${nonMandatoryCount >= maxTotal ? 'border-red-500 text-red-400' : 'border-cyan-500/50 text-cyan-300'}`}>
                                <span className={labelClass}>{language === 'ko' ? "수용량" : "Capacity"}</span>
                                <span className="font-mono text-lg">{nonMandatoryCount} / {maxTotal}</span>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                {Object.entries(limits).map(([grade, limit]) => {
                                    const count = counts[grade] || 0;
                                    const isFull = count >= limit;
                                    const isBlocked = exclusive && Object.keys(limits).some(g => g !== grade && counts[g] > 0);
                                    const displayGrade = language === 'ko' ? (GRADE_NAMES_KO[grade] || grade.toUpperCase()) : grade.toUpperCase();
                                    
                                    return (
                                        <div key={grade} className={`px-4 py-2 rounded border bg-black/40 flex items-center ${isFull ? 'border-red-500 text-red-400' : isBlocked ? 'border-gray-800 text-gray-600' : 'border-cyan-500/50 text-cyan-300'}`}>
                                            <span className={labelClass}>{displayGrade}</span>
                                            <span className="font-mono text-lg">{count} / {limit}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        
                        {pointLimit !== 9999 && (
                             <div className={`px-4 py-2 rounded border ${currentCost > pointLimit ? 'border-red-500 text-red-400' : 'border-cyan-500/50 text-cyan-300'} bg-black/40`}>
                                <span className={labelClass}>{language === 'ko' ? "포인트" : "Points"}</span>
                                <span className="font-mono text-lg">{currentCost} / {pointLimit}</span>
                            </div>
                        )}

                        <button onClick={handleSave} className="px-6 py-2 bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-500/50 rounded text-cyan-100 font-cinzel transition-all">
                            {language === 'ko' ? "확인" : "CONFIRM"}
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-white text-4xl">&times;</button>
                    </div>
                </div>

                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-black/40 border-r border-gray-800 overflow-y-auto flex-shrink-0">
                        {BLESSING_GROUPS.map((group, idx) => {
                            const count = blessingCounts[group.title] || 0;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-full text-left px-4 py-4 border-b border-gray-800/50 text-sm font-cinzel transition-colors hover:bg-white/5 flex justify-between items-center
                                        ${activeTab === idx ? 'text-cyan-300 bg-cyan-900/20 border-l-4 border-l-cyan-500' : 'text-gray-500 border-l-4 border-l-transparent'}
                                    `}
                                >
                                    <span>{group.title}</span>
                                    {count > 0 && <span className="text-xs font-mono bg-cyan-900/50 px-2 rounded-full text-cyan-200">{count}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Grid */}
                    <div className="flex-grow overflow-y-auto p-6 bg-[#0f0f10]">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {BLESSING_GROUPS[activeTab].items.map(item => {
                                const isSelected = selectedIds.has(item.id);
                                const isMandatory = mandatoryItemIds.includes(item.id);
                                const grade = item.grade || 'default';
                                const itemCost = gradeCosts[grade as MagicGrade] ?? 0;
                                const isBanned = bannedItemIds.includes(item.id) || (bannedGrades.includes(grade as MagicGrade));
                                
                                // Logic check for disabling
                                let isDisabled = false;
                                if (!isSelected) {
                                    if (isBanned) isDisabled = true;

                                    // 1. Cost Check
                                    if (pointLimit !== 9999 && currentCost + itemCost > pointLimit) isDisabled = true;

                                    // 2. Capacity Check (MaxTotal vs Limits)
                                    if (maxTotal !== undefined) {
                                        if (nonMandatoryCount >= maxTotal) isDisabled = true;
                                    } else {
                                        const limit = limits[grade as MagicGrade];
                                        if (limit !== undefined && counts[grade] >= limit) isDisabled = true;
                                        if (exclusive && !isDisabled) {
                                            const hasOtherGrades = Object.keys(limits).some(g => g !== grade && counts[g] > 0);
                                            if (hasOtherGrades) isDisabled = true;
                                        }
                                        // Unavailable Grade Check (if using specific limits and not in limits at all)
                                        if (limit === undefined && Object.keys(limits).length > 0) isDisabled = true;
                                    }
                                    
                                    // 3. Blessings Count Check
                                    if (!isDisabled && maxBlessings !== undefined) {
                                        const currentBlessingCount = Object.keys(blessingCounts).length;
                                        // Check if item adds a NEW blessing to the count
                                        const groupTitle = BLESSING_GROUPS[activeTab].title;
                                        if (!blessingCounts[groupTitle] && currentBlessingCount >= maxBlessings) {
                                            isDisabled = true;
                                        }
                                    }
                                }

                                const styles = GRADE_STYLES[grade] || GRADE_STYLES.default;
                                const displayGradeBadge = language === 'ko' && grade !== 'default' 
                                    ? (GRADE_NAMES_KO[grade] || grade.toUpperCase()) 
                                    : grade.toUpperCase();

                                return (
                                    <div 
                                        key={item.id}
                                        onClick={() => handleToggle(item)}
                                        className={`
                                            group relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-300
                                            ${isMandatory
                                                ? 'border-yellow-500/50 bg-yellow-900/20 cursor-default' // Mandatory Style
                                                : isSelected 
                                                    ? `${styles.selected} ${styles.bgSelected} shadow-[0_0_15px_currentColor] scale-[1.02] z-10` 
                                                    : isDisabled 
                                                        ? 'border-gray-800 bg-black/60 opacity-30 grayscale cursor-not-allowed' 
                                                        : `${styles.unselected} bg-black/60 hover:bg-black/80 cursor-pointer`
                                            }
                                        `}
                                    >
                                        <img 
                                            src={item.imageSrc} 
                                            alt={item.title} 
                                            className="w-20 h-20 object-cover rounded-md mb-2 drop-shadow-md" 
                                        />
                                        <h4 className={`${cardTitleClass} font-bold font-cinzel text-center leading-tight ${isMandatory ? 'text-yellow-200' : ''}`}>
                                            {item.title}
                                        </h4>
                                        
                                        {/* Cost Badge */}
                                        {grade !== 'default' && !isMandatory && (
                                            <span className={`absolute top-2 right-2 ${cardBadgeClass} font-mono px-1.5 rounded border bg-black/80 ${isSelected ? 'text-white border-white/30' : 'text-gray-600 border-gray-800'}`}>
                                                {displayGradeBadge}
                                            </span>
                                        )}
                                        
                                        {isMandatory && (
                                            <span className={`absolute top-2 right-2 ${cardBadgeClass} font-mono px-1.5 rounded border bg-black/80 text-yellow-400 border-yellow-600`}>
                                                {language === 'ko' ? "필수" : "ESSENTIAL"}
                                            </span>
                                        )}

                                        {/* Hover Description Tooltip */}
                                        <div className="absolute inset-0 bg-black/95 p-3 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 text-center rounded-lg border border-gray-700">
                                            <p className={`${tooltipTextClass} text-gray-300 leading-relaxed line-clamp-6`}>
                                                {renderFormattedText(item.description.replace(/^\{i\}Requires.*?\{\/i\}\s*/g, ''))}
                                            </p>
                                            {isDisabled && !isSelected && (
                                                <p className={`${cardBadgeClass} text-red-500 mt-2 font-mono border-t border-gray-800 pt-1 w-full`}>
                                                    {language === 'ko' ? "선택 불가" : "UNAVAILABLE"}
                                                </p>
                                            )}
                                            {isMandatory && (
                                                <p className={`${cardBadgeClass} text-yellow-500 mt-2 font-mono border-t border-gray-800 pt-1 w-full`}>
                                                    {language === 'ko' ? "포함됨" : "INCLUDED"}
                                                </p>
                                            )}
                                            {!isDisabled && !isMandatory && pointLimit !== 9999 && (
                                                <p className={`${cardBadgeClass} text-cyan-400 mt-2 font-mono border-t border-gray-800 pt-1 w-full`}>
                                                    {language === 'ko' ? "비용: " : "Cost: "}{itemCost}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
