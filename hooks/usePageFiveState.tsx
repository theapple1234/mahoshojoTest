
import React, { useState, useEffect, useCallback } from 'react';
import type { CustomColleagueInstance, Mentor, Mentee, MovingOutHome } from '../types';

export const usePageFiveState = ({ 
    isMultiplayer, 
    mentors, 
    selectedClubIds, 
    selectedMiscActivityIds 
}: { 
    isMultiplayer: boolean; 
    mentors: Mentor[]; 
    selectedClubIds: Set<string>; 
    selectedMiscActivityIds: Set<string>; 
}) => {
    const [selectedAllmillorIds, setSelectedAllmillorIds] = useState<Set<string>>(new Set());
    const [selectedCareerGoalIds, setSelectedCareerGoalIds] = useState<Set<string>>(new Set());
    const [selectedColleagueIds, setSelectedColleagueIds] = useState<Set<string>>(new Set());
    const [joysOfParentingCompanionName, setJoysOfParentingCompanionName] = useState<string | null>(null);
    const [colleagueUniforms, setColleagueUniforms] = useState<Map<string, string>>(new Map());

    const [customColleagues, setCustomColleagues] = useState<CustomColleagueInstance[]>([]);
    const [assigningColleague, setAssigningColleague] = useState<CustomColleagueInstance | null>(null);
    
    // Mentor Career State (The student you mentor)
    const [mentee, setMentee] = useState<Mentee | null>(null);
    
    // New state for Moving Out homes
    const [movingOutHomes, setMovingOutHomes] = useState<MovingOutHome[]>([]);

    useEffect(() => {
        if (isMultiplayer) {
            setSelectedColleagueIds(new Set());
            setColleagueUniforms(new Map());
        }
    }, [isMultiplayer]);

    // Force selection of Premade Mentors
    useEffect(() => {
        if (mentors.length > 0) {
            setSelectedColleagueIds(prev => {
                const newSet = new Set(prev);
                let changed = false;
                mentors.forEach(m => {
                    if (m.type === 'premade') {
                        if (!newSet.has(m.id)) {
                            newSet.add(m.id);
                            changed = true;
                        }
                    }
                });
                return changed ? newSet : prev;
            });
        }
    }, [mentors]);

    // Cleanup auxiliary data when goals are deselected
    useEffect(() => {
        if (!selectedCareerGoalIds.has('joys_of_parenting')) {
            setJoysOfParentingCompanionName(null);
        }
        if (!selectedCareerGoalIds.has('mentor_career')) {
            setMentee(null);
        }
        if (!selectedCareerGoalIds.has('moving_out')) {
            setMovingOutHomes([]);
        }
    }, [selectedCareerGoalIds]);

    // Cascade deselect based on External Prerequisites from Page 2
    useEffect(() => {
        setSelectedCareerGoalIds(prev => {
            const next = new Set(prev);
            let changed = false;
            
            // Check Requirements
            if (next.has('pro_gladiator') && !selectedClubIds.has('combat')) {
                next.delete('pro_gladiator');
                changed = true;
            }
            if (next.has('pro_racer') && !selectedClubIds.has('racer')) {
                next.delete('pro_racer');
                changed = true;
            }
            if (next.has('pro_player') && !selectedClubIds.has('mazball')) {
                next.delete('pro_player');
                changed = true;
            }
            if (next.has('become_professor') && !selectedMiscActivityIds.has('adjunct_professor')) {
                next.delete('become_professor');
                changed = true;
            }

            return changed ? next : prev;
        });
    }, [selectedClubIds, selectedMiscActivityIds]);

    const createMultiSelectHandler = (setState: React.Dispatch<React.SetStateAction<Set<string>>>, max: number = Infinity) => (id: string) => {
        setState(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                if (newSet.size < max) {
                    newSet.add(id);
                }
            }
            return newSet;
        });
    };

    const handleAllmillorSelect = createMultiSelectHandler(setSelectedAllmillorIds, 3);
    
    // Custom handler for Career Goal to handle internal dependencies (IDPA -> Shadow Convict)
    const handleCareerGoalSelect = useCallback((id: string) => {
        setSelectedCareerGoalIds(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                // Deselecting
                newSet.delete(id);
                
                // Internal Cascade
                if (id === 'join_idpa') {
                    newSet.delete('hunt_shadow_convict');
                }
            } else {
                // Selecting
                newSet.add(id);
            }
            return newSet;
        });
    }, []);
    
    const handleColleagueSelect = (id: string) => {
        // Prevent deselecting if it's a mentor
        const isMentor = mentors.some(m => m.id === id && m.type === 'premade');
        if (isMentor) return;

        setSelectedColleagueIds(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleJoysOfParentingCompanionAssign = (name: string | null) => {
        setJoysOfParentingCompanionName(name);
    };

    const handleColleagueUniformSelect = (colleagueId: string, uniformId: string) => {
        setColleagueUniforms(prev => new Map(prev).set(colleagueId, uniformId));
    };

    const handleAddCustomColleague = (optionId: string) => {
        setCustomColleagues(prev => [...prev, { id: Date.now() + Math.random(), optionId, companionName: null }]);
    };
    
    const handleRemoveCustomColleague = (id: number) => {
        // Prevent removing if it's a selected mentor (Custom)
        // Note: Mentors store the custom colleague ID as a string in 'id'
        const isMentor = mentors.some(m => m.id === id.toString() && m.type === 'custom');
        if (isMentor) return;

        setCustomColleagues(prev => prev.filter(c => c.id !== id));
    };

    const handleOpenAssignColleagueModal = (colleagueInstance: CustomColleagueInstance) => {
        setAssigningColleague(colleagueInstance);
    };

    const handleCloseAssignColleagueModal = () => {
        setAssigningColleague(null);
    };

    const handleAssignCustomColleagueName = (id: number, name: string | null) => {
        setCustomColleagues(prev => prev.map(c => (c.id === id ? { ...c, companionName: name } : c)));
    };
    
    const handleMenteeSelect = (newMentee: Mentee | null) => {
        setMentee(newMentee);
    };
    
    // Moving Out Handlers
    const addMovingOutHome = () => {
        setMovingOutHomes(prev => [...prev, {
            id: Date.now().toString() + Math.random().toString(),
            dominionId: null,
            houseId: null,
            upgradeIds: new Set(),
            isInherited: false,
            inheritedFromId: null,
            vrChamberCostType: null
        }]);
    };

    const removeMovingOutHome = (id: string) => {
        setMovingOutHomes(prev => prev.filter(h => h.id !== id));
    };

    const updateMovingOutHome = (id: string, updates: Partial<MovingOutHome>) => {
        setMovingOutHomes(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    };

    // New Load Function
    const loadPageFiveState = useCallback((data: any) => {
        if (!data) return;
        setSelectedAllmillorIds(new Set(Array.isArray(data.selectedAllmillorIds) ? data.selectedAllmillorIds : []));
        setSelectedCareerGoalIds(new Set(Array.isArray(data.selectedCareerGoalIds) ? data.selectedCareerGoalIds : []));
        setSelectedColleagueIds(new Set(Array.isArray(data.selectedColleagueIds) ? data.selectedColleagueIds : []));
        setJoysOfParentingCompanionName(data.joysOfParentingCompanionName || null);
        setColleagueUniforms(new Map(Array.isArray(data.colleagueUniforms) ? data.colleagueUniforms : []));
        setCustomColleagues(Array.isArray(data.customColleagues) ? data.customColleagues : []);
        setMentee(data.mentee || null);
        
        // Handle Moving Out Homes Set reconstruction
        if (Array.isArray(data.movingOutHomes)) {
            const restoredHomes = data.movingOutHomes.map((h: any) => ({
                ...h,
                upgradeIds: new Set(Array.isArray(h.upgradeIds) ? h.upgradeIds : [])
            }));
            setMovingOutHomes(restoredHomes);
        } else {
            setMovingOutHomes([]);
        }
    }, []);

    return {
        selectedAllmillorIds, handleAllmillorSelect,
        selectedCareerGoalIds, handleCareerGoalSelect,
        selectedColleagueIds, handleColleagueSelect,
        joysOfParentingCompanionName, handleJoysOfParentingCompanionAssign,
        colleagueUniforms, handleColleagueUniformSelect,
        customColleagues,
        handleAddCustomColleague,
        handleRemoveCustomColleague,
        assigningColleague,
        handleOpenAssignColleagueModal,
        handleCloseAssignColleagueModal,
        handleAssignCustomColleagueName,
        mentee, handleMenteeSelect,
        movingOutHomes,
        addMovingOutHome,
        removeMovingOutHome,
        updateMovingOutHome,
        loadPageFiveState // Export load function
    };
};
