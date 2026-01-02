
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { GRACIOUS_DEFEAT_SIGIL_TREE_DATA, INFLUENCE_DATA, ENTRANCE_DATA } from '../../constants';

export interface LivingInhabitant {
  id: number;
  type: 'populated' | 'rarer' | null;
  beastName: string | null;
}

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export const useGraciousDefeatState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedGraciousDefeatSigils, setSelectedGraciousDefeatSigils] = useState<Set<string>>(new Set());
    const [selectedEntrance, setSelectedEntrance] = useState<Set<string>>(new Set());
    const [selectedInfluence, setSelectedInfluence] = useState<Set<string>>(new Set());
    const [isFeaturesBoosted, setIsFeaturesBoosted] = useState(false);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const [verseAttendantCount, setVerseAttendantCount] = useState(0);
    const [verseAttendantCompanionNames, setVerseAttendantCompanionNames] = useState<(string | null)[]>([]);
    const [livingInhabitants, setLivingInhabitants] = useState<LivingInhabitant[]>([]);
    const [overlordBeastName, setOverlordBeastName] = useState<string | null>(null);

    const [naturalEnvironmentCount, setNaturalEnvironmentCount] = useState(0);
    const [artificialEnvironmentCount, setArtificialEnvironmentCount] = useState(0);
    const [shiftingWeatherCount, setShiftingWeatherCount] = useState(0);
    const [brokenSpaceCount, setBrokenSpaceCount] = useState(0);
    const [brokenTimeCount, setBrokenTimeCount] = useState(0);
    const [promisedLandCount, setPromisedLandCount] = useState(0);

    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);

    const prevIsFeaturesBoosted = useRef(isFeaturesBoosted);
    useEffect(() => {
        if (prevIsFeaturesBoosted.current && !isFeaturesBoosted) {
            // Boost was removed, reset all attendant companions as they might be over the limit
            setVerseAttendantCompanionNames(prev => Array(prev.length).fill(null));
        }
        prevIsFeaturesBoosted.current = isFeaturesBoosted;
    }, [isFeaturesBoosted]);

    const { availableEntrancePicks, availableFeaturesPicks, availableInfluencePicks } = useMemo(() => {
        let entrance = 0, features = 0, influence = 0;
        selectedGraciousDefeatSigils.forEach(sigilId => {
            const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                entrance += sigil.benefits.entrance ?? 0;
                features += sigil.benefits.features ?? 0;
                influence += sigil.benefits.influence ?? 0;
            }
        });
        return { availableEntrancePicks: entrance, availableFeaturesPicks: features, availableInfluencePicks: influence };
    }, [selectedGraciousDefeatSigils]);

    const featurePicksUsed = useMemo(() => (
        naturalEnvironmentCount +
        artificialEnvironmentCount +
        shiftingWeatherCount +
        brokenSpaceCount +
        brokenTimeCount +
        promisedLandCount +
        verseAttendantCount + 
        livingInhabitants.length
    ), [
        naturalEnvironmentCount,
        artificialEnvironmentCount,
        shiftingWeatherCount,
        brokenSpaceCount,
        brokenTimeCount,
        promisedLandCount,
        verseAttendantCount, 
        livingInhabitants.length
    ]);
    
    useEffect(() => {
      if (!selectedInfluence.has('overlord')) {
        setOverlordBeastName(null);
      }
    }, [selectedInfluence]);

    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedEntrance.size > availableEntrancePicks) {
            setSelectedEntrance(prev => new Set(Array.from(prev).slice(0, availableEntrancePicks)));
        }
        if (selectedInfluence.size > availableInfluencePicks) {
            const arr = Array.from(selectedInfluence);
            const toKeep = new Set(arr.slice(0, availableInfluencePicks));
            const toRemove = arr.slice(availableInfluencePicks);
            
            if (toRemove.includes('overlord')) {
                setOverlordBeastName(null);
            }
            setSelectedInfluence(toKeep);
        }
    }, [availableEntrancePicks, availableInfluencePicks, selectedEntrance.size, selectedInfluence.size]);

    useEffect(() => {
        const maxPicks = availableFeaturesPicks;
        if (featurePicksUsed > maxPicks) {
            let overflow = featurePicksUsed - maxPicks;

            const countableStates: [number, Dispatch<SetStateAction<number>>][] = [
                [promisedLandCount, setPromisedLandCount],
                [brokenTimeCount, setBrokenTimeCount],
                [brokenSpaceCount, setBrokenSpaceCount],
                [shiftingWeatherCount, setShiftingWeatherCount],
                [artificialEnvironmentCount, setArtificialEnvironmentCount],
                [naturalEnvironmentCount, setNaturalEnvironmentCount],
            ];
    
            for (const [count, setCount] of countableStates) {
                if (overflow <= 0) break;
                if (count > 0) {
                    const reduction = Math.min(count, overflow);
                    setCount(prevCount => prevCount - reduction);
                    overflow -= reduction;
                }
            }

            if (overflow > 0) {
                const newInhabitantCount = Math.max(0, livingInhabitants.length - overflow);
                if (newInhabitantCount < livingInhabitants.length) {
                    const overflowAfterInhabitants = overflow - (livingInhabitants.length - newInhabitantCount);
                    setLivingInhabitants(prev => prev.slice(0, newInhabitantCount));
                    overflow = overflowAfterInhabitants;
                }
            }
    
            if (overflow > 0) {
              const newAttendantCount = Math.max(0, verseAttendantCount - overflow);
              if (newAttendantCount < verseAttendantCount) {
                  setVerseAttendantCount(newAttendantCount);
                  setVerseAttendantCompanionNames(prev => prev.slice(0, newAttendantCount));
              }
            }
        }
    }, [
        availableFeaturesPicks,
        featurePicksUsed,
        naturalEnvironmentCount,
        artificialEnvironmentCount,
        shiftingWeatherCount,
        brokenSpaceCount,
        brokenTimeCount,
        promisedLandCount,
        verseAttendantCount, 
        livingInhabitants.length
    ]);

    const handleGraciousDefeatSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedGraciousDefeatSigils);
        const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                GRACIOUS_DEFEAT_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));
            
            // Filter Entrance (Remove Gathoth Puzzle if Sweet Suffering removed)
            const newEntrance = new Set(selectedEntrance);
            selectedEntrance.forEach(powerId => {
                 const power = ENTRANCE_DATA.find(p => p.id === powerId);
                 if(power?.requires?.some(req => toRemove.has(req))) {
                     newEntrance.delete(powerId);
                 }
            });
            setSelectedEntrance(newEntrance);

            // Filter Influence (Remove Reality Invasion / Soul Harvest)
            const newInfluence = new Set(selectedInfluence);
            selectedInfluence.forEach(powerId => {
                const power = INFLUENCE_DATA.find(p => p.id === powerId);
                // Requires Sigils OR requires Entrance power (Gathoth Puzzle)
                if(power?.requires?.some(req => {
                    // Check if req is a removed sigil
                    if (toRemove.has(req)) return true;
                    // Check if req is an Entrance power that was just removed
                    if (req === 'gathoth_puzzle' && !newEntrance.has('gathoth_puzzle')) return true;
                    return false;
                })) { 
                    newInfluence.delete(powerId);
                }
            });
            setSelectedInfluence(newInfluence);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedGraciousDefeatSigils(newSelected);
    };
    
    const createCountHandler = (
        count: number, 
        setCount: Dispatch<SetStateAction<number>>,
        max: number = Infinity,
        sideEffect?: (newCount: number) => void 
    ) => (newCount: number) => {
        const finalCount = Math.max(0, Math.min(newCount, max));
        const countDiff = finalCount - count;

        if (countDiff > 0) { // trying to add
            if (featurePicksUsed + countDiff > availableFeaturesPicks) {
                return;
            }
        }
        
        if (finalCount !== count) {
            setCount(finalCount);
            sideEffect?.(finalCount);
        }
    };
    
    // Cascading handlers for Features
    const handleVerseAttendantCountChange = createCountHandler(verseAttendantCount, setVerseAttendantCount, Infinity, (finalCount) => {
        setVerseAttendantCompanionNames(prev => {
            const newArray = [...prev];
            newArray.length = finalCount;
            if (finalCount > prev.length) {
               return newArray.fill(null, prev.length);
            }
            return newArray;
        });
        if (finalCount === 0) {
            setSelectedInfluence(prev => {
                const next = new Set(prev);
                next.delete('summon_attendant');
                return next;
            });
        }
    });

    const addLivingInhabitant = () => {
        if (featurePicksUsed < availableFeaturesPicks) {
            setLivingInhabitants(prev => [...prev, { id: Date.now() + Math.random(), type: null, beastName: null }]);
        }
    };

    const removeLivingInhabitant = (id: number) => {
        setLivingInhabitants(prev => {
            const next = prev.filter(inhabitant => inhabitant.id !== id);
            if (next.length === 0) {
                 setSelectedInfluence(pi => {
                    const n = new Set(pi);
                    n.delete('summon_creature');
                    return n;
                });
            }
            return next;
        });
    };
    
    const assignLivingInhabitantBeast = (id: number, type: 'populated' | 'rarer', beastName: string | null) => {
        setLivingInhabitants(prev => prev.map(inhabitant => 
            inhabitant.id === id ? { ...inhabitant, type, beastName } : inhabitant
        ));
    };

    const handleVerseAttendantCompanionAssign = (index: number, name: string | null) => {
        setVerseAttendantCompanionNames(prev => {
            const newArray = [...prev];
            if (index < newArray.length) {
                newArray[index] = name;
            }
            return newArray;
        });
    };

    const handleOverlordBeastAssign = (name: string | null) => {
        setOverlordBeastName(name);
    };

    const createMultiSelectHandler = (setState: Dispatch<SetStateAction<Set<string>>>, max: number, currentlyUsed: number) => (id: string) => {
        setState(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else if (currentlyUsed < max) {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleNaturalEnvironmentCountChange = createCountHandler(naturalEnvironmentCount, setNaturalEnvironmentCount);
    const handleArtificialEnvironmentCountChange = createCountHandler(artificialEnvironmentCount, setArtificialEnvironmentCount);
    const handleShiftingWeatherCountChange = createCountHandler(shiftingWeatherCount, setShiftingWeatherCount, 1, (newCount) => {
        if (newCount === 0) {
             setSelectedInfluence(prev => {
                const next = new Set(prev);
                next.delete('summon_weather');
                return next;
            });
        }
    });
    const handleBrokenSpaceCountChange = createCountHandler(brokenSpaceCount, setBrokenSpaceCount, 1);
    const handleBrokenTimeCountChange = createCountHandler(brokenTimeCount, setBrokenTimeCount, 1);
    const handlePromisedLandCountChange = createCountHandler(promisedLandCount, setPromisedLandCount);

    const handleEntranceSelect = (id: string) => {
        setSelectedEntrance(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Cascade: Soul Harvest requires Gathoth Puzzle
                if (id === 'gathoth_puzzle') {
                    setSelectedInfluence(prevInf => {
                        const nextInf = new Set(prevInf);
                        nextInf.delete('soul_harvest');
                        return nextInf;
                    });
                }
            } else if (selectedEntrance.size < availableEntrancePicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleInfluenceSelect = createMultiSelectHandler(setSelectedInfluence, availableInfluencePicks, selectedInfluence.size);

    const handleGraciousDefeatBoostToggle = (type: 'features') => {
        if (type === 'features') {
            if (!isFeaturesBoosted && availableSigilCounts.kaarn > 0) setIsFeaturesBoosted(true);
            else setIsFeaturesBoosted(false);
        }
    };
    
    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedGraciousDefeatSigils.forEach(id => {
            const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        if(isFeaturesBoosted) used.kaarn += 1;
        return used;
    }, [selectedGraciousDefeatSigils, isFeaturesBoosted]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedGraciousDefeatSigils.forEach(id => {
            const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedGraciousDefeatSigils]);

    // Load function
    const loadState = useCallback((data: any) => {
        setSelectedGraciousDefeatSigils(new Set(data.selectedGraciousDefeatSigils || []));
        setSelectedEntrance(new Set(data.selectedEntrance || []));
        setSelectedInfluence(new Set(data.selectedInfluence || []));
        setIsFeaturesBoosted(data.isFeaturesBoosted || false);
        setIsMagicianApplied(data.isGraciousDefeatMagicianApplied || false);
        setVerseAttendantCount(data.verseAttendantCount || 0);
        setVerseAttendantCompanionNames(data.verseAttendantCompanionNames || []);
        
        // Handle living inhabitants (array of objects)
        if (Array.isArray(data.livingInhabitants)) {
            setLivingInhabitants(data.livingInhabitants);
        } else {
            setLivingInhabitants([]);
        }

        setOverlordBeastName(data.overlordBeastName || null);
        setNaturalEnvironmentCount(data.naturalEnvironmentCount || 0);
        setArtificialEnvironmentCount(data.artificialEnvironmentCount || 0);
        setShiftingWeatherCount(data.shiftingWeatherCount || 0);
        setBrokenSpaceCount(data.brokenSpaceCount || 0);
        setBrokenTimeCount(data.brokenTimeCount || 0);
        setPromisedLandCount(data.promisedLandCount || 0);
    }, []);
    
    return {
        selectedGraciousDefeatSigils, handleGraciousDefeatSigilSelect,
        selectedEntrance, handleEntranceSelect,
        selectedInfluence, handleInfluenceSelect,
        isFeaturesBoosted, handleGraciousDefeatBoostToggle,
        availableEntrancePicks, availableFeaturesPicks, availableInfluencePicks,
        featurePicksUsed,
        verseAttendantCount, handleVerseAttendantCountChange,
        verseAttendantCompanionNames, handleVerseAttendantCompanionAssign,
        livingInhabitants, addLivingInhabitant, removeLivingInhabitant, assignLivingInhabitantBeast,
        overlordBeastName, handleOverlordBeastAssign,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        usedSigilCounts,
        naturalEnvironmentCount, handleNaturalEnvironmentCountChange,
        artificialEnvironmentCount, handleArtificialEnvironmentCountChange,
        shiftingWeatherCount, handleShiftingWeatherCountChange,
        brokenSpaceCount, handleBrokenSpaceCountChange,
        brokenTimeCount, handleBrokenTimeCountChange,
        promisedLandCount, handlePromisedLandCountChange,
        loadState
    };
};
