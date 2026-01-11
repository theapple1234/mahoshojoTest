
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { COMPELLING_WILL_SIGIL_TREE_DATA, TELEKINETICS_DATA, METATHERMICS_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: string} = { 
    'kaarn.webp': 'kaarn', 
    'purth.webp': 'purth', 
    'juathas.webp': 'juathas', 
    'xuth.webp': 'xuth', 
    'sinthru.webp': 'sinthru', 
    'lekolu.webp': 'lekolu' 
};
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export const useCompellingWillState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedCompellingWillSigils, setSelectedCompellingWillSigils] = useState<Set<string>>(new Set());
    const [selectedTelekinetics, setSelectedTelekinetics] = useState<Set<string>>(new Set());
    const [selectedMetathermics, setSelectedMetathermics] = useState<Set<string>>(new Set());
    const [isTelekineticsBoosted, setIsTelekineticsBoosted] = useState(false);
    const [isMetathermicsBoosted, setIsMetathermicsBoosted] = useState(false);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const [thermalWeaponryWeaponName, setThermalWeaponryWeaponName] = useState<string | null>(null);

    const handleThermalWeaponryWeaponAssign = (name: string | null) => {
        setThermalWeaponryWeaponName(name);
    };

    useEffect(() => {
        if (!selectedMetathermics.has('thermal_weaponry')) {
            setThermalWeaponryWeaponName(null);
        }
    }, [selectedMetathermics]);

    const { availableTelekineticsPicks, availableMetathermicsPicks } = useMemo(() => {
        let telekinetics = 0;
        let metathermics = 0;
        selectedCompellingWillSigils.forEach(sigilId => {
            const sigil = COMPELLING_WILL_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                telekinetics += sigil.benefits.telekinetics ?? 0;
                metathermics += sigil.benefits.metathermics ?? 0;
            }
        });
        return { availableTelekineticsPicks: telekinetics, availableMetathermicsPicks: metathermics };
    }, [selectedCompellingWillSigils]);

    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedTelekinetics.size > availableTelekineticsPicks) {
            setSelectedTelekinetics(prev => new Set(Array.from(prev).slice(0, availableTelekineticsPicks)));
        }
        if (selectedMetathermics.size > availableMetathermicsPicks) {
            const arr = Array.from(selectedMetathermics);
            const toKeep = new Set(arr.slice(0, availableMetathermicsPicks));
            const toRemove = arr.slice(availableMetathermicsPicks);
            
            if (toRemove.includes('thermal_weaponry')) {
                setThermalWeaponryWeaponName(null);
            }
            
            setSelectedMetathermics(toKeep);
        }
    }, [availableTelekineticsPicks, availableMetathermicsPicks, selectedTelekinetics.size, selectedMetathermics.size]);

    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);

    const handleCompellingWillSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedCompellingWillSigils);
        const sigil = COMPELLING_WILL_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while (queue.length > 0) {
                const currentId = queue.shift()!;
                COMPELLING_WILL_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const newTelekinetics = new Set(selectedTelekinetics);
            selectedTelekinetics.forEach(powerId => {
                const power = TELEKINETICS_DATA.find(p => p.id === powerId);
                if (power?.requires?.some(req => toRemove.has(req))) {
                    newTelekinetics.delete(powerId);
                }
            });
            setSelectedTelekinetics(newTelekinetics);

            const newMetathermics = new Set(selectedMetathermics);
            selectedMetathermics.forEach(powerId => {
                const power = METATHERMICS_DATA.find(p => p.id === powerId);
                if (power?.requires?.some(req => toRemove.has(req))) {
                    newMetathermics.delete(powerId);
                }
            });
            setSelectedMetathermics(newMetathermics);

        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const hasSigil = sigilType ? availableSigilCounts[sigilType as keyof typeof availableSigilCounts] > 0 : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedCompellingWillSigils(newSelected);
    };

    const handleTelekineticsSelect = (id: string) => {
        setSelectedTelekinetics(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Cascade Deselect
                if (id === 'psychic_force_i') newSet.delete('psychic_force_ii');
            } else if (newSet.size < availableTelekineticsPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleMetathermicsSelect = (id: string) => {
        setSelectedMetathermics(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                
                // Cascade Deselect for Pyromaniac
                if (id === 'pyromaniac_i') {
                    newSet.delete('pyromaniac_ii');
                    newSet.delete('pyromaniac_iii');
                }
                if (id === 'pyromaniac_ii') {
                    newSet.delete('pyromaniac_iii');
                }

                // Cascade Deselect for Ice Cold
                if (id === 'ice_cold_i') {
                    newSet.delete('ice_cold_ii');
                    newSet.delete('ice_cold_iii');
                }
                if (id === 'ice_cold_ii') {
                    newSet.delete('ice_cold_iii');
                }
                
                // Cleanup Assignment
                if (id === 'thermal_weaponry') {
                    setThermalWeaponryWeaponName(null);
                }

            } else if (newSet.size < availableMetathermicsPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleCompellingWillBoostToggle = (type: 'telekinetics' | 'metathermics') => {
        if (type === 'telekinetics') {
            if (!isTelekineticsBoosted && availableSigilCounts.kaarn > 0) setIsTelekineticsBoosted(true);
            else setIsTelekineticsBoosted(false);
        }
        if (type === 'metathermics') {
            if (!isMetathermicsBoosted && availableSigilCounts.purth > 0) setIsMetathermicsBoosted(true);
            else setIsMetathermicsBoosted(false);
        }
    };

    const usedSigilCounts = useMemo(() => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedCompellingWillSigils.forEach(id => {
            const sigil = COMPELLING_WILL_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) {
                used[type] += 1;
            }
        });
        if (isTelekineticsBoosted) used.kaarn += 1;
        if (isMetathermicsBoosted) used.purth += 1;
        return used;
    }, [selectedCompellingWillSigils, isTelekineticsBoosted, isMetathermicsBoosted]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedCompellingWillSigils.forEach(id => {
            const sigil = COMPELLING_WILL_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedCompellingWillSigils]);

    // Load function
    const loadState = useCallback((data: any) => {
        setSelectedCompellingWillSigils(new Set(data.selectedCompellingWillSigils || []));
        setSelectedTelekinetics(new Set(data.selectedTelekinetics || []));
        setSelectedMetathermics(new Set(data.selectedMetathermics || []));
        setIsTelekineticsBoosted(data.isTelekineticsBoosted || false);
        setIsMetathermicsBoosted(data.isMetathermicsBoosted || false);
        setIsMagicianApplied(data.isCompellingWillMagicianApplied || false);
        setThermalWeaponryWeaponName(data.thermalWeaponryWeaponName || null);
    }, []);

    return {
        selectedCompellingWillSigils, handleCompellingWillSigilSelect,
        selectedTelekinetics, handleTelekineticsSelect,
        selectedMetathermics, handleMetathermicsSelect,
        availableTelekineticsPicks, availableMetathermicsPicks,
        isTelekineticsBoosted, isMetathermicsBoosted,
        handleCompellingWillBoostToggle,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        thermalWeaponryWeaponName,
        handleThermalWeaponryWeaponAssign,
        usedSigilCounts,
        loadState
    };
};
