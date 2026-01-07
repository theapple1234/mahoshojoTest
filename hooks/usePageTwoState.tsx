
import React, { useState, useEffect, useCallback } from 'react';
import type { CustomClassmateInstance, Mentor } from '../types';

// This hook encapsulates state and logic for Page Two of the character creation.
export const usePageTwoState = ({ isMultiplayer }: { isMultiplayer: boolean }) => {
    const [selectedHeadmasterId, setSelectedHeadmasterId] = useState<string | null>(null);
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<Set<string>>(new Set());
    const [selectedDurationId, setSelectedDurationId] = useState<string | null>(null);
    const [selectedClubIds, setSelectedClubIds] = useState<Set<string>>(new Set());
    const [selectedMiscActivityIds, setSelectedMiscActivityIds] = useState<Set<string>>(new Set());
    const [selectedClassmateIds, setSelectedClassmateIds] = useState<Set<string>>(new Set());
    const [classmateUniforms, setClassmateUniforms] = useState<Map<string, string>>(new Map());
    const [isBoardingSchool, setIsBoardingSchool] = useState(false);
    const [customClassmates, setCustomClassmates] = useState<CustomClassmateInstance[]>([]);
    const [assigningClassmate, setAssigningClassmate] = useState<CustomClassmateInstance | null>(null);
    
    // Mentor State
    const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([]);

    // Intro State for Page 2
    const [isPageTwoIntroDone, setIsPageTwoIntroDone] = useState(false);

    // Lock choices in multiplayer
    useEffect(() => {
        if (isMultiplayer) {
            setSelectedHeadmasterId('competent');
            setSelectedClassmateIds(new Set());
        }
    }, [isMultiplayer]);

    const createMultiSelectHandler = (setState: React.Dispatch<React.SetStateAction<Set<string>>>, max: number = Infinity) => useCallback((id: string) => {
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
    }, [max, setState]);
    
    const createSingleSelectHandler = (setState: React.Dispatch<React.SetStateAction<string | null>>) => useCallback((id: string) => {
        setState(prevId => prevId === id ? null : id);
    }, [setState]);

    const handleClubSelect = createMultiSelectHandler(setSelectedClubIds);
    
    // Custom handler for misc activities to handle Teacher's Assistant -> Adjunct Professor cascade
    const handleMiscActivitySelect = useCallback((id: string) => {
        setSelectedMiscActivityIds(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                // Deselecting
                newSet.delete(id);
                
                // Cascade: Deselecting Teachers Assistant removes Adjunct Professor
                if (id === 'teachers_assistant') {
                    newSet.delete('adjunct_professor');
                }
            } else {
                // Selecting
                newSet.add(id);
            }
            return newSet;
        });
    }, []);
    
    const handleClassmateSelect = useCallback((id: string) => {
        setSelectedClassmateIds(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);
    
    const handleTeacherSelect = createMultiSelectHandler(setSelectedTeacherIds, 5);

    const handleHeadmasterSelect = createSingleSelectHandler(setSelectedHeadmasterId);
    
    // Custom duration handler to enforce requirement checks
    const handleDurationSelect = useCallback((id: string) => {
        setSelectedDurationId(prevId => {
            const nextId = prevId === id ? null : id;
            
            // Check validation for dependent activities
            setSelectedMiscActivityIds(prevMisc => {
                const newMisc = new Set(prevMisc);
                // TA requires 10, 15, or 20 years
                const validTA = ['10_years', '15_years', '20_years'].includes(nextId || '');
                // AP requires 15 or 20 years
                const validAP = ['15_years', '20_years'].includes(nextId || '');

                if (!validTA && newMisc.has('teachers_assistant')) {
                    newMisc.delete('teachers_assistant');
                }
                
                // If AP duration invalid OR TA missing (potentially just deleted), remove AP
                if ((!validAP || !newMisc.has('teachers_assistant')) && newMisc.has('adjunct_professor')) {
                    newMisc.delete('adjunct_professor');
                }
                
                return newMisc;
            });
            
            return nextId;
        });
    }, []);

    const handleClassmateUniformSelect = useCallback((classmateId: string, uniformId: string) => {
        setClassmateUniforms(prev => new Map(prev).set(classmateId, uniformId));
    }, []);

    const handleBoardingSchoolSelect = useCallback(() => {
        setIsBoardingSchool(prev => !prev);
    }, []);

    const handleAddCustomClassmate = useCallback((optionId: string) => {
        setCustomClassmates(prev => [...prev, { id: Date.now() + Math.random(), optionId, companionName: null }]);
    }, []);
    
    const handleRemoveCustomClassmate = useCallback((id: number) => {
        setCustomClassmates(prev => prev.filter(c => c.id !== id));
    }, []);

    const handleOpenAssignModal = useCallback((classmateInstance: CustomClassmateInstance) => {
        setAssigningClassmate(classmateInstance);
    }, []);

    const handleCloseAssignModal = useCallback(() => {
        setAssigningClassmate(null);
    }, []);

    const handleAssignCustomClassmateName = useCallback((id: number, name: string | null) => {
        setCustomClassmates(prev => prev.map(c => (c.id === id ? { ...c, companionName: name } : c)));
    }, []);

    const handleMentorSelect = useCallback((mentor: Mentor) => {
        setSelectedMentors(prev => {
            if (prev.length >= 3) return prev;
            return [...prev, mentor];
        });
    }, []);

    const handleMentorRemove = useCallback((mentorId: string) => {
        setSelectedMentors(prev => prev.filter(m => m.id !== mentorId));
    }, []);

    // New Load Function
    const loadPageTwoState = useCallback((data: any) => {
        if (!data) return;
        setSelectedHeadmasterId(data.selectedHeadmasterId || null);
        setSelectedTeacherIds(new Set(Array.isArray(data.selectedTeacherIds) ? data.selectedTeacherIds : []));
        setSelectedDurationId(data.selectedDurationId || null);
        setSelectedClubIds(new Set(Array.isArray(data.selectedClubIds) ? data.selectedClubIds : []));
        setSelectedMiscActivityIds(new Set(Array.isArray(data.selectedMiscActivityIds) ? data.selectedMiscActivityIds : []));
        setSelectedClassmateIds(new Set(Array.isArray(data.selectedClassmateIds) ? data.selectedClassmateIds : []));
        setClassmateUniforms(new Map(Array.isArray(data.classmateUniforms) ? data.classmateUniforms : []));
        setIsBoardingSchool(data.isBoardingSchool || false);
        setCustomClassmates(Array.isArray(data.customClassmates) ? data.customClassmates : []);
        setSelectedMentors(Array.isArray(data.selectedMentors) ? data.selectedMentors : []);
        if (data.isPageTwoIntroDone !== undefined) {
             setIsPageTwoIntroDone(data.isPageTwoIntroDone);
        }
    }, []);

    return {
        selectedHeadmasterId, handleHeadmasterSelect,
        selectedTeacherIds, handleTeacherSelect,
        selectedDurationId, handleDurationSelect,
        selectedClubIds, handleClubSelect,
        selectedMiscActivityIds, handleMiscActivitySelect,
        selectedClassmateIds, handleClassmateSelect,
        classmateUniforms, handleClassmateUniformSelect,
        isBoardingSchool, handleBoardingSchoolSelect,
        customClassmates,
        handleAddCustomClassmate,
        handleRemoveCustomClassmate,
        assigningClassmate,
        handleOpenAssignModal,
        handleCloseAssignModal,
        handleAssignCustomClassmateName,
        selectedMentors, handleMentorSelect, handleMentorRemove,
        isPageTwoIntroDone, setIsPageTwoIntroDone,
        loadPageTwoState // Export load function
    };
};
