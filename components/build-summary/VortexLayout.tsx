
import React from 'react';
import * as Constants from '../../constants';
import { SummaryHeader } from './BuildSummaryShared';
import { ICharacterContext } from '../../context/CharacterContextTypes';

export const VortexLayout: React.FC<{ sections: any[], ctx: ICharacterContext, name: string, type: string, pointsSpent: number, visualSrc: string, onImageUpload?: (base64: string) => void }> = ({ 
    sections, ctx, name, type, pointsSpent, visualSrc, onImageUpload 
}) => {
    // New Order Logic:
    // Orbit 1 (Innermost): Stage 6 (Index 5)
    // Orbit 2: Stage 4 (Index 3) + Stage 5 (Index 4)
    // Orbit 3: Stage 3 (Index 2)
    // Orbit 4 (Outermost): Stage 1 (Index 0) + Stage 2 (Index 1)

    const ringsConfig = [
        { radius: 250, stageIndices: [5] },         // Stage 6
        { radius: 530, stageIndices: [3, 4] },      // Stage 4 & 5
        { radius: 790, stageIndices: [2] },         // Stage 3 (Centered between 530 and 1050)
        { radius: 1050, stageIndices: [0, 1] }      // Stage 1 & 2
    ];
    
    // Prepare Family Data from sections (already formatted in useBuildData)
    const familyMembers = sections[0]?.familyDetails || [];
    const allHousing = sections[0]?.housingDetails || [];
    const hasOrigins = familyMembers.length > 0 || allHousing.length > 0;

    const noBorderIds = ['moving_out', 'bride_to_be', 'mentor_career', 'mentor', 'joys_of_parenting', 'puppy_love', 'teachers_assistant', 'adjunct_professor'];

    // Pre-process items for Ring Logic
    // Specifically, pull out "isLostPower" items from Stage 3 and force them into Ring 1
    const stage3 = sections[2];
    const lostPowers = stage3?.items?.filter((i: any) => i.isLostPower) || [];
    
    // Helper to get items for a ring configuration, respecting override logic
    const getRingItems = (config: any) => {
        let ringItems: any[] = [];
        const isRing1 = config.radius === 250;
        
        config.stageIndices.forEach((idx: number) => {
            if (sections[idx] && sections[idx].items) {
                // If it's Stage 3 (idx 2), filter OUT lost powers for its normal placement (Ring 3)
                if (idx === 2) {
                     ringItems = [...ringItems, ...sections[idx].items.filter((i: any) => !i.isLostPower)];
                } else {
                     ringItems = [...ringItems, ...sections[idx].items];
                }
            }
        });
        
        // If this is Ring 1, inject lost powers here
        if (isRing1) {
            ringItems = [...ringItems, ...lostPowers];
        }

        return ringItems.filter(item => item.title !== 'Parents' && item.title !== 'Siblings');
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onImageUpload) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                onImageUpload(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    // Collect all custom spells across sections for separate display
    const allCustomSpells = sections.flatMap(s => s.customSpells || []);

    return (
        <div className="relative w-full bg-black overflow-hidden flex flex-col items-center justify-start p-20 pb-0">
             {/* Background Spiral - Conic gradients often fail in html2canvas, replacing with radial */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a2e_0%,#000000_100%)] opacity-80 pointer-events-none h-full"></div>
            
            <div className="absolute top-10 left-0 right-0 z-50">
                 <SummaryHeader theme="dark" />
            </div>

            {/* Scale Container for the Vortex */}
            <div className="relative flex items-center justify-center scale-[0.35] md:scale-[0.45] lg:scale-[0.55] xl:scale-[0.65] origin-top transition-transform duration-500 mt-60" style={{ minHeight: '2300px' }}>
                
                {/* Center Title Circle - Reduced Size */}
                <div className="absolute z-[100] flex items-center justify-center w-72 h-72 rounded-full drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] bg-black border-4 border-double border-white/20 group overflow-hidden">
                     {onImageUpload && (
                        <label htmlFor="vortex-center-upload" className="absolute inset-0 w-full h-full z-50 cursor-pointer">
                            <input 
                                id="vortex-center-upload"
                                name="vortex-center-upload"
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="sr-only"
                                title="Change Center Image"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40 rounded-full">
                                <span className="text-[10px] text-white font-bold uppercase tracking-widest text-center font-cinzel">Change<br/>Image</span>
                            </div>
                        </label>
                    )}
                     <div 
                        className="w-full h-full bg-center bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${visualSrc || "/images/Z6tHPxPB-symbol-transparent.png"})` }}
                     />
                </div>

                {/* Using fixed dimensions instead of w-full aspect-square to prevent collapse in html2canvas */}
                <div className="relative w-[2400px] h-[2400px] flex items-center justify-center p-10 font-cinzel text-white">
                    {/* Background Circle - Clipped for Gradient */}
                    <div className="absolute inset-0 rounded-full bg-black overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,29,149,0.3),transparent_70%)]"></div>
                    </div>
                    
                    {ringsConfig.map((config, ringIndex) => {
                        const ringItems = getRingItems(config);

                        if (ringItems.length === 0) return null;

                        const itemCount = ringItems.length;
                        
                        let gapSize = 30;
                        if (ringIndex === 0) gapSize = 150; 
                        else if (ringIndex === 1) gapSize = 45; 

                        let startAngle = -90 + (gapSize / 2); 
                        let availableArc = 360 - gapSize;
                        const zIndex = 60 - ringIndex;

                        return (
                            <div key={ringIndex} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex }}>
                                <div className="absolute rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]" style={{ width: config.radius * 2, height: config.radius * 2 }}></div>

                                <div className="absolute text-purple-400 font-cinzel font-bold tracking-[0.1em] uppercase bg-black rounded-full border-2 border-purple-900/80 z-[100] text-center flex flex-col items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                    style={{ transform: `translateY(-${config.radius}px)`, width: '180px', height: '180px' }}>
                                    <div className="flex flex-col items-center justify-center leading-none">
                                        <span className="text-lg opacity-80 mb-2">STAGE</span>
                                        <span className={`${config.stageIndices.length > 1 ? 'text-5xl' : 'text-7xl'}`}>
                                            {config.stageIndices.map(i => i + 1).join(' & ')}
                                        </span>
                                    </div>
                                </div>

                                {ringItems.map((item: any, idx: number) => {
                                    const step = itemCount > 1 ? availableArc / (itemCount - 1) : 0;
                                    const angleDeg = itemCount === 1 ? 90 : startAngle + (step * idx);
                                    const angleRad = (angleDeg * Math.PI) / 180;
                                    
                                    const x = Math.cos(angleRad) * config.radius;
                                    const y = Math.sin(angleRad) * config.radius;

                                    const isHouseUpgrade = Constants.HOUSE_UPGRADES_DATA.some(u => u.id === item.id);
                                    const isMagicalStyle = Constants.MAGICAL_STYLES_DATA.some(s => s.id === item.id);
                                    const noBorder = isHouseUpgrade || isMagicalStyle || noBorderIds.includes(item.id);
                                    
                                    const imageSrc = item.imageSrc;
                                    
                                    // Glowing Effect Logic
                                    let borderClass = 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
                                    
                                    if (item.isLostPower) {
                                        borderClass = 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.8)]';
                                    } else if (item.isBoosted) {
                                        // Golden Glow for Boosted Items
                                        borderClass = 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.8)] ring-2 ring-amber-500/50';
                                    } else if (noBorder) {
                                        borderClass = 'border-transparent';
                                    }

                                    return (
                                        <div 
                                            key={`${ringIndex}-${idx}`}
                                            className="absolute pointer-events-auto group flex flex-col items-center justify-center w-32"
                                            style={{ transform: `translate(${x}px, ${y}px)` }}
                                        >
                                            <div className="relative">
                                                <div className={`w-24 h-24 rounded-full border-2 ${borderClass} overflow-hidden bg-black group-hover:scale-110 group-hover:z-50 transition-all duration-300 relative z-10`}>
                                                    <div 
                                                        className="w-full h-full opacity-80 group-hover:opacity-100 bg-center bg-cover bg-no-repeat"
                                                        style={{ backgroundImage: `url(${imageSrc})` }}
                                                    />
                                                </div>
                                                {item.count && item.count > 1 && (
                                                    <span className="absolute -bottom-1 -right-1 z-50 bg-purple-600 text-white text-[12px] font-bold px-2 py-0.5 rounded-full border-2 border-black shadow-md">x{item.count}</span>
                                                )}
                                            </div>
                                            <div className="mt-3 bg-black/90 px-2 py-1 rounded border border-purple-900/50 text-[10px] text-purple-200 text-center w-40 whitespace-normal leading-tight group-hover:text-white transition-colors shadow-lg z-20 min-h-[2.5em] flex flex-col items-center justify-center">
                                                <span>{item.title}</span>
                                                {item.isBoosted && (
                                                    <span className="text-[9px] text-amber-400 font-bold block mt-0.5 w-full whitespace-normal">BOOSTED</span>
                                                )}
                                                {item.assignedName && <span className="text-[9px] text-cyan-300 font-bold block mt-0.5 w-full whitespace-normal">[{item.assignedName}]</span>}
                                                {item.uniformName && <span className="text-[9px] text-pink-300 font-bold block mt-0.5 w-full whitespace-normal">Costume: {item.uniformName}</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* Removed the Points overlay circle as requested */}
                </div>
            </div>
            
            {/* Life & Assets Section */}
            {hasOrigins && (
                <div className="relative z-50 w-full max-w-6xl mt-[-700px] mb-8 p-8 bg-black/80 border-2 border-purple-500/30 rounded-2xl backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-gradient-to-r from-transparent to-purple-500/50 flex-grow"></div>
                        <h3 className="font-cinzel text-2xl text-center tracking-[0.2em] text-purple-200 uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">ORIGINS & ASSETS</h3>
                        <div className="h-px bg-gradient-to-l from-transparent to-purple-500/50 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {familyMembers.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-cinzel text-sm text-purple-400 border-b border-purple-500/20 pb-2 mb-4">FOSTER FAMILY</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {familyMembers.map((member: any, i: number) => (
                                        <div key={member.id} className="flex gap-3 bg-slate-900/40 border border-purple-500/20 p-3 rounded-lg">
                                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                                <img src={member.imageSrc} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="text-xs font-bold text-purple-200">{member.title}</p>
                                                {member.note && <p className="text-[10px] text-gray-400 truncate">"{member.note}"</p>}
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {member.traits.map((t: any) => (
                                                        <span key={t.id} className="text-[8px] px-1.5 py-0.5 rounded bg-purple-900/40 border border-purple-500/30 text-purple-300">
                                                            {t.title}
                                                            {t.assignedName && <span className="ml-1 font-bold text-cyan-300">[{t.assignedName}]</span>}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {allHousing.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-cinzel text-sm text-purple-400 border-b border-purple-500/20 pb-2 mb-4">REAL ESTATE</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {allHousing.map((home: any, i: number) => {
                                        return (
                                            <div key={home.id} className="flex gap-3 bg-slate-900/40 border border-purple-500/20 p-3 rounded-lg">
                                                 <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-purple-500/30">
                                                    <img src={home.imageSrc} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-bold text-purple-200 truncate">{home.title}</span>
                                                    </div>
                                                    <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-0.5">{home.dominion}</p>
                                                    <p className="text-[10px] text-gray-400 mb-1">Type: <span className="text-gray-300">{home.type}</span></p>
                                                    <div className="space-y-0.5">
                                                        {home.stats && <p className="text-[9px] text-cyan-400 font-mono">{home.stats}</p>}
                                                        {home.mythicalPet && <p className="text-[9px] text-pink-400 font-mono">Pet: {home.mythicalPet}</p>}
                                                    </div>
                                                    {home.upgrades.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                            {home.upgrades.map((u: any, idx: number) => (
                                                                <span key={idx} className="text-[8px] px-1.5 py-0.5 rounded bg-blue-900/20 border border-blue-500/20 text-blue-200">
                                                                    {u.title}
                                                                    {u.assignedName && <span className="ml-1 text-cyan-300">[{u.assignedName}]</span>}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Custom Spells Section */}
            {allCustomSpells.length > 0 && (
                <div className={`relative z-50 w-full max-w-6xl mb-4 p-8 bg-black/80 border-2 border-purple-500/30 rounded-2xl backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.1)] ${hasOrigins ? 'mt-4' : 'mt-[-700px]'}`}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-gradient-to-r from-transparent to-purple-500/50 flex-grow"></div>
                        <h3 className="font-cinzel text-2xl text-center tracking-[0.2em] text-purple-200 uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">YOUR CUSTOM MAGIC</h3>
                        <div className="h-px bg-gradient-to-l from-transparent to-purple-500/50 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allCustomSpells.map((spell: any, i: number) => (
                            <div key={spell.id || i} className="bg-slate-900/40 p-4 rounded border border-purple-500/20">
                                <h4 className="text-purple-300 font-bold mb-2">Custom Spell {i+1}</h4>
                                <p className="text-gray-400 text-sm whitespace-pre-wrap">{spell.description}</p>
                                {spell.mialgrathApplied && (
                                    <div className="mt-2 text-xs text-cyan-400 border-t border-purple-500/20 pt-2">
                                        <span className="font-bold uppercase tracking-wider">Milgrath Override:</span> {spell.mialgrathDescription}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
