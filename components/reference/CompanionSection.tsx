
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
import { useCharacterContext } from '../../context/CharacterContext';

// Map spells to their Blessing ID for counting purposes (using English keys for stable logic)
const SPELL_BLESSING_MAP: Record<string, string> = {};
const registerBlessing = (spells: any[], blessingId: string) => {
    spells.forEach(s => SPELL_BLESSING_MAP[s.id] = blessingId);
};

// Register English data for ID mapping consistency
registerBlessing([...Constants.ESSENTIAL_BOONS_DATA, ...Constants.MINOR_BOONS_DATA, ...Constants.MAJOR_BOONS_DATA], 'good_tidings');
registerBlessing([...Constants.TELEKINETICS_DATA, ...Constants.METATHERMICS_DATA], 'compelling_will');
registerBlessing([...Constants.ELEANORS_TECHNIQUES_DATA, ...Constants.GENEVIEVES_TECHNIQUES_DATA], 'worldly_wisdom');
registerBlessing([...Constants.BREWING_DATA, ...Constants.SOUL_ALCHEMY_DATA, ...Constants.TRANSFORMATION_DATA], 'bitter_dissatisfaction');
registerBlessing([...Constants.CHANNELLING_DATA, ...Constants.NECROMANCY_DATA, ...Constants.BLACK_MAGIC_DATA], 'lost_hope');
registerBlessing([...Constants.TELEPATHY_DATA, ...Constants.MENTAL_MANIPULATION_DATA], 'fallen_peace');
registerBlessing([...Constants.ENTRANCE_DATA, ...Constants.FEATURES_DATA, ...Constants.INFLUENCE_DATA], 'gracious_defeat');
registerBlessing([...Constants.NET_AVATAR_DATA, ...Constants.TECHNOMANCY_DATA, ...Constants.NANITE_CONTROL_DATA], 'closed_circuits');
registerBlessing([...Constants.RIGHTEOUS_CREATION_SPECIALTIES_DATA, ...Constants.RIGHTEOUS_CREATION_MAGITECH_DATA, ...Constants.RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, ...Constants.RIGHTEOUS_CREATION_METAMAGIC_DATA], 'righteous_creation');
registerBlessing(Constants.STAR_CROSSED_LOVE_PACTS_DATA, 'star_crossed_love');

type ActiveMapType = 'specialWeapon' | 'signaturePower' | 'darkMagician' | 'powerLevel';

export const CompanionSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: CompanionSelections;
    setSelections: React.Dispatch<React.SetStateAction<CompanionSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
    const { language } = useCharacterContext();
    const [isInhumanFormModalOpen, setIsInhumanFormModalOpen] = useState(false);
    const [isSpecialWeaponModalOpen, setIsSpecialWeaponModalOpen] = useState(false);
    const [activeMapType, setActiveMapType] = useState<ActiveMapType | null>(null);
    const [urlInput, setUrlInput] = useState('');

    const activeIntro = language === 'ko' ? Constants.COMPANION_INTRO_KO : Constants.COMPANION_INTRO;
    const activeCategories = language === 'ko' ? Constants.COMPANION_CATEGORIES_KO : Constants.COMPANION_CATEGORIES;
    const activeRelationships = language === 'ko' ? Constants.COMPANION_RELATIONSHIPS_KO : Constants.COMPANION_RELATIONSHIPS;
    const activeTraits = language === 'ko' ? Constants.COMPANION_PERSONALITY_TRAITS_KO : Constants.COMPANION_PERSONALITY_TRAITS;
    const activePerks = language === 'ko' ? Constants.COMPANION_PERKS_KO : Constants.COMPANION_PERKS;
    const activePowerLevels = language === 'ko' ? Constants.COMPANION_POWER_LEVELS_KO : Constants.COMPANION_POWER_LEVELS;

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
        const allItems = [...Constants.COMPANION_CATEGORIES, ...Constants.COMPANION_RELATIONSHIPS, ...Constants.COMPANION_PERSONALITY_TRAITS, ...Constants.COMPANION_PERKS, ...Constants.COMPANION_POWER_LEVELS];
        
        if (selections.category) total += allItems.find(i => i.id === selections.category)?.cost ?? 0;
        if (selections.relationship) total += allItems.find(i => i.id === selections.relationship)?.cost ?? 0;
        if (selections.powerLevel) total += allItems.find(i => i.id === selections.powerLevel)?.cost ?? 0;
        selections.traits.forEach(traitId => { total += allItems.find(i => i.id === traitId)?.cost ?? 0; });
        selections.perks.forEach((count, perkId) => { 
            const perk = allItems.find(i => i.id === perkId);
            if (perk) {
                if (perkId === 'signature_power') {
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
            const activeSpells = Array.from(selections.signaturePowerMap || []).slice(0, sigPowerCount);
            activeSpells.forEach(id => {
                const spell = ALL_SPELLS.find(s => s.id === id);
                if (spell?.grade === 'xuth') {
                    xuthCount++;
                }
            });
            if (xuthCount >= 1) total += 5;
            if (xuthCount >= 2) total += 10;
        }
        
        total -= (selections.bpSpent || 0) * 2; 

        setPoints(total);
    }, [selections, setPoints, ALL_SPELLS]); // Include ALL_SPELLS in dep array just in case

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
            // Check if either name or map has data, then clear
            if (selections.specialWeaponName || (selections.specialWeaponMap && selections.specialWeaponMap.size > 0)) {
                setSelections(prev => ({ ...prev, specialWeaponName: null, specialWeaponMap: new Set() }));
            }
        }
    }, [selections.perks, selections.specialWeaponName, selections.specialWeaponMap, setSelections]);
    
    // Dark Magician Logic: Validate Sinthru selections based on other spells
    useEffect(() => {
        if (selections.darkMagicianMap && selections.darkMagicianMap.size > 0) {
            const countsByBlessing: Record<string, number> = {};
            
            // Count spells from Power Level and Signature Power
            const sourceMaps = [selections.powerLevelMap, selections.signaturePowerMap];
            sourceMaps.forEach(map => {
                if (map) {
                    map.forEach(spellId => {
                        const blessing = SPELL_BLESSING_MAP[spellId];
                        if (blessing) {
                            countsByBlessing[blessing] = (countsByBlessing[blessing] || 0) + 1;
                        }
                    });
                }
            });

            let changed = false;
            const newDarkMap = new Set<string>(selections.darkMagicianMap);

            // Check each selected Dark Magician spell
            newDarkMap.forEach(spellId => {
                const blessing = SPELL_BLESSING_MAP[spellId];
                // Requirement: Must have at least 2 other spells in the same blessing
                if (!blessing || (countsByBlessing[blessing] || 0) < 2) {
                    newDarkMap.delete(spellId);
                    changed = true;
                }
            });

            if (changed) {
                setSelections(prev => ({ ...prev, darkMagicianMap: newDarkMap }));
            }
        }
    }, [selections.powerLevelMap, selections.signaturePowerMap, setSelections]);


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
    
    const handleUrlLoad = () => {
        if (!urlInput.trim()) return;
        setSelections(prev => ({ ...prev, customImage: urlInput.trim() }));
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
            const extra = language === 'ko' ? " 추가 마법 슬롯을 허용합니다 (책 아이콘 클릭)." : " Allows extra spell slots (click Book icon).";
            return { ...perk, description: perk.description + extra };
        }
        if (perk.id === 'signature_power') {
            const desc = language === 'ko' 
                ? "당신의 동료는 자신을 대표하는 주력기를 갖게 됩니다. 주력기는 BOOST 버튼을 눌렀을 때와 같은 효과를 받습니다. 여러 번 선택할 수 있지만, 첫 번째 이후로는 {w}10점{/w}이 소모됩니다. 만약 {r}주스{/r} 등급 마법을 선택하면 비용이 두 배가 됩니다."
                : "Your companion will have a signature power which she's most known for. It will be affected by the specific boost effect usually applied by the BOOST buttons. Can be taken multiple times, but each purchase beyond the first will cost {w}10 Points{/w}. If you choose a {r}Xuth{/r}-tier spell, the price of this perk is doubled.";
            return { ...perk, description: desc };
        }
        return perk;
    }

    const mapModalConfig = React.useMemo(() => {
        if (activeMapType === 'specialWeapon') {
            return {
                title: language === 'ko' ? "특별한 무기 마법부여" : "Special Weapon Enchantments",
                limits: { kaarn: 2, purth: 1 },
                exclusive: true,
                maxTotal: undefined,
                bannedGrades: ['xuth', 'sinthru', 'lekolu'],
                initialSelectedIds: selections.specialWeaponMap || new Set()
            };
        } else if (activeMapType === 'signaturePower') {
            const signatureCount = selections.perks.get('signature_power') || 0;
            return {
                title: language === 'ko' ? "주력기" : "Signature Powers",
                limits: {},
                exclusive: false,
                maxTotal: signatureCount,
                bannedGrades: ['sinthru'],
                initialSelectedIds: selections.signaturePowerMap || new Set()
            };
        } else if (activeMapType === 'darkMagician') {
            const darkMagicCount = selections.perks.get('dark_magician') || 0;
            
            // Calculate eligible blessings (count >= 2)
            const countsByBlessing: Record<string, number> = {};
            const sourceMaps = [selections.powerLevelMap, selections.signaturePowerMap];
            sourceMaps.forEach(map => {
                if (map) {
                    map.forEach(spellId => {
                        const blessing = SPELL_BLESSING_MAP[spellId];
                        if (blessing) countsByBlessing[blessing] = (countsByBlessing[blessing] || 0) + 1;
                    });
                }
            });

            // Find all Sinthru spells
            const sinthruSpells = ALL_SPELLS.filter(s => s.grade === 'sinthru');
            
            // Identify banned IDs (Sinthru spells from blessings with < 2 count)
            const bannedIds = sinthruSpells
                .filter(s => {
                    const blessing = SPELL_BLESSING_MAP[s.id];
                    return !blessing || (countsByBlessing[blessing] || 0) < 2;
                })
                .map(s => s.id);

            return {
                title: language === 'ko' ? "흑마술" : "Dark Arts",
                limits: {},
                exclusive: false,
                maxTotal: darkMagicCount,
                bannedGrades: ['kaarn', 'purth', 'juathas', 'xuth', 'lekolu'],
                bannedItemIds: bannedIds,
                initialSelectedIds: selections.darkMagicianMap || new Set(),
                customValidator: (selectedIds: Set<string>, _b, _g) => {
                    return null; 
                }
            };
        } else if (activeMapType === 'powerLevel') {
            const level = selections.powerLevel;
            const essentialBoonIds = (language === 'ko' ? Constants.ESSENTIAL_BOONS_DATA_KO : Constants.ESSENTIAL_BOONS_DATA).map(b => b.id);

            if (level === 'below_average') {
                return {
                    title: language === 'ko' ? "평균 이하 마법" : "Below Average Spells",
                    limits: { kaarn: 3, purth: 1 },
                    maxBlessings: 2,
                    bannedGrades: ['xuth', 'sinthru'],
                    mandatoryItemIds: essentialBoonIds,
                    initialSelectedIds: selections.powerLevelMap || new Set()
                };
            } else if (level === 'average') {
                return {
                    title: language === 'ko' ? "평균 마법" : "Average Spells",
                    limits: { kaarn: 6, purth: 2 },
                    maxBlessings: 3,
                    bannedGrades: ['xuth', 'sinthru'],
                    mandatoryItemIds: essentialBoonIds,
                    initialSelectedIds: selections.powerLevelMap || new Set()
                };
            } else if (level === 'above_average') {
                return {
                    title: language === 'ko' ? "평균 이상 마법" : "Above Average Spells",
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
                                return language === 'ko' 
                                    ? "주스 등급 마법을 선택하려면, 해당 축복 내에 최소 4개의 다른 마법(총 5개)이 있어야 합니다."
                                    : "To select a Xuth spell, you must have\nat least 4 other spells in that Blessing (Total 5).";
                            }
                        }
                        return null;
                    }
                };
            }
        }
        return null;
    }, [activeMapType, selections.perks, selections.specialWeaponMap, selections.signaturePowerMap, selections.darkMagicianMap, selections.powerLevel, selections.powerLevelMap, language, ALL_SPELLS]);

    const titles = language === 'ko' ? {
        category: "카테고리",
        relationship: "관계",
        traits: "성격",
        perks: "특성",
        powerLevel: "힘의 척도",
        visual: "커스텀 이미지",
        changeImage: "이미지 변경",
        uploadImage: "이미지 업로드",
        count: "개수",
        points: "포인트",
        assignedForm: "할당된 형상:",
        assignedWeapon: "할당된 무기:",
        careerTier: "경력 단계 선택",
        standard: "일반",
        highPrestige: "고위직",
        council: "의회"
    } : {
        category: "CATEGORY",
        relationship: "RELATIONSHIP",
        traits: "PERSONALITY TRAITS",
        perks: "PERKS",
        powerLevel: "POWER LEVEL",
        visual: "CUSTOM VISUAL",
        changeImage: "Change Image",
        uploadImage: "Upload Image",
        count: "Count",
        points: "points",
        assignedForm: "Assigned Form:",
        assignedWeapon: "Assigned Weapon:",
        careerTier: "Select Career Tier",
        standard: "Standard",
        highPrestige: "High Prestige",
        council: "Council"
    };

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={activeIntro.imageSrc} alt="Companions" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{activeIntro.description}</p></div>
            <ReferenceSection title={titles.category}><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{activeCategories.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.category === item.id} onSelect={(id) => handleSelect('category', id)} disabled={isCategoryDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title={titles.relationship}><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{activeRelationships.map(item => <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={selections.relationship === item.id} onSelect={(id) => handleSelect('relationship', id)} disabled={isRelationshipDisabled(item)} />)}</div></ReferenceSection>
            <ReferenceSection title={titles.traits}><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{activeTraits.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={(id) => handleSelect('traits', id)} />)}</div></ReferenceSection>
            <ReferenceSection title={titles.perks}><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{activePerks.map(item => {
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
                                <p className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-bold mb-2 text-center border-b border-cyan-900/30 pb-1">{titles.careerTier}</p>
                                <div className="flex flex-col gap-1.5">
                                    {[
                                        { val: 1, label: titles.standard, cost: 5 },
                                        { val: 2, label: titles.highPrestige, cost: 10 },
                                        { val: 3, label: titles.council, cost: 15 }
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
                                            <span className={`font-mono text-[10px] ${count === opt.val ? 'text-cyan-300' : 'text-gray-500'}`}>{opt.cost} {language === 'ko' ? '' : 'pts'}</span>
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
                                    <p className="text-xs text-gray-400">{titles.assignedForm}</p>
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
                                            <p className="text-xs text-gray-400">{titles.assignedWeapon}</p>
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
                                    label={titles.count} 
                                    count={count} 
                                    onCountChange={(n) => handlePerkCountChange(item.id, n)} 
                                    /* FIX: Avoid using replace on number by using template literal */
                                    cost={item.id === 'signature_power' && count > 0 ? `10 ${titles.points}` : `${item.cost} ${titles.points}`} 
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
                                    label={titles.count} 
                                    count={count} 
                                    onCountChange={(n) => handlePerkCountChange(item.id, n)} 
                                    /* FIX: Avoid using replace on number by using template literal */
                                    cost={`${item.cost} ${titles.points}`} 
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
            <ReferenceSection title={titles.powerLevel}><div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">{activePowerLevels.map(item => (
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
            
            {isInhumanFormModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsInhumanFormModalOpen(false)}
                    onSelect={handleAssignInhumanForm}
                    currentBeastName={selections.inhumanFormBeastName || null}
                    pointLimit={40}
                    title={language === 'ko' ? "인외의 형상 할당" : "Assign Inhuman Form"}
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
                    title={language === 'ko' ? "특별한 무기 할당" : "Assign Special Weapon"}
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
