
import React, { useEffect, useState } from 'react';
import * as Constants from '../../constants';
import type { VehicleSelections, CompanionOption } from '../../types';
import { ReferenceSection } from './ReferenceSection';
import { ReferenceItemCard } from './ReferenceItemCard';
import { Counter } from './Counter';
import { useCharacterContext } from '../../context/CharacterContext';

export const VehicleSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: VehicleSelections;
    setSelections: React.Dispatch<React.SetStateAction<VehicleSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
    const { language } = useCharacterContext();
    const [urlInput, setUrlInput] = useState('');
    
    const activeIntro = language === 'ko' ? Constants.VEHICLE_INTRO_KO : Constants.VEHICLE_INTRO;
    const activeCategories = language === 'ko' ? Constants.VEHICLE_CATEGORIES_KO : Constants.VEHICLE_CATEGORIES;
    const activePerks = language === 'ko' ? Constants.VEHICLE_PERKS_KO : Constants.VEHICLE_PERKS;
    const activeTraits = language === 'ko' ? Constants.COMPANION_PERSONALITY_TRAITS_KO : Constants.COMPANION_PERSONALITY_TRAITS;

    useEffect(() => {
        let total = 0;
        selections.category.forEach(catId => {
            total += Constants.VEHICLE_CATEGORIES.find(c => c.id === catId)?.cost ?? 0;
        });
        selections.perks.forEach((count, perkId) => {
            const perk = Constants.VEHICLE_PERKS.find(p => p.id === perkId);
            if (perk) {
                let cost = perk.cost ?? 0;
                if (perkId === 'chatterbox_vehicle' && selections.category.includes('car')) cost = 0;
                if (perkId === 'hellfire_volley' && (selections.category.includes('tank') || selections.category.includes('mecha'))) cost = 0;
                total += cost * count;
            }
        });
        if (selections.perks.has('chatterbox_vehicle')) {
            selections.traits.forEach(traitId => {
                const trait = Constants.COMPANION_PERSONALITY_TRAITS.find(t => t.id === traitId);
                if (trait) total += trait.cost ?? 0;
            });
        }
        
        total -= (selections.bpSpent || 0) * 2; // Apply Sun Forger's Boon Discount

        setPoints(total);
    }, [selections, setPoints]);

    const handleCategorySelect = (id: string) => {
        const transformingCount = selections.perks.get('transforming_vehicle') || 0;
        const maxCategories = 1 + transformingCount;
        const item = Constants.VEHICLE_CATEGORIES.find(c => c.id === id);
        const firstCategoryCost = selections.category.length > 0 ? Constants.VEHICLE_CATEGORIES.find(c => c.id === selections.category[0])?.cost ?? 0 : Infinity;

        setSelections(prev => {
            const newCategories = [...prev.category];
            if (newCategories.includes(id)) {
                return { ...prev, category: newCategories.filter(c => c !== id) };
            } else {
                if (newCategories.length < maxCategories) {
                    // Check cost constraint if this is not the first category
                    if (newCategories.length > 0 && (item?.cost ?? 0) > firstCategoryCost) {
                        return prev; // Cannot add, too expensive
                    }
                    return { ...prev, category: [...newCategories, id] };
                }
                return prev;
            }
        });
    };

    const handlePerkSelect = (id: string) => {
        if (id === 'speed_boost' || id === 'transforming_vehicle') return; // Handled by counter
        setSelections(prev => {
            const newPerks = new Map(prev.perks);
            if (newPerks.has(id)) {
                newPerks.delete(id);
                if (id === 'chatterbox_vehicle') return { ...prev, perks: newPerks, traits: new Set() };
            } else {
                newPerks.set(id, 1);
            }
            return { ...prev, perks: newPerks };
        });
    };

    const handlePerkCountChange = (id: string, newCount: number, max: number = Infinity) => {
        if (newCount < 0 || newCount > max) return;
        setSelections(prev => {
            const newPerks = new Map(prev.perks);
            if (newCount === 0) newPerks.delete(id);
            else newPerks.set(id, newCount);
            
            // If reducing transforming count, trim categories if needed
            if (id === 'transforming_vehicle') {
                const maxCategories = 1 + newCount;
                if (prev.category.length > maxCategories) {
                    return { ...prev, perks: newPerks, category: prev.category.slice(0, maxCategories) };
                }
            }

            return { ...prev, perks: newPerks };
        });
    };

    const handleVehicleTraitSelect = (id: string) => {
        setSelections(prev => {
            const newTraits = new Set(prev.traits);
            if (newTraits.has(id)) newTraits.delete(id);
            else newTraits.add(id);
            return { ...prev, traits: newTraits };
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
        if (!perk.requirement) return false;
        const req = perk.requirement;
        if ((req.includes("Requires Tank or Mecha") || req.includes("탱크나 메카만 선택 가능")) && !selections.category.includes('tank') && !selections.category.includes('mecha')) return true;
        return false;
    };
    const getModifiedPerk = (perk: CompanionOption): CompanionOption => {
        if (perk.id === 'chatterbox_vehicle' && selections.category.includes('car')) return { ...perk, cost: 0, requirement: language === 'ko' ? '자동차 무료' : 'Free for Car' };
        if (perk.id === 'hellfire_volley' && (selections.category.includes('tank') || selections.category.includes('mecha'))) return { ...perk, cost: 0, requirement: language === 'ko' ? '탱크/메카 무료' : 'Free for Tank/Mecha' };
        return perk;
    };

    const transformingCount = selections.perks.get('transforming_vehicle') || 0;
    const maxCategories = 1 + transformingCount;
    const firstCategoryCost = selections.category.length > 0 ? Constants.VEHICLE_CATEGORIES.find(c => c.id === selections.category[0])?.cost ?? 0 : Infinity;

    const titles = language === 'ko' ? {
        category: "카테고리",
        perks: "특성",
        personality: "성격",
        visual: "커스텀 이미지",
        changeImage: "이미지 변경",
        uploadImage: "이미지 업로드",
        purchases: "구매 횟수",
        points: "포인트",
        each: "개당"
    } : {
        category: "CATEGORY",
        perks: "PERKS",
        personality: "PERSONALITY TRAITS",
        visual: "CUSTOM VISUAL",
        changeImage: "Change Image",
        uploadImage: "Upload Image",
        purchases: "Purchases",
        points: "points",
        each: "each"
    };

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={activeIntro.imageSrc} alt="Vehicles" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{activeIntro.description}</p></div>
            <ReferenceSection title={titles.category}><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{activeCategories.map(item => {
                const isSelected = selections.category.includes(item.id);
                // Disable if limit reached AND not selected. OR if trying to add secondary category that is too expensive.
                const disabled = (!isSelected && selections.category.length >= maxCategories) || (!isSelected && selections.category.length > 0 && (item.cost ?? 0) > firstCategoryCost);
                
                return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={handleCategorySelect} disabled={disabled} />
            })}</div></ReferenceSection>
            <ReferenceSection title={titles.perks}><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{activePerks.map(item => {
                if (item.id === 'speed_boost') {
                    const count = selections.perks.get('speed_boost') ?? 0;
                    return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={count > 0} onSelect={() => {}} disabled={isPerkDisabled(item)}><Counter label={titles.purchases} count={count} onCountChange={(n) => handlePerkCountChange('speed_boost', n, 3)} cost={`${item.cost} ${language === 'ko' ? titles.points : 'VP'} ${titles.each}`} max={3} /></ReferenceItemCard>;
                }
                if (item.id === 'transforming_vehicle') {
                    const count = selections.perks.get('transforming_vehicle') ?? 0;
                    return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={count > 0} onSelect={() => {}} disabled={isPerkDisabled(item)}><Counter label={titles.purchases} count={count} onCountChange={(n) => handlePerkCountChange('transforming_vehicle', n)} cost={`${item.cost} ${language === 'ko' ? titles.points : 'VP'} ${titles.each}`} /></ReferenceItemCard>;
                }
                return <ReferenceItemCard key={item.id} item={getModifiedPerk(item)} layout="default" isSelected={selections.perks.has(item.id)} onSelect={handlePerkSelect} disabled={isPerkDisabled(item)} />;
            })}</div></ReferenceSection>
            {selections.perks.has('chatterbox_vehicle') && <ReferenceSection title={titles.personality}><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{activeTraits.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={handleVehicleTraitSelect} />)}</div></ReferenceSection>}
            
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
                                placeholder={language === 'ko' ? "https://i.ibb.co/example.jpg" : "https://i.ibb.co/example.jpg"}
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
                                    {language === 'ko' ? "권장: imgbb 등" : "Recommended: imgbb, etc."}
                                </span>
                                <span className="text-red-500/70">
                                    {language === 'ko' ? "비권장: imgur 등" : "Avoid: imgur, etc."}
                                </span>
                            </div>
                        </div>
                    </div>
                 </div>
            </ReferenceSection>
        </div>
    );
};
