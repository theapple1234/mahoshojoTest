
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useRef } from 'react';
import { DOMINIONS } from '../constants';
import { usePageOneState } from '../hooks/usePageOneState';
import { usePageTwoState } from '../hooks/usePageTwoState';
import { usePageThreeState } from '../hooks/usePageThreeState';
import { usePageFourState } from '../hooks/usePageFourState';
import { usePageFiveState } from '../hooks/usePageFiveState';
import { usePageSixState } from '../hooks/usePageSixState';
import { useSigilCalculation } from './useSigilCalculation';
import { useCostCalculation } from './useCostCalculation';
import { usePersistence } from './usePersistence';
import type { ICharacterContext, GlobalNotification } from './CharacterContextTypes';

const CharacterContext = createContext<ICharacterContext | undefined>(undefined);

export const useCharacterContext = () => {
    const context = useContext(CharacterContext);
    if (context === undefined) {
        throw new Error('useCharacterContext must be used within a CharacterProvider');
    }
    return context;
};

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedDominionId, setSelectedDominionId] = useState<string | null>(DOMINIONS[0].id);
    const [kpPaidNodes, setKpPaidNodes] = useState<Map<string, string>>(new Map()); 
    
    // Secret Page State
    const [selectedLostBlessingNodes, setSelectedLostBlessingNodes] = useState<Set<string>>(new Set());
    const [selectedLostPowers, setSelectedLostPowers] = useState<Set<string>>(new Set());
    // Backup states for when the condition is unmet
    const [backupLostBlessingNodes, setBackupLostBlessingNodes] = useState<Set<string>>(new Set());
    const [backupLostPowers, setBackupLostPowers] = useState<Set<string>>(new Set());
    
    const [hasSeenSecretTransition, setHasSeenSecretTransition] = useState(false);
    const [isSecretTransitionActive, setSecretTransitionActive] = useState(false);
    const [isSecretMusicMode, setIsSecretMusicMode] = useState(false);

    const [isReferencePageOpen, setIsReferencePageOpen] = useState(false);
    const [isBuildSummaryOpen, setIsBuildSummaryOpen] = useState(false); 
    const [miscFpCosts, setMiscFpCosts] = useState(0);
    const [buildsRefreshTrigger, setBuildsRefreshTrigger] = useState(0);
    
    // Global Notification
    const [globalNotification, setGlobalNotification] = useState<GlobalNotification | null>(null);

    // Settings State
    const [isPhotosensitivityDisabled, setPhotosensitivityDisabled] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'ko'>('en');
    const [fontSize, setFontSize] = useState<'regular' | 'large'>('regular');
    const [volume, setVolume] = useState(50);
    const [bgmVideoId, setBgmVideoId] = useState('GzIXfP0rkMk');

    // Debug State
    const [isDebugOpen, setIsDebugOpen] = useState(false);
    const [debugLog, setDebugLog] = useState<string[]>([]);
    const [debugFileContent, setDebugFileContent] = useState('');

    const toggleDebug = useCallback(() => setIsDebugOpen(prev => !prev), []);
    const addDebugLog = useCallback((msg: string) => {
        setDebugLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    }, []);

    // Monitor State Changes
    useEffect(() => {
        if (selectedDominionId) {
            addDebugLog(`[StateUpdate] selectedDominionId changed to: ${selectedDominionId}`);
        }
    }, [selectedDominionId, addDebugLog]);

    // Initialization Effect: Clear Reference Builds
    useEffect(() => {
        // As per requirement, Reference Page builds (Companions, Weapons, etc.) should reset on app initialization/reload.
        // They should only be populated when a user loads a save file.
        const STORAGE_KEY = 'seinaru_magecraft_builds';
        localStorage.removeItem(STORAGE_KEY);
        setBuildsRefreshTrigger(prev => prev + 1); // Ensure listeners update to empty state
        addDebugLog("[Init] Reference builds storage cleared for new session.");
    }, [addDebugLog]);

    // Page State Hooks
    const pageOneState = usePageOneState();
    const pageTwoState = usePageTwoState({ isMultiplayer: pageOneState.isMultiplayer });
    const pageThreeState = usePageThreeState();
    const pageFourState = usePageFourState();
    const pageFiveState = usePageFiveState({ 
        isMultiplayer: pageOneState.isMultiplayer,
        mentors: pageTwoState.selectedMentors,
        selectedClubIds: pageTwoState.selectedClubIds,
        selectedMiscActivityIds: pageTwoState.selectedMiscActivityIds
    });
    const pageSixState = usePageSixState();
    
    // --- SIDE EFFECTS ---
    useEffect(() => {
        const root = document.documentElement;
        if (fontSize === 'large') {
            root.style.fontSize = '100%'; 
        } else {
            root.style.fontSize = '85%';
        }
    }, [fontSize]);

    useEffect(() => {
        if (pageThreeState.selectedStarCrossedLovePacts.has('evoghos_vow')) {
            if (pageTwoState.selectedClassmateIds.size > 0) pageTwoState.selectedClassmateIds.forEach(id => pageTwoState.handleClassmateSelect(id));
            if (pageTwoState.customClassmates.length > 0) pageTwoState.customClassmates.forEach(c => pageTwoState.handleRemoveCustomClassmate(c.id));
            if (pageFiveState.selectedColleagueIds.size > 0) pageFiveState.selectedColleagueIds.forEach(id => pageFiveState.handleColleagueSelect(id));
            if (pageFiveState.customColleagues.length > 0) pageFiveState.customColleagues.forEach(c => pageFiveState.handleRemoveCustomColleague(c.id));
            if (pageFiveState.joysOfParentingCompanionName) pageFiveState.handleJoysOfParentingCompanionAssign(null);
        }
    }, [pageThreeState.selectedStarCrossedLovePacts]);

    useEffect(() => {
        if (!pageThreeState.selectedStarCrossedLovePacts.has('kuri_odans_charm')) {
            setKpPaidNodes(new Map());
        }
    }, [pageThreeState.selectedStarCrossedLovePacts]);

    useEffect(() => {
        const activeSigilIds = new Set<string>();
        const gtTier = pageThreeState.selectedGoodTidingsTier;
        if (gtTier) {
            activeSigilIds.add('standard');
            if (gtTier === 'journeyman' || gtTier === 'master') activeSigilIds.add('journeyman');
            if (gtTier === 'master') activeSigilIds.add('master');
        }

        const sigilSets: Set<string>[] = [
            pageThreeState.selectedCompellingWillSigils,
            pageThreeState.selectedWorldlyWisdomSigils,
            pageThreeState.selectedBitterDissatisfactionSigils,
            pageThreeState.selectedLostHopeSigils,
            pageThreeState.selectedFallenPeaceSigils,
            pageThreeState.selectedGraciousDefeatSigils,
            pageThreeState.selectedClosedCircuitsSigils,
            pageThreeState.selectedRighteousCreationSigils,
            pageThreeState.selectedStarCrossedLoveSigils,
        ];

        sigilSets.forEach(s => s.forEach((id) => activeSigilIds.add(id)));

        setKpPaidNodes((prev: Map<string, string>) => {
            let hasChanges = false;
            const next = new Map<string, string>(prev);
            for (const id of next.keys()) {
                if (!activeSigilIds.has(id)) {
                    next.delete(id);
                    hasChanges = true;
                }
            }
            return hasChanges ? next : prev;
        });
    }, [
        pageThreeState.selectedGoodTidingsTier,
        pageThreeState.selectedCompellingWillSigils,
        pageThreeState.selectedWorldlyWisdomSigils,
        pageThreeState.selectedBitterDissatisfactionSigils,
        pageThreeState.selectedLostHopeSigils,
        pageThreeState.selectedFallenPeaceSigils,
        pageThreeState.selectedGraciousDefeatSigils,
        pageThreeState.selectedClosedCircuitsSigils,
        pageThreeState.selectedRighteousCreationSigils,
        pageThreeState.selectedStarCrossedLoveSigils,
    ]);

    // Enforce Lost Powers Limit based on Tree Nodes
    useEffect(() => {
        const maxSelectable = 1 + selectedLostBlessingNodes.size;
        if (selectedLostPowers.size > maxSelectable) {
             setSelectedLostPowers(prev => {
                const arr = Array.from(prev);
                return new Set(arr.slice(0, maxSelectable));
             });
        }
    }, [selectedLostBlessingNodes.size, selectedLostPowers.size]);

    // Logic for Secret Page Requirement (Child of God)
    const prevChildOfGodChoice = useRef<string | null>(null);

    useEffect(() => {
        const currentChoice = pageSixState.selectedChildOfGodChoiceId;
        const prevChoice = prevChildOfGodChoice.current;
        const TARGET_CHOICE = 'free_child_of_god';

        // 1. Deselection: Was active, now not active
        if (prevChoice === TARGET_CHOICE && currentChoice !== TARGET_CHOICE) {
            if (selectedLostBlessingNodes.size > 0 || selectedLostPowers.size > 0) {
                // Backup existing selections
                setBackupLostBlessingNodes(new Set(selectedLostBlessingNodes));
                setBackupLostPowers(new Set(selectedLostPowers));
                
                // Clear selections (this triggers refund logic in calculations)
                setSelectedLostBlessingNodes(new Set());
                setSelectedLostPowers(new Set());

                const hasSinthrusContract = pageThreeState.selectedStarCrossedLovePacts.has('sinthrus_contract');
                const message = hasSinthrusContract 
                    ? "Condition not met. BP refunded." 
                    : "Condition not met. Sinthru Sigils refunded.";
                
                setGlobalNotification({ message, type: 'info' });
                // Hide notification after 4s
                setTimeout(() => setGlobalNotification(null), 4000);
            }
        }
        
        // 2. Reactivation: Was not active, now active
        if (prevChoice !== TARGET_CHOICE && currentChoice === TARGET_CHOICE) {
            if (backupLostBlessingNodes.size > 0 || backupLostPowers.size > 0) {
                // Restore selections
                setSelectedLostBlessingNodes(new Set(backupLostBlessingNodes));
                setSelectedLostPowers(new Set(backupLostPowers));
                
                setGlobalNotification({ message: "Condition met. Lost Blessing progress restored.", type: 'success' });
                setTimeout(() => setGlobalNotification(null), 4000);
            }
        }

        prevChildOfGodChoice.current = currentChoice;
    }, [pageSixState.selectedChildOfGodChoiceId, pageThreeState.selectedStarCrossedLovePacts, selectedLostBlessingNodes, selectedLostPowers, backupLostBlessingNodes, backupLostPowers]);

    // --- CALCULATIONS ---
    const { totalSigilCounts, availableSigilCounts } = useSigilCalculation(
        pageThreeState, 
        kpPaidNodes, 
        selectedLostBlessingNodes
    );

    useEffect(() => {
        pageThreeState.setAvailableSigilCounts(availableSigilCounts);
    }, [availableSigilCounts]);

    const { 
        blessingPoints, fortunePoints, kuriPoints,
        bpGained, bpSpent, fpGained, fpSpent, kpGained, kpSpent
    } = useCostCalculation({
        selectedDominionId,
        pageOneState, pageTwoState, pageThreeState, pageFourState, pageFiveState, pageSixState,
        kpPaidNodes, miscFpCosts, selectedLostBlessingNodes, buildsRefreshTrigger
    });

    const handleSelectDominion = (id: string) => setSelectedDominionId(id);
    const openReferencePage = () => setIsReferencePageOpen(true);
    const closeReferencePage = () => setIsReferencePageOpen(false);
    
    const openBuildSummary = useCallback(() => setIsBuildSummaryOpen(true), []);
    const closeBuildSummary = useCallback(() => setIsBuildSummaryOpen(false), []);

    const addMiscFpCost = (amount: number) => setMiscFpCosts(prev => prev + amount);
    const refreshBuildCosts = useCallback(() => setBuildsRefreshTrigger(prev => prev + 1), []);
    const markSecretTransitionSeen = useCallback(() => setHasSeenSecretTransition(true), []);
    const toggleSettings = useCallback(() => setIsSettingsOpen(prev => !prev), []);

    const toggleKpNode = useCallback((nodeId: string, sigilType: string) => {
        if (!pageThreeState.selectedStarCrossedLovePacts.has('kuri_odans_charm')) return;
        
        setKpPaidNodes(prev => {
            const newMap = new Map(prev);
            if (newMap.has(nodeId)) {
                newMap.delete(nodeId);
            } else {
                newMap.set(nodeId, sigilType);
            }
            return newMap;
        });
    }, [pageThreeState.selectedStarCrossedLovePacts]);

    const toggleLostBlessingNode = useCallback((id: string) => {
        setSelectedLostBlessingNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const toggleLostPower = useCallback((id: string) => {
        setSelectedLostPowers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                const maxSelectable = 1 + selectedLostBlessingNodes.size;
                if (newSet.size < maxSelectable) {
                    newSet.add(id);
                }
            }
            return newSet;
        });
    }, [selectedLostBlessingNodes.size]);

    // Persistence Setup
    const contextPartial = {
        selectedDominionId, miscFpCosts, kpPaidNodes, selectedLostBlessingNodes, selectedLostPowers,
        backupLostBlessingNodes, backupLostPowers, // Include backups in partial for persistence
        volume, bgmVideoId, language, fontSize,
        addDebugLog, 
        ...pageOneState, ...pageTwoState, ...pageThreeState, ...pageFourState, ...pageFiveState, ...pageSixState
    };
    
    const setters = {
        setSelectedDominionId, setMiscFpCosts, setKpPaidNodes, setSelectedLostBlessingNodes, setSelectedLostPowers,
        setBackupLostBlessingNodes, setBackupLostPowers, // Include setters for backups
        setVolume, setBgmVideoId, setLanguage, setFontSize
    };

    const { serializeState, loadState } = usePersistence(contextPartial as any, setters);

    // Robust Load Function
    const loadFullBuild = useCallback((data: any) => {
        addDebugLog("[Context] Starting Full Build Load...");
        
        // 1. Initial Load via persistence hook
        loadState(data);

        // 2. Handle Dominion specifically with a delay to ensure it overrides defaults/race conditions
        if (data.selectedDominionId) {
             addDebugLog(`[Context] Scheduling Dominion set to: ${data.selectedDominionId}`);
             // Immediate set
             setSelectedDominionId(data.selectedDominionId);
             
             // Delayed force set to beat React batching/Effect overrides
             setTimeout(() => {
                 setSelectedDominionId(prev => {
                     if (prev !== data.selectedDominionId) {
                         addDebugLog(`[Context] Force-correcting Dominion from ${prev} to ${data.selectedDominionId}`);
                         return data.selectedDominionId;
                     }
                     return prev;
                 });
             }, 50);
        }
    }, [loadState, addDebugLog]);

    const contextValue: ICharacterContext = {
      selectedDominionId, handleSelectDominion,
      blessingPoints, fortunePoints, kuriPoints,
      bpGained, bpSpent, fpGained, fpSpent, kpGained, kpSpent,
      kpPaidNodes, toggleKpNode,
      isReferencePageOpen, openReferencePage, closeReferencePage,
      isBuildSummaryOpen, openBuildSummary, closeBuildSummary,
      addMiscFpCost,
      miscFpCosts,
      refreshBuildCosts,
      buildsRefreshTrigger,
      hasSeenSecretTransition,
      markSecretTransitionSeen,
      isSecretTransitionActive,
      setSecretTransitionActive,
      isSecretMusicMode,
      setIsSecretMusicMode,
      isPhotosensitivityDisabled,
      setPhotosensitivityDisabled,
      selectedLostBlessingNodes,
      toggleLostBlessingNode,
      selectedLostPowers,
      toggleLostPower,
      backupLostBlessingNodes,
      backupLostPowers,
      globalNotification,
      setGlobalNotification,
      isSettingsOpen,
      toggleSettings,
      language,
      setLanguage,
      fontSize,
      setFontSize,
      volume,
      setVolume,
      bgmVideoId,
      setBgmVideoId,
      serializeState,
      loadState,
      loadFullBuild, // Exposed
      isDebugOpen,
      toggleDebug,
      debugLog,
      addDebugLog,
      debugFileContent,
      setDebugFileContent,
      ...pageOneState,
      ...pageTwoState,
      ...pageThreeState,
      availableSigilCounts, 
      totalSigilCounts,
      ...pageFourState,
      ...pageFiveState,
      ...pageSixState,
    };

    return (
        <CharacterContext.Provider value={contextValue}>
            {children}
        </CharacterContext.Provider>
    );
};
