
import { useMemo } from 'react';
import type { SigilCounts } from '../types';
import type { PageThreeState } from './CharacterContextTypes';

export const useSigilCalculation = (
    pageThreeState: PageThreeState,
    kpPaidNodes: Map<string, string>,
    selectedLostBlessingNodes: Set<string>
) => {
    // --- SIGIL CALCULATION ---
    const totalSigilCounts = useMemo(() => {
        const totals = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        totals.kaarn = pageThreeState.acquiredCommonSigils.get('kaarn') ?? 0;
        totals.purth = pageThreeState.acquiredCommonSigils.get('purth') ?? 0;
        totals.juathas = pageThreeState.acquiredCommonSigils.get('juathas') ?? 0;
        totals.xuth = pageThreeState.selectedSpecialSigilChoices.get('xuth')?.size ?? 0;
        totals.sinthru = pageThreeState.selectedSpecialSigilChoices.get('sinthru')?.size ?? 0;
        
        if (pageThreeState.acquiredCommonSigils.has('sinthru')) {
            totals.sinthru += pageThreeState.acquiredCommonSigils.get('sinthru')!;
        }
        
        // Jade Emperor's Challenge: Only adds +1 Xuth if the extra one is explicitly purchased
        if (pageThreeState.jadeEmperorExtraXuthPurchased) {
            totals.xuth += 1;
        }

        let lekoluTotal = 0;
        for (const count of pageThreeState.acquiredLekoluJobs.values()) {
            lekoluTotal += count;
        }
        totals.lekolu = lekoluTotal;
        return totals;
    }, [pageThreeState.acquiredCommonSigils, pageThreeState.selectedSpecialSigilChoices, pageThreeState.acquiredLekoluJobs, pageThreeState.selectedStarCrossedLovePacts, pageThreeState.jadeEmperorExtraXuthPurchased]);

    const { usedSigilCounts: rawUsedSigilCounts } = pageThreeState;

    const availableSigilCounts = useMemo(() => {
        // Adjust used counts based on selection state
        // NOTE: We do NOT subtract KP nodes here anymore. 
        // Logic Update: Selecting a node consumes a Sigil (-1). 
        // converting to KP refunds the BP cost but KEEPS the Sigil consumed (-1).
        // Deselecting the node returns the Sigil (+1).
        const adjustedUsed = { ...rawUsedSigilCounts };

        // Add Sinthru usage from Lost Blessing Page if Contract is NOT active
        if (!pageThreeState.selectedStarCrossedLovePacts.has('sinthrus_contract')) {
            adjustedUsed.sinthru += selectedLostBlessingNodes.size;
        }

        return {
            kaarn: totalSigilCounts.kaarn - adjustedUsed.kaarn,
            purth: totalSigilCounts.purth - adjustedUsed.purth,
            juathas: totalSigilCounts.juathas - adjustedUsed.juathas,
            xuth: totalSigilCounts.xuth - adjustedUsed.xuth,
            sinthru: totalSigilCounts.sinthru - adjustedUsed.sinthru,
            lekolu: totalSigilCounts.lekolu - adjustedUsed.lekolu,
        };
    }, [totalSigilCounts, rawUsedSigilCounts, selectedLostBlessingNodes, pageThreeState.selectedStarCrossedLovePacts]);

    return { totalSigilCounts, availableSigilCounts };
};
