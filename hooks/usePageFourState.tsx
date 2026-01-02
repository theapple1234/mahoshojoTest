
import { useState, useMemo, useCallback } from 'react';
import type { CustomSpell } from '../types';

export const usePageFourState = () => {
    const [acquiredRunes, setAcquiredRunes] = useState<Map<'ruhai' | 'mialgrath', number>>(new Map([['ruhai', 0], ['mialgrath', 0]]));
    const [customSpells, setCustomSpells] = useState<CustomSpell[]>([]);

    const mialgrathRunesPurchased = useMemo(() => acquiredRunes.get('mialgrath') ?? 0, [acquiredRunes]);
    const mialgrathRunesApplied = useMemo(() => customSpells.filter(s => s.mialgrathApplied).length, [customSpells]);
    const canApplyMialgrath = mialgrathRunesApplied < mialgrathRunesPurchased;

    const handleRuneAction = useCallback((runeId: 'ruhai' | 'mialgrath', action: 'buy' | 'sell') => {
        setAcquiredRunes(prev => {
            // FIX: Explicitly typing the new Map to prevent type inference issues where `prev`'s type is lost.
            const newMap = new Map<'ruhai' | 'mialgrath', number>(prev);
            const currentCount = newMap.get(runeId) ?? 0;
            
            if (action === 'buy') {
                newMap.set(runeId, currentCount + 1);
            } else if (action === 'sell' && currentCount > 0) {
                newMap.set(runeId, currentCount - 1);
            } else {
                return prev; // No change
            }

            // Sync customSpells array with ruhai runes
            if (runeId === 'ruhai') {
                const newRuhaiCount = newMap.get('ruhai') ?? 0;
                setCustomSpells(prevSpells => {
                    if (newRuhaiCount > prevSpells.length) {
                        // Add new spells
                        const spellsToAdd = newRuhaiCount - prevSpells.length;
                        const newSpellEntries: CustomSpell[] = Array.from({ length: spellsToAdd }, () => ({
                            id: Date.now() + Math.random(),
                            description: '',
                            mialgrathApplied: false,
                            mialgrathDescription: '',
                            assignedEntityName: null,
                            assignedEntityType: null,
                            isRuhaiKpPaid: false,
                            isMilgrathKpPaid: false,
                        }));
                        return [...prevSpells, ...newSpellEntries];
                    } else if (newRuhaiCount < prevSpells.length) {
                        // Remove spells
                        let spellsToRemove = prevSpells.length - newRuhaiCount;
                        let updatedSpells = [...prevSpells];
                        // Prioritize removing spells without mialgrath applied
                        for (let i = updatedSpells.length - 1; i >= 0 && spellsToRemove > 0; i--) {
                            if (!updatedSpells[i].mialgrathApplied) {
                                updatedSpells.splice(i, 1);
                                spellsToRemove--;
                            }
                        }
                        // If still need to remove, remove from the end
                        if (spellsToRemove > 0) {
                            updatedSpells.splice(-spellsToRemove);
                        }
                        return updatedSpells;
                    }
                    return prevSpells;
                });
            } else if (runeId === 'mialgrath' && action === 'sell') {
                // If a mialgrath rune is sold, un-apply it from the last spell that has it
                setCustomSpells(prevSpells => {
                    const newMialgrathCount = newMap.get('mialgrath') ?? 0;
                    const appliedCount = prevSpells.filter(s => s.mialgrathApplied).length;
                    if (appliedCount > newMialgrathCount) {
                        const updatedSpells = [...prevSpells];
                        for (let i = updatedSpells.length - 1; i >= 0; i--) {
                            if (updatedSpells[i].mialgrathApplied) {
                                updatedSpells[i] = { 
                                    ...updatedSpells[i], 
                                    mialgrathApplied: false, 
                                    mialgrathDescription: '',
                                    assignedEntityName: null,
                                    assignedEntityType: null,
                                    // Reset Milgrath KP flag if removed
                                    isMilgrathKpPaid: false,
                                };
                                break; // Only un-apply one
                            }
                        }
                        return updatedSpells;
                    }
                    return prevSpells;
                });
            }

            return newMap;
        });
    }, []);

    const handleSpellDescriptionChange = useCallback((spellId: number, description: string) => {
        setCustomSpells(prev => prev.map(spell => spell.id === spellId ? { ...spell, description } : spell));
    }, []);

    const handleMialgrathDescriptionChange = useCallback((spellId: number, mialgrathDescription: string) => {
        setCustomSpells(prev => prev.map(spell => spell.id === spellId ? { ...spell, mialgrathDescription } : spell));
    }, []);

    const handleToggleMialgrath = useCallback((spellId: number) => {
        setCustomSpells(prev => {
            const targetSpell = prev.find(s => s.id === spellId);
            if (!targetSpell) return prev;

            const isApplying = !targetSpell.mialgrathApplied;
            const currentApplied = prev.filter(s => s.mialgrathApplied).length;
            const totalPurchased = acquiredRunes.get('mialgrath') ?? 0;

            if (isApplying && currentApplied >= totalPurchased) {
                // Cannot apply more than purchased
                return prev;
            }

            return prev.map(spell => {
                if (spell.id === spellId) {
                    const willBeApplied = !spell.mialgrathApplied;
                    return {
                        ...spell,
                        mialgrathApplied: willBeApplied,
                        mialgrathDescription: willBeApplied ? spell.mialgrathDescription : '', // Clear description on toggle off
                        assignedEntityName: willBeApplied ? spell.assignedEntityName : null,
                        assignedEntityType: willBeApplied ? spell.assignedEntityType : null,
                        // If toggling off, reset KP payment for Milgrath part
                        isMilgrathKpPaid: willBeApplied ? spell.isMilgrathKpPaid : false,
                    };
                }
                return spell;
            });
        });
    }, [acquiredRunes]);

    const handleAssignEntityToSpell = useCallback((spellId: number, entityType: 'companion' | 'beast' | 'vehicle' | 'weapon' | null, entityName: string | null) => {
        setCustomSpells(prev => prev.map(spell => 
            spell.id === spellId ? { ...spell, assignedEntityType: entityType, assignedEntityName: entityName } : spell
        ));
    }, []);
    
    const handleToggleKp = useCallback((spellId: number, type: 'ruhai' | 'milgrath' = 'ruhai') => {
        setCustomSpells(prev => prev.map(spell => {
            if (spell.id === spellId) {
                if (type === 'milgrath') {
                     return { ...spell, isMilgrathKpPaid: !spell.isMilgrathKpPaid };
                }
                return { ...spell, isRuhaiKpPaid: !spell.isRuhaiKpPaid };
            }
            return spell;
        }));
    }, []);

    // New Load Function
    const loadPageFourState = useCallback((data: any) => {
        if (!data) return;
        setAcquiredRunes(new Map(Array.isArray(data.acquiredRunes) ? data.acquiredRunes : []));
        setCustomSpells(Array.isArray(data.customSpells) ? data.customSpells : []);
    }, []);

    return {
        acquiredRunes,
        customSpells,
        handleRuneAction,
        handleSpellDescriptionChange,
        handleMialgrathDescriptionChange,
        handleToggleMialgrath,
        mialgrathRunesApplied,
        mialgrathRunesPurchased,
        handleAssignEntityToSpell,
        handleToggleKp,
        loadPageFourState // Export load function
    };
};