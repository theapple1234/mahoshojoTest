
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { RIGHTEOUS_CREATION_SIGIL_TREE_DATA, RIGHTEOUS_CREATION_MAGITECH_DATA, RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, RIGHTEOUS_CREATION_METAMAGIC_DATA } from '../../constants';

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

export const useRighteousCreationState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedRighteousCreationSigils, setSelectedRighteousCreationSigils] = useState<Set<string>>(new Set());
    const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
    const [selectedMagitechPowers, setSelectedMagitechPowers] = useState<Set<string>>(new Set());
    const [selectedArcaneConstructsPowers, setSelectedArcaneConstructsPowers] = useState<Set<string>>(new Set());
    const [selectedMetamagicPowers, setSelectedMetamagicPowers] = useState<Set<string>>(new Set());
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const [weaponsmithWeaponName, setWeaponsmithWeaponName] = useState<string | null>(null);
    const [roboticistIBeastName, setRoboticistIBeastName] = useState<string | null>(null);
    const [roboticistCompanionName, setRoboticistCompanionName] = useState<string | null>(null);
    const [masterMechanicVehicleName, setMasterMechanicVehicleName] = useState<string | null>(null);

    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);

    const handleWeaponsmithWeaponAssign = (name: string | null) => {
        setWeaponsmithWeaponName(name);
    };

    const handleRoboticistIBeastAssign = (name: string | null) => {
        setRoboticistIBeastName(name);
    };

    const handleRoboticistCompanionAssign = (name: string | null) => {
        setRoboticistCompanionName(name);
    };

    const handleMasterMechanicVehicleAssign = (name: string | null) => {
        setMasterMechanicVehicleName(name);
    };

    useEffect(() => {
        if (!selectedMagitechPowers.has('weaponsmith')) {
            setWeaponsmithWeaponName(null);
        }
    }, [selectedMagitechPowers]);

    useEffect(() => {
        if (!selectedArcaneConstructsPowers.has('roboticist_i')) {
            setRoboticistIBeastName(null);
        }
    }, [selectedArcaneConstructsPowers]);


    useEffect(() => {
        if (!selectedArcaneConstructsPowers.has('roboticist_ii')) {
            setRoboticistCompanionName(null);
        }
    }, [selectedArcaneConstructsPowers]);
    
    useEffect(() => {
        if (!selectedMagitechPowers.has('master_mechanic_i')) {
            setMasterMechanicVehicleName(null);
        }
    }, [selectedMagitechPowers]);

    const { availableSpecialtyPicks, availableMagitechPicks, availableArcaneConstructsPicks, availableMetamagicPicks } = useMemo(() => {
        let specialty = 0, magitech = 0, arcaneConstructs = 0, metamagic = 0;
        selectedRighteousCreationSigils.forEach(sigilId => {
            const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                specialty += sigil.benefits.specialty ?? 0;
                magitech += sigil.benefits.magitech ?? 0;
                arcaneConstructs += sigil.benefits.arcaneConstructs ?? 0;
                metamagic += sigil.benefits.metamagic ?? 0;
            }
        });
        return { availableSpecialtyPicks: specialty, availableMagitechPicks: magitech, availableArcaneConstructsPicks: arcaneConstructs, availableMetamagicPicks: metamagic };
    }, [selectedRighteousCreationSigils]);
    
    // Automatically trim selections if they exceed the available limit
    useEffect(() => {
        if (selectedSpecialties.size > availableSpecialtyPicks) {
            setSelectedSpecialties(prev => new Set(Array.from(prev).slice(0, availableSpecialtyPicks)));
        }
        if (selectedMagitechPowers.size > availableMagitechPicks) {
            const arr = Array.from(selectedMagitechPowers);
            const toKeep = new Set(arr.slice(0, availableMagitechPicks));
            const toRemove = arr.slice(availableMagitechPicks);
            
            if (toRemove.includes('weaponsmith')) setWeaponsmithWeaponName(null);
            if (toRemove.includes('master_mechanic_i')) setMasterMechanicVehicleName(null);
            
            setSelectedMagitechPowers(toKeep);
        }
        if (selectedArcaneConstructsPowers.size > availableArcaneConstructsPicks) {
            const arr = Array.from(selectedArcaneConstructsPowers);
            const toKeep = new Set(arr.slice(0, availableArcaneConstructsPicks));
            const toRemove = arr.slice(availableArcaneConstructsPicks);
            
            if (toRemove.includes('roboticist_i')) setRoboticistIBeastName(null);
            if (toRemove.includes('roboticist_ii')) setRoboticistCompanionName(null);
            
            setSelectedArcaneConstructsPowers(toKeep);
        }
        if (selectedMetamagicPowers.size > availableMetamagicPicks) {
             setSelectedMetamagicPowers(prev => new Set(Array.from(prev).slice(0, availableMetamagicPicks)));
        }
    }, [availableSpecialtyPicks, availableMagitechPicks, availableArcaneConstructsPicks, availableMetamagicPicks, selectedSpecialties.size, selectedMagitechPowers.size, selectedArcaneConstructsPowers.size, selectedMetamagicPowers.size]);

    const handleRighteousCreationSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedRighteousCreationSigils);
        const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                RIGHTEOUS_CREATION_SIGIL_TREE_DATA.forEach(child => {
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

            deselectDependent(RIGHTEOUS_CREATION_MAGITECH_DATA, selectedMagitechPowers, setSelectedMagitechPowers);
            deselectDependent(RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, selectedArcaneConstructsPowers, setSelectedArcaneConstructsPowers);
            deselectDependent(RIGHTEOUS_CREATION_METAMAGIC_DATA, selectedMetamagicPowers, setSelectedMetamagicPowers);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedRighteousCreationSigils(newSelected);
    };

    const handleSpecialtySelect = (id: string) => {
        setSelectedSpecialties(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Clear entire category if specialty is removed
                if (id === 'magitech_specialty') {
                    setSelectedMagitechPowers(new Set());
                    setWeaponsmithWeaponName(null);
                    setMasterMechanicVehicleName(null);
                }
                if (id === 'arcane_constructs_specialty') {
                    setSelectedArcaneConstructsPowers(new Set());
                    setRoboticistIBeastName(null);
                    setRoboticistCompanionName(null);
                }
                if (id === 'metamagic_specialty') {
                    setSelectedMetamagicPowers(new Set());
                }
            } else if (newSet.size < availableSpecialtyPicks) {
                newSet.add(id);
            }
            return newSet;
        });
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

    const handleMagitechPowerSelect = (id: string) => {
        setSelectedMagitechPowers(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Cascade: Master Mechanic I -> II
                if (id === 'master_mechanic_i') newSet.delete('master_mechanic_ii');
                if (id === 'domain_master_i') newSet.delete('domain_master_ii'); // Wait, domain master is in Closed Circuits, but keeping logic consistent
            } else if (newSet.size < availableMagitechPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleArcaneConstructsPowerSelect = (id: string) => {
        setSelectedArcaneConstructsPowers(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Cascade: Roboticist I -> II
                if (id === 'roboticist_i') newSet.delete('roboticist_ii');
            } else if (newSet.size < availableArcaneConstructsPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleMetamagicPowerSelect = createMultiSelectHandler(setSelectedMetamagicPowers, availableMetamagicPicks);

    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedRighteousCreationSigils.forEach(id => {
            const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        return used;
    }, [selectedRighteousCreationSigils]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedRighteousCreationSigils.forEach(id => {
            const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedRighteousCreationSigils]);

    // Load function
    const loadState = useCallback((data: any) => {
        setSelectedRighteousCreationSigils(new Set(data.selectedRighteousCreationSigils || []));
        setSelectedSpecialties(new Set(data.selectedSpecialties || []));
        setSelectedMagitechPowers(new Set(data.selectedMagitechPowers || []));
        setSelectedArcaneConstructsPowers(new Set(data.selectedArcaneConstructsPowers || []));
        setSelectedMetamagicPowers(new Set(data.selectedMetamagicPowers || []));
        setIsMagicianApplied(data.isRighteousCreationMagicianApplied || false);
        setWeaponsmithWeaponName(data.weaponsmithWeaponName || null);
        setRoboticistIBeastName(data.roboticistIBeastName || null);
        setRoboticistCompanionName(data.roboticistCompanionName || null);
        setMasterMechanicVehicleName(data.masterMechanicVehicleName || null);
    }, []);

    return {
        selectedRighteousCreationSigils, handleRighteousCreationSigilSelect,
        selectedSpecialties, handleSpecialtySelect,
        selectedMagitechPowers, handleMagitechPowerSelect,
        selectedArcaneConstructsPowers, handleArcaneConstructsPowerSelect,
        selectedMetamagicPowers, handleMetamagicPowerSelect,
        availableSpecialtyPicks, availableMagitechPicks, availableArcaneConstructsPicks, availableMetamagicPicks,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        roboticistIBeastName, handleRoboticistIBeastAssign,
        roboticistCompanionName, handleRoboticistCompanionAssign,
        masterMechanicVehicleName, handleMasterMechanicVehicleAssign,
        weaponsmithWeaponName,
        handleWeaponsmithWeaponAssign,
        usedSigilCounts,
        loadState
    };
};
