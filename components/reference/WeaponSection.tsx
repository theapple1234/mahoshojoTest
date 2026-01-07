import React, { useEffect, useState } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import * as Constants from '../../constants';
import type { WeaponSelections, CompanionOption } from '../../types';
import { ReferenceSection } from './ReferenceSection';
import { ReferenceItemCard } from './ReferenceItemCard';
import { Counter } from './Counter';
import { BookIcon, WeaponIcon } from '../ui';
import { MapSelectionModal } from './MapSelectionModal';

type ActiveMapType = 'attunedSpell';

export const WeaponSection: React.FC<{ 
    setPoints: (points: number) => void;
    setDiscount: (discount: number) => void;
    selections: WeaponSelections;
    setSelections: React.Dispatch<React.SetStateAction<WeaponSelections>>;
}> = ({ setPoints, setDiscount, selections, setSelections }) => {
    const ctx = useCharacterContext();
    const { selectedMetathermics, selectedNaniteControls, selectedTransformation, language } = ctx;
    const [activeMapType, setActiveMapType] = useState<ActiveMapType | null>(null);
    
    // Localization
    const activeIntro = language === 'ko' ? Constants.WEAPON_INTRO_KO : Constants.WEAPON_INTRO;
    const activeCategories = language === 'ko' ? Constants.WEAPON_CATEGORIES_KO : Constants.WEAPON_CATEGORIES;
    const activePerks = language === 'ko' ? Constants.WEAPON_PERKS_KO : Constants.WEAPON_PERKS;
    const activeTraits = language === 'ko' ? Constants.COMPANION_PERSONALITY_TRAITS_KO : Constants.COMPANION_PERSONALITY_TRAITS;

    const ALL_SPELLS = language === 'ko' ? [
        ...Constants.ESSENTIAL_BOONS_DATA_KO, ...Constants.MINOR_BOONS_DATA_KO, ...Constants.MAJOR_BOONS_DATA_KO,
        ...Constants.TELEKINETICS_DATA_KO, ...Constants.METATHERMICS_DATA_KO,
        ...Constants.ELEANORS_TECHNIQUES_DATA_KO, ...Constants.GENEVIEVES_TECHNIQUES_DATA_KO,
        ...Constants.BREWING_DATA_KO, ...Constants.SOUL_ALCHEMY_DATA_KO, ...Constants.TRANSFORMATION_DATA_KO,
        ...Constants.CHANNELLING_DATA_KO, ...Constants.NECROMANCY_DATA_KO, ...Constants.BLACK_MAGIC_DATA_KO,
        ...Constants.TELEPATHY_DATA_KO, ...Constants.MENTAL_MANIPULATION_DATA_KO,
        ...Constants.ENTRANCE_DATA_KO, ...Constants.FEATURES_DATA_KO, ...Constants.INFLUENCE_DATA_KO,
        ...Constants.NET_AVATAR_DATA_KO, ...Constants.TECHNOMANCY_DATA_KO, ...Constants.NANITE_CONTROL_DATA_KO,
        ...Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA_KO, ...Constants.RIGHTEOUS_CREATION_MAGITECH_DATA_KO, 
        ...Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA_KO, ...Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA_KO,
        ...Constants.STAR_CROSSED_LOVE_PACTS_DATA_KO
    ] : [
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
        // Check raw requirement string or localized version
        const req = perk.requirement;
        const hasBow = selections.category.includes('bow');
        const hasWandStaff = selections.category.includes('wand') || selections.category.includes('staff');
        
        // English / Korean checks
        if ((req.includes("Can't be Bow") || req.includes("활은 선택 불가")) && hasBow) return true;
        if ((req.includes("Can't be Wand or Staff") || req.includes("완드나 스태프는 선택 불가")) && hasWandStaff) return true;
        
        if ((req.includes("Thermal Weaponry") || req.includes("열 병기")) && !selectedMetathermics.has('thermal_weaponry')) return true;
        if ((req.includes("Heavily Armed") || req.includes("중무장")) && !selectedNaniteControls.has('heavily_armed')) return true;
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
                title: language === 'ko' ? "마법 조율 [선택한 마법 중 선택]" : "Attune Spells [MAP: Select from chosen magic]",
                limits: {},
                maxTotal: count,
                bannedItemIds: banned,
                initialSelectedIds: selections.attunedSpellMap || new Set()
            };
        }
        return null;
    }, [activeMapType, selections.perks, selections.attunedSpellMap, ctx, language, ALL_SPELLS]);

    const transformingCount = selections.perks.get('transforming') || 0;
    const maxCategories = 1 + transformingCount;

    const titles = language === 'ko' ? {
        category: "카테고리",
        perks: "특성",
        personality: "성격",
        visual: "커스텀 이미지",
        changeImage: "이미지 변경",
        uploadImage: "이미지 업로드",
        count: "개수",
        points: "포인트"
    } : {
        category: "CATEGORY",
        perks: "PERKS",
        personality: "PERSONALITY TRAITS",
        visual: "CUSTOM VISUAL",
        changeImage: "Change Image",
        uploadImage: "Upload Image",
        count: "Count",
        points: "points"
    };

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={activeIntro.imageSrc} alt="Weapons" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{activeIntro.description}</p></div>
            <ReferenceSection title={titles.category}><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{activeCategories.map(item => {
                const isSelected = selections.category.includes(item.id);
                const disabled = !isSelected && selections.category.length >= maxCategories;
                return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={handleCategorySelect} disabled={disabled} />
            })}</div></ReferenceSection>
            <ReferenceSection title={titles.perks}><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{activePerks.map(item => {
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
                                    label={titles.count} 
                                    count={count} 
                                    onCountChange={(n) => handlePerkCountChange(item.id, n)} 
                                    /* FIX: Avoid using replace on number by using template literal */
                                    cost={`${item.cost} ${titles.points}`} 
                                    layout="small" 
                                />
                            </div>
                        </ReferenceItemCard>
                    );
                }

                if (item.id === 'special_weapon') {
                    return (
                        <ReferenceItemCard
                            key={item.id}
                            item={item}
                            layout="default"
                            isSelected={isSelected}
                            onSelect={(id) => handlePerkSelect(id)}
                            disabled={isPerkDisabled(item)}
                            iconButton={
                                isSelected ? (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); /* Logic handled in parent or modal needed */ }}
                                            className="p-2 rounded-full bg-cyan-900/80 text-cyan-200 hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-500/50"
                                            title={language === 'ko' ? "무기 할당하기" : "Assign Weapon"}
                                        >
                                            <WeaponIcon />
                                        </button>
                                    </>
                                ) : undefined
                            }
                        />
                    );
                }

                if (['transforming'].includes(item.id)) {
                     return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={() => {}} disabled={isPerkDisabled(item)}>
                         {/* FIX: Avoid using replace on number by using template literal */}
                         <Counter label={titles.count} count={count} onCountChange={(n) => handlePerkCountChange(item.id, n)} cost={`${item.cost} ${titles.points}`} layout="small" />
                     </ReferenceItemCard>
                }

                return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={handlePerkSelect} disabled={isPerkDisabled(item)} />
            })}</div></ReferenceSection>
            {selections.perks.has('chatterbox') && <ReferenceSection title={titles.personality}><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{activeTraits.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={handleWeaponTraitSelect} />)}</div></ReferenceSection>}
            
            <ReferenceSection title={titles.visual}>
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
                                    <span className="text-xs text-white font-cinzel">{titles.changeImage}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-gray-500 font-cinzel">{titles.uploadImage}</span>
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
