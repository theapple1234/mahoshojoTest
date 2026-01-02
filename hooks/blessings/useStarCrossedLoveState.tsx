
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { STAR_CROSSED_LOVE_SIGIL_TREE_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const useStarCrossedLoveState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedStarCrossedLoveSigils, setSelectedStarCrossedLoveSigils] = useState<Set<string>>(new Set());
    const [selectedStarCrossedLovePacts, setSelectedStarCrossedLovePacts] = useState<Set<string>>(new Set());
    const [onisBlessingGuardianName, setOnisBlessingGuardianName] = useState<string | null>(null);
    const [lostKronackImmunity, setLostKronackImmunity] = useState<string | null>(null);
    const [jadeEmperorExtraXuthPurchased, setJadeEmperorExtraXuthPurchased] = useState(false);

    const handleOnisBlessingGuardianAssign = (name: string | null) => {
        setOnisBlessingGuardianName(name);
    };

    const handleLostKronackImmunityChange = (immunity: string | null) => {
        setLostKronackImmunity(immunity);
    };
    
    const handleToggleJadeEmperorExtraXuth = () => {
        setJadeEmperorExtraXuthPurchased(prev => !prev);
    };

    useEffect(() => {
        if (!selectedStarCrossedLovePacts.has('onis_blessing')) {
            setOnisBlessingGuardianName(null);
        }
        if (!selectedStarCrossedLovePacts.has('lost_kronacks_deal')) {
            setLostKronackImmunity(null);
        }
        if (!selectedStarCrossedLovePacts.has('jade_emperors_challenge')) {
            setJadeEmperorExtraXuthPurchased(false);
        }
    }, [selectedStarCrossedLovePacts]);

    const { availablePactPicks } = useMemo(() => {
        let pacts = 0;
        selectedStarCrossedLoveSigils.forEach(sigilId => {
            const sigil = STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                pacts += sigil.benefits.pacts ?? 0;
            }
        });
        return { availablePactPicks: pacts };
    }, [selectedStarCrossedLoveSigils]);

    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedStarCrossedLovePacts.size > availablePactPicks) {
            const arr = Array.from(selectedStarCrossedLovePacts);
            const toKeep = new Set(arr.slice(0, availablePactPicks));
            const toRemove = arr.slice(availablePactPicks);
            
            if (toRemove.includes('onis_blessing')) setOnisBlessingGuardianName(null);
            if (toRemove.includes('lost_kronacks_deal')) setLostKronackImmunity(null);
            if (toRemove.includes('jade_emperors_challenge')) setJadeEmperorExtraXuthPurchased(false);
            
            setSelectedStarCrossedLovePacts(toKeep);
        }
    }, [availablePactPicks, selectedStarCrossedLovePacts.size]);

    const handleStarCrossedLoveSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedStarCrossedLoveSigils);
        const sigil = STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            // Cascade delete: remove this sigil and any that require it
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            
            while (queue.length > 0) {
                const currentId = queue.shift()!;
                STAR_CROSSED_LOVE_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites?.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));
        } else {
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            // Simple prerequisite check for selection
            const canSelect = !sigil.prerequisites || sigil.prerequisites.length === 0 || sigil.prerequisites.every(p => newSelected.has(p));

            if (hasSigil && canSelect) {
                newSelected.add(sigilId);
            }
        }
        setSelectedStarCrossedLoveSigils(newSelected);
    };

    const handleStarCrossedLovePactSelect = (id: string) => {
        setSelectedStarCrossedLovePacts(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else if (newSet.size < availablePactPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedStarCrossedLoveSigils.forEach(id => {
            const sigil = STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        return used;
    }, [selectedStarCrossedLoveSigils]);

    // Load function
    const loadState = useCallback((data: any) => {
        setSelectedStarCrossedLoveSigils(new Set(data.selectedStarCrossedLoveSigils || []));
        setSelectedStarCrossedLovePacts(new Set(data.selectedStarCrossedLovePacts || []));
        setOnisBlessingGuardianName(data.onisBlessingGuardianName || null);
        setLostKronackImmunity(data.lostKronackImmunity || null);
        setJadeEmperorExtraXuthPurchased(data.jadeEmperorExtraXuthPurchased || false);
    }, []);

    return {
        selectedStarCrossedLoveSigils, handleStarCrossedLoveSigilSelect,
        selectedStarCrossedLovePacts, handleStarCrossedLovePactSelect,
        availablePactPicks,
        onisBlessingGuardianName,
        handleOnisBlessingGuardianAssign,
        lostKronackImmunity,
        handleLostKronackImmunityChange,
        jadeEmperorExtraXuthPurchased,
        handleToggleJadeEmperorExtraXuth,
        usedSigilCounts,
        loadState
    };
};
