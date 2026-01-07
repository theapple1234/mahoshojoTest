
import React from 'react';
import { SummaryHeader, FamilyDetailCard, HousingDetailCard, CustomSpellCard, formatCostDisplay } from './BuildSummaryShared';

export const TempleLayout: React.FC<{ sections: any[], language?: 'en' | 'ko' }> = ({ sections, language = 'en' }) => {
     const theme = {
        cardBg: "bg-white/80 shadow-md",
        cardBorder: "border-amber-900/20",
        textMain: "text-slate-900",
        textDim: "text-slate-700", 
        textAccent: "text-amber-800",
        imgFilter: "sepia-[0.3]",
        isLight: true,
        fontHead: "font-cinzel",
        fontBody: "font-serif"
    };

    const renderItemCard = (item: any, idx: number) => (
        <div key={`${item.id}-${idx}`} className="flex flex-col w-48 group break-inside-avoid">
            <div className={`h-48 w-48 rounded-t-full overflow-hidden border-4 ${item.isLostPower ? 'border-purple-300 shadow-purple-500/20' : 'border-amber-100'} shadow-md group-hover:border-amber-300 transition-all relative bg-gray-200`}>
                {/* Use background-image instead of img for reliable cropping in html2canvas */}
                <div 
                    className="w-full h-full sepia-[0.3]"
                    style={{
                        backgroundImage: `url(${item.imageSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                    role="img"
                    aria-label={item.title}
                ></div>
                {item.assignedName && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-1 text-center border-t border-amber-100">
                        <p className="text-[10px] text-amber-800 font-bold truncate leading-[2.5]">{item.assignedName}</p>
                    </div>
                )}
            </div>
            <div className="text-center mt-3 p-2 bg-white border border-amber-100 shadow-sm rounded-sm">
                <h4 className="font-cinzel font-bold text-lg text-black">{item.title}</h4>
                {item.cost && <p className="text-[9px] text-amber-700/70 font-serif italic mt-1">{formatCostDisplay(item.cost, language as 'en' | 'ko')}</p>}
                {item.count && <span className="block build-summary-count-badge text-[10px] text-amber-600 font-bold mt-1">Quantity: {item.count}</span>}
                {item.uniformName && <span className="block text-[9px] text-amber-900/80 font-bold mt-1 leading-[2.5]">Costume: {item.uniformName}</span>}
            </div>
        </div>
    );
    
    return (
        <div className="space-y-20 bg-[#f8f5f2] text-slate-800 p-12">
            <SummaryHeader theme="light" language={language} />
            
            {sections.map(section => (
                <div key={section.id} className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-200/50"></div>
                    <div className="pl-10">
                        <h3 className="font-cinzel text-4xl text-amber-800 mb-8 inline-block pr-12">{section.title}</h3>
                        
                        {/* Family & Housing Special Render for Stage 1 */}
                        {section.id === 'stage1' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                {section.familyDetails?.length > 0 && (
                                    <div className="space-y-4">
                                        <h5 className={`font-cinzel ${language === 'ko' ? 'text-3xl' : 'text-xl'} text-amber-950 font-bold uppercase tracking-widest border-b-2 border-amber-100 pb-2`}>
                                            {language === 'ko' ? '혈통' : 'Lineage'}
                                        </h5>
                                        {section.familyDetails.map((m: any) => <FamilyDetailCard key={m.id} member={m} theme={theme} />)}
                                    </div>
                                )}
                                {section.housingDetails?.length > 0 && (
                                    <div className="space-y-4">
                                        <h5 className={`font-cinzel ${language === 'ko' ? 'text-3xl' : 'text-xl'} text-amber-950 font-bold uppercase tracking-widest border-b-2 border-amber-100 pb-2`}>
                                            {language === 'ko' ? '영지' : 'Estates'}
                                        </h5>
                                        {section.housingDetails.map((h: any) => <HousingDetailCard key={h.id} home={h} theme={theme} />)}
                                    </div>
                                )}
                            </div>
                        )}

                        {section.id === 'stage3' && section.blessingGroups ? (
                            <div className="space-y-12">
                                {section.blessingGroups.map((group: any) => (
                                    <div key={group.title}>
                                        <div className="mb-6 border-l-4 border-amber-300 pl-4 flex flex-wrap gap-3 items-baseline">
                                            <h4 className={`font-cinzel ${language === 'ko' ? 'text-2xl font-bold' : 'text-lg'} text-amber-700/80 uppercase tracking-widest`}>{group.title}</h4>
                                            {group.engraving && <span className="text-xs text-amber-900/40 font-serif italic mr-2">{group.engraving}</span>}
                                            
                                            {/* Boost Indicators */}
                                            {group.activeBoosts && group.activeBoosts.length > 0 && (
                                                <div className="flex gap-3 ml-2 items-center">
                                                    {group.activeBoosts.map((boost: string, idx: number) => (
                                                        <span key={idx} className="text-[10px] font-bold text-amber-700/80 uppercase tracking-widest font-serif flex items-center gap-1">
                                                             <span className="text-amber-400">✧</span> {boost} Boosted
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {group.isMagicianActive && (
                                                <span className="text-[10px] font-bold text-purple-700/80 uppercase tracking-widest font-serif flex items-center gap-1 ml-2 border border-purple-200 px-1.5 py-0.5 rounded bg-purple-50">
                                                    <span className="text-purple-400">✦</span> {language === 'ko' ? '마법사' : 'Magician'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-8">
                                            {group.items.map((item: any, idx: number) => renderItemCard(item, idx))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-8">
                                {section.items.map((item: any, idx: number) => renderItemCard(item, idx))}
                            </div>
                        )}

                         {section.customSpells && section.customSpells.length > 0 && (
                            <div className="mt-12">
                                <h4 className="font-cinzel text-2xl text-amber-800 mb-6 border-b border-amber-200 pb-2 inline-block">Custom Inscriptions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {section.customSpells.map((spell: any, i: number) => (
                                        <CustomSpellCard key={spell.id} spell={spell} index={i} theme={theme} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
