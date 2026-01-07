
import React, { useState, useCallback } from 'react';
import type { VacationHome } from '../types';

// This hook encapsulates state and logic for Page One of the character creation.
export const usePageOneState = () => {
    const [numParents, setNumParents] = useState(2);
    const [numSiblings, setNumSiblings] = useState(0);
    const [assignedTraits, setAssignedTraits] = useState<Map<string, Set<string>>>(new Map());
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string | null>(null);
    const [familyMemberNotes, setFamilyMemberNotes] = useState<Map<string, string>>(new Map());
    const [familyMemberImages, setFamilyMemberImages] = useState<Map<string, string>>(new Map());
    
    const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
    const [selectedUpgrades, setSelectedUpgrades] = useState<Set<string>>(new Set());
    
    // House specifics
    const [mansionExtraSqFt, setMansionExtraSqFt] = useState(0);
    const [islandExtraMiles, setIslandExtraMiles] = useState(0);
    const [vrChamberCostType, setVrChamberCostType] = useState<'fp' | 'bp' | null>(null);
    const [mythicalPetBeastName, setMythicalPetBeastName] = useState<string | null>(null);

    const [vacationHomes, setVacationHomes] = useState<VacationHome[]>([]);

    const [selectedTrueSelfTraits, setSelectedTrueSelfTraits] = useState<Set<string>>(new Set());
    const [selectedAlterEgoTraits, setSelectedAlterEgoTraits] = useState<Set<string>>(new Set());
    const [selectedUniforms, setSelectedUniforms] = useState<string[]>([]);
    const [selectedMagicalStyles, setSelectedMagicalStyles] = useState<Set<string>>(new Set());
    const [selectedBuildTypeId, setSelectedBuildTypeId] = useState<string | null>(null);

    // Assignments
    const [assignedVehicleName, setAssignedVehicleName] = useState<string | null>(null);
    const [blessedCompanions, setBlessedCompanions] = useState<Map<string, string>>(new Map());
    const [inhumanAppearanceBeastName, setInhumanAppearanceBeastName] = useState<string | null>(null);
    
    // Intro State
    const [isIntroDone, setIsIntroDone] = useState(false);

    const isMultiplayer = selectedBuildTypeId === 'multiplayer';

    // Handlers
    const handleNumParentsChange = useCallback((num: number) => setNumParents(num), []);
    const handleNumSiblingsChange = useCallback((num: number) => setNumSiblings(num), []);
    
    const handleSelectFamilyMember = useCallback((id: string) => {
        setSelectedFamilyMemberId(prev => prev === id ? null : id);
    }, []);

    const handleFamilyMemberNoteChange = useCallback((id: string, note: string) => {
        setFamilyMemberNotes(prev => new Map(prev).set(id, note));
    }, []);

    const handleSetFamilyMemberImage = useCallback((id: string, imageUrl: string) => {
        setFamilyMemberImages(prev => new Map(prev).set(id, imageUrl));
    }, []);

    const handleTraitSelect = useCallback((traitId: string) => {
        if (!selectedFamilyMemberId) return;
        setAssignedTraits((prev: Map<string, Set<string>>) => {
            const newMap = new Map(prev);
            const traits = newMap.get(selectedFamilyMemberId);
            const currentTraits = new Set<string>(traits || []);
            if (currentTraits.has(traitId)) {
                currentTraits.delete(traitId);
                // Clear assignment if trait removed (e.g. blessed)
                if (traitId === 'blessed') {
                    setBlessedCompanions(prevC => {
                        const newC = new Map(prevC);
                        newC.delete(selectedFamilyMemberId);
                        return newC;
                    });
                }
            } else {
                currentTraits.add(traitId);
            }
            newMap.set(selectedFamilyMemberId, currentTraits);
            return newMap;
        });
    }, [selectedFamilyMemberId]);

    const handleHouseSelect = useCallback((id: string) => {
        setSelectedHouseId(prev => prev === id ? null : id);
    }, []);

    const handleUpgradeSelect = useCallback((id: string) => {
        setSelectedUpgrades(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                if (id === 'virtual_reality') setVrChamberCostType(null);
                if (id === 'private_island') setIslandExtraMiles(0);
                if (id === 'mythical_pet') setMythicalPetBeastName(null);
            } else {
                // Enforce mutual exclusivity for negative upgrades
                const negativeUpgrades = ['creepy_crawlies', 'terrible_neighbors', 'haunted'];
                if (negativeUpgrades.includes(id)) {
                    negativeUpgrades.forEach(negId => newSet.delete(negId));
                }

                newSet.add(id);
                if (id === 'virtual_reality') setVrChamberCostType('fp'); // Default
            }
            return newSet;
        });
    }, []);

    const handleTrueSelfTraitSelect = useCallback((id: string) => {
        setSelectedTrueSelfTraits(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    const handleAlterEgoTraitSelect = useCallback((id: string) => {
        setSelectedAlterEgoTraits(prev => {
            const newSet = new Set(prev);
            
            if (newSet.has(id)) {
                // Deselecting
                newSet.delete(id);

                // Cascade logic: Unique -> Exotic -> Inhuman
                if (id === 'unique_appearance') {
                    newSet.delete('exotic_appearance');
                    newSet.delete('inhuman_appearance');
                } else if (id === 'exotic_appearance') {
                    newSet.delete('inhuman_appearance');
                }

                // Cleanup assignments if specific traits are removed
                if (!newSet.has('inhuman_appearance') && prev.has('inhuman_appearance')) {
                    setInhumanAppearanceBeastName(null);
                }
                
                if (id === 'signature_vehicle') {
                    setAssignedVehicleName(null);
                }
            } else {
                // Selecting
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const handleUniformSelect = useCallback((id: string) => {
        setSelectedUniforms(prev => {
            if (prev.includes(id)) return prev.filter(u => u !== id);
            return [...prev, id];
        });
    }, []);

    const handleMagicalStyleSelect = useCallback((id: string) => {
        setSelectedMagicalStyles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    const handleBuildTypeSelect = useCallback((id: string) => {
        setSelectedBuildTypeId(prev => prev === id ? null : id);
    }, []);

    // Extra Config Handlers
    const handleMansionSqFtChange = useCallback((val: number) => setMansionExtraSqFt(val), []);
    const handleIslandMilesChange = useCallback((val: number) => setIslandExtraMiles(val), []);
    const handleVrChamberCostSelect = useCallback((type: 'fp' | 'bp') => setVrChamberCostType(type), []);
    
    const handleAssignVehicle = useCallback((name: string | null) => setAssignedVehicleName(name), []);
    const handleAssignBlessedCompanion = useCallback((memberId: string, name: string | null) => {
        setBlessedCompanions(prev => new Map(prev).set(memberId, name || ''));
    }, []);
    const handleAssignMythicalPet = useCallback((name: string | null) => setMythicalPetBeastName(name), []);
    const handleAssignInhumanAppearance = useCallback((name: string | null) => setInhumanAppearanceBeastName(name), []);

    // Vacation Homes
    const addVacationHome = useCallback(() => {
        setVacationHomes(prev => [...prev, {
            id: Date.now().toString() + Math.random().toString(),
            dominionId: null,
            houseId: null,
            upgradeIds: new Set(),
            mansionExtraSqFt: 0,
            islandExtraMiles: 0,
            vrChamberCostType: null,
            mythicalPetName: null
        }]);
    }, []);

    const removeVacationHome = useCallback((id: string) => {
        setVacationHomes(prev => prev.filter(h => h.id !== id));
    }, []);

    const updateVacationHome = useCallback((id: string, updates: Partial<VacationHome>) => {
        setVacationHomes(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    }, []);

    const loadPageOneState = useCallback((data: any) => {
        if (!data) return;
        setNumParents(data.numParents ?? 2);
        setNumSiblings(data.numSiblings ?? 0);
        
        // Handle Map/Set reconstruction
        if (data.assignedTraits) {
            const traitsMap = new Map<string, Set<string>>();
            if (Array.isArray(data.assignedTraits)) {
                data.assignedTraits.forEach(([key, val]: [string, string[]]) => {
                    traitsMap.set(key, new Set(Array.isArray(val) ? val : []));
                });
            }
            setAssignedTraits(traitsMap);
        }
        
        setSelectedFamilyMemberId(data.selectedFamilyMemberId || null);
        setFamilyMemberNotes(new Map(Array.isArray(data.familyMemberNotes) ? data.familyMemberNotes : []));
        setFamilyMemberImages(new Map(Array.isArray(data.familyMemberImages) ? data.familyMemberImages : []));
        setSelectedHouseId(data.selectedHouseId || null);
        setSelectedUpgrades(new Set(Array.isArray(data.selectedUpgrades) ? data.selectedUpgrades : []));
        setSelectedTrueSelfTraits(new Set(Array.isArray(data.selectedTrueSelfTraits) ? data.selectedTrueSelfTraits : []));
        setSelectedAlterEgoTraits(new Set(Array.isArray(data.selectedAlterEgoTraits) ? data.selectedAlterEgoTraits : []));
        setSelectedUniforms(Array.isArray(data.selectedUniforms) ? data.selectedUniforms : []);
        setSelectedMagicalStyles(new Set(Array.isArray(data.selectedMagicalStyles) ? data.selectedMagicalStyles : []));
        setSelectedBuildTypeId(data.selectedBuildTypeId || null);
        
        if (data.vacationHomes && Array.isArray(data.vacationHomes)) {
            const restoredHomes = data.vacationHomes.map((h: any) => ({
                ...h,
                upgradeIds: new Set(Array.isArray(h.upgradeIds) ? h.upgradeIds : [])
            }));
            setVacationHomes(restoredHomes);
        } else {
            setVacationHomes([]);
        }

        setMansionExtraSqFt(data.mansionExtraSqFt || 0);
        setIslandExtraMiles(data.islandExtraMiles || 0);
        setVrChamberCostType(data.vrChamberCostType || null);
        setAssignedVehicleName(data.assignedVehicleName || null);
        setBlessedCompanions(new Map(Array.isArray(data.blessedCompanions) ? data.blessedCompanions : []));
        setMythicalPetBeastName(data.mythicalPetBeastName || null);
        setInhumanAppearanceBeastName(data.inhumanAppearanceBeastName || null);
        
        // Restore intro state
        if (data.isIntroDone !== undefined) {
             setIsIntroDone(data.isIntroDone);
        }
    }, []);

    return {
        numParents, handleNumParentsChange,
        numSiblings, handleNumSiblingsChange,
        assignedTraits, handleTraitSelect,
        selectedFamilyMemberId, handleSelectFamilyMember,
        familyMemberNotes, handleFamilyMemberNoteChange,
        familyMemberImages, handleSetFamilyMemberImage,
        selectedHouseId, handleHouseSelect,
        selectedUpgrades, handleUpgradeSelect,
        mansionExtraSqFt, handleMansionSqFtChange,
        islandExtraMiles, handleIslandMilesChange,
        vrChamberCostType, handleVrChamberCostSelect,
        mythicalPetBeastName, handleAssignMythicalPet,
        vacationHomes, addVacationHome, removeVacationHome, updateVacationHome,
        
        selectedTrueSelfTraits, handleTrueSelfTraitSelect,
        selectedAlterEgoTraits, handleAlterEgoTraitSelect,
        inhumanAppearanceBeastName, handleAssignInhumanAppearance,
        assignedVehicleName, handleAssignVehicle,
        
        selectedUniforms, handleUniformSelect,
        selectedMagicalStyles, handleMagicalStyleSelect,
        selectedBuildTypeId, handleBuildTypeSelect,
        isMultiplayer,
        blessedCompanions, handleAssignBlessedCompanion,
        
        isIntroDone, setIsIntroDone, // Exposed
        
        loadPageOneState
    };
};
