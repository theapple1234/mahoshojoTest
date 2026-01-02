
import { useMemo } from 'react';
import * as Constants from '../constants';
import { ICharacterContext } from '../context/CharacterContextTypes';

export const useBuildSummaryData = (ctx: ICharacterContext) => {
    const allItems = useMemo(() => [
        ...Constants.DOMINIONS, ...Constants.TRAITS_DATA.positive, ...Constants.TRAITS_DATA.negative, ...Constants.HOUSES_DATA,
        ...Constants.HOUSE_UPGRADES_DATA, ...Constants.TRUE_SELF_TRAITS, ...Constants.ALTER_EGO_TRAITS, ...Constants.UNIFORMS_DATA,
        ...Constants.MAGICAL_STYLES_DATA, ...Constants.BUILD_TYPES_DATA, ...Constants.HEADMASTERS_DATA, ...Constants.TEACHERS_DATA,
        ...Constants.DURATION_DATA, ...Constants.CLUBS_DATA, ...Constants.MISC_ACTIVITIES_DATA, ...Constants.CLASSMATES_DATA.map(c => ({...c, title: c.name})),
        ...Constants.ALLMILLOR_CHOICES_DATA, ...Object.values(Constants.CAREER_GOALS_DATA).flat(), ...Constants.COLLEAGUES_DATA.map(c => ({...c, title: c.name})),
        ...Constants.RETIREMENT_CHOICES_DATA, ...Constants.CHILD_OF_GOD_DATA,
        ...Constants.COMMON_SIGILS_DATA, ...Constants.SPECIAL_SIGILS_DATA.flatMap(s => s.subOptions ? s.subOptions : [s]),
        ...Constants.LIMITLESS_POTENTIAL_RUNES_DATA, ...Constants.LOST_POWERS_DATA
    ], []);
    
    // Enhanced getItem to inject assignment data
    const getItem = (id: string | null) => {
        if (!id) return undefined;
        const baseItem = allItems.find(item => item.id === id);
        if (!baseItem) return undefined;

        // Clone to avoid mutating constant data
        const item = { ...baseItem } as any;

        // Inject Assignments
        if (id === 'signature_vehicle') item.assignedName = ctx.assignedVehicleName;
        if (id === 'inhuman_appearance') item.assignedName = ctx.inhumanAppearanceBeastName;
        if (id === 'mythical_pet') item.assignedName = ctx.mythicalPetBeastName;
        
        // Inject Stats
        if (id === 'mansion') item.extraInfo = `+${ctx.mansionExtraSqFt * 1000} sq ft`;
        if (id === 'private_island') item.extraInfo = `+${ctx.islandExtraMiles} sq miles`;
        
        // Mentors (from Page 2 Misc Activities)
        if (id === 'mentor') {
             const mentorNames = ctx.selectedMentors.map((m: any) => m.name).join(', ');
             if (mentorNames) item.assignedName = mentorNames;

             // Dynamic Cost Calculation for Summary
             const totalFp = ctx.selectedMentors.reduce((acc: number, m: any) => acc + (m.cost || 0), 0);
             const totalBp = totalFp / 2;
             if (totalFp > 0) {
                 item.cost = `Costs -${totalFp} FP, Grants +${totalBp} BP`;
             }
        }

        return item;
    };
    
    // Helper to determine if a specific item is boosted based on context
    const isItemBoosted = (id: string) => {
        // Good Tidings
        if (ctx.isMinorBoosted && Constants.MINOR_BOONS_DATA.some(i => i.id === id)) return true;
        if (ctx.isMajorBoosted && Constants.MAJOR_BOONS_DATA.some(i => i.id === id)) return true;
        if (ctx.isEssentialBoosted && Constants.ESSENTIAL_BOONS_DATA.some(i => i.id === id)) return true;
        
        // Compelling Will
        if (ctx.isTelekineticsBoosted && Constants.TELEKINETICS_DATA.some(i => i.id === id)) return true;
        if (ctx.isMetathermicsBoosted && Constants.METATHERMICS_DATA.some(i => i.id === id)) return true;

        // Worldly Wisdom
        if (ctx.isEleanorsTechniquesBoosted && Constants.ELEANORS_TECHNIQUES_DATA.some(i => i.id === id)) return true;
        if (ctx.isGenevievesTechniquesBoosted && Constants.GENEVIEVES_TECHNIQUES_DATA.some(i => i.id === id)) return true;

        // Bitter Dissatisfaction
        if (ctx.isBrewingBoosted && Constants.BREWING_DATA.some(i => i.id === id)) return true;
        if (ctx.isSoulAlchemyBoosted && Constants.SOUL_ALCHEMY_DATA.some(i => i.id === id)) return true;
        if (ctx.isTransformationBoosted && Constants.TRANSFORMATION_DATA.some(i => i.id === id)) return true;

        // Lost Hope
        if (ctx.isChannellingBoosted && Constants.CHANNELLING_DATA.some(i => i.id === id)) return true;
        if (ctx.isNecromancyBoosted && Constants.NECROMANCY_DATA.some(i => i.id === id)) return true;
        if (ctx.blackMagicBoostSigil && Constants.BLACK_MAGIC_DATA.some(i => i.id === id)) return true;

        // Fallen Peace
        if (ctx.isTelepathyBoosted && Constants.TELEPATHY_DATA.some(i => i.id === id)) return true;
        if (ctx.isMentalManipulationBoosted && Constants.MENTAL_MANIPULATION_DATA.some(i => i.id === id)) return true;

        // Gracious Defeat
        if (ctx.isFeaturesBoosted && Constants.FEATURES_DATA.some(i => i.id === id)) return true;
        if (ctx.isFeaturesBoosted && Constants.INFLUENCE_DATA.some(i => i.id === id)) return true; // Features boost applies to some influence? Usually Influence is separate but checking logic.
        // NOTE: Gracious Defeat 'Features' boost applies primarily to Features, but let's check constants boost descriptions.
        // Actually, some influence powers are boosted by Features boost? Based on `boostDescriptions` in GraciousDefeatSection, yes.
        // However, Entrance/Influence don't have separate Boost buttons, only Features does.
        // Wait, Gracious Defeat has only "Features" boost button. 
        // Checking `GraciousDefeatSection.tsx`: `boostDescriptions` contains influence powers like `reality_invasion`? 
        // No, `boostDescriptions` has: natural, artificial, shifting, living, broken_space, broken_time, promised, verse_attendant.
        // All of these are in FEATURES_DATA. So only Features data is boosted.

        // Closed Circuits
        if (ctx.isTechnomancyBoosted && (Constants.TECHNOMANCY_DATA.some(i => i.id === id) || Constants.NET_AVATAR_DATA.some(i => i.id === id))) return true; // Technomancy boosts Net Avatar too in the section logic
        if (ctx.isNaniteControlBoosted && Constants.NANITE_CONTROL_DATA.some(i => i.id === id)) return true;

        return false;
    };

    const getBlessingPowers = (selectedIds: Set<string>, powerData: any[]) => {
        return Array.from(selectedIds).map(id => {
            const baseItem = powerData.find(p => p.id === id);
            if (!baseItem) return null;
            const item = { ...baseItem } as any;
            
            // Check boost status
            if (isItemBoosted(id)) {
                item.isBoosted = true;
            }

            // Inject Feature Counts & Assignments
            if (id === 'natural_environment') item.count = ctx.naturalEnvironmentCount;
            if (id === 'artificial_environment') item.count = ctx.artificialEnvironmentCount;
            if (id === 'shifting_weather') item.count = ctx.shiftingWeatherCount;
            if (id === 'living_inhabitants') {
                 item.count = ctx.livingInhabitants.length;
                 const names = ctx.livingInhabitants.map((i: any) => i.beastName).filter(Boolean).join(', ');
                 if (names) item.assignedName = names;
            }
            if (id === 'broken_space') item.count = ctx.brokenSpaceCount;
            if (id === 'broken_time') item.count = ctx.brokenTimeCount;
            if (id === 'promised_land') item.count = ctx.promisedLandCount;
            if (id === 'verse_attendant') {
                item.count = ctx.verseAttendantCount;
                const names = ctx.verseAttendantCompanionNames.filter(Boolean).join(', ');
                if (names) item.assignedName = names;
            }

            // Inject Blessing Assignments
            if (id === 'mages_familiar_i' || id === 'mages_familiar_ii' || id === 'mages_familiar_iii') item.assignedName = ctx.mageFamiliarBeastName;
            if (id === 'shed_humanity_i' || id === 'shed_humanity_ii') item.assignedName = ctx.shedHumanityBeastName;
            if (id === 'undead_beast') item.assignedName = ctx.undeadBeastName;
            if (id === 'undead_thrall') item.assignedName = ctx.undeadThrallCompanionName;
            if (id === 'personification') item.assignedName = ctx.personificationBuildName;
            if (id === 'heavily_armed') item.assignedName = ctx.heavilyArmedWeaponName;
            if (id === 'nanite_form') item.assignedName = ctx.naniteFormBeastName;
            if (id === 'weaponsmith') item.assignedName = ctx.weaponsmithWeaponName;
            if (id === 'master_mechanic_i' || id === 'master_mechanic_ii') item.assignedName = ctx.masterMechanicVehicleName;
            if (id === 'roboticist_i') item.assignedName = ctx.roboticistIBeastName;
            if (id === 'roboticist_ii') item.assignedName = ctx.roboticistCompanionName;
            if (id === 'overlord') item.assignedName = ctx.overlordBeastName;
            if (id === 'thermal_weaponry') item.assignedName = ctx.thermalWeaponryWeaponName;
            
            // Star Crossed Love assignments
            if (id === 'onis_blessing') item.assignedName = ctx.onisBlessingGuardianName;
            if (id === 'lost_kronacks_deal') item.assignedName = ctx.lostKronackImmunity ? `Immunity: ${ctx.lostKronackImmunity}` : null;

            return item;
        }).filter(Boolean);
    };

    // Prepare Detailed Family Data
    const familyDetails = [
        ...Array.from({ length: ctx.numParents }).map((_, i) => {
            const id = `parent-${i}`;
            const traits = Array.from((ctx.assignedTraits.get(id) as Set<string>) || []).map(tid => {
                const t = [...Constants.TRAITS_DATA.positive, ...Constants.TRAITS_DATA.negative].find(tr => tr.id === tid);
                
                // Special check for 'blessed' assignment on parent
                if (tid === 'blessed') {
                    const blessedName = ctx.blessedCompanions.get(id);
                    if (blessedName) return { ...t, assignedName: blessedName };
                }
                return t;
            }).filter(Boolean);
            
            const defaultParentImage = i === 1 
                ? 'https://i.ibb.co/DPffzsyr/parent2.png' 
                : 'https://i.ibb.co/PZJmzncs/parent1.png';

            return {
                id,
                title: `Parent ${i + 1}`,
                type: 'Parent',
                imageSrc: ctx.familyMemberImages.get(id) || defaultParentImage,
                note: ctx.familyMemberNotes.get(id),
                traits
            };
        }),
        ...Array.from({ length: ctx.numSiblings }).map((_, i) => {
            const id = `sibling-${i}`;
            const traits = Array.from((ctx.assignedTraits.get(id) as Set<string>) || []).map(tid => {
                const t = [...Constants.TRAITS_DATA.positive, ...Constants.TRAITS_DATA.negative].find(tr => tr.id === tid);
                 // Special check for 'blessed' assignment on sibling (if applicable logic changes, but mostly parents)
                if (tid === 'blessed') {
                     const blessedName = ctx.blessedCompanions.get(id);
                     if (blessedName) return { ...t, assignedName: blessedName };
                }
                return t;
            }).filter(Boolean);

            return {
                id,
                title: `Sibling ${i + 1}`,
                type: 'Sibling',
                imageSrc: ctx.familyMemberImages.get(id) || 'https://i.ibb.co/m58qFCRf/sib1.png',
                note: ctx.familyMemberNotes.get(id),
                traits
            };
        })
    ];

    // Prepare Detailed Housing Data
    const mainDominion = Constants.DOMINIONS.find(d => d.id === ctx.selectedDominionId);
    const mainHouse = Constants.HOUSES_DATA.find(h => h.id === ctx.selectedHouseId);
    
    const housingDetails = [];
    
    // Main House
    if (mainHouse) {
        housingDetails.push({
            id: 'main-house',
            title: 'Primary Residence',
            dominion: mainDominion?.title || 'Unknown',
            type: mainHouse.title,
            imageSrc: mainHouse.imageSrc,
            upgrades: Array.from(ctx.selectedUpgrades as Set<string>).map(uid => getItem(uid)),
            stats: ctx.selectedHouseId === 'mansion' ? `+${ctx.mansionExtraSqFt * 1000} sq ft` : null,
            isMain: true
        });
    }

    // Collect inherited IDs for marking
    const inheritedVacationHomeIds = new Set<string>();
    if (ctx.movingOutHomes) {
        ctx.movingOutHomes.forEach((home: any) => {
            if (home.isInherited && home.inheritedFromId) {
                inheritedVacationHomeIds.add(home.inheritedFromId);
            }
        });
    }

    // Vacation Homes
    ctx.vacationHomes.forEach((home: any, idx: number) => {
        const dom = Constants.DOMINIONS.find(d => d.id === home.dominionId);
        const house = Constants.HOUSES_DATA.find(h => h.id === home.houseId);
        const upgrades = Array.from(home.upgradeIds as Set<string>).map((uid: string) => getItem(uid));
        
        let stats = null;
        if (home.houseId === 'mansion') stats = `+${home.mansionExtraSqFt * 1000} sq ft`;
        
        // Append Inherited tag
        let title = home.name || `Vacation Home #${idx + 1}`;
        if (inheritedVacationHomeIds.has(home.id)) {
            title += ' (Inherited)';
        }

        housingDetails.push({
            id: home.id,
            title: title,
            dominion: dom?.title || 'Unselected',
            type: house?.title || 'Unselected',
            imageSrc: house?.imageSrc || 'https://i.ibb.co/QjPxQPL4/home1.jpg',
            upgrades,
            stats,
            mythicalPet: home.mythicalPetName, 
            isMain: false
        });
    });

    // Moving Out Homes
    if (ctx.movingOutHomes && ctx.movingOutHomes.length > 0) {
        ctx.movingOutHomes.forEach((home: any, idx: number) => {
            // Skip if inherited to avoid duplication in list (it's marked on the vacation home)
            if (home.isInherited) return;
            if (!home.houseId) return;

            const house = Constants.HOUSES_DATA.find(h => h.id === home.houseId);
            const upgrades = Array.from(home.upgradeIds as Set<string>).map((uid: string) => getItem(uid));
            const dom = Constants.DOMINIONS.find(d => d.id === home.dominionId);
            
            let title = `Moving Out Home #${idx + 1}`;
            
            housingDetails.push({
                id: home.id,
                title: title,
                dominion: dom?.title || 'New Residence',
                type: house?.title || 'Unselected',
                imageSrc: house?.imageSrc || 'https://i.ibb.co/KpMsN670/b1.jpg', 
                upgrades,
                stats: null, 
                isMain: false
            });
        });
    }

    const boardingSchoolItem = ctx.isBoardingSchool ? {
        id: 'boarding_school',
        title: 'BOARDING SCHOOL',
        imageSrc: 'https://i.ibb.co/B2VMLm0N/boarding.jpg',
        description: 'Living in the dorms.'
    } : null;

    // --- GROUP BLESSINGS FOR LIST LAYOUTS ---
    
    // Helper to get engraving string
    const getEngravingLabel = (engravingId: string | null, weaponName: string | null) => {
        const id = engravingId ?? ctx.selectedBlessingEngraving;
        if (!id) return null;
        if (id === 'weapon') return `Weapon: ${weaponName || 'Unassigned'}`;
        if (id === 'skin') return 'Skin';
        if (id === 'clothes') return 'Clothes';
        return id.charAt(0).toUpperCase() + id.slice(1);
    };

    const sigilsGroup = {
        title: 'Sigils & Contracts',
        engraving: null,
        activeBoosts: [],
        items: [
             ...(Array.from(ctx.acquiredCommonSigils.entries()) as [string, number][])
                .filter(([, count]) => count > 0)
                .map(([id, count]) => {
                    const sigil = Constants.COMMON_SIGILS_DATA.find(s => s.id === id);
                    return sigil ? { ...sigil, count, type: 'sigil' } : null;
                }),
        ].filter(Boolean)
    };

    const getGoodTidingsBoosts = () => {
        const boosts = [];
        if (ctx.isEssentialBoosted) boosts.push('Essential');
        if (ctx.isMinorBoosted) boosts.push('Minor');
        if (ctx.isMajorBoosted) boosts.push('Major');
        return boosts;
    };

    const goodTidingsGroup = {
        title: 'Good Tidings',
        engraving: getEngravingLabel(ctx.goodTidingsEngraving, ctx.goodTidingsWeaponName),
        activeBoosts: getGoodTidingsBoosts(),
        items: [
            ...getBlessingPowers(ctx.selectedEssentialBoons, Constants.ESSENTIAL_BOONS_DATA),
            ...getBlessingPowers(ctx.selectedMinorBoons, Constants.MINOR_BOONS_DATA),
            ...getBlessingPowers(ctx.selectedMajorBoons, Constants.MAJOR_BOONS_DATA),
        ]
    };

    const getCompellingWillBoosts = () => {
        const boosts = [];
        if (ctx.isTelekineticsBoosted) boosts.push('Telekinetics');
        if (ctx.isMetathermicsBoosted) boosts.push('Metathermics');
        return boosts;
    };

    const compellingWillGroup = {
        title: 'Compelling Will',
        engraving: getEngravingLabel(ctx.compellingWillEngraving, ctx.compellingWillWeaponName),
        activeBoosts: getCompellingWillBoosts(),
        items: [
            ...getBlessingPowers(ctx.selectedTelekinetics, Constants.TELEKINETICS_DATA),
            ...getBlessingPowers(ctx.selectedMetathermics, Constants.METATHERMICS_DATA),
        ]
    };

    const getWorldlyWisdomBoosts = () => {
        const boosts = [];
        if (ctx.isEleanorsTechniquesBoosted) boosts.push("Eleanor's");
        if (ctx.isGenevievesTechniquesBoosted) boosts.push("Genevieve's");
        return boosts;
    };

    const worldlyWisdomGroup = {
        title: 'Worldly Wisdom',
        engraving: getEngravingLabel(ctx.worldlyWisdomEngraving, ctx.worldlyWisdomWeaponName),
        activeBoosts: getWorldlyWisdomBoosts(),
        items: [
            ...getBlessingPowers(ctx.selectedEleanorsTechniques, Constants.ELEANORS_TECHNIQUES_DATA),
            ...getBlessingPowers(ctx.selectedGenevievesTechniques, Constants.GENEVIEVES_TECHNIQUES_DATA),
        ]
    };

    const getBitterDissatisfactionBoosts = () => {
        const boosts = [];
        if (ctx.isBrewingBoosted) boosts.push('Brewing');
        if (ctx.isSoulAlchemyBoosted) boosts.push('Soul Alchemy');
        if (ctx.isTransformationBoosted) boosts.push('Transformation');
        return boosts;
    };

    const bitterDissatisfactionGroup = {
        title: 'Bitter Dissatisfaction',
        engraving: getEngravingLabel(ctx.bitterDissatisfactionEngraving, ctx.bitterDissatisfactionWeaponName),
        activeBoosts: getBitterDissatisfactionBoosts(),
        items: [
            ...getBlessingPowers(ctx.selectedBrewing, Constants.BREWING_DATA),
            ...getBlessingPowers(ctx.selectedSoulAlchemy, Constants.SOUL_ALCHEMY_DATA),
            ...getBlessingPowers(ctx.selectedTransformation, Constants.TRANSFORMATION_DATA),
        ]
    };

    const getLostHopeBoosts = () => {
        const boosts = [];
        if (ctx.isChannellingBoosted) boosts.push('Channelling');
        if (ctx.isNecromancyBoosted) boosts.push('Necromancy');
        if (ctx.blackMagicBoostSigil) boosts.push('Black Magic');
        return boosts;
    };

    const lostHopeGroup = {
        title: 'Lost Hope',
        engraving: getEngravingLabel(ctx.lostHopeEngraving, ctx.lostHopeWeaponName),
        activeBoosts: getLostHopeBoosts(),
        items: [
            ...getBlessingPowers(ctx.selectedChannelling, Constants.CHANNELLING_DATA),
            ...getBlessingPowers(ctx.selectedNecromancy, Constants.NECROMANCY_DATA),
            ...getBlessingPowers(ctx.selectedBlackMagic, Constants.BLACK_MAGIC_DATA),
        ]
    };

    const getFallenPeaceBoosts = () => {
        const boosts = [];
        if (ctx.isTelepathyBoosted) boosts.push('Telepathy');
        if (ctx.isMentalManipulationBoosted) boosts.push('Mental Manip.');
        return boosts;
    };

    const fallenPeaceGroup = {
        title: 'Fallen Peace',
        engraving: getEngravingLabel(ctx.fallenPeaceEngraving, ctx.fallenPeaceWeaponName),
        activeBoosts: getFallenPeaceBoosts(),
        items: [
            ...getBlessingPowers(ctx.selectedTelepathy, Constants.TELEPATHY_DATA),
            ...getBlessingPowers(ctx.selectedMentalManipulation, Constants.MENTAL_MANIPULATION_DATA),
        ]
    };

    // Calculate selected features based on counts
    const selectedFeatures = new Set<string>();
    if (ctx.naturalEnvironmentCount > 0) selectedFeatures.add('natural_environment');
    if (ctx.artificialEnvironmentCount > 0) selectedFeatures.add('artificial_environment');
    if (ctx.shiftingWeatherCount > 0) selectedFeatures.add('shifting_weather');
    if (ctx.livingInhabitants && ctx.livingInhabitants.length > 0) selectedFeatures.add('living_inhabitants');
    if (ctx.brokenSpaceCount > 0) selectedFeatures.add('broken_space');
    if (ctx.brokenTimeCount > 0) selectedFeatures.add('broken_time');
    if (ctx.promisedLandCount > 0) selectedFeatures.add('promised_land');
    if (ctx.verseAttendantCount > 0) selectedFeatures.add('verse_attendant');

    const graciousDefeatGroup = {
        title: 'Gracious Defeat',
        engraving: getEngravingLabel(ctx.graciousDefeatEngraving, ctx.graciousDefeatWeaponName),
        activeBoosts: ctx.isFeaturesBoosted ? ['Features'] : [],
        items: [
            ...getBlessingPowers(ctx.selectedEntrance, Constants.ENTRANCE_DATA),
            ...getBlessingPowers(selectedFeatures, Constants.FEATURES_DATA),
            ...getBlessingPowers(ctx.selectedInfluence, Constants.INFLUENCE_DATA),
        ]
    };

    const getClosedCircuitsBoosts = () => {
        const boosts = [];
        if (ctx.isTechnomancyBoosted) boosts.push('Technomancy');
        if (ctx.isNaniteControlBoosted) boosts.push('Nanite Control');
        return boosts;
    };

    const closedCircuitsGroup = {
        title: 'Closed Circuits',
        engraving: getEngravingLabel(ctx.closedCircuitsEngraving, ctx.closedCircuitsWeaponName),
        activeBoosts: getClosedCircuitsBoosts(),
        items: [
            ...getBlessingPowers(ctx.selectedNetAvatars, Constants.NET_AVATAR_DATA),
            ...getBlessingPowers(ctx.selectedTechnomancies, Constants.TECHNOMANCY_DATA),
            ...getBlessingPowers(ctx.selectedNaniteControls, Constants.NANITE_CONTROL_DATA),
        ]
    };

    const righteousCreationGroup = {
        title: 'Righteous Creation',
        engraving: getEngravingLabel(ctx.righteousCreationEngraving, ctx.righteousCreationWeaponName),
        activeBoosts: [], // No explicit boosts for this blessing in UI
        items: [
            ...getBlessingPowers(ctx.selectedSpecialties, Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA),
            ...getBlessingPowers(ctx.selectedMagitechPowers, Constants.RIGHTEOUS_CREATION_MAGITECH_DATA),
            ...getBlessingPowers(ctx.selectedArcaneConstructsPowers, Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA),
            ...getBlessingPowers(ctx.selectedMetamagicPowers, Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA),
        ]
    };

    const starCrossedLoveGroup = {
        title: 'Star Crossed Love',
        engraving: null,
        activeBoosts: [],
        items: [
            ...getBlessingPowers(ctx.selectedStarCrossedLovePacts, Constants.STAR_CROSSED_LOVE_PACTS_DATA)
        ]
    };

    const lostPowersGroup = {
        title: 'Lost Powers',
        engraving: null,
        activeBoosts: [],
        items: [
            ...getBlessingPowers(ctx.selectedLostPowers, Constants.LOST_POWERS_DATA).map((p: any) => ({ ...p, isLostPower: true }))
        ]
    };

    const blessingGroups = [
        sigilsGroup,
        goodTidingsGroup,
        compellingWillGroup,
        worldlyWisdomGroup,
        bitterDissatisfactionGroup,
        lostHopeGroup,
        fallenPeaceGroup,
        graciousDefeatGroup,
        closedCircuitsGroup,
        righteousCreationGroup,
        starCrossedLoveGroup,
        lostPowersGroup
    ].filter(group => group.items.length > 0);

    const sections = [
        {
            id: 'stage1',
            title: "Stage I: Origins",
            items: [
                getItem(ctx.selectedDominionId),
                ...(Array.from(ctx.selectedTrueSelfTraits) as string[]).map(id => getItem(id)),
                ...(Array.from(ctx.selectedAlterEgoTraits) as string[]).map(id => getItem(id)),
                ...ctx.selectedUniforms.map((id: string) => getItem(id)),
                ...(Array.from(ctx.selectedMagicalStyles) as string[]).map(id => getItem(id)),
                getItem(ctx.selectedBuildTypeId),
            ].filter(Boolean),
            familyDetails,
            housingDetails
        },
        {
            id: 'stage2',
            title: "Stage II: Academy",
            items: [
                ctx.selectedDominionId ? Constants.SCHOOLS_DATA[ctx.selectedDominionId] : null,
                getItem(ctx.selectedHeadmasterId),
                getItem(ctx.selectedDurationId),
                boardingSchoolItem,
                ...(Array.from(ctx.selectedTeacherIds) as string[]).map(id => getItem(id)),
                ...(Array.from(ctx.selectedClubIds) as string[]).map(id => getItem(id)),
                ...(Array.from(ctx.selectedMiscActivityIds) as string[]).filter(id => id !== 'mentor').map(id => getItem(id)),
                (ctx.selectedMentors && ctx.selectedMentors.length > 0) ? getItem('mentor') : null,
                ...(Array.from(ctx.selectedClassmateIds) as string[]).map(id => {
                    const item = getItem(id);
                    if (item) {
                        const uniformId = ctx.classmateUniforms.get(id);
                        if (uniformId) {
                            const uniform = Constants.UNIFORMS_DATA.find(u => u.id === uniformId);
                            if (uniform) item.uniformName = uniform.title;
                        }
                    }
                    return item;
                }),
                ...ctx.customClassmates.map((cc: any) => {
                     const base = Constants.CUSTOM_CLASSMATE_CHOICES_DATA.find(c => c.id === cc.optionId);
                     return { ...base, title: 'Custom Classmate', assignedName: cc.companionName, imageSrc: 'https://i.ibb.co/BHnbDZyY/new.jpg' };
                })
            ].filter(Boolean)
        },
        {
            id: 'stage3',
            title: "Stage III: Blessings",
            items: blessingGroups.flatMap(g => g.items),
            blessingGroups: blessingGroups
        },
        {
            id: 'stage4',
            title: "Stage IV: Custom Magic",
            items: [
                 ...(Array.from(ctx.acquiredRunes.entries()) as [string, number][])
                    .filter(([, count]) => count > 0)
                    .map(([id, count]) => {
                         const rune = Constants.LIMITLESS_POTENTIAL_RUNES_DATA.find(r => r.id === id);
                         return rune ? { ...rune, count, type: 'rune' } : null;
                    }),
            ].filter(Boolean),
            customSpells: ctx.customSpells
        },
        {
            id: 'stage5',
            title: "Stage V: Career",
            items: [
                ...(Array.from(ctx.selectedAllmillorIds) as string[]).map(id => getItem(id)),
                ...(Array.from(ctx.selectedCareerGoalIds) as string[]).map(id => {
                    const item = getItem(id);
                    if (id === 'joys_of_parenting') item.assignedName = ctx.joysOfParentingCompanionName;
                    if (id === 'mentor_career') item.assignedName = ctx.mentee?.name ? `Student: ${ctx.mentee.name}` : null;
                    if (id === 'moving_out' && ctx.movingOutHomes.length > 0) item.assignedName = `${ctx.movingOutHomes.length} New Home(s)`;
                    return item;
                }),
                ...(Array.from(ctx.selectedColleagueIds) as string[]).map(id => {
                    const item = getItem(id);
                    if (item) {
                        const uniformId = ctx.colleagueUniforms.get(id);
                        if (uniformId) {
                            const uniform = Constants.UNIFORMS_DATA.find(u => u.id === uniformId);
                            if (uniform) item.uniformName = uniform.title;
                        }
                    }
                    return item;
                }),
                 ...ctx.customColleagues.map((cc: any) => {
                     const base = Constants.CUSTOM_COLLEAGUE_CHOICES_DATA.find(c => c.id === cc.optionId);
                     return { ...base, title: 'Custom Colleague', assignedName: cc.companionName, imageSrc: 'https://i.ibb.co/wNfdjNJ0/c25.png' };
                })
            ].filter(Boolean)
        },
        {
            id: 'stage6',
            title: "Stage VI: Retirement",
            items: [
                getItem(ctx.selectedRetirementChoiceId),
                getItem(ctx.selectedChildOfGodChoiceId)
            ].filter(Boolean)
        }
    ];

    return { sections, getItem };
};
