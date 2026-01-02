
import React, { useEffect, useState } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import * as Constants from '../../constants';
import type { WeaponSelections, CompanionOption } from '../../types';
import { ReferenceSection } from './ReferenceSection';
import { ReferenceItemCard } from './ReferenceItemCard';
import { Counter } from './Counter';
import { BookIcon } from '../ui';
import { MapSelectionModal } from './MapSelectionModal';

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

type ActiveMapType = 'attunedSpell';

export const WeaponSection: React.FC<{ 
    setPoints: (points: number) => void;
    setDiscount: (discount: number) => void;
    selections: WeaponSelections;
    setSelections: React.Dispatch<React.SetStateAction<WeaponSelections>>;
}> = ({ setPoints, setDiscount, selections, setSelections }) => {
    const ctx = useCharacterContext();
    const { selectedMetathermics, selectedNaniteControls, selectedTransformation } = ctx;
    const [activeMapType, setActiveMapType] = useState<ActiveMapType | null>(null);

    useEffect(() => {
        let total = 0;
        selections.perks.forEach((count, perkId) => {
            const perk = Constants.WEAPON_PERKS.find(p => p.id === perkId);
            if (perk) total += (perk.cost ?? 0) * count;
        });
        if (selections.perks.has('chatterbox')) {
            selections.traits.forEach(traitId => {
                const trait = Constants.COMPANION_PERSONALITY_TRAITS.find(t => t.id === traitId);
                if (trait) total += trait.cost ?? 0;
            });
        }
        
        let discount = 0;
        const isMelee = selections.category.some(c => ['blunt_melee', 'bladed_melee'].includes(c));
        const hasHighPower = selections.perks.has('high_power');
        const hasTransmutation = selectedTransformation.has('material_transmutation');

        if (isMelee && hasHighPower && hasTransmutation) {
            discount = 8;
        }
        
        total -= (selections.bpSpent || 0) * 2; // Apply Sun Forger's Boon Discount

        setPoints(total);
        setDiscount(discount);
    }, [selections, setPoints, setDiscount, selectedTransformation]);

    const handleCategorySelect = (id: string) => {
        const transformingCount = selections.perks.get('transforming') || 0;
        const maxCategories = 1 + transformingCount;

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

    const handlePerkSelect = (id: string) => {
        if (['transforming', 'attuned_spell'].includes(id)) return; // Handled by counter logic inside card

        setSelections(prev => {
            const newPerks = new Map(prev.perks);
            let newTraits = prev.traits;
            if (newPerks.has(id)) {
                newPerks.delete(id);
                if (id === 'chatterbox') newTraits = new Set();
            } else {
                newPerks.set(id, 1);
            }
            return { ...prev, perks: newPerks, traits: newTraits };
        });
    };

    const handlePerkCountChange = (id: string, count: number) => {
        setSelections(prev => {
            const newPerks = new Map(prev.perks);
            if (count <= 0) newPerks.delete(id);
            else newPerks.set(id, count);
            
            // If reducing transformation count, ensure categories are valid
            if (id === 'transforming') {
                const maxCategories = 1 + count;
                if (prev.category.length > maxCategories) {
                    return { ...prev, perks: newPerks, category: prev.category.slice(0, maxCategories) };
                }
            }
            
            return { ...prev, perks: newPerks };
        });
    };

    const handleWeaponTraitSelect = (id: string) => {
        setSelections(prev => {
            const newTraits = new Set(prev.traits);
            if (newTraits.has(id)) newTraits.delete(id);
            else newTraits.add(id);
            return { ...prev, traits: newTraits };
        });
    };

    const handleMapSelect = (selectedIds: Set<string>) => {
        setSelections(prev => {
            return { ...prev, attunedSpellMap: selectedIds };
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
        if (!perk.requirement) return false;
        const hasBow = selections.category.includes('bow');
        const hasWandStaff = selections.category.includes('wand') || selections.category.includes('staff');
        
        if (perk.requirement.includes("Can't be Bow") && hasBow) return true;
        if (perk.requirement.includes("Can't be Wand or Staff") && hasWandStaff) return true;
        
        if (perk.requirement.includes("Thermal Weaponry") && !selectedMetathermics.has('thermal_weaponry')) return true;
        if (perk.requirement.includes("Heavily Armed") && !selectedNaniteControls.has('heavily_armed')) return true;
        return false;
    };

    const getUserSpells = () => {
        return new Set([
            ...ctx.selectedEssentialBoons, ...ctx.selectedMinorBoons, ...ctx.selectedMajorBoons,
            ...ctx.selectedTelekinetics, ...ctx.selectedMetathermics,
            ...ctx.selectedEleanorsTechniques, ...ctx.selectedGenevievesTechniques,
            ...ctx.selectedBrewing, ...ctx.selectedSoulAlchemy, ...ctx.selectedTransformation,
            ...ctx.selectedChannelling, ...ctx.selectedNecromancy, ...ctx.selectedBlackMagic,
            ...ctx.selectedTelepathy, ...ctx.selectedMentalManipulation,
            ...ctx.selectedEntrance, ...ctx.selectedInfluence, ...ctx.selectedGraciousDefeatSigils,
            ...ctx.selectedNetAvatars, ...ctx.selectedTechnomancies, ...ctx.selectedNaniteControls,
            ...ctx.selectedSpecialties, ...ctx.selectedMagitechPowers, ...ctx.selectedArcaneConstructsPowers, ...ctx.selectedMetamagicPowers,
            ...ctx.selectedStarCrossedLovePacts
        ]);
    };

    const mapModalConfig = React.useMemo(() => {
        if (activeMapType === 'attunedSpell') {
            const userSpells = getUserSpells();
            const allSpellIds = ALL_SPELLS.map(s => s.id);
            const banned = allSpellIds.filter(id => !userSpells.has(id));
            const count = selections.perks.get('attuned_spell') || 0;
            
            return {
                title: "Attune Spells [MAP: Select from chosen magic]",
                limits: {},
                maxTotal: count,
                bannedItemIds: banned,
                initialSelectedIds: selections.attunedSpellMap || new Set()
            };
        }
        return null;
    }, [activeMapType, selections.perks, selections.attunedSpellMap, ctx]);

    const transformingCount = selections.perks.get('transforming') || 0;
    const maxCategories = 1 + transformingCount;

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={Constants.WEAPON_INTRO.imageSrc} alt="Weapons" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{Constants.WEAPON_INTRO.description}</p></div>
            <ReferenceSection title="CATEGORY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{Constants.WEAPON_CATEGORIES.map(item => {
                const isSelected = selections.category.includes(item.id);
                const disabled = !isSelected && selections.category.length >= maxCategories;
                return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={handleCategorySelect} disabled={disabled} />
            })}</div></ReferenceSection>
            <ReferenceSection title="PERKS"><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{Constants.WEAPON_PERKS.map(item => {
                const count = selections.perks.get(item.id) || 0;
                const isSelected = count > 0;
                
                if (item.id === 'attuned_spell') {
                    return (
                        <ReferenceItemCard 
                            key={item.id} 
                            item={item} 
                            layout="default" 
                            isSelected={isSelected} 
                            onSelect={() => {}} 
                            disabled={isPerkDisabled(item)}
                            iconButton={isSelected ? <BookIcon /> : undefined}
                            onIconButtonClick={isSelected ? () => setActiveMapType('attunedSpell') : undefined}
                        >
                            <div className="mt-2 w-full">
                                {isSelected && selections.attunedSpellMap && selections.attunedSpellMap.size > 0 && (
                                    <div className="text-center mb-2">
                                        <div className="text-[10px] text-green-400 font-mono mt-1 space-y-0.5">
                                            {Array.from(selections.attunedSpellMap).slice(0, count).map(id => {
                                                const spell = ALL_SPELLS.find(s => s.id === id);
                                                return <div key={id} className="truncate">+ {spell?.title || id}</div>;
                                            })}
                                        </div>
                                    </div>
                                )}
                                <Counter 
                                    label="Count" 
                                    count={count} 
                                    onCountChange={(n) => handlePerkCountChange(item.id, n)} 
                                    cost={`${item.cost} points`} 
                                    layout="small" 
                                />
                            </div>
                        </ReferenceItemCard>
                    );
                }

                if (['transforming'].includes(item.id)) {
                     return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={() => {}} disabled={isPerkDisabled(item)}>
                         <Counter label="Count" count={count} onCountChange={(n) => handlePerkCountChange(item.id, n)} cost={`${item.cost} points`} layout="small" />
                     </ReferenceItemCard>
                }

                return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={handlePerkSelect} disabled={isPerkDisabled(item)} />
            })}</div></ReferenceSection>
            {selections.perks.has('chatterbox') && <ReferenceSection title="PERSONALITY TRAITS"><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{Constants.COMPANION_PERSONALITY_TRAITS.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={handleWeaponTraitSelect} />)}</div></ReferenceSection>}
            
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
                />
            )}
        </div>
    );
};
