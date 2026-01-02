
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { FALLEN_PEACE_SIGIL_TREE_DATA, TELEPATHY_DATA, MENTAL_MANIPULATION_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export const useFallenPeaceState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedFallenPeaceSigils, setSelectedFallenPeaceSigils] = useState<Set<string>>(new Set());
    const [selectedTelepathy, setSelectedTelepathy] = useState<Set<string>>(new Set());
    const [selectedMentalManipulation, setSelectedMentalManipulation] = useState<Set<string>>(new Set());
    const [isTelepathyBoosted, setIsTelepathyBoosted] = useState(false);
    const [isMentalManipulationBoosted, setIsMentalManipulationBoosted] = useState(false);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);

    const { availableTelepathyPicks, availableMentalManipulationPicks } = useMemo(() => {
        let telepathy = 0, mentalManipulation = 0;
        selectedFallenPeaceSigils.forEach(sigilId => {
            const sigil = FALLEN_PEACE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                telepathy += sigil.benefits.telepathy ?? 0;
                mentalManipulation += sigil.benefits.mentalManipulation ?? 0;
            }
        });
        return { availableTelepathyPicks: telepathy, availableMentalManipulationPicks: mentalManipulation };
    }, [selectedFallenPeaceSigils]);

    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedTelepathy.size > availableTelepathyPicks) {
            setSelectedTelepathy(prev => new Set(Array.from(prev).slice(0, availableTelepathyPicks)));
        }
        if (selectedMentalManipulation.size > availableMentalManipulationPicks) {
            setSelectedMentalManipulation(prev => new Set(Array.from(prev).slice(0, availableMentalManipulationPicks)));
        }
    }, [availableTelepathyPicks, availableMentalManipulationPicks, selectedTelepathy.size, selectedMentalManipulation.size]);

    const handleFallenPeaceSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedFallenPeaceSigils);
        const sigil = FALLEN_PEACE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                FALLEN_PEACE_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));
            
            const newMentalManipulation = new Set(selectedMentalManipulation);
            selectedMentalManipulation.forEach(powerId => {
                const power = MENTAL_MANIPULATION_DATA.find(p => p.id === powerId);
                if(power?.requires?.some(req => toRemove.has(req))) {
                    newMentalManipulation.delete(powerId);
                }
            });
            setSelectedMentalManipulation(newMentalManipulation);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedFallenPeaceSigils(newSelected);
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

    const handleTelepathySelect = createMultiSelectHandler(setSelectedTelepathy, availableTelepathyPicks);
    const handleMentalManipulationSelect = createMultiSelectHandler(setSelectedMentalManipulation, availableMentalManipulationPicks);

    const handleFallenPeaceBoostToggle = (type: 'telepathy' | 'mentalManipulation') => {
        if (type === 'telepathy') {
            if (!isTelepathyBoosted && availableSigilCounts.kaarn > 0) setIsTelepathyBoosted(true);
            else setIsTelepathyBoosted(false);
        }
        if (type === 'mentalManipulation') {
            if (!isMentalManipulationBoosted && availableSigilCounts.purth > 0) setIsMentalManipulationBoosted(true);
            else setIsMentalManipulationBoosted(false);
        }
    };

    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedFallenPeaceSigils.forEach(id => {
            const sigil = FALLEN_PEACE_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        if(isTelepathyBoosted) used.kaarn += 1;
        if(isMentalManipulationBoosted) used.purth += 1;
        return used;
    }, [selectedFallenPeaceSigils, isTelepathyBoosted, isMentalManipulationBoosted]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedFallenPeaceSigils.forEach(id => {
            const sigil = FALLEN_PEACE_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedFallenPeaceSigils]);

    // Load function
    const loadState = useCallback((data: any) => {
        setSelectedFallenPeaceSigils(new Set(data.selectedFallenPeaceSigils || []));
        setSelectedTelepathy(new Set(data.selectedTelepathy || []));
        setSelectedMentalManipulation(new Set(data.selectedMentalManipulation || []));
        setIsTelepathyBoosted(data.isTelepathyBoosted || false);
        setIsMentalManipulationBoosted(data.isMentalManipulationBoosted || false);
        setIsMagicianApplied(data.isFallenPeaceMagicianApplied || false);
    }, []);
    
    return {
        selectedFallenPeaceSigils, handleFallenPeaceSigilSelect,
        selectedTelepathy, handleTelepathySelect,
        selectedMentalManipulation, handleMentalManipulationSelect,
        isTelepathyBoosted, isMentalManipulationBoosted, handleFallenPeaceBoostToggle,
        availableTelepathyPicks, availableMentalManipulationPicks,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        usedSigilCounts,
        loadState
    };
};
