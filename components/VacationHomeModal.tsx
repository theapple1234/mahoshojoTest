
import React, { useEffect } from 'react';
import { HOUSES_DATA, HOUSE_UPGRADES_DATA, DOMINIONS } from '../constants';
import type { VacationHome } from '../types';
import { useCharacterContext } from '../context/CharacterContext';
import { BeastSelectionModal } from './BeastSelectionModal';

interface VacationHomeModalProps {
    onClose: () => void;
}

export const VacationHomeModal: React.FC<VacationHomeModalProps> = ({ onClose }) => {
    const { 
        vacationHomes, 
        addVacationHome, 
        removeVacationHome, 
        updateVacationHome,
        mythicalPetBeastName, // Access main pet
        handleAssignMythicalPet // Access main pet handler
    } = useCharacterContext();
    
    // State to handle per-home pet assignment modals
    const [activePetHomeId, setActivePetHomeId] = React.useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleUpgradeToggle = (homeId: string, upgradeId: string) => {
        const home = vacationHomes.find(h => h.id === homeId);
        if (!home) return;
        
        const newUpgrades = new Set(home.upgradeIds);
        if (newUpgrades.has(upgradeId)) {
            newUpgrades.delete(upgradeId);
            if (upgradeId === 'virtual_reality') updateVacationHome(homeId, { vrChamberCostType: null });
            if (upgradeId === 'private_island') updateVacationHome(homeId, { islandExtraMiles: 0 });
            if (upgradeId === 'mythical_pet') updateVacationHome(homeId, { mythicalPetName: null });
        } else {
            // Negative upgrade mutual exclusivity
            const negativeUpgrades = ['creepy_crawlies', 'terrible_neighbors', 'haunted'];
            if (negativeUpgrades.includes(upgradeId)) {
                negativeUpgrades.forEach(negId => newUpgrades.delete(negId));
            }

            newUpgrades.add(upgradeId);
            if (upgradeId === 'virtual_reality') updateVacationHome(homeId, { vrChamberCostType: 'fp' });
        }
        updateVacationHome(homeId, { upgradeIds: newUpgrades });
    };

    const formatCost = (costStr: string) => {
        return costStr.replace('Costs ', '').replace('Grants ', '');
    };

    return (
        <>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#0f172a] border-2 border-cyan-700/80 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-cyan-900/50">
                    <h2 className="font-cinzel text-2xl text-cyan-200">
                        Manage Vacation Homes
                    </h2>
                    <button onClick={onClose} className="text-cyan-200/70 hover:text-white text-3xl font-bold transition-colors">&times;</button>
                </header>
                <main className="p-6 overflow-y-auto space-y-8 flex-grow">
                    {vacationHomes.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-400 mb-4">You haven't purchased any vacation homes yet.</p>
                            <button 
                                onClick={addVacationHome}
                                className="px-6 py-3 bg-cyan-900/40 border border-cyan-500 rounded hover:bg-cyan-800 transition-colors text-cyan-200 font-cinzel"
                            >
                                Purchase First Vacation Home (-3 FP)
                            </button>
                        </div>
                    ) : (
                        vacationHomes.map((home, index) => (
                            <div key={home.id} className="border border-cyan-800/50 rounded-lg p-4 bg-black/40 relative">
                                <div className="flex justify-between items-start mb-4 border-b border-cyan-900/30 pb-2">
                                    <div className="flex flex-col gap-1 w-full max-w-md">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-cinzel text-xl text-cyan-300">
                                                Vacation Home #{index + 1} 
                                            </h3>
                                            <span className="text-xs text-green-400 font-mono">(-3 FP Base)</span>
                                        </div>
                                        <input 
                                            type="text"
                                            value={home.name || ''}
                                            onChange={(e) => updateVacationHome(home.id, { name: e.target.value })}
                                            placeholder="Name this home (e.g., Summer Villa)..."
                                            className="bg-transparent border-b border-cyan-900/50 text-gray-300 text-sm py-1 focus:outline-none focus:border-cyan-500 w-full placeholder-gray-600 font-sans"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => removeVacationHome(home.id)}
                                        className="text-red-500 hover:text-red-400 text-sm underline flex-shrink-0"
                                    >
                                        Remove Home
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                                    <select 
                                        value={home.dominionId || ''}
                                        onChange={(e) => updateVacationHome(home.id, { dominionId: e.target.value || null })}
                                        className="bg-gray-900 border border-cyan-800 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                    >
                                        <option value="">Select Dominion...</option>
                                        {DOMINIONS.map(dom => (
                                            <option key={dom.id} value={dom.id}>{dom.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Select House Type</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {HOUSES_DATA.map(house => {
                                            const isSelected = home.houseId === house.id;
                                            const isRagamuffin = house.id === 'ragamuffin';
                                            const isDisabled = isRagamuffin; // Vacation homes can't be Ragamuffin

                                            return (
                                                <div 
                                                    key={house.id}
                                                    onClick={() => !isDisabled && updateVacationHome(home.id, { houseId: house.id })}
                                                    className={`
                                                        border rounded p-2 text-center transition-all flex flex-col items-center gap-2 relative
                                                        ${isDisabled ? 'opacity-40 cursor-not-allowed bg-black/20 border-gray-800 grayscale' : 'cursor-pointer'}
                                                        ${isSelected ? 'bg-cyan-900/40 border-cyan-500 ring-1 ring-cyan-500' : (!isDisabled && 'bg-gray-900/40 border-gray-700 hover:border-cyan-600/50')}
                                                    `}
                                                >
                                                    <img src={house.imageSrc} alt={house.title} className="w-full h-20 object-cover rounded" />
                                                    <div className="text-xs">
                                                        <div className="font-bold text-gray-200">{house.title}</div>
                                                        <div className="mt-1 text-green-400 font-bold">
                                                            {formatCost(house.cost)}
                                                        </div>
                                                    </div>
                                                    {isDisabled && <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded text-red-500 font-bold text-xs">UNAVAILABLE</div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {home.houseId === 'mansion' && (
                                        <div className="mt-3 bg-black/30 p-2 rounded border border-gray-800 flex justify-center">
                                             <div className="text-center">
                                                <label className="text-xs text-gray-300 font-semibold">Additional Space <span className="text-green-400 font-bold">(-1 FP per 1,000)</span></label>
                                                <div className="flex items-center justify-center gap-2 mt-1">
                                                    <button onClick={() => updateVacationHome(home.id, { mansionExtraSqFt: Math.max(0, home.mansionExtraSqFt - 1) })} disabled={home.mansionExtraSqFt === 0} className="px-2 py-1 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">-</button>
                                                    <span className="font-semibold text-white w-24 text-center text-sm">{home.mansionExtraSqFt * 1000} sq ft</span>
                                                    <button onClick={() => updateVacationHome(home.id, { mansionExtraSqFt: home.mansionExtraSqFt + 1 })} className="px-2 py-1 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Select Upgrades</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                        {HOUSE_UPGRADES_DATA.map(upgrade => {
                                            const isSelected = home.upgradeIds.has(upgrade.id);
                                            const isVrChamber = upgrade.id === 'virtual_reality';
                                            const isMythicalPet = upgrade.id === 'mythical_pet';
                                            const isPrivateIsland = upgrade.id === 'private_island';

                                            const negativeUpgrades = ['creepy_crawlies', 'terrible_neighbors', 'haunted'];
                                            const isCurrentNegative = negativeUpgrades.includes(upgrade.id);
                                            const otherNegativeSelected = negativeUpgrades.some(id => id !== upgrade.id && home.upgradeIds.has(id));

                                            let isDisabled = false;
                                            if (isCurrentNegative && otherNegativeSelected) {
                                                isDisabled = true;
                                            }

                                            return (
                                                <div 
                                                    key={upgrade.id}
                                                    onClick={() => !isDisabled && handleUpgradeToggle(home.id, upgrade.id)}
                                                    className={`
                                                        border rounded p-2 text-center transition-all flex flex-col items-center justify-between min-h-[140px]
                                                        ${isDisabled ? 'opacity-50 cursor-not-allowed bg-black/20 border-gray-800 grayscale' : 'cursor-pointer'}
                                                        ${isSelected ? 'bg-cyan-900/40 border-cyan-500' : (!isDisabled && 'bg-gray-900/40 border-gray-700 hover:border-cyan-600/50')}
                                                    `}
                                                >
                                                    <img src={upgrade.imageSrc} alt={upgrade.title} className="w-full h-32 object-contain mb-2 rounded" />
                                                    
                                                    <div className="text-xs font-bold text-gray-200 mb-1 leading-tight">{upgrade.title}</div>
                                                    <div className="text-[10px] text-green-400 font-bold">
                                                        {formatCost(upgrade.cost)}
                                                    </div>
                                                    
                                                    {isVrChamber && isSelected && (
                                                        <div className="flex justify-center gap-2 mt-2 w-full" onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => updateVacationHome(home.id, { vrChamberCostType: 'fp' })}
                                                                className={`flex-1 py-0.5 text-[10px] rounded border transition-colors ${home.vrChamberCostType !== 'bp' ? 'bg-green-800/50 border-green-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-green-500/50'}`}
                                                            >
                                                                -5 FP
                                                            </button>
                                                            <button
                                                                onClick={() => updateVacationHome(home.id, { vrChamberCostType: 'bp' })}
                                                                className={`flex-1 py-0.5 text-[10px] rounded border transition-colors ${home.vrChamberCostType === 'bp' ? 'bg-purple-800/50 border-purple-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'}`}
                                                            >
                                                                -2 BP
                                                            </button>
                                                        </div>
                                                    )}

                                                    {isMythicalPet && isSelected && (
                                                        <div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}>
                                                             <button 
                                                                onClick={() => setActivePetHomeId(home.id)}
                                                                className="w-full text-[10px] bg-cyan-900/50 border border-cyan-600 text-cyan-200 rounded py-1 hover:bg-cyan-800"
                                                            >
                                                                {home.mythicalPetName ? 'Edit Pet' : 'Assign Pet'}
                                                            </button>
                                                            {home.mythicalPetName && (
                                                                <p className="text-[9px] text-cyan-300 truncate mt-1">{home.mythicalPetName}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {home.upgradeIds.has('private_island') && (
                                         <div className="mt-3 bg-black/30 p-2 rounded border border-gray-800 flex justify-center">
                                             <div className="text-center">
                                                <label className="text-xs text-gray-300 font-semibold">Additional Space <span className="text-green-400 font-bold">(-1 FP each)</span></label>
                                                <div className="flex items-center justify-center gap-2 mt-1">
                                                    <button onClick={() => updateVacationHome(home.id, { islandExtraMiles: Math.max(0, home.islandExtraMiles - 1) })} disabled={home.islandExtraMiles === 0} className="px-2 py-1 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">-</button>
                                                    <span className="font-semibold text-white w-24 text-center text-sm">{home.islandExtraMiles} sq miles</span>
                                                    <button onClick={() => updateVacationHome(home.id, { islandExtraMiles: home.islandExtraMiles + 1 })} className="px-2 py-1 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    
                    {vacationHomes.length > 0 && (
                        <button 
                            onClick={addVacationHome}
                            className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-cyan-500 hover:text-cyan-300 transition-colors font-cinzel tracking-wider"
                        >
                            + Purchase Another Home (-3 FP)
                        </button>
                    )}
                </main>
                <footer className="p-4 border-t border-cyan-900/50 bg-black/20 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-cyan-800/60 hover:bg-cyan-700/80 text-white rounded border border-cyan-600 font-cinzel transition-colors"
                    >
                        Done
                    </button>
                </footer>
            </div>
        </div>
        
        {activePetHomeId && (
             <BeastSelectionModal
                currentBeastName={vacationHomes.find(h => h.id === activePetHomeId)?.mythicalPetName || null}
                onClose={() => setActivePetHomeId(null)}
                onSelect={(name) => {
                    updateVacationHome(activePetHomeId, { mythicalPetName: name });
                    setActivePetHomeId(null);
                }}
                pointLimit={30}
                title="Assign Mythical Pet (30 BP)"
                colorTheme="cyan"
            />
        )}
        </>
    );
};
