
import React, { useEffect, useState } from 'react';
import * as Constants from '../../constants';
import type { BeastSelections, CompanionOption } from '../../types';
import { ReferenceSection } from './ReferenceSection';
import { ReferenceItemCard } from './ReferenceItemCard';
import { MapSelectionModal } from './MapSelectionModal';
import { BookIcon } from '../ui';
import { Counter } from './Counter';
import { useCharacterContext } from '../../context/CharacterContext';

type ActiveMapType = 'magicalBeast';

export const BeastSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: BeastSelections;
    setSelections: React.Dispatch<React.SetStateAction<BeastSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
    const { 
        language,
        selectedNecromancy,
        selectedArcaneConstructsPowers,
        selectedNaniteControls
    } = useCharacterContext();
    const [activeMapType, setActiveMapType] = useState<ActiveMapType | null>(null);
    const [urlInput, setUrlInput] = useState('');
    
    // Localization
    const activeIntro = language === 'ko' ? Constants.BEAST_INTRO_KO : Constants.BEAST_INTRO;
    const activeCategories = language === 'ko' ? Constants.BEAST_CATEGORIES_KO : Constants.BEAST_CATEGORIES;
    const activeSizes = language === 'ko' ? Constants.BEAST_SIZES_KO : Constants.BEAST_SIZES;
    const activePerks = language === 'ko' ? Constants.BEAST_PERKS_KO : Constants.BEAST_PERKS;
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
        selections.category.forEach(catId => {
            total += Constants.BEAST_CATEGORIES.find(c => c.id === catId)?.cost ?? 0;
        });
        if (selections.size) total += Constants.BEAST_SIZES.find(s => s.id === selections.size)?.cost ?? 0;
        selections.perks.forEach((count, perkId) => {
            if (perkId === 'magical_beast') return; // Handled separately
            const perk = Constants.BEAST_PERKS.find(p => p.id === perkId);
            if (perk) {
                let cost = perk.cost ?? 0;
                /* FIX: Use perkId instead of id in forEach callback */
                if (perkId === 'unnerving_appearance' && selections.perks.has('undead_perk')) cost = 0;
                if (perkId === 'steel_skin' && selections.perks.has('automaton_perk')) cost = 0;
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
    
    const handleUrlLoad = () => {
        if (!urlInput.trim()) return;
        setSelections(prev => ({ ...prev, customImage: urlInput.trim() }));
    };
    
    const isPerkDisabled = (perk: CompanionOption) => {
        if (perk.id === 'noble_steed') return !['medium', 'large', 'humongous'].includes(selections.size ?? '');
        
        if (perk.id === 'automaton_perk') {
             const hasRoboticist = selectedArcaneConstructsPowers.has('roboticist_i');
             const hasNaniteForm = selectedNaniteControls.has('nanite_form');
             return !hasRoboticist && !hasNaniteForm;
        }
        
        if (perk.id === 'undead_perk') {
            return !selectedNecromancy.has('undead_beast');
        }
        
        return false;
    }

    const getModifiedPerk = (perk: CompanionOption): CompanionOption => {
        if (perk.id === 'unnerving_appearance' && selections.perks.has('undead_perk')) {
             return { ...perk, cost: 0, requirement: language === 'ko' ? '언데드 무료' : 'Free for Undead' };
        }
        if (perk.id === 'steel_skin' && selections.perks.has('automaton_perk')) {
            return { ...perk, cost: 0, requirement: language === 'ko' ? '오토마톤 무료' : 'Free for Automaton' };
        }
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
            
            // Build excluded IDs based on language context
            const excludedIds = [
                ...(language === 'ko' ? [
                    ...Constants.ESSENTIAL_BOONS_DATA_KO, ...Constants.MINOR_BOONS_DATA_KO, ...Constants.MAJOR_BOONS_DATA_KO,
                    ...Constants.BREWING_DATA_KO, ...Constants.SOUL_ALCHEMY_DATA_KO, ...Constants.TRANSFORMATION_DATA_KO,
                    ...Constants.ENTRANCE_DATA_KO, ...Constants.FEATURES_DATA_KO, ...Constants.INFLUENCE_DATA_KO,
                    ...Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA_KO, ...Constants.RIGHTEOUS_CREATION_MAGITECH_DATA_KO, 
                    ...Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA_KO, ...Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA_KO,
                ] : [
                    ...Constants.ESSENTIAL_BOONS_DATA, ...Constants.MINOR_BOONS_DATA, ...Constants.MAJOR_BOONS_DATA,
                    ...Constants.BREWING_DATA, ...Constants.SOUL_ALCHEMY_DATA, ...Constants.TRANSFORMATION_DATA,
                    ...Constants.ENTRANCE_DATA, ...Constants.FEATURES_DATA, ...Constants.INFLUENCE_DATA,
                    ...Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA, ...Constants.RIGHTEOUS_CREATION_MAGITECH_DATA, 
                    ...Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, ...Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA,
                ])
            ].map(i => i.id);

            const itemsWithRequirements = ALL_SPELLS.filter(item => !!(item as any).requires).map(i => i.id);
            const bannedIds = [...excludedIds, ...itemsWithRequirements];

            return {
                title: language === 'ko' ? "마수 마법 [카른 등급 마법 선택]" : "Magical Beast Spells [MAP: Select Kaarn Spells]",
                limits: {},
                maxTotal: count,
                bannedItemIds: bannedIds,
                bannedGrades: ['purth', 'xuth', 'lekolu', 'sinthru'],
                initialSelectedIds: selections.magicalBeastMap || new Set()
            };
        }
        return null;
    }, [activeMapType, selections.magicalBeastCount, selections.magicalBeastMap, language, ALL_SPELLS]);

    const titles = language === 'ko' ? {
        category: "카테고리",
        size: "크기",
        perks: "특성",
        personality: "성격",
        visual: "커스텀 이미지",
        changeImage: "이미지 변경",
        uploadImage: "이미지 업로드",
        count: "개수",
        purchases: "구매 횟수",
        points: "포인트"
    } : {
        category: "CATEGORY",
        size: "SIZE",
        perks: "PERKS",
        personality: "PERSONALITY TRAITS",
        visual: "CUSTOM VISUAL",
        changeImage: "Change Image",
        uploadImage: "Upload Image",
        count: "Count",
        purchases: "Purchases",
        points: "points"
    };

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={activeIntro.imageSrc} alt="Beasts" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{activeIntro.description}</p></div>
            <ReferenceSection title={titles.category}><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{activeCategories.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.category.includes(item.id)} onSelect={handleCategorySelect} disabled={isCategoryDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title={titles.size}><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{activeSizes.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.size === item.id} onSelect={(id) => handleSelect('size', id)} disabled={isSizeDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title={titles.perks}><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{activePerks.map(item => {
                const count = selections.perks.get(item.id) || 0;
                const isSelected = count > 0;

                if (item.id === 'hybrid') {
                    return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={() => {}} disabled={isPerkDisabled(item)}>
                         {/* FIX: Avoid using replace on number by using template literal */}
                         <Counter label={titles.purchases} count={count} onCountChange={(n) => handlePerkCountChange('hybrid', n)} cost={`${item.cost} ${titles.points}`} max={7} />
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
                                    label={titles.count} 
                                    count={count} 
                                    onCountChange={handleMagicalBeastCountChange} 
                                    /* FIX: Avoid using replace on number by using template literal */
                                    cost={`${item.cost} ${titles.points}`} 
                                    layout="small" 
                                />
                            </div>
                        </ReferenceItemCard>
                    );
                }
                return <ReferenceItemCard key={item.id} item={getModifiedPerk(item)} layout="default" isSelected={isSelected} onSelect={(id) => handleSelect('perks', id)} disabled={isPerkDisabled(item)} />;
            })}</div></ReferenceSection>
            {selections.perks.has('chatterbox_beast') && <ReferenceSection title={titles.personality}><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{activeTraits.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={(id) => handleSelect('traits', id)} />)}</div></ReferenceSection>}
            
            <ReferenceSection title={titles.visual}>
                 <div className="flex flex-col items-center gap-4">
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

                     <div className="mt-4 w-full max-w-md">
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text" 
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder={language === 'ko' ? "이미지 주소 (URL) 입력..." : "Paste Image URL..."}
                                className="flex-grow bg-black/40 border border-gray-700 text-gray-300 text-xs px-3 py-2 rounded focus:border-cyan-500 focus:outline-none"
                            />
                            <button 
                                onClick={handleUrlLoad}
                                className="px-4 py-2 bg-gray-800 text-gray-300 text-xs font-bold rounded border border-gray-600 hover:bg-gray-700 hover:text-white transition-colors"
                            >
                                {language === 'ko' ? "적용" : "Load"}
                            </button>
                        </div>
                        
                        <div className="bg-yellow-900/10 border border-yellow-700/30 p-3 rounded text-center">
                            <p className="text-[10px] text-yellow-500/80 font-bold mb-1 uppercase tracking-wider">
                                {language === 'ko' ? "⚠️ CORS 경고" : "⚠️ CORS Warning"}
                            </p>
                            <p className="text-[10px] text-gray-500 mb-2 leading-relaxed">
                                {language === 'ko' 
                                    ? "외부 이미지로 가져온 사진은 CORS 문제로 인해 빌드 다운로드 시 포함되지 않을 수 있습니다. 해당 사이트가 CORS를 지원하는지 꼭 검증해주세요."
                                    : "External images might not appear in build downloads due to CORS. Please ensure the host supports it."}
                            </p>
                            <div className="flex justify-center gap-4 text-[10px] font-mono">
                                <span className="text-green-500/70">
                                    {language === 'ko' ? "권장: imgbb" : "Good: imgbb"}
                                </span>
                                <span className="text-red-500/70">
                                    {language === 'ko' ? "비권장: imgur" : "Bad: imgur"}
                                </span>
                            </div>
                        </div>
                    </div>
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
