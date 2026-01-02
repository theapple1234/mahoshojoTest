
import React, { useEffect } from 'react';
import * as Constants from '../../constants';
import type { VehicleSelections, CompanionOption } from '../../types';
import { ReferenceSection } from './ReferenceSection';
import { ReferenceItemCard } from './ReferenceItemCard';
import { Counter } from './Counter';

export const VehicleSection: React.FC<{ 
    setPoints: (points: number) => void;
    selections: VehicleSelections;
    setSelections: React.Dispatch<React.SetStateAction<VehicleSelections>>;
}> = ({ setPoints, selections, setSelections }) => {
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

    const isPerkDisabled = (perk: CompanionOption) => {
        if (!perk.requirement) return false;
        if (perk.requirement.includes("Requires Tank or Mecha") && !selections.category.includes('tank') && !selections.category.includes('mecha')) return true;
        return false;
    };
    const getModifiedPerk = (perk: CompanionOption): CompanionOption => {
        if (perk.id === 'chatterbox_vehicle' && selections.category.includes('car')) return { ...perk, cost: 0 };
        if (perk.id === 'hellfire_volley' && (selections.category.includes('tank') || selections.category.includes('mecha'))) return { ...perk, cost: 0 };
        return perk;
    };

    const transformingCount = selections.perks.get('transforming_vehicle') || 0;
    const maxCategories = 1 + transformingCount;
    const firstCategoryCost = selections.category.length > 0 ? Constants.VEHICLE_CATEGORIES.find(c => c.id === selections.category[0])?.cost ?? 0 : Infinity;

    return (
        <div className="p-8 bg-black/50">
            <div className="text-center mb-10"><img src={Constants.VEHICLE_INTRO.imageSrc} alt="Vehicles" className="mx-auto rounded-xl border border-white/20 max-w-lg w-full" /><p className="text-center text-gray-400 italic max-w-xl mx-auto text-sm my-6">{Constants.VEHICLE_INTRO.description}</p></div>
            <ReferenceSection title="CATEGORY"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">{Constants.VEHICLE_CATEGORIES.map(item => {
                const isSelected = selections.category.includes(item.id);
                // Disable if limit reached AND not selected. OR if trying to add secondary category that is too expensive.
                const disabled = (!isSelected && selections.category.length >= maxCategories) || (!isSelected && selections.category.length > 0 && (item.cost ?? 0) > firstCategoryCost);
                
                return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={isSelected} onSelect={handleCategorySelect} disabled={disabled} />
            })}</div></ReferenceSection>
            <ReferenceSection title="PERKS"><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">{Constants.VEHICLE_PERKS.map(item => {
                if (item.id === 'speed_boost') {
                    const count = selections.perks.get('speed_boost') ?? 0;
                    return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={count > 0} onSelect={() => {}} disabled={isPerkDisabled(item)}><Counter label="Purchases" count={count} onCountChange={(n) => handlePerkCountChange('speed_boost', n, 3)} cost={`${item.cost} VP each`} max={3} /></ReferenceItemCard>;
                }
                if (item.id === 'transforming_vehicle') {
                    const count = selections.perks.get('transforming_vehicle') ?? 0;
                    return <ReferenceItemCard key={item.id} item={item} layout="default" isSelected={count > 0} onSelect={() => {}} disabled={isPerkDisabled(item)}><Counter label="Purchases" count={count} onCountChange={(n) => handlePerkCountChange('transforming_vehicle', n)} cost={`${item.cost} VP each`} /></ReferenceItemCard>;
                }
                return <ReferenceItemCard key={item.id} item={getModifiedPerk(item)} layout="default" isSelected={selections.perks.has(item.id)} onSelect={handlePerkSelect} disabled={isPerkDisabled(item)} />;
            })}</div></ReferenceSection>
            {selections.perks.has('chatterbox_vehicle') && <ReferenceSection title="PERSONALITY TRAITS"><div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 max-w-7xl mx-auto">{Constants.COMPANION_PERSONALITY_TRAITS.map(item => <ReferenceItemCard key={item.id} item={item} layout="trait" isSelected={selections.traits.has(item.id)} onSelect={handleVehicleTraitSelect} />)}</div></ReferenceSection>}
            
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
        </div>
    );
};
