
import React, { useState, useEffect } from 'react';
import * as Constants from '../../constants';
import type { CompanionSelections, CompanionOption } from '../../types';
import { ReferenceSection } from './ReferenceSection';
import { ReferenceItemCard } from './ReferenceItemCard';
import { Counter } from './Counter';
import { BeastSelectionModal } from '../BeastSelectionModal';
import { WeaponSelectionModal } from '../WeaponSelectionModal';
import { MapSelectionModal } from './MapSelectionModal';
import { CompanionIcon, WeaponIcon, BookIcon } from '../ui';

const ALL_SPELLS = [
    ...Constants.ESSENTIAL_BOONS_DATA, ...Constants.MINOR_BOONS_DATA, ...Constants.MAJOR_BOONS_DATA,
    ...Constants.TELEKINETICS_DATA, ...Constants.METATHERMICS_DATA,
    ...Constants.ELEANORS_TECHNIQUES_DATA, ...Constants.GENEVIEVES_TECHNIQUES_DATA,
    ...Constants.BREWING_DATA, ...Constants.SOUL_ALCHEMY_DATA, ...Constants.TRANSFORMATION_DATA,
    ...Constants.CHANNELLING_DATA, ...Constants.NECROMANCY_DATA, ...Constants.BLACK_MAGIC_DATA,
    ...Constants.TELEPATHY_DATA, ...Constants.MENTAL_MANIPULATION_DATA,
    ...Constants.ENTRANCE_DATA, ...Constants.FEATURES_DATA, ...Constants.INFLUENCE_DATA,
    ...Constants.NET_AVATAR_DATA, ...Constants.TECHNOMANCY_DATA, ...Constants.NANITE_CONTROL_DATA,
    ...Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA, ...Constants.RIGHTEOUS_CREATION_MAGITECH_DATA, 
    ...Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, ...Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA,
    ...Constants.STAR_CROSSED_LOVE_PACTS_DATA
];

type ActiveMapType = 'specialWeapon' | 'signaturePower' | 'darkMagician' | 'powerLevel';

export const CompanionSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: CompanionSelections;
    setSelections: React.Dispatch<React.SetStateAction<CompanionSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
    const [isInhumanFormModalOpen, setIsInhumanFormModalOpen] = useState(false);
    const [isSpecialWeaponModalOpen, setIsSpecialWeaponModalOpen] = useState(false);
    const [activeMapType, setActiveMapType] = useState<ActiveMapType | null>(null);

    useEffect(() => {
        let total = 0;
        const allItems = [...Constants.COMPANION_CATEGORIES, ...Constants.COMPANION_RELATIONSHIPS, ...Constants.COMPANION_PERSONALITY_TRAITS, ...Constants.COMPANION_PERKS, ...Constants.COMPANION_POWER_LEVELS];
        
        if (selections.category) total += allItems.find(i => i.id === selections.category)?.cost ?? 0;
        if (selections.relationship) total += allItems.find(i => i.id === selections.relationship)?.cost ?? 0;
        if (selections.powerLevel) total += allItems.find(i => i.id === selections.powerLevel)?.cost ?? 0;
        selections.traits.forEach(traitId => { total += allItems.find(i => i.id === traitId)?.cost ?? 0; });
        selections.perks.forEach((count, perkId) => { 
            const perk = allItems.find(i => i.id === perkId);
            if (perk) {
                if (perkId === 'signature_power') {
                    // First cost 5, subsequent cost 10
                    // cost logic: 5 + (count - 1) * 10
                    if (count > 0) {
                        total += 5 + (count - 1) * 10;
                    }
                } else {
                    total += (perk.cost ?? 0) * count; 
                }
            }
        });

        // Add additional costs for Xuth spells selected via Signature Power
        const sigPowerCount = selections.perks.get('signature_power') || 0;
        if (sigPowerCount > 0) {
            let xuthCount = 0;
            // Only consider the first N selected spells based on count
            const activeSpells = Array.from(selections.signaturePowerMap || []).slice(0, sigPowerCount);
            activeSpells.forEach(id => {
                const spell = ALL_SPELLS.find(s => s.id === id);
                if (spell?.grade === 'xuth') {
                    xuthCount++;
                }
            });
            // 1st Xuth adds 5, 2nd Xuth adds 10
            if (xuthCount >= 1) total += 5;
            if (xuthCount >= 2) total += 10;
        }
        
        total -= (selections.bpSpent || 0) * 2; // Apply Sun Forger's Boon Discount

        setPoints(total);
    }, [selections, setPoints]);

    // Force Subservient for non-Mage
    useEffect(() => {
        if (selections.category && selections.category !== 'mage') {
            setSelections(prev => {
                if (prev.relationship !== 'subservient') {
                    return { ...prev, relationship: 'subservient' };
                }
                return prev;
            });
        }
    }, [selections.category, setSelections]);

    // Clean up inhuman form name if perk is removed
    useEffect(() => {
        if (!selections.perks.has('inhuman_form') && selections.inhumanFormBeastName) {
            setSelections(prev => ({ ...prev, inhumanFormBeastName: null }));
        }
    }, [selections.perks, selections.inhumanFormBeastName, setSelections]);

    // Clean up Special Weapon if removed
    useEffect(() => {
        if (!selections.perks.has('special_weapon')) {
            if (selections.specialWeaponName) {
                setSelections(prev => ({ ...prev, specialWeaponName: null, specialWeaponMap: new Set() }));
            }
        }
    }, [selections.perks, selections.specialWeaponName, setSelections]);

    const handleSelect = (type: keyof CompanionSelections, id: string) => {
        setSelections(prev => {
            const newSelections = {...prev};
            if (type === 'traits') {
                const currentSet = new Set<string>(prev[type]);
                if (currentSet.has(id)) currentSet.delete(id); else currentSet.add(id);
                newSelections[type] = currentSet;
            } else if (type === 'perks') {
                const currentMap = new Map(prev.perks);
                if (currentMap.has(id)) currentMap.delete(id);
                else currentMap.set(id, 1);
                newSelections.perks = currentMap;
            } else {
                const prop = type as 'category' | 'relationship' | 'powerLevel';
                (newSelections[prop] as string | null) = prev[prop] === id ? null : id;
                
                // If changing power level, reset the map selections to ensure validity
                if (prop === 'powerLevel' && prev.powerLevel !== id) {
                    newSelections.powerLevelMap = new Set();
                }
            }
            return newSelections;
        });
    };

    const handlePerkCountChange = (id: string, count: number) => {
        setSelections(prev => {
            const newPerks = new Map(prev.perks);
            if (count <= 0) newPerks.delete(id);
            else newPerks.set(id, count);
            return { ...prev, perks: newPerks };
        });
    };

    const handleAssignInhumanForm = (name: string | null) => {
        setSelections(prev => ({ ...prev, inhumanFormBeastName: name }));
        setIsInhumanFormModalOpen(false);
    };

    const handleAssignSpecialWeapon = (name: string | null) => {
        setSelections(prev => ({ ...prev, specialWeaponName: name }));
        setIsSpecialWeaponModalOpen(false);
    };

    const handleMapSelect = (selectedIds: Set<string>) => {
        setSelections(prev => {
            const newSel = { ...prev };
            if (activeMapType === 'specialWeapon') newSel.specialWeaponMap = selectedIds;
            if (activeMapType === 'signaturePower') newSel.signaturePowerMap = selectedIds;
            if (activeMapType === 'darkMagician') newSel.darkMagicianMap = selectedIds;
            if (activeMapType === 'powerLevel') newSel.powerLevelMap = selectedIds;
            return newSel;
        });
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelections(prev => ({ ...prev, customImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const isCategoryDisabled = (item: CompanionOption) => {
        return selections.category !== null && selections.category !== item.id;
    }
    
    const isRelationshipDisabled = (item: CompanionOption) => {
        if (selections.category && selections.category !== 'mage' && item.id !== 'subservient') return true;
        return selections.relationship !== null && selections.relationship !== item.id;
    }

    const isPerkDisabled = (item: CompanionOption) => {
        return false;
    }

    const getModifiedPerk = (perk: CompanionOption): CompanionOption => {
        if (perk.id === 'impressive_career') {
            const count = selections.perks.get(perk.id) || 0;
            if (count === 2) return { ...perk, cost: 10 };
            if (count === 3) return { ...perk, cost: 15 };
        }
        if (perk.id === 'special_weapon') {
            return { ...perk, description: perk.description + " Allows extra spell slots (click Book icon)." };
        }
        if (perk.id === 'signature_power') {
            return { ...perk, description: "Your companion will have a signature power which she's most known for. It will be affected by the specific boost effect usually applied by the BOOST buttons. Can be taken multiple times, but each purchase beyond the first will cost {w}10 Points{/w}. If you choose a {r}Xuth{/r}-tier spell, the price of this perk is doubled." };
        }
        return perk;
    }

    const mapModalConfig = React.useMemo(() => {
        if (activeMapType === 'specialWeapon') {
            return {
                title: "Special Weapon Enchantments",
                limits: { kaarn: 2, purth: 1 },
                exclusive: true,
                maxTotal: undefined,
                bannedGrades: ['xuth', 'sinthru', 'lekolu'],
                initialSelectedIds: selections.specialWeaponMap || new Set()
            };
        } else if (activeMapType === 'signaturePower') {
            const signatureCount = selections.perks.get('signature_power') || 0;
            return {
                title: "Signature Powers",
                limits: {},
                exclusive: false,
                maxTotal: signatureCount,
                bannedGrades: ['sinthru'],
                initialSelectedIds: selections.signaturePowerMap || new Set()
            };
        } else if (activeMapType === 'darkMagician') {
            const darkMagicCount = selections.perks.get('dark_magician') || 0;
            return {
                title: "Dark Arts",
                limits: {},
                exclusive: false,
                maxTotal: darkMagicCount,
                bannedGrades: ['kaarn', 'purth', 'juathas', 'xuth', 'lekolu'],
                initialSelectedIds: selections.darkMagicianMap || new Set()
            };
        } else if (activeMapType === 'powerLevel') {
            const level = selections.powerLevel;
            const essentialBoonIds = Constants.ESSENTIAL_BOONS_DATA.map(b => b.id);

            if (level === 'below_average') {
                return {
                    title: "Below Average Spells",
                    limits: { kaarn: 3, purth: 1 },
                    maxBlessings: 2,
                    bannedGrades: ['xuth', 'sinthru'],
                    mandatoryItemIds: essentialBoonIds,
                    initialSelectedIds: selections.powerLevelMap || new Set()
                };
            } else if (level === 'average') {
                return {
                    title: "Average Spells",
                    limits: { kaarn: 6, purth: 2 },
                    maxBlessings: 3,
                    bannedGrades: ['xuth', 'sinthru'],
                    mandatoryItemIds: essentialBoonIds,
                    initialSelectedIds: selections.powerLevelMap || new Set()
                };
            } else if (level === 'above_average') {
                return {
                    title: "Above Average Spells",
                    limits: { kaarn: 6, purth: 2, xuth: 1 },
                    maxBlessings: 4,
                    bannedGrades: ['sinthru'],
                    bannedItemIds: ['marias_gift'],
                    mandatoryItemIds: essentialBoonIds,
                    initialSelectedIds: selections.powerLevelMap || new Set(),
                    customValidator: (selectedIds: Set<string>, blessingCounts: Record<string, number>, gradeCounts: Record<string, number>) => {
                        if (gradeCounts.xuth && gradeCounts.xuth > 0) {
                            const hasDeepBlessing = Object.values(blessingCounts).some(count => count >= 5);
                            if (!hasDeepBlessing) {
                                return "To select a Xuth spell, you must have\nat least 4 other spells in that Blessing (Total 5).";
                            }
                        }
                        return null;
                    }
                };
            }
        }
        return null;
    }, [activeMapType, selections.perks, selections.specialWeaponMap, selections.signaturePowerMap, selections.darkMagicianMap, selections.powerLevel, selections.powerLevelMap]);

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={Constants.COMPANION_INTRO.imageSrc} alt="Companions" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{Constants.COMPANION_INTRO.description}</p></div>
            <ReferenceSection title="CATEGORY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{Constants.COMPANION_CATEGORIES.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.category === item.id} onSelect={(id) => handleSelect('category', id)} disabled={isCategoryDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title="RELATIONSHIP"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{Constants.COMPANION_RELATIONSHIPS.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.relationship === item.id} onSelect={(id) => handleSelect('relationship', id)} disabled={isRelationshipDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title="PERSONALITY TRAITS"><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{Constants.COMPANION_PERSONALITY_TRAITS.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={(id) => handleSelect('traits', id)} />)}</div></ReferenceSection>
            <ReferenceSection title="PERKS"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{Constants.COMPANION_PERKS.map(item => {
                const count = selections.perks.get(item.id) || 0;
                const isSelected = count > 0;
                
                if (item.id === 'impressive_career' && isSelected) {
                    return (
                        <ReferenceItemCard 
                            key={item.id} 
                            item={getModifiedPerk(item)} 
                            layout="default" 
                            isSelected={true} 
                            onSelect={(id) => handleSelect('perks', id)} 
                            disabled={isPerkDisabled(item)}
                        >
                            <div className="mt-3 w-full" onClick={e => e.stopPropagation()}>
                                <p className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-bold mb-2 text-center border-b border-cyan-900/30 pb-1">Select Career Tier</p>
                                <div className="flex flex-col gap-1.5">
                                    {[
                                        { val: 1, label: "Standard", cost: 5 },
                                        { val: 2, label: "High Prestige", cost: 10 },
                                        { val: 3, label: "Council", cost: 15 }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => handlePerkCountChange(item.id, opt.val)}
                                            className={`
                                                flex justify-between items-center px-3 py-2 rounded-md text-xs border transition-all duration-200
                                                ${count === opt.val 
                                                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-100 ring-1 ring-cyan-500/50' 
                                                    : 'bg-black/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            <span className="font-cinzel font-bold">{opt.label}</span>
                                            <span className={`font-mono text-[10px] ${count === opt.val ? 'text-cyan-300' : 'text-gray-500'}`}>{opt.cost} pts</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </ReferenceItemCard>
                    );
                }

                if (item.id === 'inhuman_form') {
                    return (
                        <ReferenceItemCard 
                            key={item.id} 
                            item={item} 
                            layout="default" 
                            isSelected={isSelected} 
                            onSelect={(id) => {
                                handleSelect('perks', id);
                            }}
                            disabled={isPerkDisabled(item)}
                            iconButton={isSelected ? <CompanionIcon /> : undefined}
                            onIconButtonClick={isSelected ? () => setIsInhumanFormModalOpen(true) : undefined}
                        >
                            {selections.inhumanFormBeastName && (
                                <div className="text-center mt-2">
                                    <p className="text-xs text-gray-400">Assigned Form:</p>
                                    <p className="text-sm font-bold text-cyan-300 truncate">{selections.inhumanFormBeastName}</p>
                                </div>
                            )}
                        </ReferenceItemCard>
                    );
                }

                if (item.id === 'special_weapon') {
                    return (
                        <ReferenceItemCard
                            key={item.id}
                            item={getModifiedPerk(item)}
                            layout="default"
                            isSelected={isSelected}
                            onSelect={(id) => handleSelect('perks', id)}
                            disabled={isPerkDisabled(item)}
                            iconButton={
                                isSelected ? (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsSpecialWeaponModalOpen(true); }}
                                            className="p-2 rounded-full bg-cyan-900/80 text-cyan-200 hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-500/50"
                                            title="Assign Weapon"
                                        >
                                            <WeaponIcon />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveMapType('specialWeapon'); }}
                                            className="p-2 rounded-full bg-cyan-900/80 text-cyan-200 hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-500/50"
                                            title="MAP: Add Powers"
                                        >
                                            <BookIcon />
                                        </button>
                                    </>
                                ) : undefined
                            }
                        >
                            {isSelected && (
                                <div className="text-center mt-2">
                                    {selections.specialWeaponName && (
                                        <>
                                            <p className="text-xs text-gray-400">Assigned Weapon:</p>
                                            <p className="text-sm font-bold text-cyan-300 truncate mb-1">{selections.specialWeaponName}</p>
                                        </>
                                    )}
                                    {selections.specialWeaponMap && selections.specialWeaponMap.size > 0 && (
                                        <div className="text-[10px] text-green-400 font-mono mt-1 space-y-0.5">
                                            {Array.from(selections.specialWeaponMap).map(id => {
                                                const spell = ALL_SPELLS.find(s => s.id === id);
                                                return <div key={id} className="truncate">+ {spell?.title || id}</div>;
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </ReferenceItemCard>
                    );
                }
                
                if (item.id === 'signature_power') {
                     return (
                        <ReferenceItemCard 
                            key={item.id} 
                            item={getModifiedPerk(item)} 
                            layout="default" 
                            isSelected={isSelected} 
                            onSelect={() => {}} 
                            disabled={isPerkDisabled(item)}
                            iconButton={isSelected ? <BookIcon /> : undefined}
                            onIconButtonClick={isSelected ? () => setActiveMapType('signaturePower') : undefined}
                        >
                            <div className="mt-6 w-full">
                                <Counter 
                                    label="Count" 
                                    count={count} 
                                    onCountChange={(n) => handlePerkCountChange(item.id, n)} 
                                    cost={item.id === 'signature_power' && count > 0 ? '10 points' : `${item.cost} points`} 
                                    layout="small" 
                                />
                            </div>
                            {isSelected && selections.signaturePowerMap && selections.signaturePowerMap.size > 0 && (
                                <div className="text-center mt-2">
                                    <div className="text-[10px] text-green-400 font-mono mt-1 space-y-0.5">
                                        {Array.from(selections.signaturePowerMap).slice(0, count).map(id => {
                                            const spell = ALL_SPELLS.find(s => s.id === id);
                                            return <div key={id} className="truncate">+ {spell?.title || id}</div>;
                                        })}
                                    </div>
                                </div>
                            )}
                        </ReferenceItemCard>
                    );
                }

                if (item.id === 'dark_magician') {
                     return (
                        <ReferenceItemCard 
                            key={item.id} 
                            item={getModifiedPerk(item)} 
                            layout="default" 
                            isSelected={isSelected} 
                            onSelect={() => {}} 
                            disabled={isPerkDisabled(item)}
                            iconButton={isSelected ? <BookIcon /> : undefined}
                            onIconButtonClick={isSelected ? () => setActiveMapType('darkMagician') : undefined}
                        >
                            <div className="mt-6 w-full">
                                <Counter 
                                    label="Count" 
                                    count={count} 
                                    onCountChange={(n) => handlePerkCountChange(item.id, n)} 
                                    cost={`${item.cost} points`} 
                                    max={4} 
                                    layout="small" 
                                />
                            </div>
                            {isSelected && selections.darkMagicianMap && selections.darkMagicianMap.size > 0 && (
                                <div className="text-center mt-2">
                                    <div className="text-[10px] text-purple-400 font-mono mt-1 space-y-0.5">
                                        {Array.from(selections.darkMagicianMap).slice(0, count).map(id => {
                                            const spell = ALL_SPELLS.find(s => s.id === id);
                                            return <div key={id} className="truncate">+ {spell?.title || id}</div>;
                                        })}
                                    </div>
                                </div>
                            )}
                        </ReferenceItemCard>
                    );
                }

                return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={(id) => handleSelect('perks', id)} disabled={isPerkDisabled(item)} />;
            })}</div></ReferenceSection>
            <ReferenceSection title="POWER LEVEL"><div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">{Constants.COMPANION_POWER_LEVELS.map(item => (
                <ReferenceItemCard 
                    key={item.id} 
                    item={item} 
                    layout="default" 
                    isSelected={selections.powerLevel === item.id} 
                    onSelect={(id) => handleSelect('powerLevel', id)} 
                    iconButton={selections.powerLevel === item.id ? <BookIcon /> : undefined}
                    onIconButtonClick={selections.powerLevel === item.id ? () => setActiveMapType('powerLevel') : undefined}
                >
                    {selections.powerLevel === item.id && selections.powerLevelMap && selections.powerLevelMap.size > 0 && (
                        <div className="text-center mt-2">
                            <div className="text-[10px] text-blue-400 font-mono mt-1 space-y-0.5">
                                {Array.from(selections.powerLevelMap).map(id => {
                                    const spell = ALL_SPELLS.find(s => s.id === id);
                                    return <div key={id} className="truncate">+ {spell?.title || id}</div>;
                                })}
                            </div>
                        </div>
                    )}
                </ReferenceItemCard>
            ))}</div></ReferenceSection>
            
            <ReferenceSection title="CUSTOM VISUAL">
                 <div className="flex justify-center">
                    <label className={`
                        relative w-48 aspect-[9/16] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
                        ${selections.customImage ? 'border-cyan-500' : 'border-gray-700 hover:border-cyan-500/50 bg-black/20 hover:bg-black/40'}
                    `}>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                        />
                        {selections.customImage ? (
                            <>
                                <img src={selections.customImage} alt="Custom" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-xs text-white font-cinzel">Change Image</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-gray-500 font-cinzel">Upload Image</span>
                            </>
                        )}
                    </label>
                 </div>
            </ReferenceSection>
            
            {isInhumanFormModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsInhumanFormModalOpen(false)}
                    onSelect={handleAssignInhumanForm}
                    currentBeastName={selections.inhumanFormBeastName || null}
                    pointLimit={40}
                    title="Assign Inhuman Form"
                    excludedPerkIds={['magical_beast', 'chatterbox_beast']}
                    colorTheme="cyan"
                />
            )}

            {isSpecialWeaponModalOpen && (
                <WeaponSelectionModal
                    onClose={() => setIsSpecialWeaponModalOpen(false)}
                    onSelect={handleAssignSpecialWeapon}
                    currentWeaponName={selections.specialWeaponName || null}
                    pointLimit={20}
                    title="Assign Special Weapon"
                    colorTheme="cyan"
                />
            )}

            {activeMapType && mapModalConfig && (
                <MapSelectionModal
                    onClose={() => setActiveMapType(null)}
                    onSelect={handleMapSelect}
                    initialSelectedIds={mapModalConfig.initialSelectedIds}
                    title={mapModalConfig.title}
                    limits={mapModalConfig.limits}
                    exclusive={mapModalConfig.exclusive}
                    maxTotal={mapModalConfig.maxTotal}
                    bannedGrades={mapModalConfig.bannedGrades as any}
                    maxBlessings={mapModalConfig.maxBlessings}
                    bannedItemIds={mapModalConfig.bannedItemIds}
                    mandatoryItemIds={mapModalConfig.mandatoryItemIds}
                    customValidator={mapModalConfig.customValidator}
                />
            )}
        </div>
    );
};
