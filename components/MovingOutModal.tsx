import React, { useEffect } from 'react';
import { HOUSES_DATA, HOUSE_UPGRADES_DATA, DOMINIONS, DOMINIONS_KO, HOUSES_DATA_KO, HOUSE_UPGRADES_DATA_KO } from '../constants';
import type { VacationHome } from '../types';
import { useCharacterContext } from '../context/CharacterContext';
import { BeastSelectionModal } from './BeastSelectionModal';

// Fix: Renamed interface from VacationHomeModalProps to MovingOutModalProps to match usage below
interface MovingOutModalProps {
    onClose: () => void;
}

export const MovingOutModal: React.FC<MovingOutModalProps> = ({ onClose }) => {
    const { 
        movingOutHomes, 
        addMovingOutHome, 
        removeMovingOutHome, 
        updateMovingOutHome,
        vacationHomes,
        language
    } = useCharacterContext();

    const activeHouses = language === 'ko' ? HOUSES_DATA_KO : HOUSES_DATA;
    const activeUpgrades = language === 'ko' ? HOUSE_UPGRADES_DATA_KO : HOUSE_UPGRADES_DATA;
    const activeDominions = language === 'ko' ? DOMINIONS_KO : DOMINIONS;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Ensure at least one home exists when opening
    useEffect(() => {
        if (movingOutHomes.length === 0) {
            addMovingOutHome();
        }
    }, []);

    const handleUpgradeToggle = (homeId: string, upgradeId: string) => {
        const home = movingOutHomes.find(h => h.id === homeId);
        if (!home) return;
        
        const newUpgrades = new Set(home.upgradeIds);
        if (newUpgrades.has(upgradeId)) {
            newUpgrades.delete(upgradeId);
            if (upgradeId === 'virtual_reality') {
                updateMovingOutHome(homeId, { vrChamberCostType: null });
            }
        } else {
            // Negative upgrade mutual exclusivity
            const negativeUpgrades = ['creepy_crawlies', 'terrible_neighbors', 'haunted'];
            if (negativeUpgrades.includes(upgradeId)) {
                negativeUpgrades.forEach(negId => newUpgrades.delete(negId));
            }

            newUpgrades.add(upgradeId);
            if (upgradeId === 'virtual_reality') {
                updateMovingOutHome(homeId, { vrChamberCostType: 'fp' }); // Default to FP
            }
        }
        updateMovingOutHome(homeId, { upgradeIds: newUpgrades });
    };

    const currentInheritedCount = movingOutHomes.filter(h => h.isInherited).length;

    const handleInheritSelect = (homeId: string, vacationHomeId: string) => {
        const vacationHome = vacationHomes.find(vh => vh.id === vacationHomeId);
        if (!vacationHome) return;

        updateMovingOutHome(homeId, {
            houseId: vacationHome.houseId,
            upgradeIds: new Set(vacationHome.upgradeIds),
            vrChamberCostType: vacationHome.vrChamberCostType,
            inheritedFromId: vacationHomeId
        });
    };

    const formatCost = (costStr: string) => {
        if (language === 'ko') {
             // Mythical Pet Special Format
             if (costStr.includes('-5 FP') && costStr.includes('-5 BP')) {
                 return (
                     <div className="flex flex-col items-center leading-tight">
                         <span>행운 점수 -5</span>
                         <span>축복 점수 -5</span>
                     </div>
                 );
             }
             // VR Chamber Special Format
             if (costStr.includes('-5 FP') && costStr.includes('-2 BP') && costStr.includes('or')) {
                 return (
                     <div className="flex flex-col items-center leading-tight">
                         <span>행운 점수 -5</span>
                         <span className="text-[9px] text-gray-400 my-0.5">또는</span>
                         <span>축복 점수 -2</span>
                     </div>
                 );
             }

             let clean = costStr.replace(/Costs\s*|Grants\s*/gi, '');
             if (clean.toLowerCase() === 'free') return '무료';
             
             clean = clean.replace(/([+-]?\d+)\s*FP/gi, '행운 점수 $1');
             clean = clean.replace(/([+-]?\d+)\s*BP/gi, '축복 점수 $1');
             clean = clean.replace(/\s+and\s+/gi, ', ');
             return clean;
        }
        return costStr.replace(/Costs\s*|Grants\s*/gi, '');
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#0f172a] border-2 border-green-700/80 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-green-900/50">
                    <h2 className="font-cinzel text-2xl text-green-200">
                        {language === 'ko' ? "새로운 집 디자인" : "Design Your New Home(s)"}
                    </h2>
                    <button onClick={onClose} className="text-green-200/70 hover:text-white text-3xl font-bold transition-colors">&times;</button>
                </header>
                <main className="p-6 overflow-y-auto space-y-8 flex-grow">
                    {movingOutHomes.map((home, index) => {
                        const isFirst = index === 0;
                        const isFree = isFirst || home.isInherited;
                        const isInheritanceDisabled = !home.isInherited && (currentInheritedCount >= vacationHomes.length);
                        
                        return (
                            <div key={home.id} className="border border-green-800/50 rounded-lg p-4 bg-black/40 relative">
                                <div className="flex justify-between items-center mb-4 border-b border-green-900/30 pb-2">
                                    <h3 className="font-cinzel text-xl text-green-300">
                                        {language === 'ko' ? `집 #${index + 1}` : `Home #${index + 1}`}
                                        {isFirst && <span className="ml-2 text-xs bg-green-900/50 text-green-200 px-2 py-0.5 rounded border border-green-700">{language === 'ko' ? "기본 무료" : "FREE BASE"}</span>}
                                        {!isFirst && !home.isInherited && <span className="ml-2 text-xs text-green-400 font-bold font-mono">{language === 'ko' ? "(기본 행운 점수 -3)" : "(-3 FP Base)"}</span>}
                                    </h3>
                                    {(!isFirst) && (
                                        <button 
                                            onClick={() => removeMovingOutHome(home.id)}
                                            className="text-red-500 hover:text-red-400 text-sm underline"
                                        >
                                            {language === 'ko' ? "집 삭제" : "Remove Home"}
                                        </button>
                                    )}
                                </div>

                                <div className={`mb-4 ${isInheritanceDisabled ? 'opacity-50' : ''}`}>
                                    <label className={`flex items-center gap-2 select-none text-sm text-gray-300 ${isInheritanceDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <input 
                                            type="checkbox" 
                                            checked={home.isInherited}
                                            disabled={isInheritanceDisabled}
                                            onChange={(e) => updateMovingOutHome(home.id, { 
                                                isInherited: e.target.checked,
                                                houseId: e.target.checked ? null : home.houseId, 
                                                upgradeIds: e.target.checked ? new Set() : home.upgradeIds,
                                                vrChamberCostType: null,
                                                inheritedFromId: null,
                                                dominionId: null
                                            })}
                                            className="w-4 h-4 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-gray-700 disabled:opacity-50"
                                        />
                                        {language === 'ko' ? "휴가지 물려받기 (무료)" : "Inherit a Vacation Home (Free)"}
                                        {vacationHomes.length > 0 && <span className="text-gray-500 text-xs ml-1">({currentInheritedCount}/{vacationHomes.length} {language === 'ko' ? "사용됨" : "used"})</span>}
                                        {vacationHomes.length === 0 && <span className="text-red-500/70 text-xs ml-1">{language === 'ko' ? "(사용 가능 없음)" : "(None available)"}</span>}
                                    </label>
                                </div>
                                
                                {home.isInherited && (
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{language === 'ko' ? "물려받을 휴가지 선택:" : "Select Which Vacation Home:"}</label>
                                        <select 
                                            className="bg-gray-900 border border-green-700 text-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                            onChange={(e) => handleInheritSelect(home.id, e.target.value)}
                                            defaultValue={home.inheritedFromId || ""}
                                        >
                                            <option value="" disabled>{language === 'ko' ? "집 선택..." : "Select a home..."}</option>
                                            {vacationHomes.map((vh, i) => {
                                                const houseTitle = activeHouses.find(h => h.id === vh.houseId)?.title || (language === 'ko' ? '알 수 없는 집' : 'Unknown House');
                                                const domTitle = activeDominions.find(d => d.id === vh.dominionId)?.title || (language === 'ko' ? '알 수 없는 지역' : 'Unknown Dominion');
                                                const homeName = vh.name ? `"${vh.name}"` : (language === 'ko' ? `휴가지 #${i+1}` : `Vacation Home #${i+1}`);
                                                return (
                                                    <option key={vh.id} value={vh.id}>
                                                        {homeName}: {houseTitle} ({domTitle})
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}

                                {(!home.isInherited || (home.isInherited && home.houseId)) && (
                                    <>
                                         {/* Dominion Selector for NEW homes */}
                                        {!home.isInherited && (
                                            <div className="mb-6">
                                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{language === 'ko' ? "위치" : "Location"}</label>
                                                <select 
                                                    value={home.dominionId || ''}
                                                    onChange={(e) => updateMovingOutHome(home.id, { dominionId: e.target.value || null })}
                                                    className="bg-gray-900 border border-green-700 text-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                                >
                                                    <option value="">{language === 'ko' ? "지역 선택..." : "Select Dominion..."}</option>
                                                    {activeDominions.map(dom => (
                                                        <option key={dom.id} value={dom.id}>{dom.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className={`mb-6 ${home.isInherited ? 'opacity-70 pointer-events-none' : ''}`}>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{language === 'ko' ? "집 형태 선택" : "Select House Type"} {isFirst && <span className="text-green-400">{language === 'ko' ? "(무료)" : "(Free)"}</span>}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                                {activeHouses.map(house => {
                                                    const isSelected = home.houseId === house.id;
                                                    const isRagamuffin = house.id === 'ragamuffin';
                                                    const isDisabled = isRagamuffin; // Moving out cannot select Ragamuffin

                                                    return (
                                                        <div 
                                                            key={house.id}
                                                            onClick={() => !isDisabled && !home.isInherited && updateMovingOutHome(home.id, { houseId: house.id })}
                                                            className={`
                                                                border rounded p-2 text-center transition-all flex flex-col items-center gap-2 relative
                                                                ${isDisabled ? 'opacity-40 cursor-not-allowed bg-black/20 border-gray-800 grayscale' : 'cursor-pointer'}
                                                                ${isSelected ? 'bg-green-900/40 border-green-500 ring-1 ring-green-500' : (!isDisabled && 'bg-gray-900/40 border-gray-700 hover:border-green-600/50')}
                                                            `}
                                                        >
                                                            <img src={house.imageSrc} alt={house.title} className="w-full h-20 object-cover rounded" />
                                                            <div className="text-xs">
                                                                <div className="font-bold text-gray-200">{house.title}</div>
                                                                <div className={`mt-1 ${isFirst || home.isInherited ? 'text-green-400/70 line-through text-[10px]' : 'text-green-400 font-bold'}`}>
                                                                    {formatCost(house.cost)}
                                                                </div>
                                                                {(isFirst || home.isInherited) && <div className="text-green-400 font-bold text-[10px] uppercase">{language === 'ko' ? "무료" : "Free"}</div>}
                                                            </div>
                                                            {isDisabled && <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded text-red-500 font-bold text-xs">{language === 'ko' ? "선택 불가" : "UNAVAILABLE"}</div>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className={home.isInherited ? 'opacity-70 pointer-events-none' : ''}>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{language === 'ko' ? "업그레이드 선택" : "Select Upgrades"} {isFirst && <span className="text-green-400">{language === 'ko' ? "(무료)" : "(Free)"}</span>}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                                {activeUpgrades.map(upgrade => {
                                                    const isSelected = home.upgradeIds.has(upgrade.id);
                                                    const isVrChamber = upgrade.id === 'virtual_reality';
                                                    const showCostToggle = isVrChamber && isSelected && !isFree;

                                                    const negativeUpgrades = ['creepy_crawlies', 'terrible_neighbors', 'haunted'];
                                                    const isCurrentNegative = negativeUpgrades.includes(upgrade.id);
                                                    const otherNegativeSelected = negativeUpgrades.some(id => id !== upgrade.id && home.upgradeIds.has(id));

                                                    let isDisabled = false;
                                                    if (isCurrentNegative && otherNegativeSelected) {
                                                        isDisabled = true;
                                                    }
                                                    
                                                    // Determine if we should show "Free"
                                                    // Negative upgrades grant points, so they shouldn't be marked as free even on free slots
                                                    const shouldShowFree = (isFirst || home.isInherited) && !isCurrentNegative;

                                                    return (
                                                        <div 
                                                            key={upgrade.id}
                                                            onClick={() => !isDisabled && !home.isInherited && handleUpgradeToggle(home.id, upgrade.id)}
                                                            className={`
                                                                border rounded p-2 text-center transition-all flex flex-col items-center justify-between min-h-[140px]
                                                                ${isDisabled ? 'opacity-50 cursor-not-allowed bg-black/20 border-gray-800 grayscale' : 'cursor-pointer'}
                                                                ${isSelected ? 'bg-green-900/40 border-green-500' : (!isDisabled && 'bg-gray-900/40 border-gray-700 hover:border-green-600/50')}
                                                            `}
                                                        >
                                                            <img src={upgrade.imageSrc} alt={upgrade.title} className="w-full h-32 object-contain mb-2 rounded" />
                                                            
                                                            <div className="text-xs font-bold text-gray-200 mb-1 leading-tight">{upgrade.title}</div>
                                                            <div className={`text-[10px] ${shouldShowFree ? 'text-green-400/70 line-through' : 'text-green-400 font-bold'}`}>
                                                                {formatCost(upgrade.cost)}
                                                            </div>
                                                            {shouldShowFree && <div className="text-green-400 font-bold text-[10px] uppercase">{language === 'ko' ? "무료" : "Free"}</div>}
                                                            
                                                            {showCostToggle && (
                                                                <div className="flex justify-center gap-2 mt-2 w-full" onClick={(e) => e.stopPropagation()}>
                                                                    <button
                                                                        onClick={() => updateMovingOutHome(home.id, { vrChamberCostType: 'fp' })}
                                                                        className={`flex-1 py-0.5 text-[10px] rounded border transition-colors ${home.vrChamberCostType !== 'bp' ? 'bg-green-800/50 border-green-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-green-500/50'}`}
                                                                    >
                                                                        {language === 'ko' ? "행운 -5" : "-5 FP"}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateMovingOutHome(home.id, { vrChamberCostType: 'bp' })}
                                                                        className={`flex-1 py-0.5 text-[10px] rounded border transition-colors ${home.vrChamberCostType === 'bp' ? 'bg-purple-800/50 border-purple-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'}`}
                                                                    >
                                                                        {language === 'ko' ? "축복 -2" : "-2 BP"}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                    
                    <button 
                        onClick={addMovingOutHome}
                        className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-green-500 hover:text-green-300 transition-colors font-cinzel tracking-wider"
                    >
                        {language === 'ko' ? "+ 집 추가 (행운 점수 -3)" : "+ Add Another Home (-3 FP)"}
                    </button>
                </main>
                <footer className="p-4 border-t border-green-900/50 bg-black/20 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-cyan-800/60 hover:bg-cyan-700/80 text-white rounded border border-cyan-600 font-cinzel transition-colors"
                    >
                        {language === 'ko' ? "완료" : "Done"}
                    </button>
                </footer>
            </div>
        </div>
    );
};