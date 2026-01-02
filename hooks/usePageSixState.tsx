
import React, { useState, useCallback } from 'react';

export const usePageSixState = () => {
    const [selectedRetirementChoiceId, setSelectedRetirementChoiceId] = useState<string | null>(null);
    const [selectedChildOfGodChoiceId, setSelectedChildOfGodChoiceId] = useState<string | null>(null);
    
    const createSingleSelectHandler = (setState: React.Dispatch<React.SetStateAction<string | null>>) => (id: string) => {
        setState(prevId => prevId === id ? null : id);
    };

    const handleRetirementChoiceSelect = createSingleSelectHandler(setSelectedRetirementChoiceId);
    const handleChildOfGodChoiceSelect = createSingleSelectHandler(setSelectedChildOfGodChoiceId);
    
    // New Load Function
    const loadPageSixState = useCallback((data: any) => {
        if (!data) return;
        setSelectedRetirementChoiceId(data.selectedRetirementChoiceId || null);
        setSelectedChildOfGodChoiceId(data.selectedChildOfGodChoiceId || null);
    }, []);

    return {
        selectedRetirementChoiceId, handleRetirementChoiceSelect,
        selectedChildOfGodChoiceId, handleChildOfGodChoiceSelect,
        loadPageSixState // Export load function
    };
};
