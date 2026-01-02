
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { CLOSED_CIRCUITS_SIGIL_TREE_DATA, NET_AVATAR_DATA, TECHNOMANCY_DATA, NANITE_CONTROL_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export const useClosedCircuitsState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    // ... existing state ...
    const [selectedClosedCircuitsSigils, setSelectedClosedCircuitsSigils] = useState<Set<string>>(new Set());
    const [selectedNetAvatars, setSelectedNetAvatars] = useState<Set<string>>(new Set());
    const [selectedTechnomancies, setSelectedTechnomancies] = useState<Set<string>>(new Set());
    const [selectedNaniteControls, setSelectedNaniteControls] = useState<Set<string>>(new Set());
    const [isTechnomancyBoosted, setIsTechnomancyBoosted] = useState(false);
    const [isNaniteControlBoosted, setIsNaniteControlBoosted] = useState(false);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const [naniteFormBeastName, setNaniteFormBeastName] = useState<string | null>(null);
    const [heavilyArmedWeaponName, setHeavilyArmedWeaponName] = useState<string | null>(null);

    const handleHeavilyArmedWeaponAssign = (name: string | null) => {
        setHeavilyArmedWeaponName(name);
    };

    useEffect(() => {
        if (!selectedNaniteControls.has('heavily_armed')) {
            setHeavilyArmedWeaponName(null);
        }
    }, [selectedNaniteControls]);

    const handleNaniteFormBeastAssign = (name: string | null) => {
        setNaniteFormBeastName(name);
    };

    useEffect(() => {
        if (!selectedNaniteControls.has('nanite_form')) {
            setNaniteFormBeastName(null);
        }
    }, [selectedNaniteControls]);

    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);
    
    const { availableNetAvatarPicks, availableTechnomancyPicks, availableNaniteControlPicks } = useMemo(() => {
        // ... (existing logic) ...
        let netAvatar = 0, technomancy = 0, naniteControl = 0;
        selectedClosedCircuitsSigils.forEach(sigilId => {
            const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                netAvatar += sigil.benefits.netAvatar ?? 0;
                technomancy += sigil.benefits.technomancy ?? 0;
                naniteControl += sigil.benefits.naniteControl ?? 0;
            }
        });
        return { availableNetAvatarPicks: netAvatar, availableTechnomancyPicks: technomancy, availableNaniteControlPicks: naniteControl };
    }, [selectedClosedCircuitsSigils]);

    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedNetAvatars.size > availableNetAvatarPicks) {
            setSelectedNetAvatars(prev => new Set(Array.from(prev).slice(0, availableNetAvatarPicks)));
        }
        if (selectedTechnomancies.size > availableTechnomancyPicks) {
            // Trim
            const arr = Array.from(selectedTechnomancies);
            const toKeep = new Set(arr.slice(0, availableTechnomancyPicks));
            // Ensure dependencies removed if their parent is trimmed
            const toRemove = arr.slice(availableTechnomancyPicks);
            if (toRemove.includes('domain_master_i')) toKeep.delete('domain_master_ii');
            setSelectedTechnomancies(toKeep);
        }
        if (selectedNaniteControls.size > availableNaniteControlPicks) {
            const arr = Array.from(selectedNaniteControls);
            const toKeep = new Set(arr.slice(0, availableNaniteControlPicks));
            const toRemove = arr.slice(availableNaniteControlPicks);
            
            if (toRemove.includes('nanite_form')) setNaniteFormBeastName(null);
            if (toRemove.includes('heavily_armed')) setHeavilyArmedWeaponName(null);
            
            // Trim dependencies
            if (toRemove.includes('nanite_armor_i')) {
                toKeep.delete('nanite_armor_ii');
                toKeep.delete('nanite_armor_iii');
            }
             if (toRemove.includes('nanite_armor_ii')) {
                toKeep.delete('nanite_armor_iii');
            }
            
            setSelectedNaniteControls(toKeep);
        }
    }, [availableNetAvatarPicks, availableTechnomancyPicks, availableNaniteControlPicks, selectedNetAvatars.size, selectedTechnomancies.size, selectedNaniteControls.size]);
    
    // ... handleClosedCircuitsSigilSelect (existing) ...
    const handleClosedCircuitsSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedClosedCircuitsSigils);
        const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                CLOSED_CIRCUITS_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const deselectDependent = (powersData: any[], selectedSet: Set<string>, setFunc: Dispatch<SetStateAction<Set<string>>>) => {
                const newPowerSet = new Set(selectedSet);
                selectedSet.forEach(powerId => {
                    const power = powersData.find(p => p.id === powerId);
                    if(power?.requires?.some((req: string) => toRemove.has(req))) {
                        newPowerSet.delete(powerId);
                    }
                });
                setFunc(newPowerSet);
            };

            deselectDependent(NET_AVATAR_DATA, selectedNetAvatars, setSelectedNetAvatars);
            deselectDependent(TECHNOMANCY_DATA, selectedTechnomancies, setSelectedTechnomancies);
            deselectDependent(NANITE_CONTROL_DATA, selectedNaniteControls, setSelectedNaniteControls);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedClosedCircuitsSigils(newSelected);
    };

    const createMultiSelectHandler = (setState: Dispatch<SetStateAction<Set<string>>>, max: number) => (id: string) => {
        setState(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else if (newSet.size < max) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleNetAvatarSelect = createMultiSelectHandler(setSelectedNetAvatars, availableNetAvatarPicks);
    
    const handleTechnomancySelect = (id: string) => {
        setSelectedTechnomancies(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Cascade Deselect
                if (id === 'domain_master_i') newSet.delete('domain_master_ii');
            } else if (newSet.size < availableTechnomancyPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleNaniteControlSelect = (id: string) => {
        setSelectedNaniteControls(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Cascade Deselect
                if (id === 'nanite_armor_i') {
                    newSet.delete('nanite_armor_ii');
                    newSet.delete('nanite_armor_iii');
                }
                if (id === 'nanite_armor_ii') {
                    newSet.delete('nanite_armor_iii');
                }
                // Cleanup assignments
                if (id === 'heavily_armed') setHeavilyArmedWeaponName(null);
                if (id === 'nanite_form') setNaniteFormBeastName(null);
            } else if (newSet.size < availableNaniteControlPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleClosedCircuitsBoostToggle = (type: 'technomancy' | 'naniteControl') => {
        if (type === 'technomancy') {
            if (!isTechnomancyBoosted && availableSigilCounts.kaarn > 0) setIsTechnomancyBoosted(true);
            else setIsTechnomancyBoosted(false);
        }
        if (type === 'naniteControl') {
            if (!isNaniteControlBoosted && availableSigilCounts.purth > 0) setIsNaniteControlBoosted(true);
            else setIsNaniteControlBoosted(false);
        }
    };
    
    // ... (rest of the file: usedSigilCounts, sigilTreeCost, loadState, return statement) ...
    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedClosedCircuitsSigils.forEach(id => {
            const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        if (isTechnomancyBoosted) used.kaarn += 1;
        if (isNaniteControlBoosted) used.purth += 1;
        return used;
    }, [selectedClosedCircuitsSigils, isTechnomancyBoosted, isNaniteControlBoosted]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedClosedCircuitsSigils.forEach(id => {
            const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedClosedCircuitsSigils]);

    // Load function
    const loadState = useCallback((data: any) => {
        setSelectedClosedCircuitsSigils(new Set(data.selectedClosedCircuitsSigils || []));
        setSelectedNetAvatars(new Set(data.selectedNetAvatars || []));
        setSelectedTechnomancies(new Set(data.selectedTechnomancies || []));
        setSelectedNaniteControls(new Set(data.selectedNaniteControls || []));
        setIsTechnomancyBoosted(data.isTechnomancyBoosted || false);
        setIsNaniteControlBoosted(data.isNaniteControlBoosted || false);
        setIsMagicianApplied(data.isClosedCircuitsMagicianApplied || false);
        setNaniteFormBeastName(data.naniteFormBeastName || null);
        setHeavilyArmedWeaponName(data.heavilyArmedWeaponName || null);
    }, []);
    
    return {
        selectedClosedCircuitsSigils, handleClosedCircuitsSigilSelect,
        selectedNetAvatars, handleNetAvatarSelect,
        selectedTechnomancies, handleTechnomancySelect,
        selectedNaniteControls, handleNaniteControlSelect,
        isTechnomancyBoosted, isNaniteControlBoosted, handleClosedCircuitsBoostToggle,
        availableNetAvatarPicks, availableTechnomancyPicks, availableNaniteControlPicks,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        naniteFormBeastName,
        handleNaniteFormBeastAssign,
        heavilyArmedWeaponName,
        handleHeavilyArmedWeaponAssign,
        usedSigilCounts,
        loadState
    };
};
