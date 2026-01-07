
import { useMemo, useCallback, useEffect, useState } from 'react';
import type { PageOneState, PageTwoState, PageThreeState, PageFourState, PageFiveState, PageSixState } from './CharacterContextTypes';
import type { AllBuilds } from '../types';
import { 
  DOMINIONS, TRAITS_DATA, HOUSES_DATA, HOUSE_UPGRADES_DATA, 
  TRUE_SELF_TRAITS, ALTER_EGO_TRAITS, MAGICAL_STYLES_DATA, 
  BUILD_TYPES_DATA, HEADMASTERS_DATA, TEACHERS_DATA,
  DURATION_DATA, CLUBS_DATA, MISC_ACTIVITIES_DATA, CLASSMATES_DATA,
  CUSTOM_CLASSMATE_CHOICES_DATA,
  BLESSING_ENGRAVINGS, COMMON_SIGILS_DATA, SPECIAL_SIGILS_DATA,
  GOOD_TIDINGS_SIGIL_TREE_DATA,
  LIMITLESS_POTENTIAL_RUNES_DATA, ALLMILLOR_CHOICES_DATA, CAREER_GOALS_DATA,
  COLLEAGUES_DATA, CUSTOM_COLLEAGUE_CHOICES_DATA, RETIREMENT_CHOICES_DATA, CHILD_OF_GOD_DATA,
  UNIFORMS_DATA,
  TELEKINETICS_DATA, METATHERMICS_DATA, 
  ESSENTIAL_BOONS_DATA, MINOR_BOONS_DATA, MAJOR_BOONS_DATA,
  ELEANORS_TECHNIQUES_DATA, GENEVIEVES_TECHNIQUES_DATA,
  BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA,
  CHANNELLING_DATA, NECROMANCY_DATA, BLACK_MAGIC_DATA,
  TELEPATHY_DATA, MENTAL_MANIPULATION_DATA,
  ENTRANCE_DATA, FEATURES_DATA, INFLUENCE_DATA,
  NET_AVATAR_DATA, TECHNOMANCY_DATA, NANITE_CONTROL_DATA,
  RIGHTEOUS_CREATION_SPECIALTIES_DATA, RIGHTEOUS_CREATION_MAGITECH_DATA, 
  RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, RIGHTEOUS_CREATION_METAMAGIC_DATA,
  STAR_CROSSED_LOVE_PACTS_DATA
} from '../constants';
import { PARENT_COST_MAP, SIBLING_COST_PER, STORAGE_KEY, SIGIL_BP_COSTS, parseCost, getBlessingForNode, type Cost } from './utils';

const SUN_FORGER_CREATION_POWERS = new Set([
    'thermal_weaponry',
    'mages_familiar_i', 'mages_familiar_ii', 'mages_familiar_iii',
    'human_marionettes', 'beastmaster', 'personification',
    'shed_humanity_i', 'shed_humanity_ii', 'malrayoots',
    'undead_beast', 'undead_thrall',
    'overlord',
    'heavily_armed', 'nanite_form',
    'weaponsmith', 'master_mechanic_i', 'master_mechanic_ii',
    'roboticist_i', 'roboticist_ii'
]);

// Set of Sigil IDs that are of type 'Lekolu' within trees
const LEKOLU_TREE_SIGILS = new Set([
    'thermosword', // Compelling Will
    'realmkeeper', 'realmmaster', // Gracious Defeat
    'kyrotik_armor', 'ez_hack', // Closed Circuits
    'polymat' // Righteous Creation
]);

interface CostProps {
    selectedDominionId: string | null;
    pageOneState: PageOneState;
    pageTwoState: PageTwoState;
    pageThreeState: PageThreeState;
    pageFourState: PageFourState;
    pageFiveState: PageFiveState;
    pageSixState: PageSixState;
    kpPaidNodes: Map<string, string>;
    miscFpCosts: number;
    selectedLostBlessingNodes: Set<string>;
    buildsRefreshTrigger: number;
}

export const useCostCalculation = ({
    selectedDominionId, pageOneState, pageTwoState, pageThreeState, pageFourState, pageFiveState, pageSixState, kpPaidNodes, miscFpCosts, selectedLostBlessingNodes, buildsRefreshTrigger
}: CostProps) => {
    const [blessingPoints, setBlessingPoints] = useState(100);
    const [fortunePoints, setFortunePoints] = useState(100);
    const [kuriPoints, setKuriPoints] = useState(0);

    // Detailed Breakdown States
    const [bpGained, setBpGained] = useState(0);
    const [bpSpent, setBpSpent] = useState(0);
    const [fpGained, setFpGained] = useState(0);
    const [fpSpent, setFpSpent] = useState(0);
    const [kpGained, setKpGained] = useState(0);
    const [kpSpent, setKpSpent] = useState(0);

    const lekoluSubOptions = SPECIAL_SIGILS_DATA.find(s => s.id === 'lekolu')?.subOptions || [];
    const ALL_CAREER_GOALS = useMemo(() => [ ...CAREER_GOALS_DATA.proSports, ...CAREER_GOALS_DATA.general, ...CAREER_GOALS_DATA.finishingTouches ], []);

    const ALL_ITEMS_WITH_COSTS = useMemo(() => [
        ...TRAITS_DATA.positive, ...TRAITS_DATA.negative,
        ...HOUSES_DATA, ...HOUSE_UPGRADES_DATA,
        ...TRUE_SELF_TRAITS, ...ALTER_EGO_TRAITS, ...UNIFORMS_DATA,
        ...MAGICAL_STYLES_DATA, ...BUILD_TYPES_DATA,
        ...HEADMASTERS_DATA, ...TEACHERS_DATA, ...DURATION_DATA,
        ...CLUBS_DATA, ...MISC_ACTIVITIES_DATA, ...CLASSMATES_DATA,
        ...CUSTOM_CLASSMATE_CHOICES_DATA,
        ...BLESSING_ENGRAVINGS, ...COMMON_SIGILS_DATA, 
        ...SPECIAL_SIGILS_DATA.map(s => ({...s, cost: s.id === 'lekolu' ? '' : s.cost})),
        ...lekoluSubOptions.map(sub => ({...sub, cost: SPECIAL_SIGILS_DATA.find(s => s.id === 'lekolu')?.cost || ''})),
        ...GOOD_TIDINGS_SIGIL_TREE_DATA,
        ...LIMITLESS_POTENTIAL_RUNES_DATA, ...ALLMILLOR_CHOICES_DATA,
        ...ALL_CAREER_GOALS, ...COLLEAGUES_DATA, ...CUSTOM_COLLEAGUE_CHOICES_DATA,
        ...RETIREMENT_CHOICES_DATA, ...CHILD_OF_GOD_DATA,
        ...ESSENTIAL_BOONS_DATA, ...MINOR_BOONS_DATA, ...MAJOR_BOONS_DATA,
        ...TELEKINETICS_DATA, ...METATHERMICS_DATA,
        ...ELEANORS_TECHNIQUES_DATA, ...GENEVIEVES_TECHNIQUES_DATA,
        ...BREWING_DATA, ...SOUL_ALCHEMY_DATA, ...TRANSFORMATION_DATA,
        ...CHANNELLING_DATA, ...NECROMANCY_DATA, ...BLACK_MAGIC_DATA,
        ...TELEPATHY_DATA, ...MENTAL_MANIPULATION_DATA,
        ...ENTRANCE_DATA, ...FEATURES_DATA, ...INFLUENCE_DATA,
        ...NET_AVATAR_DATA, ...TECHNOMANCY_DATA, ...NANITE_CONTROL_DATA,
        ...RIGHTEOUS_CREATION_SPECIALTIES_DATA, ...RIGHTEOUS_CREATION_MAGITECH_DATA, 
        ...RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, ...RIGHTEOUS_CREATION_METAMAGIC_DATA,
        ...STAR_CROSSED_LOVE_PACTS_DATA
    ], [ALL_CAREER_GOALS, lekoluSubOptions]);

    const ALL_COSTS = useMemo(() => {
        const costs = new Map<string, Cost>();
        ALL_ITEMS_WITH_COSTS.forEach(item => {
            if (item.id) costs.set(item.id, parseCost((item as any).cost || ''));
        });
        return costs;
    }, [ALL_ITEMS_WITH_COSTS]);

    const getExtraBpCost = useCallback(() => {
        if (!pageThreeState.selectedStarCrossedLovePacts.has('sun_forgers_boon')) {
            return 0;
        }

        const assignedNames: string[] = [
            pageOneState.assignedVehicleName,
            ...Array.from(pageOneState.blessedCompanions.values()),
            pageOneState.mythicalPetBeastName,
            pageOneState.inhumanAppearanceBeastName,
            ...pageTwoState.customClassmates.map(c => c.companionName),
            ...pageFiveState.customColleagues.map(c => c.companionName),
            pageFiveState.joysOfParentingCompanionName,
            pageThreeState.mageFamiliarBeastName,
            ...pageThreeState.humanMarionetteCompanionNames,
            ...pageThreeState.beastmasterBeastNames,
            pageThreeState.personificationBuildName,
            pageThreeState.shedHumanityBeastName,
            pageThreeState.malrayootsMageFormName, 
            pageThreeState.malrayootsUniversalFormName,
            pageThreeState.undeadThrallCompanionName,
            pageThreeState.undeadBeastName,
            pageThreeState.goodTidingsWeaponName,
            pageThreeState.compellingWillWeaponName,
            pageThreeState.thermalWeaponryWeaponName,
            pageThreeState.worldlyWisdomWeaponName,
            pageThreeState.bitterDissatisfactionWeaponName,
            pageThreeState.lostHopeWeaponName,
            pageThreeState.fallenPeaceWeaponName,
            pageThreeState.graciousDefeatWeaponName,
            ...pageThreeState.verseAttendantCompanionNames,
            ...pageThreeState.livingInhabitants.map(i => i.beastName),
            pageThreeState.overlordBeastName,
            pageThreeState.closedCircuitsWeaponName,
            pageThreeState.heavilyArmedWeaponName,
            pageThreeState.naniteFormBeastName,
            pageThreeState.righteousCreationWeaponName,
            pageThreeState.weaponsmithWeaponName,
            pageThreeState.masterMechanicVehicleName,
            pageThreeState.roboticistIBeastName,
            pageThreeState.roboticistCompanionName,
            ...pageFourState.customSpells.map(s => s.assignedEntityName),
            pageThreeState.onisBlessingGuardianName,
             // Add Vacation Homes mythical pets if applicable
             ...pageOneState.vacationHomes.map(h => h.mythicalPetName)
        ].filter((name): name is string => !!name);

        let totalExtraBp = 0;
        const savedBuildsJSON = localStorage.getItem(STORAGE_KEY);
        if (savedBuildsJSON) {
            try {
                const parsedBuilds: AllBuilds = JSON.parse(savedBuildsJSON);
                const allBuildCategories = [parsedBuilds.companions, parsedBuilds.weapons, parsedBuilds.beasts, parsedBuilds.vehicles];
                
                assignedNames.forEach(name => {
                    for (const category of allBuildCategories) {
                        if (category && category[name]) {
                            totalExtraBp += (category[name].data.bpSpent || 0);
                            break;
                        }
                    }
                });
            } catch (e) {
                console.error("Error calculating extra BP cost", e);
            }
        }
        return totalExtraBp;
    }, [
        pageOneState, pageTwoState, pageThreeState, pageFourState, pageFiveState, 
        buildsRefreshTrigger 
    ]);

    useEffect(() => {
        let calcFpSpent = 0;
        let calcFpGained = 0;
        let calcBpSpent = 0;
        let calcBpGained = 0;
        let calcKpSpent = 0;
        let calcKpGained = 0;

        const addFp = (val: number) => { if (val > 0) calcFpSpent += val; else calcFpGained += Math.abs(val); };
        const addBp = (val: number) => { if (val > 0) calcBpSpent += val; else calcBpGained += Math.abs(val); };
        const addKp = (val: number) => { if (val > 0) calcKpSpent += val; else calcKpGained += Math.abs(val); };

        const accumulateCost = (id: string | null) => {
          if (!id) return;
          const cost = ALL_COSTS.get(id) ?? {fp: 0, bp: 0};
          addFp(cost.fp);
          addBp(cost.bp);
        };
        const dominion = DOMINIONS.find(d => d.id === selectedDominionId);
        const dominionName = dominion?.title.toUpperCase();

        // Page 1
        const parentCost = PARENT_COST_MAP[pageOneState.numParents] ?? (pageOneState.numParents > 0 ? (pageOneState.numParents - 2) * 5 + 3 : -20);
        addFp(parentCost);
        addFp(pageOneState.numSiblings * SIBLING_COST_PER);
        
        pageOneState.assignedTraits.forEach((traits) => { traits.forEach(accumulateCost); });
        
        // Main House
        accumulateCost(pageOneState.selectedHouseId);
        pageOneState.selectedUpgrades.forEach(id => {
            if (id === 'virtual_reality') {
                if (pageOneState.vrChamberCostType === 'fp') addFp(5);
                else if (pageOneState.vrChamberCostType === 'bp') addBp(2);
            } else {
                accumulateCost(id);
            }
        });
        if (pageOneState.selectedHouseId === 'mansion') {
            addFp(pageOneState.mansionExtraSqFt * 1);
        }
        if (pageOneState.selectedUpgrades.has('private_island')) {
            addFp(pageOneState.islandExtraMiles * 1);
        }

        // Vacation Homes Logic
        pageOneState.vacationHomes.forEach(home => {
            addFp(3); // Base cost per home
            if (home.houseId) accumulateCost(home.houseId);
            home.upgradeIds.forEach(id => {
                 if (id === 'virtual_reality') {
                    if (home.vrChamberCostType === 'fp') addFp(5);
                    else if (home.vrChamberCostType === 'bp') addBp(2);
                } else {
                    accumulateCost(id);
                }
            });
            if (home.houseId === 'mansion') {
                addFp(home.mansionExtraSqFt * 1);
            }
            if (home.upgradeIds.has('private_island')) {
                addFp(home.islandExtraMiles * 1);
            }
        });


        pageOneState.selectedTrueSelfTraits.forEach(accumulateCost);
        pageOneState.selectedAlterEgoTraits.forEach(accumulateCost);
        pageOneState.selectedUniforms.slice(1).forEach(accumulateCost);
        pageOneState.selectedMagicalStyles.forEach(accumulateCost);

        // Page 2
        accumulateCost(pageTwoState.selectedHeadmasterId);
        pageTwoState.selectedTeacherIds.forEach(accumulateCost);
        accumulateCost(pageTwoState.selectedDurationId);
        pageTwoState.selectedClubIds.forEach(accumulateCost);
        // Explicitly handle mixed cost for TA and Adjunct Professor
        pageTwoState.selectedMiscActivityIds.forEach(id => {
            if (id === 'teachers_assistant') {
                addFp(5);
                addBp(-2);
            } else if (id === 'adjunct_professor') {
                addFp(5);
                addBp(-3);
            } else {
                accumulateCost(id);
            }
        });

        pageTwoState.selectedClassmateIds.forEach(id => {
            const classmate = CLASSMATES_DATA.find(c => c.id === id);
            const cost = ALL_COSTS.get(id) ?? { fp: 0, bp: 0 };
            let currentFpCost = cost.fp;
            if (classmate && dominionName && classmate.birthplace.toUpperCase() === dominionName) {
                currentFpCost -= 2;
            }
            addFp(currentFpCost);
            addBp(cost.bp);
        });
        pageTwoState.customClassmates.forEach(c => accumulateCost(c.optionId));
        if (pageTwoState.isBoardingSchool && pageOneState.selectedHouseId === 'ragamuffin') {
            addFp(8);
        }
        pageTwoState.selectedMentors.forEach(mentor => {
            const mentorFpCost = mentor.cost;
            addFp(mentorFpCost * 2); // Double cost
            addBp(-(mentorFpCost));  // Grants BP equal to original FP cost (effectively double the original half grant)
        });

        // Page 3 - Dominion Perks / School Bonuses Logic
        // Dynamic Costs
        const juathasCost = selectedDominionId === 'rovines' ? 7 : 8; // Droudnore (Global)
        const sinthruCost = selectedDominionId === 'shinar' ? 8 : 10; // Sheol (Global)
        const xuthCost = selectedDominionId === 'valsereth' ? 9 : 12; // Strasmara (Global)
        const lekoluCost = selectedDominionId === 'palisade' ? 2 : 4; // Triumph Towers (Global)

        let bpRefund = 0;
        const checkRefund = (engraving: string | null, sigilSet: Set<string>, juathasSigilId: string) => {
            const finalEngraving = engraving ?? pageThreeState.selectedBlessingEngraving;
            if (finalEngraving === 'weapon' && sigilSet.has(juathasSigilId)) {
                bpRefund++;
            }
        };

        const refundMap = [
            { engraving: pageThreeState.compellingWillEngraving, sigils: pageThreeState.selectedCompellingWillSigils, juathasId: 'manipulator' },
            { engraving: pageThreeState.worldlyWisdomEngraving, sigils: pageThreeState.selectedWorldlyWisdomSigils, juathasId: 'arborealist' },
            { engraving: pageThreeState.bitterDissatisfactionEngraving, sigils: pageThreeState.selectedBitterDissatisfactionSigils, juathasId: 'fireborn' },
            { engraving: pageThreeState.lostHopeEngraving, sigils: pageThreeState.selectedLostHopeSigils, juathasId: 'young_witch' },
            { engraving: pageThreeState.fallenPeaceEngraving, sigils: pageThreeState.selectedFallenPeaceSigils, juathasId: 'left_brained' },
            { engraving: pageThreeState.graciousDefeatEngraving, sigils: pageThreeState.selectedGraciousDefeatSigils, juathasId: 'gd_fireborn' },
            { engraving: pageThreeState.closedCircuitsEngraving, sigils: pageThreeState.selectedClosedCircuitsSigils, juathasId: 'script_kiddy' },
            { engraving: pageThreeState.righteousCreationEngraving, sigils: pageThreeState.selectedRighteousCreationSigils, juathasId: 'rookie_engineer' },
        ];

        for (const { engraving, sigils, juathasId } of refundMap) {
            checkRefund(engraving, sigils, juathasId);
        }
        addBp(-bpRefund);

        // Apply Dominion Refunds for Juathas Sigils (BP Calculation)
        // Only apply if NOT paid with KP
        if (selectedDominionId === 'halidew') {
            if (pageThreeState.selectedClosedCircuitsSigils.has('script_kiddy') && !kpPaidNodes.has('script_kiddy')) addBp(-2);
            if (pageThreeState.selectedRighteousCreationSigils.has('rookie_engineer') && !kpPaidNodes.has('rookie_engineer')) addBp(-2);
            if (pageThreeState.selectedStarCrossedLoveSigils.has('sworn_fealty') && !kpPaidNodes.has('sworn_fealty')) addBp(-2);
        }

        if (selectedDominionId === 'unterseeisch') {
            if (pageThreeState.selectedLostHopeSigils.has('young_witch') && !kpPaidNodes.has('young_witch')) addBp(-2);
            if (pageThreeState.selectedFallenPeaceSigils.has('left_brained') && !kpPaidNodes.has('left_brained')) addBp(-2);
            if (pageThreeState.selectedGraciousDefeatSigils.has('gd_fireborn') && !kpPaidNodes.has('gd_fireborn')) addBp(-2);
        }

        if (selectedDominionId === 'gohwood') {
            if (pageThreeState.selectedCompellingWillSigils.has('manipulator') && !kpPaidNodes.has('manipulator')) addBp(-2);
            if (pageThreeState.selectedWorldlyWisdomSigils.has('arborealist') && !kpPaidNodes.has('arborealist')) addBp(-2);
            if (pageThreeState.selectedBitterDissatisfactionSigils.has('fireborn') && !kpPaidNodes.has('fireborn')) addBp(-2);
        }

        // Weapon Cost Logic: Charge 5 FP for each unique weapon assigned to a blessing engraving
        const assignedWeapons = new Set([
            pageThreeState.goodTidingsWeaponName,
            pageThreeState.compellingWillWeaponName,
            pageThreeState.worldlyWisdomWeaponName,
            pageThreeState.bitterDissatisfactionWeaponName,
            pageThreeState.lostHopeWeaponName,
            pageThreeState.fallenPeaceWeaponName,
            pageThreeState.graciousDefeatWeaponName,
            pageThreeState.closedCircuitsWeaponName,
            pageThreeState.righteousCreationWeaponName,
        ].filter(Boolean)); // remove nulls
        
        addFp(assignedWeapons.size * 5);

        if (pageThreeState.selectedMetathermics.has('thermal_weaponry')) addFp(-5);
        if (pageThreeState.selectedNaniteControls.has('heavily_armed')) addFp(-5);
        if (pageThreeState.selectedMagitechPowers.has('weaponsmith')) addFp(-5);

        const hasCheissilith = pageThreeState.selectedStarCrossedLovePacts.has('cheissiliths_bargain');
        const hasSinthrusContract = pageThreeState.selectedStarCrossedLovePacts.has('sinthrus_contract');
        const hasKuriOdanCharm = pageThreeState.selectedStarCrossedLovePacts.has('kuri_odans_charm');

        pageThreeState.acquiredCommonSigils.forEach((count, id) => {
            let itemBpCost = ALL_COSTS.get(id)?.bp ?? 0;
            let itemFpCost = ALL_COSTS.get(id)?.fp ?? 0;

            if (id === 'juathas') {
                itemBpCost = juathasCost;
                if (hasCheissilith) {
                    itemBpCost = 0; // Free
                }
            } else if (id === 'purth') {
                if (hasCheissilith) {
                    itemBpCost = itemBpCost * 2;
                }
            } else if (id === 'sinthru') {
                if (hasSinthrusContract) {
                    itemBpCost = 0;
                }
            }

            addFp(itemFpCost * count);
            addBp(itemBpCost * count);
        });

        pageThreeState.acquiredLekoluJobs.forEach((count, id) => {
            const cost = ALL_COSTS.get(id) ?? {fp: 0, bp: 0};
            addFp(cost.fp * count);
            addBp(lekoluCost * count);
        });

        pageThreeState.selectedSpecialSigilChoices.forEach((subOptionSet, sigilId) => {
            if (sigilId !== 'lekolu') {
                const baseCost = ALL_COSTS.get(sigilId) ?? { fp: 0, bp: 0 };
                let currentBpCost = baseCost.bp;
                
                if (sigilId === 'xuth') {
                    if (hasCheissilith) {
                        currentBpCost = xuthCost * 2; // Doubled
                    } else {
                        currentBpCost = xuthCost;
                    }
                }
                if (sigilId === 'sinthru') {
                    if (hasSinthrusContract) {
                        currentBpCost = 0;
                    } else {
                        currentBpCost = sinthruCost;
                    }
                }

                addFp(baseCost.fp * subOptionSet.size);
                addBp(currentBpCost * subOptionSet.size);
            }
        });
        
        // Lost Blessing Cost Logic
        if (selectedLostBlessingNodes.size > 0) {
            if (hasSinthrusContract) {
                // If contract active, pay BP instead of Sigil
                addBp(selectedLostBlessingNodes.size * sinthruCost);
            }
            // If contract inactive, cost is 1 Sinthru Sigil (handled in availableSigilCounts calculation)
        }
        
        if (pageThreeState.selectedStarCrossedLovePacts.has('sun_forgers_boon')) {
            const allSelectedPowers = new Set<string>();
            const powerStateSources = [
                pageThreeState.selectedTelekinetics,
                pageThreeState.selectedMetathermics,
                pageThreeState.selectedEleanorsTechniques,
                pageThreeState.selectedGenevievesTechniques,
                pageThreeState.selectedBrewing,
                pageThreeState.selectedSoulAlchemy,
                pageThreeState.selectedTransformation,
                pageThreeState.selectedChannelling,
                pageThreeState.selectedNecromancy,
                pageThreeState.selectedBlackMagic,
                pageThreeState.selectedTelepathy,
                pageThreeState.selectedMentalManipulation,
                pageThreeState.selectedNetAvatars,
                pageThreeState.selectedTechnomancies,
                pageThreeState.selectedNaniteControls,
                pageThreeState.selectedSpecialties,
                pageThreeState.selectedMagitechPowers,
                pageThreeState.selectedArcaneConstructsPowers,
                pageThreeState.selectedMetamagicPowers,
                pageThreeState.selectedEntrance,
                pageThreeState.selectedInfluence
            ];
            
            powerStateSources.forEach(set => set.forEach(id => allSelectedPowers.add(id)));

            allSelectedPowers.forEach(powerId => {
                if (SUN_FORGER_CREATION_POWERS.has(powerId)) {
                    const item = ALL_ITEMS_WITH_COSTS.find(i => i.id === powerId);
                    const grade = (item as any)?.grade;

                    if (grade === 'kaarn') addBp(-1.5);
                    else if (grade === 'purth') addBp(-2.5);
                    else if (grade === 'xuth') {
                        const baseCost = 12;
                        const schoolRefund = (selectedDominionId === 'valsereth') ? 3 : 0;
                        const paid = baseCost - schoolRefund; 
                        addBp(-(paid / 2));
                    } else if (grade === 'lekolu') {
                        const baseBp = 4;
                        const baseFp = 6;
                        const schoolRefund = (selectedDominionId === 'palisade') ? 2 : 0;
                        const paidBp = baseBp - schoolRefund;
                        addBp(-(paidBp / 2)); 
                        addFp(-(baseFp / 2)); 
                    } else if (grade === 'sinthru') {
                        const baseCost = 10;
                        const schoolRefund = (selectedDominionId === 'shinar') ? 2 : 0;
                        const paid = baseCost - schoolRefund;
                        addBp(-(paid / 2));
                    }
                }
            });

            if (pageThreeState.livingInhabitants.length > 0) addBp(-(1.5 * pageThreeState.livingInhabitants.length));
            if (pageThreeState.verseAttendantCount > 0) addBp(-(1.5 * pageThreeState.verseAttendantCount));
            addBp(getExtraBpCost());
        }

        if (selectedDominionId === 'jipangu') {
            const ruhaiCount = pageFourState.acquiredRunes.get('ruhai') ?? 0;
            const mialgrathCount = pageFourState.acquiredRunes.get('mialgrath') ?? 0;
            addBp(-(ruhaiCount * 1));
            addBp(-(mialgrathCount * 1));
        }

        if (pageOneState.selectedTrueSelfTraits.has('magician')) {
            const magicianBlessings = [
                { isApplied: pageThreeState.isGoodTidingsMagicianApplied, cost: pageThreeState.goodTidingsSigilTreeCost, sigils: [] }, // Good Tidings uses standard costs, sigil tree doesn't track ids here but costs directly
                { isApplied: pageThreeState.isCompellingWillMagicianApplied, cost: pageThreeState.compellingWillSigilTreeCost, sigils: pageThreeState.selectedCompellingWillSigils },
                { isApplied: pageThreeState.isWorldlyWisdomMagicianApplied, cost: pageThreeState.worldlyWisdomSigilTreeCost, sigils: pageThreeState.selectedWorldlyWisdomSigils },
                { isApplied: pageThreeState.isBitterDissatisfactionMagicianApplied, cost: pageThreeState.bitterDissatisfactionSigilTreeCost, sigils: pageThreeState.selectedBitterDissatisfactionSigils },
                { isApplied: pageThreeState.isLostHopeMagicianApplied, cost: pageThreeState.lostHopeSigilTreeCost, sigils: pageThreeState.selectedLostHopeSigils },
                { isApplied: pageThreeState.isFallenPeaceMagicianApplied, cost: pageThreeState.fallenPeaceSigilTreeCost, sigils: pageThreeState.selectedFallenPeaceSigils },
                { isApplied: pageThreeState.isGraciousDefeatMagicianApplied, cost: pageThreeState.graciousDefeatSigilTreeCost, sigils: pageThreeState.selectedGraciousDefeatSigils },
                { isApplied: pageThreeState.isClosedCircuitsMagicianApplied, cost: pageThreeState.closedCircuitsSigilTreeCost, sigils: pageThreeState.selectedClosedCircuitsSigils },
                { isApplied: pageThreeState.isRighteousCreationMagicianApplied, cost: pageThreeState.righteousCreationSigilTreeCost, sigils: pageThreeState.selectedRighteousCreationSigils },
            ];
            
            magicianBlessings.forEach(blessing => {
                if (blessing.isApplied) {
                    addBp(Math.floor(blessing.cost * 0.25));
                    
                    // Add FP cost for Lekolu sigils if present in the tree
                    // Assume Lekolu base cost of 6 FP for calculation
                    if (blessing.sigils) {
                        let lekoluCount = 0;
                        blessing.sigils.forEach((id: string) => {
                            if (LEKOLU_TREE_SIGILS.has(id)) {
                                lekoluCount++;
                            }
                        });
                        if (lekoluCount > 0) {
                            addFp(Math.floor(lekoluCount * 6 * 0.25));
                        }
                    }
                }
            });
        }
        
        // Jade Emperor's Challenge Cost Logic
        if (pageThreeState.selectedStarCrossedLovePacts.has('jade_emperors_challenge')) {
            const xuthTrialsCount = pageThreeState.selectedSpecialSigilChoices.get('xuth')?.size || 0;
            // 1. Calculate discount refund if at least one trial is done
            if (xuthTrialsCount >= 1) {
                addBp(-(xuthCost / 2));
            }
            // 2. Add extra cost if the 3rd one is purchased
            if (pageThreeState.jadeEmperorExtraXuthPurchased) {
                addBp(xuthCost);
            }
        }

        if (pageThreeState.selectedStarCrossedLovePacts.has('evoghos_vow')) {
            addFp(50); 
            addBp(-50);
        }
        if (pageThreeState.selectedStarCrossedLovePacts.has('kuri_odans_charm')) {
            addBp(50);
        }

        // --- Calculate Kuri Points Cost ---
        // Iterate over kpPaidNodes and sum their BP costs
        kpPaidNodes.forEach((type, id) => {
             // 1. Determine base cost
             let cost = SIGIL_BP_COSTS[type] || 0;
             const blessingId = getBlessingForNode(id);
             
             // 2. Adjust cost based on perks (same logic as above)
             if (type === 'juathas') {
                cost = juathasCost;
                
                // Specific School Refunds for Juathas
                if (selectedDominionId === 'halidew') {
                    if (blessingId === 'closed_circuits' || blessingId === 'righteous_creation' || blessingId === 'star_crossed_love') {
                        cost -= 2;
                    }
                }
                
                if (selectedDominionId === 'unterseeisch') {
                    if (blessingId === 'lost_hope' || blessingId === 'fallen_peace' || blessingId === 'gracious_defeat') {
                        cost -= 2;
                    }
                }

                if (selectedDominionId === 'gohwood') {
                    if (blessingId === 'compelling_will' || blessingId === 'worldly_wisdom' || blessingId === 'bitter_dissatisfaction') {
                        cost -= 2;
                    }
                }

                if (hasCheissilith) cost = 0; // Free
            } else if (type === 'purth') {
                if (hasCheissilith) cost = cost * 2;
            } else if (type === 'sinthru') {
                if (hasSinthrusContract) cost = 0;
            } else if (type === 'xuth') {
                if (hasCheissilith) cost = xuthCost * 2; // Doubled
                else cost = xuthCost;
            } else if (type === 'lekolu') {
                cost = lekoluCost; 
            }

            // --- REFUND LOGIC ---
            // If paying with KP, we refund the BP/FP cost that was charged by the standard calculation above.
            // Lekolu is special: it costs FP and BP.
            if (type === 'lekolu') {
                // Lekolu standard cost is 4 BP and 6 FP per job
                // With palisade refund, it's 2 BP
                const refundBp = lekoluCost; // 4 or 2
                const refundFp = 6; // Fixed FP cost
                addBp(-refundBp);
                addFp(-refundFp);
            } else {
                 // For other sigils, refund the BP cost calculated above
                 addBp(-cost);
            }

            addKp(Math.max(0, cost));
        });

        // Page 4 - Runes Cost Logic
        const ruhaiCount = pageFourState.acquiredRunes.get('ruhai') ?? 0;
        const mialgrathCount = pageFourState.acquiredRunes.get('mialgrath') ?? 0;
        const ruhaiCost = ALL_COSTS.get('ruhai')?.bp ?? 0;
        const mialgrathCost = ALL_COSTS.get('mialgrath')?.bp ?? 0;

        // Base cost calculation (before KP adjustments)
        addBp(ruhaiCost * ruhaiCount);
        addBp(mialgrathCost * mialgrathCount);

        // KP Cost Adjustment for Custom Spells
        if (hasKuriOdanCharm) {
            pageFourState.customSpells.forEach(spell => {
                // Calculate Ruhai Cost Adjustment
                if (spell.isRuhaiKpPaid) {
                    addBp(-ruhaiCost);
                    addKp(ruhaiCost);
                }
                
                // Calculate Milgrath Cost Adjustment
                // Note: Milgrath cost is applied only if Milgrath is actually applied to the spell
                if (spell.mialgrathApplied && spell.isMilgrathKpPaid) {
                    addBp(-mialgrathCost);
                    addKp(mialgrathCost);
                }
            });
        }

        // Page 5
        pageFiveState.selectedAllmillorIds.forEach(accumulateCost);
        pageFiveState.selectedCareerGoalIds.forEach(accumulateCost);
        pageFiveState.selectedColleagueIds.forEach(id => {
            const colleague = COLLEAGUES_DATA.find(c => c.id === id);
            const cost = ALL_COSTS.get(id) ?? { fp: 0, bp: 0 };
            let currentFpCost = cost.fp;
            if (colleague && dominionName && colleague.birthplace.toUpperCase() === dominionName) {
                if (currentFpCost > 0) currentFpCost = Math.max(0, currentFpCost - 2);
            }
            addFp(currentFpCost);
            addBp(cost.bp);
        });
        pageFiveState.customColleagues.forEach(c => accumulateCost(c.optionId));
        
        if (pageFiveState.selectedCareerGoalIds.has('mentor_career')) {
            if (pageFiveState.mentee) {
                addFp(Math.max(0, pageFiveState.mentee.originalCost - 1));
            }
        }
        
        pageFiveState.movingOutHomes.forEach((home, index) => {
            if (home.isInherited) return;
            if (index !== 0) {
                addFp(3);
                if (home.houseId) accumulateCost(home.houseId);
                home.upgradeIds.forEach(id => {
                    if (id === 'virtual_reality') {
                         if (home.vrChamberCostType === 'bp') addBp(2);
                         else addFp(5);
                    } else accumulateCost(id);
                });
            }
        });
        
        // Page 6
        accumulateCost(pageSixState.selectedRetirementChoiceId);
        accumulateCost(pageSixState.selectedChildOfGodChoiceId);
        
        addFp(miscFpCosts);

        // Final Totals
        // Starting points are 100
        const totalFpSpent = calcFpSpent;
        const totalFpGained = calcFpGained;
        const totalBpSpent = calcBpSpent;
        const totalBpGained = calcBpGained;
        const totalKpSpent = calcKpSpent;
        const initialKp = pageThreeState.selectedStarCrossedLovePacts.has('kuri_odans_charm') ? 100 : 0;
        const totalKpGained = initialKp + calcKpGained;

        setFpSpent(totalFpSpent);
        setFpGained(totalFpGained);
        setBpSpent(totalBpSpent);
        setBpGained(totalBpGained);
        setKpSpent(totalKpSpent);
        setKpGained(totalKpGained);

        // Net points logic
        // Current Points = Starting(100) + Gained - Spent
        setFortunePoints(100 + totalFpGained - totalFpSpent);
        setBlessingPoints(100 + totalBpGained - totalBpSpent);
        setKuriPoints(totalKpGained - totalKpSpent);

    }, [
        selectedDominionId, ALL_COSTS, miscFpCosts, kpPaidNodes,
        pageOneState, pageTwoState, pageThreeState, pageFourState, pageFiveState, pageSixState,
        buildsRefreshTrigger, getExtraBpCost, selectedLostBlessingNodes
    ]);

    return { 
        blessingPoints, fortunePoints, kuriPoints,
        bpGained, bpSpent,
        fpGained, fpSpent,
        kpGained, kpSpent
    };
};
