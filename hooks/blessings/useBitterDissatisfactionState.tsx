
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { BITTER_DISSATISFACTION_SIGIL_TREE_DATA, BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export const useBitterDissatisfactionState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    // ... existing state definitions ...
    const [selectedBitterDissatisfactionSigils, setSelectedBitterDissatisfactionSigils] = useState<Set<string>>(new Set());
    const [selectedBrewing, setSelectedBrewing] = useState<Set<string>>(new Set());
    const [selectedSoulAlchemy, setSelectedSoulAlchemy] = useState<Set<string>>(new Set());
    const [selectedTransformation, setSelectedTransformation] = useState<Set<string>>(new Set());
    const [isBrewingBoosted, setIsBrewingBoosted] = useState(false);
    const [isSoulAlchemyBoosted, setIsSoulAlchemyBoosted] = useState(false);
    const [isTransformationBoosted, setIsTransformationBoosted] = useState(false);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const [humanMarionetteCount, setHumanMarionetteCount] = useState<number | null>(null);
    const [humanMarionetteCompanionNames, setHumanMarionetteCompanionNames] = useState<(string | null)[]>([]);
    
    const [mageFamiliarBeastName, setMageFamiliarBeastName] = useState<string | null>(null);
    const [beastmasterCount, setBeastmasterCount] = useState<number | null>(null);
    const [beastmasterBeastNames, setBeastmasterBeastNames] = useState<(string | null)[]>([]);
    const [personificationBuildName, setPersonificationBuildName] = useState<string | null>(null);
    
    const [shedHumanityBeastName, setShedHumanityBeastName] = useState<string | null>(null);
    const [malrayootsMageFormName, setMalrayootsMageFormName] = useState<string | null>(null);
    const [malrayootsUniversalFormName, setMalrayootsUniversalFormName] = useState<string | null>(null);

    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);
    
    const handleShedHumanityBeastAssign = (name: string | null) => {
        setShedHumanityBeastName(name);
    };

    const handleMalrayootsMageFormAssign = (name: string | null) => {
        setMalrayootsMageFormName(name);
    };
    const handleMalrayootsUniversalFormAssign = (name: string | null) => {
        setMalrayootsUniversalFormName(name);
    };

    const handleMageFamiliarBeastAssign = (name: string | null) => {
        setMageFamiliarBeastName(name);
    };

    const handlePersonificationBuildAssign = (name: string | null) => {
        setPersonificationBuildName(name);
    };

    const handleBeastmasterCountChange = (count: number | null) => {
        setBeastmasterCount(count);
        if (count === null || count === 0) {
            setBeastmasterBeastNames([]);
        } else {
            setBeastmasterBeastNames(Array(count).fill(null));
        }
    };

    const handleBeastmasterBeastAssign = (index: number, name: string | null) => {
        setBeastmasterBeastNames(prev => {
            const newArray = [...prev];
            if (index < newArray.length) {
                newArray[index] = name;
            }
            return newArray;
        });
    };

    const prevSoulAlchemyBoosted = useRef(isSoulAlchemyBoosted);
    useEffect(() => {
        if (prevSoulAlchemyBoosted.current && !isSoulAlchemyBoosted) {
            // Human Marionette logic
            const nonBoostedCounts = [1, 2, 4, 5, 10, 20, 25, 50];
            if (humanMarionetteCount && !nonBoostedCounts.includes(humanMarionetteCount)) {
                setHumanMarionetteCount(null);
                setHumanMarionetteCompanionNames([]);
            }

            // Familiar/Beastmaster logic
            setMageFamiliarBeastName(null);
            setBeastmasterCount(null);
            setBeastmasterBeastNames(prev => Array(prev.length).fill(null));
        }
        prevSoulAlchemyBoosted.current = isSoulAlchemyBoosted;
    }, [isSoulAlchemyBoosted, humanMarionetteCount]);

    const prevTransformationBoosted = useRef(isTransformationBoosted);
    useEffect(() => {
        if (prevTransformationBoosted.current && !isTransformationBoosted) {
            setShedHumanityBeastName(null);
        }
        prevTransformationBoosted.current = isTransformationBoosted;
    }, [isTransformationBoosted]);


    const { availableBrewingPicks, availableSoulAlchemyPicks, availableTransformationPicks } = useMemo(() => {
        // ... (existing logic for limits) ...
        let baseBrewing = 0;
        let baseSoulAlchemy = 0;
        let baseTransformation = 0;
        let hasFireborn = false;

        selectedBitterDissatisfactionSigils.forEach(sigilId => {
            const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                if (sigil.id === 'fireborn') {
                    hasFireborn = true;
                } else {
                    baseBrewing += sigil.benefits.brewing ?? 0;
                    baseSoulAlchemy += sigil.benefits.soulAlchemy ?? 0;
                    baseTransformation += sigil.benefits.transformation ?? 0;
                }
            }
        });

        let bonusBrewing = 0;
        let bonusSoulAlchemy = 0;
        let bonusTransformation = 0;

        if (hasFireborn) {
            const brewingNeedsBonus = selectedBrewing.size > baseBrewing;
            const soulNeedsBonus = selectedSoulAlchemy.size > baseSoulAlchemy;
            const transNeedsBonus = selectedTransformation.size > baseTransformation;

            const usedBonusSlots = (brewingNeedsBonus ? 1 : 0) + (soulNeedsBonus ? 1 : 0) + (transNeedsBonus ? 1 : 0);

            if (usedBonusSlots >= 2) {
                if (brewingNeedsBonus) bonusBrewing = 1;
                if (soulNeedsBonus) bonusSoulAlchemy = 1;
                if (transNeedsBonus) bonusTransformation = 1;
            } else {
                bonusBrewing = 1;
                bonusSoulAlchemy = 1;
                bonusTransformation = 1;
            }
        }

        return { 
            availableBrewingPicks: baseBrewing + bonusBrewing, 
            availableSoulAlchemyPicks: baseSoulAlchemy + bonusSoulAlchemy, 
            availableTransformationPicks: baseTransformation + bonusTransformation 
        };
    }, [selectedBitterDissatisfactionSigils, selectedBrewing.size, selectedSoulAlchemy.size, selectedTransformation.size]);

    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedBrewing.size > availableBrewingPicks) {
            setSelectedBrewing(prev => new Set(Array.from(prev).slice(0, availableBrewingPicks)));
        }
        if (selectedSoulAlchemy.size > availableSoulAlchemyPicks) {
            const currentArray = Array.from(selectedSoulAlchemy);
            const toRemove = currentArray.slice(availableSoulAlchemyPicks);
            const toKeep = new Set(currentArray.slice(0, availableSoulAlchemyPicks));
             
            toRemove.forEach(id => {
               if (id === 'human_marionettes') {
                   setHumanMarionetteCount(null);
                   setHumanMarionetteCompanionNames([]);
               }
               if (id === 'mages_familiar_i') {
                   setMageFamiliarBeastName(null);
                   setBeastmasterCount(null);
                   setBeastmasterBeastNames([]);
                   toKeep.delete('mages_familiar_ii');
                   toKeep.delete('mages_familiar_iii');
                   toKeep.delete('beastmaster');
               }
               if (id === 'beastmaster') {
                   setBeastmasterCount(null);
                   setBeastmasterBeastNames([]);
               }
               if (id === 'personification') {
                   setPersonificationBuildName(null);
               }
            });
            setSelectedSoulAlchemy(toKeep);
        }
        if (selectedTransformation.size > availableTransformationPicks) {
            const currentArray = Array.from(selectedTransformation);
            const toRemove = currentArray.slice(availableTransformationPicks);
            const toKeep = new Set(currentArray.slice(0, availableTransformationPicks));
            
            toRemove.forEach(id => {
                 if (id === 'shed_humanity_i') {
                    setShedHumanityBeastName(null);
                    toKeep.delete('shed_humanity_ii'); // Ensure ii is removed if i is trimmed
                }
                if (id === 'malrayoots') {
                    setMalrayootsMageFormName(null);
                    setMalrayootsUniversalFormName(null);
                }
            });
            setSelectedTransformation(toKeep);
        }
    }, [availableBrewingPicks, availableSoulAlchemyPicks, availableTransformationPicks, selectedBrewing.size, selectedSoulAlchemy.size, selectedTransformation.size]);

    // ... (totalBeastPoints, shedHumanityPoints memos) ...
    const totalBeastPoints = useMemo(() => {
        let points = 0;
        const boostAmount = isSoulAlchemyBoosted ? 10 : 0;
        if (selectedSoulAlchemy.has('mages_familiar_i')) points = 30 + boostAmount;
        if (selectedSoulAlchemy.has('mages_familiar_ii')) points = 60 + boostAmount;
        if (selectedSoulAlchemy.has('mages_familiar_iii')) points = 90 + boostAmount;
        return points;
    }, [selectedSoulAlchemy, isSoulAlchemyBoosted]);

    const shedHumanityPoints = useMemo(() => {
        let points = 0;
        const boostAmount = isTransformationBoosted ? 10 : 0;
        if (selectedTransformation.has('shed_humanity_i')) points = 50 + boostAmount;
        if (selectedTransformation.has('shed_humanity_ii')) points = 80 + boostAmount;
        return points;
    }, [selectedTransformation, isTransformationBoosted]);


    const handleBitterDissatisfactionSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedBitterDissatisfactionSigils);
        const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                BITTER_DISSATISFACTION_SIGIL_TREE_DATA.forEach(child => {
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

            deselectDependent(BREWING_DATA, selectedBrewing, setSelectedBrewing);
            deselectDependent(SOUL_ALCHEMY_DATA, selectedSoulAlchemy, setSelectedSoulAlchemy);
            deselectDependent(TRANSFORMATION_DATA, selectedTransformation, setSelectedTransformation);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedBitterDissatisfactionSigils(newSelected);
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

    const handleBrewingSelect = createMultiSelectHandler(setSelectedBrewing, availableBrewingPicks);
    
    const handleSoulAlchemySelect = (id: string) => {
        setSelectedSoulAlchemy(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Clean up dependent state
                if (id === 'human_marionettes') {
                    setHumanMarionetteCount(null);
                    setHumanMarionetteCompanionNames([]);
                }
                if (id === 'mages_familiar_i') {
                    setMageFamiliarBeastName(null);
                    setBeastmasterCount(null);
                    setBeastmasterBeastNames([]);
                    newSet.delete('mages_familiar_ii');
                    newSet.delete('mages_familiar_iii');
                    newSet.delete('beastmaster');
                }
                if (id === 'mages_familiar_ii') {
                    newSet.delete('mages_familiar_iii');
                }
                if (id === 'beastmaster') {
                    setBeastmasterCount(null);
                    setBeastmasterBeastNames([]);
                }
                if (id === 'personification') {
                    setPersonificationBuildName(null);
                }
            } else if (newSet.size < availableSoulAlchemyPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleTransformationSelect = (id: string) => {
        setSelectedTransformation(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                if (id === 'shed_humanity_i') {
                    setShedHumanityBeastName(null);
                    newSet.delete('shed_humanity_ii');
                }
                if (id === 'malrayoots') {
                    setMalrayootsMageFormName(null);
                    setMalrayootsUniversalFormName(null);
                }
            } else if (newSet.size < availableTransformationPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleBitterDissatisfactionBoostToggle = (type: 'brewing' | 'soulAlchemy' | 'transformation') => {
        const toggleBoost = (isBoosted: boolean, setIsBoosted: Dispatch<SetStateAction<boolean>>) => {
            if (!isBoosted && availableSigilCounts.kaarn > 0) setIsBoosted(true);
            else setIsBoosted(false);
        }
        if (type === 'brewing') toggleBoost(isBrewingBoosted, setIsBrewingBoosted);
        if (type === 'soulAlchemy') toggleBoost(isSoulAlchemyBoosted, setIsSoulAlchemyBoosted);
        if (type === 'transformation') toggleBoost(isTransformationBoosted, setIsTransformationBoosted);
    };

    // ... (rest of the file: usedSigilCounts, sigilTreeCost, loadState, return statement) ...
    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedBitterDissatisfactionSigils.forEach(id => {
            const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        if(isBrewingBoosted) used.kaarn += 1;
        if(isSoulAlchemyBoosted) used.kaarn += 1;
        if(isTransformationBoosted) used.kaarn += 1;
        return used;
    }, [selectedBitterDissatisfactionSigils, isBrewingBoosted, isSoulAlchemyBoosted, isTransformationBoosted]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedBitterDissatisfactionSigils.forEach(id => {
            const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedBitterDissatisfactionSigils]);

    const handleHumanMarionetteCountChange = (count: number | null) => {
        setHumanMarionetteCount(count);
        if (count === null || count === 0) {
            setHumanMarionetteCompanionNames([]);
        } else {
            setHumanMarionetteCompanionNames(Array(count).fill(null));
        }
    };

    const handleHumanMarionetteCompanionAssign = (index: number, name: string | null) => {
        setHumanMarionetteCompanionNames(prev => {
            const newArray = [...prev];
            if (index < newArray.length) {
                newArray[index] = name;
            }
            return newArray;
        });
    };

    const loadState = useCallback((data: any) => {
        setSelectedBitterDissatisfactionSigils(new Set(data.selectedBitterDissatisfactionSigils || []));
        setSelectedBrewing(new Set(data.selectedBrewing || []));
        setSelectedSoulAlchemy(new Set(data.selectedSoulAlchemy || []));
        setSelectedTransformation(new Set(data.selectedTransformation || []));
        setIsBrewingBoosted(data.isBrewingBoosted || false);
        setIsSoulAlchemyBoosted(data.isSoulAlchemyBoosted || false);
        setIsTransformationBoosted(data.isTransformationBoosted || false);
        setIsMagicianApplied(data.isBitterDissatisfactionMagicianApplied || false);
        setHumanMarionetteCount(data.humanMarionetteCount || null);
        setHumanMarionetteCompanionNames(data.humanMarionetteCompanionNames || []);
        setMageFamiliarBeastName(data.mageFamiliarBeastName || null);
        setBeastmasterCount(data.beastmasterCount || null);
        setBeastmasterBeastNames(data.beastmasterBeastNames || []);
        setPersonificationBuildName(data.personificationBuildName || null);
        setShedHumanityBeastName(data.shedHumanityBeastName || null);
        setMalrayootsMageFormName(data.malrayootsMageFormName || null);
        setMalrayootsUniversalFormName(data.malrayootsUniversalFormName || null);
    }, []);

    return {
        selectedBitterDissatisfactionSigils, handleBitterDissatisfactionSigilSelect,
        selectedBrewing, handleBrewingSelect,
        selectedSoulAlchemy, handleSoulAlchemySelect,
        selectedTransformation, handleTransformationSelect,
        isBrewingBoosted, isSoulAlchemyBoosted, isTransformationBoosted, handleBitterDissatisfactionBoostToggle,
        availableBrewingPicks, availableSoulAlchemyPicks, availableTransformationPicks,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        humanMarionetteCount, handleHumanMarionetteCountChange,
        humanMarionetteCompanionNames, handleHumanMarionetteCompanionAssign,
        totalBeastPoints,
        mageFamiliarBeastName, handleMageFamiliarBeastAssign,
        beastmasterCount, handleBeastmasterCountChange,
        beastmasterBeastNames, handleBeastmasterBeastAssign,
        personificationBuildName, handlePersonificationBuildAssign,
        shedHumanityPoints,
        shedHumanityBeastName, handleShedHumanityBeastAssign,
        malrayootsMageFormName, handleMalrayootsMageFormAssign,
        malrayootsUniversalFormName, handleMalrayootsUniversalFormAssign,
        usedSigilCounts,
        loadState
    };
};
