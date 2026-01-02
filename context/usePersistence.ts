
import { useCallback } from 'react';
import type { ICharacterContext } from './CharacterContextTypes';

export const usePersistence = (
    contextState: Omit<ICharacterContext, 'serializeState' | 'loadState'>,
    setters: {
        setSelectedDominionId: (id: string | null) => void;
        setMiscFpCosts: (cost: number) => void;
        setKpPaidNodes: (nodes: Map<string, string>) => void;
        setSelectedLostBlessingNodes: (nodes: Set<string>) => void;
        setSelectedLostPowers: (powers: Set<string>) => void;
        setBackupLostBlessingNodes: (nodes: Set<string>) => void;
        setBackupLostPowers: (powers: Set<string>) => void;
        setVolume: (vol: number) => void;
        setBgmVideoId: (id: string) => void;
        setLanguage: (lang: 'en' | 'ko') => void;
        setFontSize: (size: 'regular' | 'large') => void;
    }
) => {
    // Create a serializable state object for full saves
    const serializeState = useCallback(() => {
        const {
            selectedDominionId, miscFpCosts, kpPaidNodes, selectedLostBlessingNodes, selectedLostPowers,
            backupLostBlessingNodes, backupLostPowers,
            volume, bgmVideoId, language, fontSize
        } = contextState;

        // Note: Reference page builds are in localStorage and handled separately by the save logic in SettingsModal
        const state = {
            selectedDominionId,
            miscFpCosts,
            kpPaidNodes: Array.from(kpPaidNodes.entries()),
            selectedLostBlessingNodes: Array.from(selectedLostBlessingNodes),
            selectedLostPowers: Array.from(selectedLostPowers),
            backupLostBlessingNodes: Array.from(backupLostBlessingNodes),
            backupLostPowers: Array.from(backupLostPowers),
            
            // Page 1
            numParents: contextState.numParents,
            numSiblings: contextState.numSiblings,
            assignedTraits: Array.from(contextState.assignedTraits.entries()).map(([k, v]) => [k, Array.from(v)]),
            selectedFamilyMemberId: contextState.selectedFamilyMemberId,
            familyMemberNotes: Array.from(contextState.familyMemberNotes.entries()),
            familyMemberImages: Array.from(contextState.familyMemberImages.entries()),
            selectedHouseId: contextState.selectedHouseId,
            selectedUpgrades: Array.from(contextState.selectedUpgrades),
            selectedTrueSelfTraits: Array.from(contextState.selectedTrueSelfTraits),
            selectedAlterEgoTraits: Array.from(contextState.selectedAlterEgoTraits),
            selectedUniforms: contextState.selectedUniforms,
            selectedMagicalStyles: Array.from(contextState.selectedMagicalStyles),
            selectedBuildTypeId: contextState.selectedBuildTypeId,
            vacationHomes: contextState.vacationHomes.map(h => ({
                ...h,
                upgradeIds: Array.from(h.upgradeIds)
            })),
            mansionExtraSqFt: contextState.mansionExtraSqFt,
            islandExtraMiles: contextState.islandExtraMiles,
            vrChamberCostType: contextState.vrChamberCostType,
            assignedVehicleName: contextState.assignedVehicleName,
            blessedCompanions: Array.from(contextState.blessedCompanions.entries()),
            mythicalPetBeastName: contextState.mythicalPetBeastName,
            inhumanAppearanceBeastName: contextState.inhumanAppearanceBeastName,

            // Page 2
            selectedHeadmasterId: contextState.selectedHeadmasterId,
            selectedTeacherIds: Array.from(contextState.selectedTeacherIds),
            selectedDurationId: contextState.selectedDurationId,
            selectedClubIds: Array.from(contextState.selectedClubIds),
            selectedMiscActivityIds: Array.from(contextState.selectedMiscActivityIds),
            selectedClassmateIds: Array.from(contextState.selectedClassmateIds),
            classmateUniforms: Array.from(contextState.classmateUniforms.entries()),
            isBoardingSchool: contextState.isBoardingSchool,
            customClassmates: contextState.customClassmates,
            selectedMentors: contextState.selectedMentors,

            // Page 3 (Deep state)
            acquiredCommonSigils: Array.from(contextState.acquiredCommonSigils.entries()),
            acquiredLekoluJobs: Array.from(contextState.acquiredLekoluJobs.entries()),
            selectedSpecialSigilChoices: Array.from(contextState.selectedSpecialSigilChoices.entries()).map(([k, v]) => [k, Array.from(v)]),
            
            // Good Tidings
            selectedGoodTidingsTier: contextState.selectedGoodTidingsTier,
            selectedEssentialBoons: Array.from(contextState.selectedEssentialBoons),
            selectedMinorBoons: Array.from(contextState.selectedMinorBoons),
            selectedMajorBoons: Array.from(contextState.selectedMajorBoons),
            isMinorBoonsBoosted: contextState.isMinorBoonsBoosted,
            isMajorBoonsBoosted: contextState.isMajorBoonsBoosted,
            isGoodTidingsMagicianApplied: contextState.isGoodTidingsMagicianApplied,

            // Compelling Will
            selectedCompellingWillSigils: Array.from(contextState.selectedCompellingWillSigils),
            selectedTelekinetics: Array.from(contextState.selectedTelekinetics),
            selectedMetathermics: Array.from(contextState.selectedMetathermics),
            isTelekineticsBoosted: contextState.isTelekineticsBoosted,
            isMetathermicsBoosted: contextState.isMetathermicsBoosted,
            isCompellingWillMagicianApplied: contextState.isCompellingWillMagicianApplied,
            thermalWeaponryWeaponName: contextState.thermalWeaponryWeaponName,

            // Worldly Wisdom
            selectedWorldlyWisdomSigils: Array.from(contextState.selectedWorldlyWisdomSigils),
            selectedEleanorsTechniques: Array.from(contextState.selectedEleanorsTechniques),
            selectedGenevievesTechniques: Array.from(contextState.selectedGenevievesTechniques),
            isEleanorsTechniquesBoosted: contextState.isEleanorsTechniquesBoosted,
            isGenevievesTechniquesBoosted: contextState.isGenevievesTechniquesBoosted,
            isWorldlyWisdomMagicianApplied: contextState.isWorldlyWisdomMagicianApplied,

            // Bitter Dissatisfaction
            selectedBitterDissatisfactionSigils: Array.from(contextState.selectedBitterDissatisfactionSigils),
            selectedBrewing: Array.from(contextState.selectedBrewing),
            selectedSoulAlchemy: Array.from(contextState.selectedSoulAlchemy),
            selectedTransformation: Array.from(contextState.selectedTransformation),
            isBrewingBoosted: contextState.isBrewingBoosted,
            isSoulAlchemyBoosted: contextState.isSoulAlchemyBoosted,
            isTransformationBoosted: contextState.isTransformationBoosted,
            isBitterDissatisfactionMagicianApplied: contextState.isBitterDissatisfactionMagicianApplied,
            humanMarionetteCount: contextState.humanMarionetteCount,
            humanMarionetteCompanionNames: contextState.humanMarionetteCompanionNames,
            mageFamiliarBeastName: contextState.mageFamiliarBeastName,
            beastmasterCount: contextState.beastmasterCount,
            beastmasterBeastNames: contextState.beastmasterBeastNames,
            personificationBuildName: contextState.personificationBuildName,
            shedHumanityBeastName: contextState.shedHumanityBeastName,
            malrayootsMageFormName: contextState.malrayootsMageFormName,
            malrayootsUniversalFormName: contextState.malrayootsUniversalFormName,

            // Lost Hope
            selectedLostHopeSigils: Array.from(contextState.selectedLostHopeSigils),
            selectedChannelling: Array.from(contextState.selectedChannelling),
            selectedNecromancy: Array.from(contextState.selectedNecromancy),
            selectedBlackMagic: Array.from(contextState.selectedBlackMagic),
            isChannellingBoosted: contextState.isChannellingBoosted,
            isNecromancyBoosted: contextState.isNecromancyBoosted,
            blackMagicBoostSigil: contextState.blackMagicBoostSigil,
            isLostHopeMagicianApplied: contextState.isLostHopeMagicianApplied,
            undeadThrallCompanionName: contextState.undeadThrallCompanionName,
            undeadBeastName: contextState.undeadBeastName,

            // Fallen Peace
            selectedFallenPeaceSigils: Array.from(contextState.selectedFallenPeaceSigils),
            selectedTelepathy: Array.from(contextState.selectedTelepathy),
            selectedMentalManipulation: Array.from(contextState.selectedMentalManipulation),
            isTelepathyBoosted: contextState.isTelepathyBoosted,
            isMentalManipulationBoosted: contextState.isMentalManipulationBoosted,
            isFallenPeaceMagicianApplied: contextState.isFallenPeaceMagicianApplied,

            // Gracious Defeat
            selectedGraciousDefeatSigils: Array.from(contextState.selectedGraciousDefeatSigils),
            selectedEntrance: Array.from(contextState.selectedEntrance),
            selectedInfluence: Array.from(contextState.selectedInfluence),
            isFeaturesBoosted: contextState.isFeaturesBoosted,
            isGraciousDefeatMagicianApplied: contextState.isGraciousDefeatMagicianApplied,
            verseAttendantCount: contextState.verseAttendantCount,
            verseAttendantCompanionNames: contextState.verseAttendantCompanionNames,
            livingInhabitants: contextState.livingInhabitants,
            overlordBeastName: contextState.overlordBeastName,
            naturalEnvironmentCount: contextState.naturalEnvironmentCount,
            artificialEnvironmentCount: contextState.artificialEnvironmentCount,
            shiftingWeatherCount: contextState.shiftingWeatherCount,
            brokenSpaceCount: contextState.brokenSpaceCount,
            brokenTimeCount: contextState.brokenTimeCount,
            promisedLandCount: contextState.promisedLandCount,

            // Closed Circuits
            selectedClosedCircuitsSigils: Array.from(contextState.selectedClosedCircuitsSigils),
            selectedNetAvatars: Array.from(contextState.selectedNetAvatars),
            selectedTechnomancies: Array.from(contextState.selectedTechnomancies),
            selectedNaniteControls: Array.from(contextState.selectedNaniteControls),
            isTechnomancyBoosted: contextState.isTechnomancyBoosted,
            isNaniteControlBoosted: contextState.isNaniteControlBoosted,
            isClosedCircuitsMagicianApplied: contextState.isClosedCircuitsMagicianApplied,
            naniteFormBeastName: contextState.naniteFormBeastName,
            heavilyArmedWeaponName: contextState.heavilyArmedWeaponName,

            // Righteous Creation
            selectedRighteousCreationSigils: Array.from(contextState.selectedRighteousCreationSigils),
            selectedSpecialties: Array.from(contextState.selectedSpecialties),
            selectedMagitechPowers: Array.from(contextState.selectedMagitechPowers),
            selectedArcaneConstructsPowers: Array.from(contextState.selectedArcaneConstructsPowers),
            selectedMetamagicPowers: Array.from(contextState.selectedMetamagicPowers),
            isRighteousCreationMagicianApplied: contextState.isRighteousCreationMagicianApplied,
            weaponsmithWeaponName: contextState.weaponsmithWeaponName,
            roboticistIBeastName: contextState.roboticistIBeastName,
            roboticistCompanionName: contextState.roboticistCompanionName,
            masterMechanicVehicleName: contextState.masterMechanicVehicleName,

            // Star Crossed Love
            selectedStarCrossedLoveSigils: Array.from(contextState.selectedStarCrossedLoveSigils),
            selectedStarCrossedLovePacts: Array.from(contextState.selectedStarCrossedLovePacts),
            onisBlessingGuardianName: contextState.onisBlessingGuardianName,
            lostKronackImmunity: contextState.lostKronackImmunity,
            jadeEmperorExtraXuthPurchased: contextState.jadeEmperorExtraXuthPurchased,

            // Engravings
            goodTidingsEngraving: contextState.goodTidingsEngraving,
            goodTidingsWeaponName: contextState.goodTidingsWeaponName,
            compellingWillEngraving: contextState.compellingWillEngraving,
            compellingWillWeaponName: contextState.compellingWillWeaponName,
            worldlyWisdomEngraving: contextState.worldlyWisdomEngraving,
            worldlyWisdomWeaponName: contextState.worldlyWisdomWeaponName,
            bitterDissatisfactionEngraving: contextState.bitterDissatisfactionEngraving,
            bitterDissatisfactionWeaponName: contextState.bitterDissatisfactionWeaponName,
            lostHopeEngraving: contextState.lostHopeEngraving,
            lostHopeWeaponName: contextState.lostHopeWeaponName,
            fallenPeaceEngraving: contextState.fallenPeaceEngraving,
            fallenPeaceWeaponName: contextState.fallenPeaceWeaponName,
            graciousDefeatEngraving: contextState.graciousDefeatEngraving,
            graciousDefeatWeaponName: contextState.graciousDefeatWeaponName,
            closedCircuitsEngraving: contextState.closedCircuitsEngraving,
            closedCircuitsWeaponName: contextState.closedCircuitsWeaponName,
            righteousCreationEngraving: contextState.righteousCreationEngraving,
            righteousCreationWeaponName: contextState.righteousCreationWeaponName,
            selectedBlessingEngraving: contextState.selectedBlessingEngraving,
            
            // Page 4
            acquiredRunes: Array.from(contextState.acquiredRunes.entries()),
            customSpells: contextState.customSpells,

            // Page 5
            selectedAllmillorIds: Array.from(contextState.selectedAllmillorIds),
            selectedCareerGoalIds: Array.from(contextState.selectedCareerGoalIds),
            selectedColleagueIds: Array.from(contextState.selectedColleagueIds),
            joysOfParentingCompanionName: contextState.joysOfParentingCompanionName,
            colleagueUniforms: Array.from(contextState.colleagueUniforms.entries()),
            customColleagues: contextState.customColleagues,
            mentee: contextState.mentee,
            movingOutHomes: contextState.movingOutHomes.map(h => ({
                ...h,
                upgradeIds: Array.from(h.upgradeIds)
            })),

            // Page 6
            selectedRetirementChoiceId: contextState.selectedRetirementChoiceId,
            selectedChildOfGodChoiceId: contextState.selectedChildOfGodChoiceId,
            
            // Settings
            settings: {
                volume,
                bgmVideoId,
                language,
                fontSize
            }
        };
        return state;
    }, [contextState]);

    const loadState = useCallback((data: any) => {
        if (!data) {
            if (contextState.addDebugLog) contextState.addDebugLog("[LoadState] No data provided.");
            return;
        }

        const log = (msg: string) => {
            if (contextState.addDebugLog) contextState.addDebugLog(msg);
        }

        log(`[LoadState] Processing Dominion ID: ${data.selectedDominionId}`);

        if (data.selectedDominionId) {
            setters.setSelectedDominionId(data.selectedDominionId);
            log(`[LoadState] SUCCESS: Set Dominion to ${data.selectedDominionId}`);
        } else {
            setters.setSelectedDominionId(null);
            log(`[LoadState] FAIL: No Dominion ID, resetting to null.`);
        }

        setters.setMiscFpCosts(data.miscFpCosts || 0);
        setters.setKpPaidNodes(new Map(Array.isArray(data.kpPaidNodes) ? data.kpPaidNodes : []));
        setters.setSelectedLostBlessingNodes(new Set(Array.isArray(data.selectedLostBlessingNodes) ? data.selectedLostBlessingNodes : []));
        setters.setSelectedLostPowers(new Set(Array.isArray(data.selectedLostPowers) ? data.selectedLostPowers : []));
        setters.setBackupLostBlessingNodes(new Set(Array.isArray(data.backupLostBlessingNodes) ? data.backupLostBlessingNodes : []));
        setters.setBackupLostPowers(new Set(Array.isArray(data.backupLostPowers) ? data.backupLostPowers : []));
        
        if (data.settings) {
            setters.setVolume(data.settings.volume ?? 50);
            setters.setBgmVideoId(data.settings.bgmVideoId ?? 'GzIXfP0rkMk');
            // We load language to respect user's saved preference
            setters.setLanguage(data.settings.language ?? 'en');
            setters.setFontSize(data.settings.fontSize ?? 'regular');
        }

        // Sub-loaders wrapped in try-catch
        try {
            log(`[LoadState] Loading Page 1...`);
            contextState.loadPageOneState(data);
        } catch (e) {
            log(`[LoadState] ERROR loading Page 1: ${(e as any).message}`);
            console.error(e);
        }

        try {
            log(`[LoadState] Loading Page 2...`);
            contextState.loadPageTwoState(data);
        } catch (e) {
            log(`[LoadState] ERROR loading Page 2: ${(e as any).message}`);
            console.error(e);
        }

        try {
             log(`[LoadState] Loading Page 3...`);
             contextState.loadPageThreeState(data);
        } catch (e) {
             log(`[LoadState] ERROR loading Page 3: ${(e as any).message}`);
             console.error(e);
        }

        try {
             log(`[LoadState] Loading Page 4...`);
             contextState.loadPageFourState(data);
        } catch (e) {
             log(`[LoadState] ERROR loading Page 4: ${(e as any).message}`);
             console.error(e);
        }

        try {
             log(`[LoadState] Loading Page 5...`);
             contextState.loadPageFiveState(data);
        } catch (e) {
             log(`[LoadState] ERROR loading Page 5: ${(e as any).message}`);
             console.error(e);
        }

        try {
             log(`[LoadState] Loading Page 6...`);
             contextState.loadPageSixState(data);
        } catch (e) {
             log(`[LoadState] ERROR loading Page 6: ${(e as any).message}`);
             console.error(e);
        }
        
        log(`[LoadState] Finished.`);

    }, [contextState, setters]);

    return { serializeState, loadState };
};
