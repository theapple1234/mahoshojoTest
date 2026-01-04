
import React from 'react';
import { SummaryHeader, FamilyDetailCard, HousingDetailCard, CustomSpellCard } from './BuildSummaryShared';

export const ArcaneLayout: React.FC<{ sections: any[] }> = ({ sections }) => {
    const theme = {
        cardBg: "bg-slate-900/60",
        cardBorder: "border-slate-700/50 hover:border-cyan-500/40",
        textMain: "text-gray-300",
        textDim: "text-gray-500",
        textAccent: "text-cyan-400",
        imgFilter: "",
        isLight: false,
        fontHead: "font-cinzel",
        fontBody: "font-sans"
    };

    const renderItemsGrid = (items: any[]) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {items.map((item: any, idx: number) => (
                <div key={`${item.id}-${idx}`} className="bg-slate-900/60 border border-slate-700/50 hover:border-cyan-500/40 rounded-lg overflow-hidden group transition-all flex flex-col relative">
                    <div className="relative w-full aspect-square overflow-hidden border-b border-white/5 bg-black/40">
                        {/* Changed from img to div with background-image to force crop/cover behavior properly */}
                        <div 
                            className="w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 bg-center bg-cover bg-no-repeat"
                            style={{ backgroundImage: `url(${item.imageSrc})` }}
                            role="img"
                            aria-label={item.title}
                        />
                        {item.count && item.count > 1 && (
                            <div className="absolute top-1 right-1 bg-black/90 text-cyan-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/30">
                                x{item.count}
                            </div>
                        )}
                    </div>
                    <div className="p-2 flex flex-col flex-grow">
                        <h4 className="font-cinzel text-[10px] font-bold text-gray-300 group-hover:text-white leading-loose mb-1 truncate">{item.title}</h4>
                        {item.cost && <p className="text-[9px] text-cyan-500/60 font-mono mt-auto leading-normal">{item.cost}</p>}
                        {item.assignedName && (
                            <div className="mt-1 pt-1 border-t border-white/5">
                                <p className="text-[9px] text-cyan-300 font-bold truncate leading-loose">[{item.assignedName}]</p>
                            </div>
                        )}
                        {item.uniformName && (
                            <div className="mt-1 pt-1 border-t border-white/5">
                                <p className="text-[9px] text-pink-300 font-bold truncate leading-loose">Costume: {item.uniformName}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-16">
            <SummaryHeader theme="dark" />
            {sections.map(section => (
                <div key={section.id} className="animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gradient-to-r from-transparent to-cyan-500/50 flex-grow"></div>
                        <h3 className="font-cinzel text-2xl text-center tracking-[0.2em] text-cyan-200 uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                            {section.title}
                        </h3>
                        <div className="h-px bg-gradient-to-l from-transparent to-cyan-500/50 flex-grow"></div>
                    </div>
                    
                    {/* Family & Housing Special Render for Stage 1 */}
                    {section.id === 'stage1' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {section.familyDetails?.length > 0 && (
                                <div className="space-y-2">
                                    <h5 className="font-mono text-[10px] text-cyan-500/70 uppercase tracking-widest pl-1 mb-2">Foster Family</h5>
                                    {section.familyDetails.map((m: any) => <FamilyDetailCard key={m.id} member={m} theme={theme} />)}
                                </div>
                            )}
                            {section.housingDetails?.length > 0 && (
                                <div className="space-y-2">
                                    <h5 className="font-mono text-[10px] text-cyan-500/70 uppercase tracking-widest pl-1 mb-2">Real Estate</h5>
                                    {section.housingDetails.map((h: any) => <HousingDetailCard key={h.id} home={h} theme={theme} />)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Grouped rendering for Stage 3, Standard for others */}
                    {section.id === 'stage3' && section.blessingGroups ? (
                        <div className="space-y-8">
                            {section.blessingGroups.map((group: any) => (
                                <div key={group.title} className="bg-black/20 p-4 rounded-lg border border-cyan-900/20">
                                    <div className="border-b border-cyan-900/30 mb-4 pb-2 flex flex-wrap gap-3 items-center">
                                        <h4 className="font-cinzel text-sm text-cyan-500 uppercase tracking-widest mr-2">{group.title}</h4>
                                        {group.engraving && <span className="text-[10px] text-cyan-700/80 font-mono uppercase tracking-wide mr-2">{group.engraving}</span>}
                                        
                                        {/* Boost Indicators */}
                                        {group.activeBoosts && group.activeBoosts.length > 0 && (
                                            <div className="flex gap-2">
                                                {group.activeBoosts.map((boost: string, idx: number) => (
                                                    <span key={idx} className="text-[9px] font-bold bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                        {boost} Boost
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {renderItemsGrid(group.items)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        renderItemsGrid(section.items)
                    )}

                    {section.customSpells && section.customSpells.length > 0 && (
                        <div className="mt-8">
                             <h4 className="font-cinzel text-lg text-cyan-500/80 tracking-widest mb-4 border-b border-cyan-900/30 pb-2">Custom Grimoire</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {section.customSpells.map((spell: any, i: number) => (
                                    <CustomSpellCard key={spell.id} spell={spell} index={i} theme={theme} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
