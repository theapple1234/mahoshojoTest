import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useRef, useMemo } from 'react';
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
import type { BuildType } from '../types';

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
    const [isOptimizationMode, setOptimizationMode] = useState(false);
    const [isSimplifiedUiMode, setSimplifiedUiMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Sandbox Mode
    const [isSandboxMode, setIsSandboxMode] = useState(false);
    const enableSandboxMode = useCallback(() => {
        setIsSandboxMode(true);
        setGlobalNotification({ message: "SANDBOX MODE ACTIVATED", type: 'success' });
    }, []);

    // Initialize language based on browser preference
    const [language, setLanguage] = useState<'en' | 'ko'>(() => {
        if (typeof navigator !== 'undefined' && navigator.language) {
            return navigator.language.startsWith('ko') ? 'ko' : 'en';
        }
        return 'en';
    });

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

    // Synchronize HTML lang attribute with selected language
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    // Monitor State Changes
    useEffect(() => {
        if (selectedDominionId) {
            addDebugLog(`[StateUpdate] selectedDominionId changed to: ${selectedDominionId}`);
        }
    }, [selectedDominionId, addDebugLog]);

    // Initialization Effect: Clear Reference Builds
    useEffect(() => {
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

    // Calculate Total Runes (including Sandbox bonus)
    const totalRunes = useMemo(() => {
        const map = new Map<'ruhai' | 'mialgrath', number>(pageFourState.acquiredRunes);
        if (isSandboxMode) {
             const currentRuhai = map.get('ruhai');
             const currentMialgrath = map.get('mialgrath');
             map.set('ruhai', (typeof currentRuhai === 'number' ? currentRuhai : 0) + 99);
             map.set('mialgrath', (typeof currentMialgrath === 'number' ? currentMialgrath : 0) + 99);
        }
        return map;
    }, [pageFourState.acquiredRunes, isSandboxMode]);
    
    // Override mialgrathRunesPurchased to use totalRunes so validation passes in Sandbox
    const mialgrathRunesPurchased = totalRunes.get('mialgrath') ?? 0;

    // Centralized Rename Logic
    const updateReferenceName = useCallback((type: BuildType, oldName: string, newName: string) => {
        // Page 1
        if (type === 'vehicles') {
            if (pageOneState.assignedVehicleName === oldName) pageOneState.handleAssignVehicle(newName);
        }
        if (type === 'beasts') {
            if (pageOneState.mythicalPetBeastName === oldName) pageOneState.handleAssignMythicalPet(newName);
            if (pageOneState.inhumanAppearanceBeastName === oldName) pageOneState.handleAssignInhumanAppearance(newName);
            pageOneState.vacationHomes.forEach(h => {
                if (h.mythicalPetName === oldName) pageOneState.updateVacationHome(h.id, { mythicalPetName: newName });
            });
        }
        if (type === 'companions') {
            pageOneState.blessedCompanions.forEach((name, id) => {
                if (name === oldName) pageOneState.handleAssignBlessedCompanion(id, newName);
            });
        }

        // Page 2
        if (type === 'companions') {
            pageTwoState.customClassmates.forEach(c => {
                if (c.companionName === oldName) pageTwoState.handleAssignCustomClassmateName(c.id, newName);
            });
        }

        // Page 3
        if (type === 'beasts') {
            if (pageThreeState.mageFamiliarBeastName === oldName) pageThreeState.handleMageFamiliarBeastAssign(newName);
            pageThreeState.beastmasterBeastNames.forEach((name, idx) => {
                if (name === oldName) pageThreeState.handleBeastmasterBeastAssign(idx, newName);
            });
            if (pageThreeState.shedHumanityBeastName === oldName) pageThreeState.handleShedHumanityBeastAssign(newName);
            if (pageThreeState.malrayootsMageFormName === oldName) pageThreeState.handleMalrayootsMageFormAssign(newName);
            if (pageThreeState.malrayootsUniversalFormName === oldName) pageThreeState.handleMalrayootsUniversalFormAssign(newName);
            if (pageThreeState.undeadBeastName === oldName) pageThreeState.handleUndeadBeastAssign(newName);
            pageThreeState.livingInhabitants.forEach(i => {
                if (i.beastName === oldName) pageThreeState.assignLivingInhabitantBeast(i.id, i.type!, newName);
            });
            if (pageThreeState.overlordBeastName === oldName) pageThreeState.handleOverlordBeastAssign(newName);
            if (pageThreeState.naniteFormBeastName === oldName) pageThreeState.handleNaniteFormBeastAssign(newName);
            if (pageThreeState.roboticistIBeastName === oldName) pageThreeState.handleRoboticistIBeastAssign(newName);
            if (pageThreeState.onisBlessingGuardianName === oldName) pageThreeState.handleOnisBlessingGuardianAssign(newName);
        }
        if (type === 'companions') {
            pageThreeState.humanMarionetteCompanionNames.forEach((name, idx) => {
                if (name === oldName) pageThreeState.handleHumanMarionetteCompanionAssign(idx, newName);
            });
            if (pageThreeState.undeadThrallCompanionName === oldName) pageThreeState.handleUndeadThrallCompanionAssign(newName);
            pageThreeState.verseAttendantCompanionNames.forEach((name, idx) => {
                if (name === oldName) pageThreeState.handleVerseAttendantCompanionAssign(idx, newName);
            });
            if (pageThreeState.roboticistCompanionName === oldName) pageThreeState.handleRoboticistCompanionAssign(newName);
            if (pageThreeState.personificationBuildName === oldName) pageThreeState.handlePersonificationBuildAssign(newName);
        }
        if (type === 'weapons') {
            const weaponHandlers = [
                { current: pageThreeState.goodTidingsWeaponName, set: pageThreeState.handleGoodTidingsWeaponAssign },
                { current: pageThreeState.compellingWillWeaponName, set: pageThreeState.handleCompellingWillWeaponAssign },
                { current: pageThreeState.thermalWeaponryWeaponName, set: pageThreeState.handleThermalWeaponryWeaponAssign },
                { current: pageThreeState.worldlyWisdomWeaponName, set: pageThreeState.handleWorldlyWisdomWeaponAssign },
                { current: pageThreeState.bitterDissatisfactionWeaponName, set: pageThreeState.handleBitterDissatisfactionWeaponAssign },
                { current: pageThreeState.lostHopeWeaponName, set: pageThreeState.handleLostHopeWeaponAssign },
                { current: pageThreeState.fallenPeaceWeaponName, set: pageThreeState.handleFallenPeaceWeaponAssign },
                { current: pageThreeState.graciousDefeatWeaponName, set: pageThreeState.handleGraciousDefeatWeaponAssign },
                { current: pageThreeState.closedCircuitsWeaponName, set: pageThreeState.handleClosedCircuitsWeaponAssign },
                { current: pageThreeState.heavilyArmedWeaponName, set: pageThreeState.handleHeavilyArmedWeaponAssign },
                { current: pageThreeState.righteousCreationWeaponName, set: pageThreeState.handleRighteousCreationWeaponAssign },
                { current: pageThreeState.weaponsmithWeaponName, set: pageThreeState.handleWeaponsmithWeaponAssign },
            ];
            weaponHandlers.forEach(h => {
                if (h.current === oldName) h.set(newName);
            });
        }
        if (type === 'vehicles') {
            if (pageThreeState.masterMechanicVehicleName === oldName) pageThreeState.handleMasterMechanicVehicleAssign(newName);
        }

        // Page 4
        pageFourState.customSpells.forEach(s => {
             const singularType = type.slice(0, -1); // 'companion', 'beast', 'weapon', 'vehicle'
             if (s.assignedEntityName === oldName && s.assignedEntityType === singularType) {
                 pageFourState.handleAssignEntityToSpell(s.id, s.assignedEntityType, newName);
             }
        });

        // Page 5
        if (type === 'companions') {
            if (pageFiveState.joysOfParentingCompanionName === oldName) pageFiveState.handleJoysOfParentingCompanionAssign(newName);
            pageFiveState.customColleagues.forEach(c => {
                if (c.companionName === oldName) pageFiveState.handleAssignCustomColleagueName(c.id, newName);
            });
            if (pageFiveState.mentee?.type === 'custom' && pageFiveState.mentee.name === oldName) {
                pageFiveState.handleMenteeSelect({ ...pageFiveState.mentee, name: newName });
            }
        }
    }, [pageOneState, pageTwoState, pageThreeState, pageFourState, pageFiveState]);
    
    // --- SIDE EFFECTS ---
    useEffect(() => {
        const root = document.documentElement;
        if (fontSize === 'large') {
            root.style.fontSize = '120%'; 
        } else {
            root.style.fontSize = '90%';
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
        selectedLostBlessingNodes,
        isSandboxMode // Updated: pass isSandboxMode
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
        kpPaidNodes, miscFpCosts, selectedLostBlessingNodes, buildsRefreshTrigger, isSandboxMode
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
        volume, bgmVideoId, language, fontSize, isOptimizationMode, isSimplifiedUiMode, isSandboxMode,
        addDebugLog, 
        ...pageOneState, ...pageTwoState, ...pageThreeState, ...pageFourState, ...pageFiveState, ...pageSixState
    };
    
    const setters = {
        setSelectedDominionId, setMiscFpCosts, setKpPaidNodes, setSelectedLostBlessingNodes, setSelectedLostPowers,
        setBackupLostBlessingNodes, setBackupLostPowers, // Include setters for backups
        setVolume, setBgmVideoId, setLanguage, setFontSize,
        setOptimizationMode, setSimplifiedUiMode, setIsSandboxMode
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
      isOptimizationMode,
      setOptimizationMode,
      isSimplifiedUiMode,
      setSimplifiedUiMode,
      isSandboxMode,
      enableSandboxMode,
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
      loadFullBuild, 
      isDebugOpen,
      toggleDebug,
      debugLog,
      addDebugLog,
      debugFileContent,
      setDebugFileContent,
      updateReferenceName, // Exposed
      ...pageOneState,
      ...pageTwoState,
      ...pageThreeState,
      availableSigilCounts, 
      totalSigilCounts,
      // Provide totalRunes to context
      totalRunes,
      // Override with derived value
      ...pageFourState,
      mialgrathRunesPurchased,
      ...pageFiveState,
      ...pageSixState,
    };

    return (
        <CharacterContext.Provider value={contextValue}>
            {children}
        </CharacterContext.Provider>
    );
};