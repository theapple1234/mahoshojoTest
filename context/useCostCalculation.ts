
import { useMemo } from 'react';
import { 
    PARENT_COST_MAP, SIBLING_COST_PER, parseCost, SIGIL_BP_COSTS
} from './utils';
import * as Constants from '../constants';
import { PageOneState, PageTwoState, PageThreeState, PageFourState, PageFiveState, PageSixState } from './CharacterContextTypes';

interface UseCostCalculationProps {
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
    isSandboxMode: boolean;
}

export const useCostCalculation = ({
    selectedDominionId,
    pageOneState,
    pageTwoState,
    pageThreeState,
    pageFourState,
    pageFiveState,
    pageSixState,
    kpPaidNodes,
    miscFpCosts,
    selectedLostBlessingNodes,
    buildsRefreshTrigger,
    isSandboxMode
}: UseCostCalculationProps) => {

    return useMemo(() => {
        let fpGained = 0;
        let fpSpent = 0;
        let bpGained = 0;
        let bpSpent = 0;
        let kpGained = 0;
        let kpSpent = 0;

        // Helpers
        const addFp = (amount: number) => { if (amount > 0) fpGained += amount; else fpSpent += Math.abs(amount); };
        const addBp = (amount: number) => { if (amount > 0) bpGained += amount; else bpSpent += Math.abs(amount); };
        const addKp = (amount: number) => { if (amount > 0) kpGained += amount; else kpSpent += Math.abs(amount); };

        const processCost = (costStr: string | undefined) => {
            if (!costStr) return;
            const { fp, bp } = parseCost(costStr);
            // parseCost returns positive for costs (if "Costs ...") and negative for grants (if "Grants ...")
            // utils.ts parseCost logic: 
            // - Grants return negative values
            // - Costs return positive values
            
            if (fp < 0) fpGained += Math.abs(fp);
            else fpSpent += fp;

            if (bp < 0) bpGained += Math.abs(bp);
            else bpSpent += bp;
        };

        // --- PAGE 1 ---
        // Parents
        const parentCost = PARENT_COST_MAP[pageOneState.numParents] ?? 0;
        if (parentCost < 0) fpGained += Math.abs(parentCost); else fpSpent += parentCost;

        // Siblings
        const siblingCost = pageOneState.numSiblings * SIBLING_COST_PER;
        fpSpent += siblingCost;

        // Traits (Family)
        pageOneState.assignedTraits.forEach(traits => {
            traits.forEach(tId => {
                const t = [...Constants.TRAITS_DATA.positive, ...Constants.TRAITS_DATA.negative].find(i => i.id === tId);
                processCost(t?.cost);
            });
        });

        // House
        const house = Constants.HOUSES_DATA.find(h => h.id === pageOneState.selectedHouseId);
        processCost(house?.cost);
        
        // House Upgrades
        pageOneState.selectedUpgrades.forEach(uId => {
            const u = Constants.HOUSE_UPGRADES_DATA.find(i => i.id === uId);
            if (u) {
                // Special handling for VR Chamber cost type
                if (uId === 'virtual_reality' && pageOneState.vrChamberCostType) {
                    if (pageOneState.vrChamberCostType === 'fp') fpSpent += 5;
                    else bpSpent += 2;
                } else {
                    processCost(u.cost);
                }
            }
        });

        // Extra House Costs
        if (pageOneState.selectedHouseId === 'mansion') {
            fpSpent += pageOneState.mansionExtraSqFt; // 1 FP per 1000 sq ft (counter is raw count)
        }
        if (pageOneState.selectedUpgrades.has('private_island')) {
            fpSpent += pageOneState.islandExtraMiles; // 1 FP per extra mile
        }

        // Vacation Homes
        pageOneState.vacationHomes.forEach(home => {
             // Base cost for extra homes (first one if Moving Out might be free but that's P5 logic)
             // Vacation homes in P1 cost 3 FP each
             fpSpent += 3;

             // House type cost
             const h = Constants.HOUSES_DATA.find(i => i.id === home.houseId);
             processCost(h?.cost);

             // Upgrades
             home.upgradeIds.forEach(uId => {
                const u = Constants.HOUSE_UPGRADES_DATA.find(i => i.id === uId);
                 if (u) {
                    if (uId === 'virtual_reality' && home.vrChamberCostType) {
                        if (home.vrChamberCostType === 'fp') fpSpent += 5;
                        else bpSpent += 2;
                    } else {
                        processCost(u.cost);
                    }
                }
             });

             if (home.houseId === 'mansion') fpSpent += home.mansionExtraSqFt;
             if (home.upgradeIds.has('private_island')) fpSpent += home.islandExtraMiles;
        });

        // True Self & Alter Ego
        pageOneState.selectedTrueSelfTraits.forEach(tId => processCost(Constants.TRUE_SELF_TRAITS.find(i => i.id === tId)?.cost));
        pageOneState.selectedAlterEgoTraits.forEach(tId => processCost(Constants.ALTER_EGO_TRAITS.find(i => i.id === tId)?.cost));
        
        // Uniforms (First free)
        if (pageOneState.selectedUniforms.length > 1) {
            fpSpent += (pageOneState.selectedUniforms.length - 1);
        }

        // Magical Styles
        pageOneState.selectedMagicalStyles.forEach(sId => processCost(Constants.MAGICAL_STYLES_DATA.find(i => i.id === sId)?.cost));

        // --- PAGE 2 ---
        
        // Headmaster (Always calculate)
        processCost(Constants.HEADMASTERS_DATA.find(i => i.id === pageTwoState.selectedHeadmasterId)?.cost);
        
        // Teachers (Always calculate)
        pageTwoState.selectedTeacherIds.forEach(tId => processCost(Constants.TEACHERS_DATA.find(i => i.id === tId)?.cost));
        
        // Duration (Always calculate)
        processCost(Constants.DURATION_DATA.find(i => i.id === pageTwoState.selectedDurationId)?.cost);
        
        // Clubs (Always calculate)
        pageTwoState.selectedClubIds.forEach(cId => processCost(Constants.CLUBS_DATA.find(i => i.id === cId)?.cost));
        
        // Misc Activities (Always calculate)
        pageTwoState.selectedMiscActivityIds.forEach(aId => {
            if (aId !== 'mentor') processCost(Constants.MISC_ACTIVITIES_DATA.find(i => i.id === aId)?.cost);
        });
        
        // Classmates - Restricted to Single Player
        if (!pageOneState.isMultiplayer) {
            pageTwoState.selectedClassmateIds.forEach(cId => {
                const cm = Constants.CLASSMATES_DATA.find(i => i.id === cId);
                if (cm) {
                    let { fp, bp } = parseCost(cm.cost);
                    // Refund logic for same dominion
                    const dom = Constants.DOMINIONS.find(d => d.id === selectedDominionId);
                    if (dom && cm.birthplace.toUpperCase() === dom.title.toUpperCase()) {
                        fp = Math.max(0, fp - 2);
                    }
                    fpSpent += fp;
                    bpSpent += bp;
                }
            });
        }
        
        // Boarding School
        if (pageTwoState.isBoardingSchool && pageOneState.selectedHouseId === 'ragamuffin') {
            fpSpent += 8;
        }

        // Custom Classmates
        pageTwoState.customClassmates.forEach(cc => {
             const opt = Constants.CUSTOM_CLASSMATE_CHOICES_DATA.find(c => c.id === cc.optionId);
             processCost(opt?.cost);
        });

        // Mentors (Page 2 & 5 hybrid logic)
        // If mentor selected here or P5, calculate cost.
        // We use P2 selectedMentors as source of truth.
        pageTwoState.selectedMentors.forEach(mentor => {
             const cost = mentor.cost; // Base FP cost
             fpSpent += (cost * 2);
             bpGained += cost;
        });

        // --- PAGE 3 ---
        // Common Sigils
        const kaarnCount = pageThreeState.acquiredCommonSigils.get('kaarn') ?? 0;
        const purthCount = pageThreeState.acquiredCommonSigils.get('purth') ?? 0;
        const juathasCount = pageThreeState.acquiredCommonSigils.get('juathas') ?? 0;
        const sinthruCount = pageThreeState.acquiredCommonSigils.get('sinthru') ?? 0; // If bought directly

        bpSpent += kaarnCount * SIGIL_BP_COSTS.kaarn;
        bpSpent += purthCount * SIGIL_BP_COSTS.purth;
        bpSpent += juathasCount * SIGIL_BP_COSTS.juathas;
        
        if (!pageThreeState.selectedStarCrossedLovePacts.has('sinthrus_contract')) {
            // Sinthru cost: Depends on Dominion (Shinar = 8, others = 10)
            const sinthruCost = selectedDominionId === 'shinar' ? 8 : 10;
            // Count purchased ones + Lost Blessing usage
            // The context handles `acquiredCommonSigils` for purchased ones.
            // Lost Blessing usage is handled by `selectedLostBlessingNodes` but those are 1 sinthru cost each.
            // If contract is NOT active, we pay BP for purchased Sinthru sigils
            bpSpent += sinthruCount * sinthruCost;
        }
        
        // Special Sigils: Xuth
        const xuthTrials = pageThreeState.selectedSpecialSigilChoices.get('xuth')?.size ?? 0;
        const xuthCost = selectedDominionId === 'valsereth' ? 9 : 12;
        let xuthBp = xuthTrials * xuthCost;
        
        // Jade Emperor Refund logic
        if (pageThreeState.selectedStarCrossedLovePacts.has('jade_emperors_challenge')) {
            if (xuthTrials >= 1) xuthBp -= (xuthCost / 2); // Refund half of one
        }
        // Jade Emperor Extra Buy
        if (pageThreeState.jadeEmperorExtraXuthPurchased) {
            xuthBp += xuthCost;
        }
        // Cheissilith's Bargain: Double Xuth/Purth price
        if (pageThreeState.selectedStarCrossedLovePacts.has('cheissiliths_bargain')) {
            xuthBp *= 2;
            // Double purth cost too (subtracted before, add again)
            bpSpent += purthCount * SIGIL_BP_COSTS.purth; 
        }
        bpSpent += xuthBp;

        // Special Sigils: Lekolu
        let lekoluTotal = 0;
        for (const count of pageThreeState.acquiredLekoluJobs.values()) {
            lekoluTotal += count;
        }
        bpSpent += lekoluTotal * 4;
        fpSpent += lekoluTotal * 6;

        // Special Sigils: Sinthru (Favors)
        // Only if contract is NOT active. If active, Favors are free (but Prereqs might not be).
        // Wait, Favors give Sigils. 
        // The cost is: "Costs -10 BP per favor" to GET the sigil.
        if (!pageThreeState.selectedStarCrossedLovePacts.has('sinthrus_contract')) {
             const sinthruFavors = pageThreeState.selectedSpecialSigilChoices.get('sinthru')?.size ?? 0;
             bpSpent += sinthruFavors * 10;
        }

        // Star Crossed Love Pacts (Costs/Grants from description not explicit usually, but handled here if needed)
        // Evoghos Vow: -50 FP, +50 BP
        if (pageThreeState.selectedStarCrossedLovePacts.has('evoghos_vow')) {
            fpSpent += 50;
            bpGained += 50;
        }
        // Kuri-Odan: -50 BP, +100 KP
        if (pageThreeState.selectedStarCrossedLovePacts.has('kuri_odans_charm')) {
            bpSpent += 50;
            kpGained += 100;
        }

        // KP Usage Calculation
        // Iterate paid nodes and deduct their BP cost, add to KP spent
        kpPaidNodes.forEach((sigilType) => {
            const cost = SIGIL_BP_COSTS[sigilType] || 0;
            let finalCost = cost;
            // Adjust for specific cost modifiers (e.g. Dominion perks, Cheissilith)
            if (sigilType === 'xuth') {
                finalCost = selectedDominionId === 'valsereth' ? 9 : 12;
            }
            if (pageThreeState.selectedStarCrossedLovePacts.has('cheissiliths_bargain')) {
                if (sigilType === 'purth' || sigilType === 'xuth') finalCost *= 2;
                if (sigilType === 'juathas') finalCost = 0;
            }
            
            bpSpent -= finalCost;
            kpSpent += finalCost;
        });
        
        // Dominion Perks (Discounts)
        
        // Halidew: Juathas -2 BP for Margra (Closed Circuits, Righteous Creation, Star Crossed Love)
        if (selectedDominionId === 'halidew') {
            const margraClosedCircuits = Array.from(pageThreeState.selectedClosedCircuitsSigils).filter(id => {
                const s = Constants.CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('juathas');
            });
            const margraRighteousCreation = Array.from(pageThreeState.selectedRighteousCreationSigils).filter(id => {
                const s = Constants.RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('juathas');
            });
            const margraStarCrossedLove = Array.from(pageThreeState.selectedStarCrossedLoveSigils).filter(id => {
                const s = Constants.STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('juathas');
            });
            
            bpSpent -= (margraClosedCircuits.length * 2);
            bpSpent -= (margraRighteousCreation.length * 2);
            bpSpent -= (margraStarCrossedLove.length * 2);
        }

        // Shinar: Sinthru -2 BP (Lost Hope)
        if (selectedDominionId === 'shinar') {
            const shinarNodes = Array.from(pageThreeState.selectedLostHopeSigils).filter(id => {
                const s = Constants.LOST_HOPE_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('sinthru');
            });
            bpSpent -= (shinarNodes.length * 2);
        }

        // Unterseeisch: Juathas -2 BP for Fidelia (Lost Hope, Fallen Peace, Gracious Defeat)
        if (selectedDominionId === 'unterseeisch') {
            const fideliaLostHope = Array.from(pageThreeState.selectedLostHopeSigils).filter(id => {
                const s = Constants.LOST_HOPE_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('juathas');
            });
            const fideliaFallenPeace = Array.from(pageThreeState.selectedFallenPeaceSigils).filter(id => {
                const s = Constants.FALLEN_PEACE_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('juathas');
            });
            const fideliaGraciousDefeat = Array.from(pageThreeState.selectedGraciousDefeatSigils).filter(id => {
                const s = Constants.GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('juathas');
            });

            bpSpent -= (fideliaLostHope.length * 2);
            bpSpent -= (fideliaFallenPeace.length * 2);
            bpSpent -= (fideliaGraciousDefeat.length * 2);
        }

        // Valsereth: Xuth -3 BP (Any) -> Already handled in Xuth base cost logic above (9 instead of 12)
        
        // Gohwood: Juathas -2 BP for Arabella (Compelling Will, Worldly Wisdom)
        // Note: Good Tidings has no Juathas nodes (0 cost root).
        if (selectedDominionId === 'gohwood') {
             const arabellaCompelling = Array.from(pageThreeState.selectedCompellingWillSigils).filter(id => {
                const s = Constants.COMPELLING_WILL_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('juathas');
            });
            const arabellaWorldly = Array.from(pageThreeState.selectedWorldlyWisdomSigils).filter(id => {
                const s = Constants.WORLDLY_WISDOM_SIGIL_TREE_DATA.find(n => n.id === id);
                return s?.imageSrc.includes('juathas');
            });

            bpSpent -= (arabellaCompelling.length * 2);
            bpSpent -= (arabellaWorldly.length * 2);
        }

        // Palisade: Lekolu -2 BP (Any)
        if (selectedDominionId === 'palisade') {
            bpSpent -= (lekoluTotal * 2);
        }
        // Rovines: Juathas -1 BP (Any)
        if (selectedDominionId === 'rovines') {
             // Need to count ALL Juathas nodes selected across all trees
             const allJuathas = [
                 pageThreeState.selectedGoodTidingsTier ? 1 : 0, // Fireborn is Juathas
                 ...Array.from(pageThreeState.selectedCompellingWillSigils).filter(id => Constants.COMPELLING_WILL_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
                 ...Array.from(pageThreeState.selectedWorldlyWisdomSigils).filter(id => Constants.WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
                 ...Array.from(pageThreeState.selectedBitterDissatisfactionSigils).filter(id => Constants.BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
                 ...Array.from(pageThreeState.selectedLostHopeSigils).filter(id => Constants.LOST_HOPE_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
                 ...Array.from(pageThreeState.selectedFallenPeaceSigils).filter(id => Constants.FALLEN_PEACE_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
                 ...Array.from(pageThreeState.selectedGraciousDefeatSigils).filter(id => Constants.GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
                 ...Array.from(pageThreeState.selectedClosedCircuitsSigils).filter(id => Constants.CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
                 ...Array.from(pageThreeState.selectedRighteousCreationSigils).filter(id => Constants.RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
                 ...Array.from(pageThreeState.selectedStarCrossedLoveSigils).filter(id => Constants.STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s=>s.id===id)?.imageSrc.includes('juathas')),
             ].length;
             bpSpent -= allJuathas;
        }
        // Jipangu: -1 BP/KP for Drysdea (Custom Magic / Page 4 only)
        if (selectedDominionId === 'jipangu') {
            // Page 4: Custom Magic (Runes)
            let kpRuhai = 0;
            let kpMialgrath = 0;
            pageFourState.customSpells.forEach(spell => {
                if (spell.isRuhaiKpPaid) kpRuhai++;
                if (spell.mialgrathApplied && spell.isMilgrathKpPaid) kpMialgrath++;
            });

            const ruhaiCount = pageFourState.acquiredRunes.get('ruhai') ?? 0;
            const mialgrathCount = pageFourState.acquiredRunes.get('mialgrath') ?? 0;

            const bpRuhai = Math.max(0, ruhaiCount - kpRuhai);
            const bpMialgrath = Math.max(0, mialgrathCount - kpMialgrath);

            kpSpent -= (kpRuhai + kpMialgrath);
            bpSpent -= (bpRuhai + bpMialgrath);
        }

        // Cheissilith's Bargain: Juathas Free
        if (pageThreeState.selectedStarCrossedLovePacts.has('cheissiliths_bargain')) {
             const totalJuathas = pageThreeState.usedSigilCounts.juathas;
             bpSpent -= (totalJuathas * 8);
        }
        
        // --- ENGRAVING COSTS & REFUNDS ---
        const processEngraving = (
            override: string | null,
            isActive: boolean,
            hasJuathas: boolean
        ) => {
            if (!isActive) return;
            const engraving = override ?? pageThreeState.selectedBlessingEngraving;
            
            if (engraving === 'weapon') {
                fpSpent += 5;
                if (hasJuathas) {
                    bpSpent -= 1;
                }
            }
        };

        processEngraving(pageThreeState.goodTidingsEngraving, !!pageThreeState.selectedGoodTidingsTier, false);
        processEngraving(pageThreeState.compellingWillEngraving, pageThreeState.selectedCompellingWillSigils.size > 0, pageThreeState.selectedCompellingWillSigils.has('manipulator'));
        processEngraving(pageThreeState.worldlyWisdomEngraving, pageThreeState.selectedWorldlyWisdomSigils.size > 0, pageThreeState.selectedWorldlyWisdomSigils.has('arborealist'));
        processEngraving(pageThreeState.bitterDissatisfactionEngraving, pageThreeState.selectedBitterDissatisfactionSigils.size > 0, pageThreeState.selectedBitterDissatisfactionSigils.has('fireborn'));
        processEngraving(pageThreeState.lostHopeEngraving, pageThreeState.selectedLostHopeSigils.size > 0, pageThreeState.selectedLostHopeSigils.has('young_witch'));
        processEngraving(pageThreeState.fallenPeaceEngraving, pageThreeState.selectedFallenPeaceSigils.size > 0, pageThreeState.selectedFallenPeaceSigils.has('left_brained'));
        processEngraving(pageThreeState.graciousDefeatEngraving, pageThreeState.selectedGraciousDefeatSigils.size > 0, pageThreeState.selectedGraciousDefeatSigils.has('gd_fireborn'));
        processEngraving(pageThreeState.closedCircuitsEngraving, pageThreeState.selectedClosedCircuitsSigils.size > 0, pageThreeState.selectedClosedCircuitsSigils.has('script_kiddy'));
        processEngraving(pageThreeState.righteousCreationEngraving, pageThreeState.selectedRighteousCreationSigils.size > 0, pageThreeState.selectedRighteousCreationSigils.has('rookie_engineer'));

        // --- PAGE 4 ---
        // Runes
        const ruhaiCount = pageFourState.acquiredRunes.get('ruhai') ?? 0;
        const mialgrathCount = pageFourState.acquiredRunes.get('mialgrath') ?? 0;
        const ruhaiCost = Constants.LIMITLESS_POTENTIAL_RUNES_DATA[0].cost; // "Costs 8 BP"
        const mialgrathCost = Constants.LIMITLESS_POTENTIAL_RUNES_DATA[1].cost; // "Costs 16 BP"

        // Parse costs
        const { bp: rBp } = parseCost(ruhaiCost || '');
        const { bp: mBp } = parseCost(mialgrathCost || '');
        
        let totalRuhaiBp = rBp * ruhaiCount;
        let totalMialBp = mBp * mialgrathCount;

        // KP Logic for Runes (Page 4 Toggles)
        pageFourState.customSpells.forEach((spell: any) => {
             if (spell.isRuhaiKpPaid) {
                 totalRuhaiBp -= rBp;
                 kpSpent += rBp;
             }
             if (spell.mialgrathApplied && spell.isMilgrathKpPaid) {
                 totalMialBp -= mBp;
                 kpSpent += mBp;
             }
        });
        
        bpSpent += totalRuhaiBp;
        bpSpent += totalMialBp;

        // --- PAGE 5 ---
        // Allmillor
        pageFiveState.selectedAllmillorIds.forEach(id => processCost(Constants.ALLMILLOR_CHOICES_DATA.find(i => i.id === id)?.cost));
        // Career Goals
        pageFiveState.selectedCareerGoalIds.forEach(id => {
             const goals = Object.values(Constants.CAREER_GOALS_DATA).flat() as any[];
             const goal = goals.find(g => g.id === id);
             processCost(goal?.cost);
        });
        // Colleagues
        pageFiveState.selectedColleagueIds.forEach(id => {
            const isMentor = pageTwoState.selectedMentors.some(m => m.id === id && m.type === 'premade');
            
            if (!isMentor) {
                const c = Constants.COLLEAGUES_DATA.find(i => i.id === id);
                if (c) {
                    let { fp, bp } = parseCost(c.cost);
                    // Refund logic for same dominion
                    const dom = Constants.DOMINIONS.find(d => d.id === selectedDominionId);
                    if (dom && c.birthplace.toUpperCase() === dom.title.toUpperCase()) {
                        fp = Math.max(0, fp - 2);
                    }
                    fpSpent += fp;
                    bpSpent += bp;
                }
            }
        });
        // Custom Colleagues
        pageFiveState.customColleagues.forEach(cc => {
             const isMentor = pageTwoState.selectedMentors.some(m => m.id === cc.id.toString() && m.type === 'custom');

             if (!isMentor) {
                 const opt = Constants.CUSTOM_COLLEAGUE_CHOICES_DATA.find(c => c.id === cc.optionId);
                 processCost(opt?.cost);
             }
        });
        // Moving Out Homes
        pageFiveState.movingOutHomes.forEach((home, index) => {
             const isFirst = index === 0;
             const isInherited = home.isInherited;

             if (!isInherited) {
                 // Base Cost (3 FP): Only apply if NOT first
                 if (!isFirst) {
                     fpSpent += 3; 
                 }
                 
                 const h = Constants.HOUSES_DATA.find(i => i.id === home.houseId);
                 if (h?.cost) {
                     // For First home, waive costs (positive), keep grants (negative)
                     if (isFirst) {
                         const { fp, bp } = parseCost(h.cost);
                         if (fp < 0) fpGained += Math.abs(fp);
                         if (bp < 0) bpGained += Math.abs(bp);
                     } else {
                         // Standard processing
                         processCost(h.cost);
                     }
                 }
             }

             // Upgrades Cost
             home.upgradeIds.forEach(uId => {
                const u = Constants.HOUSE_UPGRADES_DATA.find(i => i.id === uId);
                 if (u) {
                    if (uId === 'virtual_reality' && home.vrChamberCostType) {
                        // VR Chamber special handling
                        // If it's First or Inherited, it should be free
                        if (!isFirst && !isInherited) {
                            if (home.vrChamberCostType === 'fp') fpSpent += 5;
                            else bpSpent += 2;
                        }
                    } else {
                        // Standard Upgrades
                        if (isFirst || isInherited) {
                             const { fp, bp } = parseCost(u.cost);
                             if (fp < 0) fpGained += Math.abs(fp);
                             if (bp < 0) bpGained += Math.abs(bp);
                        } else {
                            processCost(u.cost);
                        }
                    }
                }
             });
        });

        // --- PAGE 6 ---
        // No explicit costs usually, but check
        // ...

        // --- LOST BLESSING (Secret) ---
        // Each node in tree = 1 Sinthru (or BP if Contract)
        const lostNodeCount = selectedLostBlessingNodes.size;
        if (pageThreeState.selectedStarCrossedLovePacts.has('sinthrus_contract')) {
            const sinthruBpCost = selectedDominionId === 'shinar' ? 8 : 10;
            bpSpent += lostNodeCount * sinthruBpCost;
        } else {
            // Already added to sinthru usage count in Page 3 section
        }

        // Misc Costs
        fpSpent += miscFpCosts;

        // --- SANDBOX OVERRIDE ---
        if (isSandboxMode) {
            return {
                blessingPoints: 999,
                fortunePoints: 999,
                kuriPoints: 999,
                bpGained, bpSpent, fpGained, fpSpent, kpGained, kpSpent
            };
        }

        const blessingPoints = 100 + bpGained - bpSpent;
        const fortunePoints = 100 + fpGained - fpSpent;
        const kuriPoints = kpGained - kpSpent;

        return {
            blessingPoints,
            fortunePoints,
            kuriPoints,
            bpGained, bpSpent, fpGained, fpSpent, kpGained, kpSpent
        };

    }, [
        selectedDominionId,
        pageOneState, pageTwoState, pageThreeState, pageFourState, pageFiveState, pageSixState,
        kpPaidNodes, miscFpCosts, selectedLostBlessingNodes, buildsRefreshTrigger, isSandboxMode
    ]);
};
