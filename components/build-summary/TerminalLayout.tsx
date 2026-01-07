

import React from 'react';
import { SummaryHeader, FamilyDetailCard, HousingDetailCard, CustomSpellCard, formatCostDisplay } from './BuildSummaryShared';

export const TerminalLayout: React.FC<{ sections: any[], language?: 'en' | 'ko' }> = ({ sections, language = 'en' }) => {
    const theme = {
        cardBg: "bg-green-900/10",
        cardBorder: "border-green-500/30",
        textMain: "text-green-500",
        textDim: "text-green-700",
        textAccent: "text-green-400",
        imgFilter: "",
        isTerminal: true,
        isLight: false,
        fontHead: "font-galmuri leading-[2.5]",
        fontBody: "font-galmuri leading-[2.5]"
    };
    
    const renderItemsGrid = (items: any[]) => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item: any, idx: number) => (
                <div key={`${item.id}-${idx}`} className={`border ${item.isLostPower ? 'border-green-400 bg-green-900/30' : 'border-green-500/30 bg-green-900/10'} p-2 flex items-start gap-3 hover:bg-green-900/20 transition-colors`}>
                    <div 
                        className={`w-12 h-12 flex-shrink-0 border border-green-500/20 bg-black ${theme.imgFilter}`}
                        style={{
                            backgroundImage: `url(${item.imageSrc})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    ></div>
                    <div className="flex-grow min-w-0">
                        <p className="text-lg font-bold truncate text-green-500 mb-0.5 leading-[2.5]">{item.title}</p>
                        <p className="text-[9px] opacity-60 truncate leading-[2.5]">ID: {item.id}</p>
                        {/* Cost Display Added Here */}
                        {item.cost && <p className="text-[9px] text-green-400 mt-0.5 leading-[2.5]">{formatCostDisplay(item.cost, language as 'en' | 'ko')}</p>}
                        
                        {item.count && <p className="build-summary-count-badge text-[9px] text-green-400 mt-0.5 leading-[2.5]">QTY: {item.count}</p>}
                        {item.assignedName && (
                            <p className="text-[9px] text-green-200 mt-0.5 pt-0.5 truncate leading-[2.5]">[{item.assignedName}]</p>
                        )}
                        {item.uniformName && (
                            <p className="text-[9px] text-green-200 mt-0.5 pt-0.5 truncate leading-[2.5]">COSTUME: {item.uniformName}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-black p-8 font-galmuri text-green-500 space-y-12 border-x-4 border-green-900/30 min-h-screen relative leading-[2.5]">
            <SummaryHeader theme="cyber" language={language} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none sovereignty h-full leading-[2.5]"></div>

            {sections.map((section, sIdx) => (
                <div key={section.id}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 leading-[2.5]">
                        <span className="text-green-800">0{sIdx + 1}</span> 
                        <span>{section.title.toUpperCase()}</span>
                        <div className="h-px bg-green-500/30 flex-grow ml-4"></div>
                    </h3>
                    
                    {/* Family & Housing Special Render for Stage 1 */}
                    {section.id === 'stage1' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {section.familyDetails?.length > 0 && (
                                <div className="space-y-2 border border-green-900/50 p-2">
                                    <h5 className="font-galmuri text-xs text-green-700 font-bold uppercase tracking-widest leading-[2.5]">
                                        {language === 'ko' ? '&gt;&gt; LINEAGE_DATA' : '&gt;&gt; LINEAGE_DATA'}
                                    </h5>
                                    {section.familyDetails.map((m: any) => <FamilyDetailCard key={m.id} member={m} theme={theme} />)}
                                </div>
                            )}
                            {section.housingDetails?.length > 0 && (
                                <div className="space-y-2 border border-green-900/50 p-2">
                                    <h5 className="font-galmuri text-xs text-green-700 font-bold uppercase tracking-widest leading-[2.5]">
                                        {language === 'ko' ? '&gt;&gt; ASSET_ALLOCATION' : '&gt;&gt; ASSET_ALLOCATION'}
                                    </h5>
                                    {section.housingDetails.map((h: any) => <HousingDetailCard key={h.id} home={h} theme={theme} />)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Grouped rendering for Stage 3 */}
                    {section.id === 'stage3' && section.blessingGroups ? (
                        <div className="space-y-6">
                            {section.blessingGroups.map((group: any) => (
                                <div key={group.title} className="border-l-2 border-green-800 pl-4 py-1">
                                    <h4 className="font-galmuri text-xs text-green-600 mb-3 font-bold uppercase tracking-wider flex flex-wrap gap-2 items-center leading-[2.5]">
                                        <span>&gt;&gt; GROUP: {group.title.replace(/ /g, '_')}</span>
                                        {group.engraving && <span className="text-[9px] text-green-800 normal-case font-galmuri">:: {group.engraving} ::</span>}
                                        
                                        {/* Boost Indicators */}
                                        {group.activeBoosts && group.activeBoosts.length > 0 && (
                                            <div className="flex gap-3 ml-2 items-center">
                                                {group.activeBoosts.map((boost: string, idx: number) => (
                                                    <span key={idx} className="text-[10px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                                                        <span className="text-green-500 font-bold">[+]</span> {boost}_BOOST
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {group.isMagicianActive && (
                                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1 ml-2">
                                                <span className="text-green-500 font-bold">[!]</span> {language === 'ko' ? 'MAGICIAN_ACTIVE (마법사)' : 'MAGICIAN_ACTIVE'}
                                            </span>
                                        )}
                                    </h4>
                                    {renderItemsGrid(group.items)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        renderItemsGrid(section.items)
                    )}

                    {section.customSpells && section.customSpells.length > 0 && (
                        <div className="mt-8 border-t border-green-900/50 pt-4">
                             <h4 className="font-galmuri text-sm text-green-600 mb-4 font-bold leading-[2.5]">&gt;&gt; CUSTOM_PROTOCOLS</h4>
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
