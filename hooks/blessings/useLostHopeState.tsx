
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { LOST_HOPE_SIGIL_TREE_DATA, CHANNELLING_DATA, NECROMANCY_DATA, BLACK_MAGIC_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export const useLostHopeState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedLostHopeSigils, setSelectedLostHopeSigils] = useState<Set<string>>(new Set());
    const [selectedChannelling, setSelectedChannelling] = useState<Set<string>>(new Set());
    const [selectedNecromancy, setSelectedNecromancy] = useState<Set<string>>(new Set());
    const [selectedBlackMagic, setSelectedBlackMagic] = useState<Set<string>>(new Set());
    const [isChannellingBoosted, setIsChannellingBoosted] = useState(false);
    const [isNecromancyBoosted, setIsNecromancyBoosted] = useState(false);
    const [blackMagicBoostSigil, setBlackMagicBoostSigil] = useState<'sinthru' | 'xuth' | null>(null);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const [undeadThrallCompanionName, setUndeadThrallCompanionName] = useState<string | null>(null);
    const [undeadBeastName, setUndeadBeastName] = useState<string | null>(null);

    const prevBlackMagicBoostSigil = useRef(blackMagicBoostSigil);
    useEffect(() => {
        if (prevBlackMagicBoostSigil.current && !blackMagicBoostSigil) {
            // Boost was removed, reset the companion in case it was over the limit
            setUndeadThrallCompanionName(null);
        }
        prevBlackMagicBoostSigil.current = blackMagicBoostSigil;
    }, [blackMagicBoostSigil]);

    const handleUndeadThrallCompanionAssign = (name: string | null) => {
        setUndeadThrallCompanionName(name);
    };

    const handleUndeadBeastAssign = (name: string | null) => {
        setUndeadBeastName(name);
    };

    useEffect(() => {
        if (!selectedBlackMagic.has('undead_thrall')) {
            setUndeadThrallCompanionName(null);
        }
    }, [selectedBlackMagic]);

    useEffect(() => {
        if (!selectedNecromancy.has('undead_beast')) {
            setUndeadBeastName(null);
        }
    }, [selectedNecromancy]);

    const { availableChannellingPicks, availableNecromancyPicks, availableBlackMagicPicks } = useMemo(() => {
        let channelling = 0, necromancy = 0, blackMagic = 0;
        selectedLostHopeSigils.forEach(sigilId => {
            const sigil = LOST_HOPE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                channelling += sigil.benefits.channeling ?? 0;
                necromancy += sigil.benefits.necromancy ?? 0;
                blackMagic += sigil.benefits.blackMagic ?? 0;
            }
        });
        return { availableChannellingPicks: channelling, availableNecromancyPicks: necromancy, availableBlackMagicPicks: blackMagic };
    }, [selectedLostHopeSigils]);

    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedChannelling.size > availableChannellingPicks) {
             setSelectedChannelling(prev => new Set(Array.from(prev).slice(0, availableChannellingPicks)));
        }
        if (selectedNecromancy.size > availableNecromancyPicks) {
            const arr = Array.from(selectedNecromancy);
            const toKeep = new Set(arr.slice(0, availableNecromancyPicks));
            const toRemove = arr.slice(availableNecromancyPicks);
            
            if (toRemove.includes('undead_beast')) {
                setUndeadBeastName(null);
            }
            setSelectedNecromancy(toKeep);
        }
        if (selectedBlackMagic.size > availableBlackMagicPicks) {
            const arr = Array.from(selectedBlackMagic);
            const toKeep = new Set(arr.slice(0, availableBlackMagicPicks));
            const toRemove = arr.slice(availableBlackMagicPicks);
            
            if (toRemove.includes('undead_thrall')) {
                setUndeadThrallCompanionName(null);
            }
            setSelectedBlackMagic(toKeep);
        }
    }, [availableChannellingPicks, availableNecromancyPicks, availableBlackMagicPicks, selectedChannelling.size, selectedNecromancy.size, selectedBlackMagic.size]);

    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);

    const handleLostHopeSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedLostHopeSigils);
        const sigil = LOST_HOPE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                LOST_HOPE_SIGIL_TREE_DATA.forEach(child => {
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

            deselectDependent(CHANNELLING_DATA, selectedChannelling, setSelectedChannelling);
            deselectDependent(NECROMANCY_DATA, selectedNecromancy, setSelectedNecromancy);
            deselectDependent(BLACK_MAGIC_DATA, selectedBlackMagic, setSelectedBlackMagic);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedLostHopeSigils(newSelected);
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

    const handleChannellingSelect = createMultiSelectHandler(setSelectedChannelling, availableChannellingPicks);
    const handleNecromancySelect = createMultiSelectHandler(setSelectedNecromancy, availableNecromancyPicks);
    const handleBlackMagicSelect = createMultiSelectHandler(setSelectedBlackMagic, availableBlackMagicPicks);

    const handleLostHopeBoostToggle = (type: 'channelling' | 'necromancy' | 'blackMagic', sigilType?: 'sinthru' | 'xuth') => {
        if (type === 'channelling') {
            if (!isChannellingBoosted && availableSigilCounts.kaarn > 0) setIsChannellingBoosted(true);
            else setIsChannellingBoosted(false);
        }
        if (type === 'necromancy') {
            if (!isNecromancyBoosted && availableSigilCounts.purth > 0) setIsNecromancyBoosted(true);
            else setIsNecromancyBoosted(false);
        }
        if (type === 'blackMagic') {
            if (sigilType) {
                if (blackMagicBoostSigil === sigilType) {
                    setBlackMagicBoostSigil(null);
                } else if (availableSigilCounts[sigilType] > 0) {
                    setBlackMagicBoostSigil(sigilType);
                }
            } else {
                if (blackMagicBoostSigil) {
                    setBlackMagicBoostSigil(null);
                } else {
                    if (availableSigilCounts.sinthru > 0) setBlackMagicBoostSigil('sinthru');
                    else if (availableSigilCounts.xuth > 0) setBlackMagicBoostSigil('xuth');
                }
            }
        }
    };

    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedLostHopeSigils.forEach(id => {
            const sigil = LOST_HOPE_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        if(isChannellingBoosted) used.kaarn += 1;
        if(isNecromancyBoosted) used.purth += 1;
        if(blackMagicBoostSigil) used[blackMagicBoostSigil] += 1;
        return used;
    }, [selectedLostHopeSigils, isChannellingBoosted, isNecromancyBoosted, blackMagicBoostSigil]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedLostHopeSigils.forEach(id => {
            const sigil = LOST_HOPE_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedLostHopeSigils]);

    // Load function
    const loadState = useCallback((data: any) => {
        setSelectedLostHopeSigils(new Set(data.selectedLostHopeSigils || []));
        setSelectedChannelling(new Set(data.selectedChannelling || []));
        setSelectedNecromancy(new Set(data.selectedNecromancy || []));
        setSelectedBlackMagic(new Set(data.selectedBlackMagic || []));
        setIsChannellingBoosted(data.isChannellingBoosted || false);
        setIsNecromancyBoosted(data.isNecromancyBoosted || false);
        setBlackMagicBoostSigil(data.blackMagicBoostSigil || null);
        setIsMagicianApplied(data.isLostHopeMagicianApplied || false);
        setUndeadThrallCompanionName(data.undeadThrallCompanionName || null);
        setUndeadBeastName(data.undeadBeastName || null);
    }, []);

    return {
        selectedLostHopeSigils, handleLostHopeSigilSelect,
        selectedChannelling, handleChannellingSelect,
        selectedNecromancy, handleNecromancySelect,
        selectedBlackMagic, handleBlackMagicSelect,
        isChannellingBoosted, isNecromancyBoosted, blackMagicBoostSigil, handleLostHopeBoostToggle,
        availableChannellingPicks, availableNecromancyPicks, availableBlackMagicPicks,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        undeadThrallCompanionName,
        handleUndeadThrallCompanionAssign,
        undeadBeastName,
        handleUndeadBeastAssign,
        usedSigilCounts,
        loadState
    };
};
