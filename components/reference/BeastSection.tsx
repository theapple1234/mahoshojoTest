
import React, { useEffect, useState } from 'react';
import * as Constants from '../../constants';
import type { BeastSelections, CompanionOption } from '../../types';
import { ReferenceSection } from './ReferenceSection';
import { ReferenceItemCard } from './ReferenceItemCard';
import { MapSelectionModal } from './MapSelectionModal';
import { BookIcon } from '../ui';
import { Counter } from './Counter';

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

type ActiveMapType = 'magicalBeast';

export const BeastSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: BeastSelections;
    setSelections: React.Dispatch<React.SetStateAction<BeastSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
    const [activeMapType, setActiveMapType] = useState<ActiveMapType | null>(null);

     useEffect(() => {
        let total = 0;
        selections.category.forEach(catId => {
            total += Constants.BEAST_CATEGORIES.find(c => c.id === catId)?.cost ?? 0;
        });
        if (selections.size) total += Constants.BEAST_SIZES.find(s => s.id === selections.size)?.cost ?? 0;
        selections.perks.forEach((count, perkId) => {
            if (perkId === 'magical_beast') return; // Handled separately
            const perk = Constants.BEAST_PERKS.find(p => p.id === perkId);
            if (perk) {
                let cost = perk.cost ?? 0;
                if (perk.id === 'unnerving_appearance' && selections.perks.has('undead_perk')) cost = 0;
                if (perk.id === 'steel_skin' && selections.perks.has('automaton_perk')) cost = 0;
                total += cost * count;
            }
        });
        
        if (selections.magicalBeastCount && selections.magicalBeastCount > 0) {
            total += selections.magicalBeastCount * 15;
        }

        if (selections.perks.has('chatterbox_beast')) {
            selections.traits.forEach(traitId => {
                const trait = Constants.COMPANION_PERSONALITY_TRAITS.find(t => t.id === traitId);
                if (trait) total += trait.cost ?? 0;
            });
        }
        
        total -= (selections.bpSpent || 0) * 2; // Apply Sun Forger's Boon Discount

        setPoints(total);
    }, [selections, setPoints]);

    const handleCategorySelect = (id: string) => {
        const hybridCount = selections.perks.get('hybrid') || 0;
        const maxCategories = 1 + hybridCount;

        setSelections(prev => {
            const newCategories = [...prev.category];
            if (newCategories.includes(id)) {
                return { ...prev, category: newCategories.filter(c => c !== id) };
            } else {
                if (newCategories.length < maxCategories) {
                    return { ...prev, category: [...newCategories, id] };
                }
                return prev;
            }
        });
    };

    const handleSelect = (type: keyof BeastSelections, id: string) => {
        setSelections(prev => {
            const newSelections = {...prev};
            if (type === 'traits') {
                const currentSet = new Set<string>(prev[type]);
                if (currentSet.has(id)) currentSet.delete(id); else currentSet.add(id);
                newSelections[type] = currentSet;
            } else if (type === 'perks') {
                const currentMap = new Map(prev.perks);
                if (currentMap.has(id)) {
                    currentMap.delete(id);
                    if (id === 'chatterbox_beast') newSelections.traits = new Set();
                } else {
                    currentMap.set(id, 1);
                }
                newSelections.perks = currentMap;
            } else {
                const prop = type as 'size';
                (newSelections[prop] as string | null) = prev[prop] === id ? null : id;
            }
            return newSelections;
        });
    };
    
    const handlePerkCountChange = (id: string, count: number) => {
        setSelections(prev => {
            const newPerks = new Map(prev.perks);
            if (count <= 0) newPerks.delete(id);
            else newPerks.set(id, count);

            // If reducing hybrid count, ensure categories are valid
            if (id === 'hybrid') {
                const maxCategories = 1 + count;
                if (prev.category.length > maxCategories) {
                    return { ...prev, perks: newPerks, category: prev.category.slice(0, maxCategories) };
                }
            }

            return { ...prev, perks: newPerks };
        });
    };

    const handleMagicalBeastCountChange = (count: number) => {
        setSelections(prev => {
            const newSelections = {...prev};
            newSelections.magicalBeastCount = count;
            if (count > 0) {
                newSelections.perks = new Map(prev.perks);
                newSelections.perks.set('magical_beast', 1);
            } else {
                newSelections.perks = new Map(prev.perks);
                newSelections.perks.delete('magical_beast');
                newSelections.magicalBeastMap = new Set();
            }
            return newSelections;
        });
    };

    const handleMapSelect = (selectedIds: Set<string>) => {
        setSelections(prev => {
            return { ...prev, magicalBeastMap: selectedIds };
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
    
    const isPerkDisabled = (perk: CompanionOption) => {
        if (perk.id === 'noble_steed') return !['medium', 'large', 'humongous'].includes(selections.size ?? '');
        if (perk.id === 'automaton_perk' && !selections.category.includes('automaton')) return true;
        if (perk.id === 'undead_perk' && !selections.category.includes('undead')) return true;
        return false;
    }

    const getModifiedPerk = (perk: CompanionOption): CompanionOption => {
        if (perk.id === 'unnerving_appearance' && selections.perks.has('undead_perk')) return { ...perk, cost: 0, requirement: 'Free for Undead' };
        if (perk.id === 'steel_skin' && selections.perks.has('automaton_perk')) return { ...perk, cost: 0, requirement: 'Free for Automaton' };
        return perk;
    }

    const isCategoryDisabled = (item: CompanionOption) => {
        const hybridCount = selections.perks.get('hybrid') || 0;
        const maxCategories = 1 + hybridCount;
        return !selections.category.includes(item.id) && selections.category.length >= maxCategories;
    }

    const isSizeDisabled = (item: CompanionOption) => {
        return selections.size !== null && selections.size !== item.id;
    }

    const mapModalConfig = React.useMemo(() => {
        if (activeMapType === 'magicalBeast') {
            const count = selections.magicalBeastCount || 0;
            const excludedIds = [
                ...Constants.ESSENTIAL_BOONS_DATA, ...Constants.MINOR_BOONS_DATA, ...Constants.MAJOR_BOONS_DATA,
                ...Constants.BREWING_DATA, ...Constants.SOUL_ALCHEMY_DATA, ...Constants.TRANSFORMATION_DATA,
                ...Constants.ENTRANCE_DATA, ...Constants.FEATURES_DATA, ...Constants.INFLUENCE_DATA,
                ...Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA, ...Constants.RIGHTEOUS_CREATION_MAGITECH_DATA, 
                ...Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, ...Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA,
            ].map(i => i.id);

            const itemsWithRequirements = ALL_SPELLS.filter(item => !!(item as any).requires).map(i => i.id);
            const bannedIds = [...excludedIds, ...itemsWithRequirements];

            return {
                title: "Magical Beast Spells [MAP: Select Kaarn Spells]",
                limits: {},
                maxTotal: count,
                bannedItemIds: bannedIds,
                bannedGrades: ['purth', 'xuth', 'lekolu', 'sinthru'],
                initialSelectedIds: selections.magicalBeastMap || new Set()
            };
        }
        return null;
    }, [activeMapType, selections.magicalBeastCount, selections.magicalBeastMap]);

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={Constants.BEAST_INTRO.imageSrc} alt="Beasts" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{Constants.BEAST_INTRO.description}</p></div>
            <ReferenceSection title="CATEGORY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{Constants.BEAST_CATEGORIES.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.category.includes(item.id)} onSelect={handleCategorySelect} disabled={isCategoryDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title="SIZE"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{Constants.BEAST_SIZES.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.size === item.id} onSelect={(id) => handleSelect('size', id)} disabled={isSizeDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title="PERKS"><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{Constants.BEAST_PERKS.map(item => {
                const count = selections.perks.get(item.id) || 0;
                const isSelected = count > 0;

                if (item.id === 'hybrid') {
                    return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={() => {}} disabled={isPerkDisabled(item)}>
                         <Counter label="Purchases" count={count} onCountChange={(n) => handlePerkCountChange('hybrid', n)} cost={`${item.cost} points`} max={7} />
                     </ReferenceItemCard>
                }

                if (item.id === 'magical_beast') {
                    const count = selections.magicalBeastCount || 0;
                    const isSelected = count > 0;
                    return (
                        <ReferenceItemCard 
                            key={item.id} 
                            item={item} 
                            layout="default" 
                            isSelected={isSelected} 
                            onSelect={() => {}} 
                            disabled={isPerkDisabled(item)}
                            iconButton={isSelected ? <BookIcon /> : undefined}
                            onIconButtonClick={isSelected ? () => setActiveMapType('magicalBeast') : undefined}
                        >
                            <div className="mt-2 w-full">
                                {isSelected && selections.magicalBeastMap && selections.magicalBeastMap.size > 0 && (
                                    <div className="text-center mb-2">
                                        <div className="text-[10px] text-green-400 font-mono mt-1 space-y-0.5">
                                            {Array.from(selections.magicalBeastMap).slice(0, count).map(id => {
                                                const spell = ALL_SPELLS.find(s => s.id === id);
                                                return <div key={id} className="truncate">+ {spell?.title || id}</div>;
                                            })}
                                        </div>
                                    </div>
                                )}
                                <Counter 
                                    label="Count" 
                                    count={count} 
                                    onCountChange={handleMagicalBeastCountChange} 
                                    cost={`${item.cost} points`} 
                                    layout="small" 
                                />
                            </div>
                        </ReferenceItemCard>
                    );
                }
                return <ReferenceItemCard key={item.id} item={getModifiedPerk(item)} layout="default" isSelected={isSelected} onSelect={(id) => handleSelect('perks', id)} disabled={isPerkDisabled(item)} />;
            })}</div></ReferenceSection>
            {selections.perks.has('chatterbox_beast') && <ReferenceSection title="PERSONALITY TRAITS"><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{Constants.COMPANION_PERSONALITY_TRAITS.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={(id) => handleSelect('traits', id)} />)}</div></ReferenceSection>}
            
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

            {activeMapType && mapModalConfig && (
                <MapSelectionModal
                    onClose={() => setActiveMapType(null)}
                    onSelect={handleMapSelect}
                    initialSelectedIds={mapModalConfig.initialSelectedIds}
                    title={mapModalConfig.title}
                    limits={mapModalConfig.limits}
                    maxTotal={mapModalConfig.maxTotal}
                    bannedItemIds={mapModalConfig.bannedItemIds}
                    bannedGrades={mapModalConfig.bannedGrades as any}
                />
            )}
        </div>
    );
};
