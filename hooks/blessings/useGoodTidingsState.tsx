
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { GOOD_TIDINGS_SIGIL_TREE_DATA, MAJOR_BOONS_DATA } from '../../constants';

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

export const useGoodTidingsState = ({ availableSigilCounts, isOnisBlessingActive = false }: { availableSigilCounts: SigilCounts, isOnisBlessingActive?: boolean }) => {
    const [selectedGoodTidingsTier, setSelectedGoodTidingsTier] = useState<'standard' | 'journeyman' | 'master' | null>(null);
    const [selectedEssentialBoons, setSelectedEssentialBoons] = useState<Set<string>>(new Set());
    const [selectedMinorBoons, setSelectedMinorBoons] = useState<Set<string>>(new Set());
    const [selectedMajorBoons, setSelectedMajorBoons] = useState<Set<string>>(new Set());
    const [isMinorBoonsBoosted, setIsMinorBoonsBoosted] = useState(false);
    const [isMajorBoonsBoosted, setIsMajorBoonsBoosted] = useState(false);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);

    // Effective Boost States: Active if manually toggled OR if Oni's Blessing is active
    const isEssentialBoosted = isOnisBlessingActive;
    const isMinorBoosted = isMinorBoonsBoosted || isOnisBlessingActive;
    const isMajorBoosted = isMajorBoonsBoosted || isOnisBlessingActive;

    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);

    const { availableEssentialBoonPicks, availableMinorBoonPicks, availableMajorBoonPicks } = useMemo(() => {
        let essential = 0, minor = 0, major = 0;
        if (selectedGoodTidingsTier) {
            essential = 3;
            if (selectedGoodTidingsTier === 'journeyman' || selectedGoodTidingsTier === 'master') { minor = 4; }
            if (selectedGoodTidingsTier === 'master') { major = 1; }
        }
        return { availableEssentialBoonPicks: essential, availableMinorBoonPicks: minor, availableMajorBoonPicks: major };
    }, [selectedGoodTidingsTier]);

    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedEssentialBoons.size > availableEssentialBoonPicks) {
            setSelectedEssentialBoons(prev => new Set(Array.from(prev).slice(0, availableEssentialBoonPicks)));
        }
        if (selectedMinorBoons.size > availableMinorBoonPicks) {
            setSelectedMinorBoons(prev => new Set(Array.from(prev).slice(0, availableMinorBoonPicks)));
        }
        if (selectedMajorBoons.size > availableMajorBoonPicks) {
            setSelectedMajorBoons(prev => new Set(Array.from(prev).slice(0, availableMajorBoonPicks)));
        }
    }, [availableEssentialBoonPicks, availableMinorBoonPicks, availableMajorBoonPicks, selectedEssentialBoons.size, selectedMinorBoons.size, selectedMajorBoons.size]);

    const handleGoodTidingsTierSelect = (id: 'standard' | 'journeyman' | 'master' | null) => {
        const tierOrder: ('standard' | 'journeyman' | 'master')[] = ['standard', 'journeyman', 'master'];
        
        if (selectedGoodTidingsTier === id) {
             const currentIndex = tierOrder.indexOf(id as 'standard' | 'journeyman' | 'master');
             // Deselecting goes down one step
             const newTier = currentIndex > 0 ? tierOrder[currentIndex - 1] : null;
             setSelectedGoodTidingsTier(newTier);
             
             // Clear selections based on new tier
             if (newTier === null) {
                 setSelectedEssentialBoons(new Set());
                 setSelectedMinorBoons(new Set());
                 setSelectedMajorBoons(new Set());
             } else if (newTier === 'standard') {
                 setSelectedMinorBoons(new Set());
                 setSelectedMajorBoons(new Set());
             } else if (newTier === 'journeyman') {
                 setSelectedMajorBoons(new Set());
             }
             return;
        }

        // Identify needed sigils for the new tier level
        const currentTierIndex = selectedGoodTidingsTier ? tierOrder.indexOf(selectedGoodTidingsTier) : -1;
        const newTierIndex = id ? tierOrder.indexOf(id) : -1;

        if (newTierIndex > currentTierIndex) {
            const needed: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
            
            // Calculate what we need to add to reach new tier
            for (let i = currentTierIndex + 1; i <= newTierIndex; i++) {
                const tierId = tierOrder[i];
                const tierData = GOOD_TIDINGS_SIGIL_TREE_DATA.find(t => t.id === tierId);
                if (tierData) {
                    const type = getSigilTypeFromImage(tierData.imageSrc);
                    if (type) {
                        needed[type] += 1;
                    }
                }
            }

            // Check availability
            for (const key in needed) {
                const k = key as keyof SigilCounts;
                if (availableSigilCounts[k] < needed[k]) {
                    // Cannot afford
                    return; 
                }
            }
        }
        
        // If downgrading directly (e.g. clicking Standard while Master is selected), clear upper tiers
        if (newTierIndex < currentTierIndex) {
             if (id === 'standard') {
                 setSelectedMinorBoons(new Set());
                 setSelectedMajorBoons(new Set());
             } else if (id === 'journeyman') {
                 setSelectedMajorBoons(new Set());
             }
        }

        setSelectedGoodTidingsTier(id);
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

    const handleEssentialBoonSelect = createMultiSelectHandler(setSelectedEssentialBoons, availableEssentialBoonPicks);
    
    // Custom handler for Minor Boons to handle cascade to Major Boons
    const handleMinorBoonSelect = (id: string) => {
        setSelectedMinorBoons(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Cascade: Check if any selected Major Boon requires this Minor Boon
                setSelectedMajorBoons(prevMajor => {
                    const newMajor = new Set(prevMajor);
                    MAJOR_BOONS_DATA.forEach(majorBoon => {
                        if (majorBoon.requires && newMajor.has(majorBoon.id)) {
                             const req = Array.isArray(majorBoon.requires) ? majorBoon.requires[0] : majorBoon.requires;
                             if (req === id) {
                                 newMajor.delete(majorBoon.id);
                             }
                        }
                    });
                    return newMajor;
                });
            } else if (newSet.size < availableMinorBoonPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleMajorBoonSelect = createMultiSelectHandler(setSelectedMajorBoons, availableMajorBoonPicks);
    
    const handleGoodTidingsBoostToggle = (type: 'minorBoons' | 'majorBoons') => {
        // If Oni's Blessing is active, toggle does nothing visually/functionally for count
        // but we allow the state to persist so if Oni's Blessing is removed, the old state returns
        if (type === 'minorBoons') {
            if (!isMinorBoonsBoosted && availableSigilCounts.purth > 0) {
                setIsMinorBoonsBoosted(true);
            } else {
                setIsMinorBoonsBoosted(false);
            }
        }
        if (type === 'majorBoons') {
            if (!isMajorBoonsBoosted && availableSigilCounts.xuth > 0) {
                setIsMajorBoonsBoosted(true);
            } else {
                setIsMajorBoonsBoosted(false);
            }
        }
    };

    const usedSigilCounts = useMemo(() => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        const tierOrder: ('standard' | 'journeyman' | 'master')[] = ['standard', 'journeyman', 'master'];
        const tierIndex = selectedGoodTidingsTier ? tierOrder.indexOf(selectedGoodTidingsTier) : -1;
        
        // Calculate used sigils for the selected tier AND all tiers below it
        for (let i = 0; i <= tierIndex; i++) {
            const tierId = tierOrder[i];
            const tierData = GOOD_TIDINGS_SIGIL_TREE_DATA.find(t => t.id === tierId);
            if (tierData) {
                const type = getSigilTypeFromImage(tierData.imageSrc);
                if (type) {
                    used[type] += 1;
                }
            }
        }

        // If Oni's Blessing is active, these sigils are NOT consumed (refund logic)
        if (!isOnisBlessingActive) {
            if (isMinorBoonsBoosted) used.purth += 1;
            if (isMajorBoonsBoosted) used.xuth += 1;
        }

        return used;
    }, [selectedGoodTidingsTier, isMinorBoonsBoosted, isMajorBoonsBoosted, isOnisBlessingActive]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        const tierOrder: ('standard' | 'journeyman' | 'master')[] = ['standard', 'journeyman', 'master'];
        const tierIndex = selectedGoodTidingsTier ? tierOrder.indexOf(selectedGoodTidingsTier) : -1;

        for (let i = 0; i <= tierIndex; i++) {
            const tierId = tierOrder[i];
            const tierData = GOOD_TIDINGS_SIGIL_TREE_DATA.find(t => t.id === tierId);
            if (tierData) {
                const type = getSigilTypeFromImage(tierData.imageSrc);
                if (type && SIGIL_BP_COSTS[type]) {
                    cost += SIGIL_BP_COSTS[type];
                }
            }
        }
        
        return cost;
    }, [selectedGoodTidingsTier]);

    // Load function
    const loadState = useCallback((data: any) => {
        setSelectedGoodTidingsTier(data.selectedGoodTidingsTier || null);
        setSelectedEssentialBoons(new Set(data.selectedEssentialBoons || []));
        setSelectedMinorBoons(new Set(data.selectedMinorBoons || []));
        setSelectedMajorBoons(new Set(data.selectedMajorBoons || []));
        setIsMinorBoonsBoosted(data.isMinorBoonsBoosted || false);
        setIsMajorBoonsBoosted(data.isMajorBoonsBoosted || false);
        setIsMagicianApplied(data.isGoodTidingsMagicianApplied || false);
    }, []);

    return {
        selectedGoodTidingsTier, handleGoodTidingsTierSelect,
        selectedEssentialBoons, handleEssentialBoonSelect, availableEssentialBoonPicks,
        selectedMinorBoons, handleMinorBoonSelect, availableMinorBoonPicks,
        selectedMajorBoons, handleMajorBoonSelect, availableMajorBoonPicks,
        isMinorBoonsBoosted, isMajorBoonsBoosted, handleGoodTidingsBoostToggle,
        isEssentialBoosted, isMinorBoosted, isMajorBoosted, // Added effective states
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        usedSigilCounts,
        goodTidingsUsedSigils: usedSigilCounts,
        loadState
    };
};
