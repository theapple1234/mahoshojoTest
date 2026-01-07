import { useMemo } from 'react';
import * as Constants from '../constants';
import { ICharacterContext } from '../context/CharacterContextTypes';

export const useBuildSummaryData = (ctx: ICharacterContext) => {
    const allItems = useMemo(() => {
        const isKo = ctx.language === 'ko';
        
        // Helper to select data set
        const get = (en: any, ko: any) => isKo ? ko : en;

        // Spread localized data
        return [
            ...get(Constants.DOMINIONS, Constants.DOMINIONS_KO),
            ...get(Constants.TRAITS_DATA.positive, Constants.TRAITS_DATA_KO.positive),
            ...get(Constants.TRAITS_DATA.negative, Constants.TRAITS_DATA_KO.negative),
            ...get(Constants.HOUSES_DATA, Constants.HOUSES_DATA_KO),
            ...get(Constants.HOUSE_UPGRADES_DATA, Constants.HOUSE_UPGRADES_DATA_KO),
            ...get(Constants.TRUE_SELF_TRAITS, Constants.TRUE_SELF_TRAITS_KO),
            ...get(Constants.ALTER_EGO_TRAITS, Constants.ALTER_EGO_TRAITS_KO),
            ...get(Constants.UNIFORMS_DATA, Constants.UNIFORMS_DATA_KO),
            ...get(Constants.MAGICAL_STYLES_DATA, Constants.MAGICAL_STYLES_DATA_KO),
            ...get(Constants.BUILD_TYPES_DATA, Constants.BUILD_TYPES_DATA_KO),
            ...get(Constants.HEADMASTERS_DATA, Constants.HEADMASTERS_DATA_KO),
            ...get(Constants.TEACHERS_DATA, Constants.TEACHERS_DATA_KO),
            ...get(Constants.DURATION_DATA, Constants.DURATION_DATA_KO),
            ...get(Constants.CLUBS_DATA, Constants.CLUBS_DATA_KO),
            ...get(Constants.MISC_ACTIVITIES_DATA, Constants.MISC_ACTIVITIES_DATA_KO),
            ...get(Constants.CLASSMATES_DATA, Constants.CLASSMATES_DATA_KO).map((c: any) => ({...c, title: c.name})),
            ...get(Constants.ALLMILLOR_CHOICES_DATA, Constants.ALLMILLOR_CHOICES_DATA_KO),
            ...Object.values(get(Constants.CAREER_GOALS_DATA, Constants.CAREER_GOALS_DATA_KO)).flat() as any[],
            ...get(Constants.COLLEAGUES_DATA, Constants.COLLEAGUES_DATA_KO).map((c: any) => ({...c, title: c.name})),
            ...get(Constants.RETIREMENT_CHOICES_DATA, Constants.RETIREMENT_CHOICES_DATA_KO),
            ...get(Constants.CHILD_OF_GOD_DATA, Constants.CHILD_OF_GOD_DATA_KO),
            ...get(Constants.COMMON_SIGILS_DATA, Constants.COMMON_SIGILS_DATA_KO),
            ...get(Constants.SPECIAL_SIGILS_DATA, Constants.SPECIAL_SIGILS_DATA_KO).flatMap((s: any) => [s, ...(s.subOptions || [])]),
            
            // Powers & Abilities
            ...get(Constants.ESSENTIAL_BOONS_DATA, Constants.ESSENTIAL_BOONS_DATA_KO),
            ...get(Constants.MINOR_BOONS_DATA, Constants.MINOR_BOONS_DATA_KO),
            ...get(Constants.MAJOR_BOONS_DATA, Constants.MAJOR_BOONS_DATA_KO),
            ...get(Constants.TELEKINETICS_DATA, Constants.TELEKINETICS_DATA_KO),
            ...get(Constants.METATHERMICS_DATA, Constants.METATHERMICS_DATA_KO),
            ...get(Constants.ELEANORS_TECHNIQUES_DATA, Constants.ELEANORS_TECHNIQUES_DATA_KO),
            ...get(Constants.GENEVIEVES_TECHNIQUES_DATA, Constants.GENEVIEVES_TECHNIQUES_DATA_KO),
            ...get(Constants.BREWING_DATA, Constants.BREWING_DATA_KO),
            ...get(Constants.SOUL_ALCHEMY_DATA, Constants.SOUL_ALCHEMY_DATA_KO),
            ...get(Constants.TRANSFORMATION_DATA, Constants.TRANSFORMATION_DATA_KO),
            ...get(Constants.CHANNELLING_DATA, Constants.CHANNELLING_DATA_KO),
            ...get(Constants.NECROMANCY_DATA, Constants.NECROMANCY_DATA_KO),
            ...get(Constants.BLACK_MAGIC_DATA, Constants.BLACK_MAGIC_DATA_KO),
            ...get(Constants.TELEPATHY_DATA, Constants.TELEPATHY_DATA_KO),
            ...get(Constants.MENTAL_MANIPULATION_DATA, Constants.MENTAL_MANIPULATION_DATA_KO),
            ...get(Constants.ENTRANCE_DATA, Constants.ENTRANCE_DATA_KO),
            ...get(Constants.FEATURES_DATA, Constants.FEATURES_DATA_KO),
            ...get(Constants.INFLUENCE_DATA, Constants.INFLUENCE_DATA_KO),
            ...get(Constants.NET_AVATAR_DATA, Constants.NET_AVATAR_DATA_KO),
            ...get(Constants.TECHNOMANCY_DATA, Constants.TECHNOMANCY_DATA_KO),
            ...get(Constants.NANITE_CONTROL_DATA, Constants.NANITE_CONTROL_DATA_KO),
            ...get(Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA, Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA_KO),
            ...get(Constants.RIGHTEOUS_CREATION_MAGITECH_DATA, Constants.RIGHTEOUS_CREATION_MAGITECH_DATA_KO),
            ...get(Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA_KO),
            ...get(Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA, Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA_KO),
            ...get(Constants.STAR_CROSSED_LOVE_PACTS_DATA, Constants.STAR_CROSSED_LOVE_PACTS_DATA_KO),

            ...get(Constants.LIMITLESS_POTENTIAL_RUNES_DATA, Constants.LIMITLESS_POTENTIAL_RUNES_DATA_KO),
            ...get(Constants.LOST_POWERS_DATA, Constants.LOST_POWERS_DATA_KO)
        ];
    }, [ctx.language]);
    
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
        if (id === 'mansion') item.extraInfo = `+${ctx.mansionExtraSqFt * (ctx.language === 'ko' ? 28 : 1000)} ${ctx.language === 'ko' ? '평' : 'sq ft'}`;
        if (id === 'private_island') item.extraInfo = `+${ctx.islandExtraMiles} ${ctx.language === 'ko' ? '개' : 'sq miles'}`;
        
        // Mentors (from Page 2 Misc Activities)
        if (id === 'mentor') {
             // Look up localized names for premade mentors
             const mentorNames = ctx.selectedMentors.map((m: any) => {
                 if (m.type === 'premade') {
                     const found = allItems.find(item => item.id === m.id);
                     return found ? (found.title || found.name) : m.name;
                 }
                 return m.name;
             }).join(', ');

             if (mentorNames) item.assignedName = mentorNames;

             // Dynamic Cost Calculation for Summary
             const totalFp = ctx.selectedMentors.reduce((acc: number, m: any) => acc + (m.cost || 0), 0);
             const totalBp = totalFp / 2;
             if (totalFp > 0) {
                 item.cost = ctx.language === 'ko' 
                    ? `행운 점수 -${totalFp * 2}, 축복 점수 +${totalBp * 2}`
                    : `Costs -${totalFp * 2} FP, Grants +${totalBp * 2} BP`;
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
        if (ctx.isFeaturesBoosted && Constants.INFLUENCE_DATA.some(i => i.id === id)) return true;

        // Closed Circuits
        if (ctx.isTechnomancyBoosted && (Constants.TECHNOMANCY_DATA.some(i => i.id === id) || Constants.NET_AVATAR_DATA.some(i => i.id === id))) return true; 
        if (ctx.isNaniteControlBoosted && Constants.NANITE_CONTROL_DATA.some(i => i.id === id)) return true;

        return false;
    };

    const getBlessingPowers = (selectedIds: Set<string>, powerData: any[], isMagicianActive: boolean = false) => {
        return Array.from(selectedIds).map(id => {
            const baseItem = allItems.find(p => p.id === id); // Use localized allItems
            if (!baseItem) return null;
            const item = { ...baseItem } as any;
            
            // Check boost status
            if (isItemBoosted(id)) {
                item.isBoosted = true;
            }
            
            if (isMagicianActive) {
                item.isMagicianActive = true;
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
            if (id === 'lost_kronacks_deal') {
                if (ctx.language === 'ko') {
                    const koMap: Record<string, string> = {
                        telekinetics: '염력', metathermics: '메타열역학', eleanors_techniques: '엘레노어의 기술',
                        genevieves_techniques: '제네비브의 기술', brewing: '양조', soul_alchemy: '영혼 연금술',
                        transformation: '변신술', channelling: '혼령술', necromancy: '강령술', black_magic: '흑마법',
                        telepathy: '텔레파시', mental_manipulation: '정신 조작', features: '특성', influence: '영향',
                        technomancy: '기계마법', nanite_control: '나나이트 조종', magitech: '마법공학',
                        arcane_constructs: '비전 구조체', metamagic: '메타마법'
                    };
                    const label = ctx.lostKronackImmunity ? (koMap[ctx.lostKronackImmunity] || ctx.lostKronackImmunity) : '미선택';
                    item.assignedName = `면역: ${label}`;
                } else {
                    const label = ctx.lostKronackImmunity ? ctx.lostKronackImmunity.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'None';
                    item.assignedName = `Immunity: ${label}`;
                }
            }

            return item;
        }).filter(Boolean);
    };

    // Prepare Detailed Family Data
    const familyDetails = [
        ...Array.from({ length: ctx.numParents }).map((_, i) => {
            const id = `parent-${i}`;
            const traits = Array.from((ctx.assignedTraits.get(id) as Set<string>) || []).map(tid => {
                const t = allItems.find(tr => tr.id === tid); 
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
                title: ctx.language === 'ko' ? `부모님 ${i + 1}` : `Parent ${i + 1}`,
                type: 'Parent',
                imageSrc: ctx.familyMemberImages.get(id) || defaultParentImage,
                note: ctx.familyMemberNotes.get(id),
                traits
            };
        }),
        ...Array.from({ length: ctx.numSiblings }).map((_, i) => {
            const id = `sibling-${i}`;
            const traits = Array.from((ctx.assignedTraits.get(id) as Set<string>) || []).map(tid => {
                const t = allItems.find(tr => tr.id === tid);
                if (tid === 'blessed') {
                     const blessedName = ctx.blessedCompanions.get(id);
                     if (blessedName) return { ...t, assignedName: blessedName };
                }
                return t;
            }).filter(Boolean);

            return {
                id,
                title: ctx.language === 'ko' ? `형제 ${i + 1}` : `Sibling ${i + 1}`,
                type: 'Sibling',
                imageSrc: ctx.familyMemberImages.get(id) || 'https://i.ibb.co/m58qFCRf/sib1.png',
                note: ctx.familyMemberNotes.get(id),
                traits
            };
        })
    ];

    // Prepare Detailed Housing Data
    const mainDominion = allItems.find(d => d.id === ctx.selectedDominionId);
    const mainHouse = allItems.find(h => h.id === ctx.selectedHouseId);
    
    const housingDetails = [];
    
    // Main House
    if (mainHouse) {
        housingDetails.push({
            id: 'main-house',
            title: ctx.language === 'ko' ? '본가' : 'Primary Residence',
            dominion: mainDominion?.title || 'Unknown',
            type: mainHouse.title,
            imageSrc: mainHouse.imageSrc,
            upgrades: Array.from(ctx.selectedUpgrades as Set<string>).map(uid => getItem(uid)),
            stats: ctx.selectedHouseId === 'mansion' ? `+${ctx.mansionExtraSqFt * (ctx.language === 'ko' ? 28 : 1000)} ${ctx.language === 'ko' ? '평' : 'sq ft'}` : null,
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
        const dom = allItems.find(d => d.id === home.dominionId);
        const house = allItems.find(h => h.id === home.houseId);
        const upgrades = Array.from(home.upgradeIds as Set<string>).map((uid: string) => getItem(uid));
        
        let stats = null;
        if (home.houseId === 'mansion') stats = `+${home.mansionExtraSqFt * (ctx.language === 'ko' ? 28 : 1000)} ${ctx.language === 'ko' ? '평' : 'sq ft'}`;
        
        let title = home.name || (ctx.language === 'ko' ? `휴가지 #${idx + 1}` : `Vacation Home #${idx + 1}`);
        if (inheritedVacationHomeIds.has(home.id)) {
            title += ctx.language === 'ko' ? ' (상속됨)' : ' (Inherited)';
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
            if (home.isInherited) return;
            if (!home.houseId) return;

            const house = allItems.find(h => h.id === home.houseId);
            const upgrades = Array.from(home.upgradeIds as Set<string>).map((uid: string) => getItem(uid));
            const dom = allItems.find(d => d.id === home.dominionId);
            
            let title = ctx.language === 'ko' ? `분가 #${idx + 1}` : `Moving Out Home #${idx + 1}`;
            
            housingDetails.push({
                id: home.id,
                title: title,
                dominion: dom?.title || (ctx.language === 'ko' ? '새 거주지' : 'New Residence'),
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
        title: ctx.language === 'ko' ? '기숙사 생활' : 'BOARDING SCHOOL',
        imageSrc: 'https://i.ibb.co/B2VMLm0N/boarding.jpg',
        description: ctx.language === 'ko' ? '기숙사에 거주합니다.' : 'Living in the dorms.'
    } : null;

    // --- GROUP BLESSINGS FOR LIST LAYOUTS ---
    
    const getEngravingLabel = (engravingId: string | null, weaponName: string | null) => {
        const id = engravingId ?? ctx.selectedBlessingEngraving;
        if (!id) return null;
        if (id === 'weapon') return (ctx.language === 'ko' ? `무기: ${weaponName || '미할당'}` : `Weapon: ${weaponName || 'Unassigned'}`);
        if (id === 'skin') return (ctx.language === 'ko' ? '피부' : 'Skin');
        if (id === 'clothes') return (ctx.language === 'ko' ? '의복' : 'Clothes');
        return id.charAt(0).toUpperCase() + id.slice(1);
    };

    const sigilsGroup = {
        title: ctx.language === 'ko' ? '표식 & 계약' : 'Sigils & Contracts',
        engraving: null,
        activeBoosts: [],
        isMagicianActive: false,
        items: [
             ...(['kaarn', 'purth', 'juathas', 'xuth', 'lekolu', 'sinthru'] as const).map(id => {
                const count = ctx.totalSigilCounts[id];
                if (count <= 0) return null;
                const sigil = allItems.find(s => s.id === id);
                return sigil ? { ...sigil, count, type: 'sigil' } : null;
             }),
        ].filter(Boolean)
    };

    const getGoodTidingsBoosts = () => {
        const boosts = [];
        if (ctx.isEssentialBoosted) boosts.push(ctx.language === 'ko' ? '필수' : 'Essential');
        if (ctx.isMinorBoosted) boosts.push(ctx.language === 'ko' ? '하위' : 'Minor');
        if (ctx.isMajorBoosted) boosts.push(ctx.language === 'ko' ? '상위' : 'Major');
        return boosts;
    };

    const goodTidingsGroup = {
        title: ctx.language === 'ko' ? '길조의 축복' : 'Good Tidings',
        engraving: getEngravingLabel(ctx.goodTidingsEngraving, ctx.goodTidingsWeaponName),
        activeBoosts: getGoodTidingsBoosts(),
        isMagicianActive: ctx.isGoodTidingsMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedEssentialBoons, [], ctx.isGoodTidingsMagicianApplied),
            ...getBlessingPowers(ctx.selectedMinorBoons, [], ctx.isGoodTidingsMagicianApplied),
            ...getBlessingPowers(ctx.selectedMajorBoons, [], ctx.isGoodTidingsMagicianApplied),
        ]
    };

    const getCompellingWillBoosts = () => {
        const boosts = [];
        if (ctx.isTelekineticsBoosted) boosts.push(ctx.language === 'ko' ? '염력' : 'Telekinetics');
        if (ctx.isMetathermicsBoosted) boosts.push(ctx.language === 'ko' ? '메타열역학' : 'Metathermics');
        return boosts;
    };

    const compellingWillGroup = {
        title: ctx.language === 'ko' ? '강렬한 의지의 축복' : 'Compelling Will',
        engraving: getEngravingLabel(ctx.compellingWillEngraving, ctx.compellingWillWeaponName),
        activeBoosts: getCompellingWillBoosts(),
        isMagicianActive: ctx.isCompellingWillMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedTelekinetics, [], ctx.isCompellingWillMagicianApplied),
            ...getBlessingPowers(ctx.selectedMetathermics, [], ctx.isCompellingWillMagicianApplied),
        ]
    };

    const getWorldlyWisdomBoosts = () => {
        const boosts = [];
        if (ctx.isEleanorsTechniquesBoosted) boosts.push(ctx.language === 'ko' ? "엘레노어" : "Eleanor's");
        if (ctx.isGenevievesTechniquesBoosted) boosts.push(ctx.language === 'ko' ? "제네비브" : "Genevieve's");
        return boosts;
    };

    const worldlyWisdomGroup = {
        title: ctx.language === 'ko' ? '경험과 지혜의 축복' : 'Worldly Wisdom',
        engraving: getEngravingLabel(ctx.worldlyWisdomEngraving, ctx.worldlyWisdomWeaponName),
        activeBoosts: getWorldlyWisdomBoosts(),
        isMagicianActive: ctx.isWorldlyWisdomMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedEleanorsTechniques, [], ctx.isWorldlyWisdomMagicianApplied),
            ...getBlessingPowers(ctx.selectedGenevievesTechniques, [], ctx.isWorldlyWisdomMagicianApplied),
        ]
    };

    const getBitterDissatisfactionBoosts = () => {
        const boosts = [];
        if (ctx.isBrewingBoosted) boosts.push(ctx.language === 'ko' ? '양조' : 'Brewing');
        if (ctx.isSoulAlchemyBoosted) boosts.push(ctx.language === 'ko' ? '영혼 연금술' : 'Soul Alchemy');
        if (ctx.isTransformationBoosted) boosts.push(ctx.language === 'ko' ? '변신술' : 'Transformation');
        return boosts;
    };

    const bitterDissatisfactionGroup = {
        title: ctx.language === 'ko' ? '씁쓸한 불만족의 축복' : 'Bitter Dissatisfaction',
        engraving: getEngravingLabel(ctx.bitterDissatisfactionEngraving, ctx.bitterDissatisfactionWeaponName),
        activeBoosts: getBitterDissatisfactionBoosts(),
        isMagicianActive: ctx.isBitterDissatisfactionMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedBrewing, [], ctx.isBitterDissatisfactionMagicianApplied),
            ...getBlessingPowers(ctx.selectedSoulAlchemy, [], ctx.isBitterDissatisfactionMagicianApplied),
            ...getBlessingPowers(ctx.selectedTransformation, [], ctx.isBitterDissatisfactionMagicianApplied),
        ]
    };

    const getLostHopeBoosts = () => {
        const boosts = [];
        if (ctx.isChannellingBoosted) boosts.push(ctx.language === 'ko' ? '혼령술' : 'Channelling');
        if (ctx.isNecromancyBoosted) boosts.push(ctx.language === 'ko' ? '강령술' : 'Necromancy');
        if (ctx.blackMagicBoostSigil) boosts.push(ctx.language === 'ko' ? '흑마법' : 'Black Magic');
        return boosts;
    };

    const lostHopeGroup = {
        title: ctx.language === 'ko' ? '잃어버린 희망의 축복' : 'Lost Hope',
        engraving: getEngravingLabel(ctx.lostHopeEngraving, ctx.lostHopeWeaponName),
        activeBoosts: getLostHopeBoosts(),
        isMagicianActive: ctx.isLostHopeMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedChannelling, [], ctx.isLostHopeMagicianApplied),
            ...getBlessingPowers(ctx.selectedNecromancy, [], ctx.isLostHopeMagicianApplied),
            ...getBlessingPowers(ctx.selectedBlackMagic, [], ctx.isLostHopeMagicianApplied),
        ]
    };

    const getFallenPeaceBoosts = () => {
        const boosts = [];
        if (ctx.isTelepathyBoosted) boosts.push(ctx.language === 'ko' ? '텔레파시' : 'Telepathy');
        if (ctx.isMentalManipulationBoosted) boosts.push(ctx.language === 'ko' ? '정신 조작' : 'Mental Manip.');
        return boosts;
    };

    const fallenPeaceGroup = {
        title: ctx.language === 'ko' ? '무너진 평화의 축복' : 'Fallen Peace',
        engraving: getEngravingLabel(ctx.fallenPeaceEngraving, ctx.fallenPeaceWeaponName),
        activeBoosts: getFallenPeaceBoosts(),
        isMagicianActive: ctx.isFallenPeaceMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedTelepathy, [], ctx.isFallenPeaceMagicianApplied),
            ...getBlessingPowers(ctx.selectedMentalManipulation, [], ctx.isFallenPeaceMagicianApplied),
        ]
    };

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
        title: ctx.language === 'ko' ? '품위있는 패배의 축복' : 'Gracious Defeat',
        engraving: getEngravingLabel(ctx.graciousDefeatEngraving, ctx.graciousDefeatWeaponName),
        activeBoosts: ctx.isFeaturesBoosted ? [ctx.language === 'ko' ? '특성' : 'Features'] : [],
        isMagicianActive: ctx.isGraciousDefeatMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedEntrance, [], ctx.isGraciousDefeatMagicianApplied),
            ...getBlessingPowers(selectedFeatures, [], ctx.isGraciousDefeatMagicianApplied),
            ...getBlessingPowers(ctx.selectedInfluence, [], ctx.isGraciousDefeatMagicianApplied),
        ]
    };

    const getClosedCircuitsBoosts = () => {
        const boosts = [];
        if (ctx.isTechnomancyBoosted) boosts.push(ctx.language === 'ko' ? '기계마법' : 'Technomancy');
        if (ctx.isNaniteControlBoosted) boosts.push(ctx.language === 'ko' ? '나나이트 조종' : 'Nanite Control');
        return boosts;
    };

    const closedCircuitsGroup = {
        title: ctx.language === 'ko' ? '폐쇄회로의 축복' : 'Closed Circuits',
        engraving: getEngravingLabel(ctx.closedCircuitsEngraving, ctx.closedCircuitsWeaponName),
        activeBoosts: getClosedCircuitsBoosts(),
        isMagicianActive: ctx.isClosedCircuitsMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedNetAvatars, [], ctx.isClosedCircuitsMagicianApplied),
            ...getBlessingPowers(ctx.selectedTechnomancies, [], ctx.isClosedCircuitsMagicianApplied),
            ...getBlessingPowers(ctx.selectedNaniteControls, [], ctx.isClosedCircuitsMagicianApplied),
        ]
    };

    const righteousCreationGroup = {
        title: ctx.language === 'ko' ? '정당한 창조의 축복' : 'Righteous Creation',
        engraving: getEngravingLabel(ctx.righteousCreationEngraving, ctx.righteousCreationWeaponName),
        activeBoosts: [], 
        isMagicianActive: ctx.isRighteousCreationMagicianApplied,
        items: [
            ...getBlessingPowers(ctx.selectedSpecialties, [], ctx.isRighteousCreationMagicianApplied),
            ...getBlessingPowers(ctx.selectedMagitechPowers, [], ctx.isRighteousCreationMagicianApplied),
            ...getBlessingPowers(ctx.selectedArcaneConstructsPowers, [], ctx.isRighteousCreationMagicianApplied),
            ...getBlessingPowers(ctx.selectedMetamagicPowers, [], ctx.isRighteousCreationMagicianApplied),
        ]
    };

    const starCrossedLoveGroup = {
        title: ctx.language === 'ko' ? '불행한 사랑의 축복' : 'Star Crossed Love',
        engraving: null,
        activeBoosts: [],
        isMagicianActive: false,
        items: [
            ...getBlessingPowers(ctx.selectedStarCrossedLovePacts, [])
        ]
    };

    const lostPowersGroup = {
        title: ctx.language === 'ko' ? '잃어버린 힘' : 'Lost Powers',
        engraving: null,
        activeBoosts: [],
        isMagicianActive: false,
        items: [
            ...getBlessingPowers(ctx.selectedLostPowers, []).map((p: any) => ({ ...p, isLostPower: true }))
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
            title: ctx.language === 'ko' ? "1단계: 기원" : "Stage I: Origins",
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
            title: ctx.language === 'ko' ? "2단계: 학교" : "Stage II: Academy",
            items: [
                ctx.selectedDominionId ? (ctx.language === 'ko' ? Constants.SCHOOLS_DATA_KO[ctx.selectedDominionId] : Constants.SCHOOLS_DATA[ctx.selectedDominionId]) : null,
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
                            const uniform = (ctx.language === 'ko' ? Constants.UNIFORMS_DATA_KO : Constants.UNIFORMS_DATA).find(u => u.id === uniformId);
                            if (uniform) item.uniformName = uniform.title;
                        }
                    }
                    return item;
                }),
                ...ctx.customClassmates.map((cc: any) => {
                     const base = (ctx.language === 'ko' ? Constants.CUSTOM_CLASSMATE_CHOICES_DATA_KO : Constants.CUSTOM_CLASSMATE_CHOICES_DATA).find(c => c.id === cc.optionId);
                     return { ...base, title: ctx.language === 'ko' ? '커스텀 클래스메이트' : 'Custom Classmate', assignedName: cc.companionName, imageSrc: 'https://i.ibb.co/BHnbDZyY/new.jpg' };
                })
            ].filter(Boolean)
        },
        {
            id: 'stage3',
            title: ctx.language === 'ko' ? "3단계: 축복" : "Stage III: Blessings",
            items: blessingGroups.flatMap(g => g.items),
            blessingGroups: blessingGroups
        },
        {
            id: 'stage4',
            title: ctx.language === 'ko' ? "4단계: 커스텀 마법" : "Stage IV: Custom Magic",
            items: [
                 ...(Array.from(ctx.acquiredRunes.entries()) as [string, number][])
                    .filter(([, count]) => count > 0)
                    .map(([id, count]) => {
                         const runesData = ctx.language === 'ko' ? Constants.LIMITLESS_POTENTIAL_RUNES_DATA_KO : Constants.LIMITLESS_POTENTIAL_RUNES_DATA;
                         const rune = runesData.find(r => r.id === id);
                         return rune ? { ...rune, count, type: 'rune' } : null;
                    }),
            ].filter(Boolean),
            customSpells: ctx.customSpells
        },
        {
            id: 'stage5',
            title: ctx.language === 'ko' ? "5단계: 진로" : "Stage V: Career",
            items: [
                ...(Array.from(ctx.selectedAllmillorIds) as string[]).map(id => getItem(id)),
                ...(Array.from(ctx.selectedCareerGoalIds) as string[]).map(id => {
                    const item = getItem(id);
                    if (id === 'joys_of_parenting') item.assignedName = ctx.joysOfParentingCompanionName;
                    if (id === 'mentor_career') {
                        // Look up localized mentee name
                        let menteeName = ctx.mentee?.name;
                        if (ctx.mentee?.type === 'classmate') {
                            const found = allItems.find(item => item.id === ctx.mentee.id);
                            if (found) menteeName = found.title || found.name;
                        }
                        item.assignedName = menteeName ? `${ctx.language === 'ko' ? '제자' : 'Student'}: ${menteeName}` : null;
                    }
                    if (id === 'moving_out' && ctx.movingOutHomes.length > 0) item.assignedName = `${ctx.movingOutHomes.length} ${ctx.language === 'ko' ? '채의 새 집' : 'New Home(s)'}`;
                    return item;
                }),
                ...(Array.from(ctx.selectedColleagueIds) as string[]).map(id => {
                    const item = getItem(id);
                    if (item) {
                        const uniformId = ctx.colleagueUniforms.get(id);
                        if (uniformId) {
                            const uniform = (ctx.language === 'ko' ? Constants.UNIFORMS_DATA_KO : Constants.UNIFORMS_DATA).find(u => u.id === uniformId);
                            if (uniform) item.uniformName = uniform.title;
                        }
                    }
                    return item;
                }),
                 ...ctx.customColleagues.map((cc: any) => {
                     const base = (ctx.language === 'ko' ? Constants.CUSTOM_COLLEAGUE_CHOICES_DATA_KO : Constants.CUSTOM_COLLEAGUE_CHOICES_DATA).find(c => c.id === cc.optionId);
                     return { ...base, title: ctx.language === 'ko' ? '커스텀 동료' : 'Custom Colleague', assignedName: cc.companionName, imageSrc: 'https://i.ibb.co/wNfdjNJ0/c25.png' };
                })
            ].filter(Boolean)
        },
        {
            id: 'stage6',
            title: ctx.language === 'ko' ? "6단계: 은퇴" : "Stage VI: Retirement",
            items: [
                getItem(ctx.selectedRetirementChoiceId),
                getItem(ctx.selectedChildOfGodChoiceId)
            ].filter(Boolean)
        }
    ];

    return { sections, getItem };
};
