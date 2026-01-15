
import React, { useState, useEffect, useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
    DRYADEA_DATA, DRYADEA_DATA_KO, 
    LIMITLESS_POTENTIAL_DATA, LIMITLESS_POTENTIAL_DATA_KO, 
    CUSTOM_SPELL_RULES_DATA, CUSTOM_SPELL_RULES_DATA_KO, 
    LIMITLESS_POTENTIAL_RUNES_DATA, LIMITLESS_POTENTIAL_RUNES_DATA_KO 
} from '../constants';
import { SectionHeader, BlessingIntro, renderFormattedText } from './ui';
import { useLongPress } from '../hooks/useLongPress';
import { CompanionSelectionModal } from './SigilTreeOptionCard';
import { BeastSelectionModal } from './BeastSelectionModal';
import { VehicleSelectionModal } from './VehicleSelectionModal';
import { WeaponSelectionModal } from './WeaponSelectionModal';
import type { ChoiceItem, CustomSpell } from '../types';

const RuneCard: React.FC<{
    rune: ChoiceItem;
    count: number;
    onAction: (action: 'buy' | 'sell') => void;
    onAnimate: (rect: DOMRect) => void;
    fontSize?: 'regular' | 'large';
    language: 'en' | 'ko';
}> = ({ rune, count, onAction, onAnimate, fontSize = 'regular', language }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    
    const handleBuy = () => {
        onAction('buy');
        if (imgRef.current) {
            onAnimate(imgRef.current.getBoundingClientRect());
        }
    };

    const handleSell = () => {
        if (count > 0) onAction('sell');
    };

    const longPressProps = useLongPress(
        (e) => {
            handleSell();
            if (navigator.vibrate) navigator.vibrate(50);
        },
        (e) => {
            handleBuy();
        },
        { shouldPreventDefault: true, delay: 500 }
    );
    
    const descriptionClass = fontSize === 'large' ? 'text-base' : 'text-sm';
    const isMialgrath = rune.id === 'mialgrath';
    const glowColor = isMialgrath ? '#38bdf8' : '#fbbf24'; // Cyan vs Amber

    return (
        <div 
            className="group flex flex-col items-center p-6 bg-black/40 rounded-lg border border-gray-700 hover:border-gray-500 transition-all select-none active:scale-[0.99] cursor-pointer h-full"
            style={{ boxShadow: `0 0 15px ${glowColor}10` }}
            {...longPressProps}
            onContextMenu={(e) => { e.preventDefault(); handleSell(); }}
        >
             <div className="flex-shrink-0 mb-6 relative">
                 <img 
                    ref={imgRef}
                    src={rune.imageSrc} 
                    alt={rune.title} 
                    className="w-32 h-32 object-contain filter drop-shadow-lg transition-transform group-hover:scale-105"
                 />
             </div>
             <div className="flex-grow text-center">
                 <h3 className="font-cinzel text-2xl font-bold text-white mb-2 tracking-wider" style={{ textShadow: `0 0 5px ${glowColor}` }}>{rune.title}</h3>
                 <p className="text-xs font-bold mb-3 italic" style={{ color: glowColor }}>{rune.cost}</p>
                 <div className={`${descriptionClass} text-gray-300 leading-relaxed`}>
                     {renderFormattedText(rune.description)}
                 </div>
                  <div className="mt-4 pt-4 border-t border-gray-700/50 w-full text-center">
                     <p className="text-[10px] text-gray-500 font-mono uppercase tracking-tight">
                        {language === 'ko' ? "좌클릭/탭: 구매 • 우클릭/홀드: 판매" : "L-Click/Tap: Buy • R-Click/Hold: Sell"}
                     </p>
                 </div>
             </div>
        </div>
    );
};

const RuneCounter: React.FC<{
    ruhaiCount: number;
    availableMialgrathCount: number;
    onAction: (runeId: 'ruhai' | 'mialgrath', action: 'buy' | 'sell') => void;
    language: 'en' | 'ko';
    runeData: ChoiceItem[];
}> = ({ ruhaiCount, availableMialgrathCount, onAction, language, runeData }) => {
    
    // Just a simple visual counter, actions are handled by cards in page
    // But we can add floating controls if needed. For now, let's keep it informative.
    
    return (
        <div className="fixed top-[35%] right-0 -translate-y-1/2 bg-black/80 backdrop-blur-md p-4 rounded-l-xl border-l border-t border-b border-gray-700 z-[80] shadow-2xl shadow-blue-900/20 flex flex-col gap-4">
             <div className="text-center border-b border-gray-700 pb-2 mb-1">
                 <h4 className="font-cinzel text-lg text-blue-300 tracking-widest">{language === 'ko' ? "룬" : "RUNES"}</h4>
             </div>
             
             {/* Ruhai */}
             <div className="flex items-center gap-3">
                 <img src={runeData[0].imageSrc} className="w-8 h-8 object-contain" alt="Ruhai" />
                 <div className="flex flex-col">
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{runeData[0].title}</span>
                     <span className="text-xl font-bold text-amber-400">{ruhaiCount}</span>
                 </div>
             </div>

             {/* Mialgrath */}
              <div className="flex items-center gap-3">
                 <img src={runeData[1].imageSrc} className="w-8 h-8 object-contain" alt="Mialgrath" />
                 <div className="flex flex-col">
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{runeData[1].title}</span>
                     <span className="text-xl font-bold text-cyan-400">{availableMialgrathCount}</span>
                 </div>
             </div>
        </div>
    );
};

const CustomSpellInput: React.FC<{
    spell: CustomSpell;
    index: number;
    onDescriptionChange: (id: number, text: string) => void;
    onMialgrathToggle: (id: number) => void;
    onMialgrathDescriptionChange: (id: number, text: string) => void;
    canApplyMialgrath: boolean;
    onOpenAssignment: (id: number, type: 'companion' | 'beast' | 'vehicle' | 'weapon') => void;
    onClearAssignment: (id: number) => void;
    showKpButton?: boolean;
    onToggleKp?: (id: number, type: 'ruhai' | 'milgrath') => void;
    language: 'en' | 'ko';
    mialgrathImageSrc: string;
}> = ({ 
    spell, index, onDescriptionChange, onMialgrathToggle, onMialgrathDescriptionChange, 
    canApplyMialgrath, onOpenAssignment, onClearAssignment, showKpButton, onToggleKp, language, mialgrathImageSrc 
}) => {
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    
    return (
        <div className="bg-black/40 border border-gray-700 rounded-lg p-4 flex flex-col gap-3 relative group">
             <div className="flex justify-between items-center mb-1">
                 <div className="flex items-center gap-2">
                    <span className="font-cinzel text-amber-500 font-bold text-lg">#{index + 1}</span>
                    <span className="text-base text-white font-bold uppercase tracking-widest">{language === 'ko' ? "커스텀 주문" : "Custom Spell"}</span>
                    {spell.isRuhaiKpPaid && (
                        <span className="bg-pink-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold ml-2">KP</span>
                    )}
                 </div>
                 {showKpButton && onToggleKp && (
                     <button 
                        onClick={() => onToggleKp(spell.id, 'ruhai')}
                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${spell.isRuhaiKpPaid ? 'bg-pink-900/50 border-pink-500 text-pink-200' : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-pink-300'}`}
                     >
                         {language === 'ko' ? "KP로 지불" : "Pay with KP"}
                     </button>
                 )}
             </div>
             
             <textarea 
                className="w-full bg-gray-900/50 border border-gray-600 rounded p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors resize-none h-24"
                placeholder={language === 'ko' ? "주문 설명을 입력하세요..." : "Describe your spell..."}
                value={spell.description}
                onChange={(e) => onDescriptionChange(spell.id, e.target.value)}
             />

             <div className="flex items-center justify-between border-t border-gray-700/50 pt-3 mt-1">
                 <div className="flex items-center gap-2">
                     <button
                        onClick={() => (canApplyMialgrath || spell.mialgrathApplied) && onMialgrathToggle(spell.id)}
                        disabled={!canApplyMialgrath && !spell.mialgrathApplied}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                            spell.mialgrathApplied 
                            ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                            : 'bg-gray-800/50 border-gray-600 text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                     >
                         <img src={mialgrathImageSrc} className="w-4 h-4 object-contain" alt="" />
                         <span className="text-[10px] font-bold uppercase tracking-wider">{language === 'ko' ? "밀그라스 적용" : "Apply Milgrath"}</span>
                     </button>
                     {spell.mialgrathApplied && showKpButton && onToggleKp && (
                        <button 
                            onClick={() => onToggleKp(spell.id, 'milgrath')}
                            className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${spell.isMilgrathKpPaid ? 'bg-pink-900/50 border-pink-500 text-pink-200' : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-pink-300'}`}
                            title="Pay Milgrath cost with KP"
                        >
                            KP
                        </button>
                     )}
                 </div>
                 
                 {/* Assignments Dropdown */}
                 {spell.mialgrathApplied && (
                     <div className="relative">
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-mono tracking-tight hidden sm:inline-block">
                                {language === 'ko' ? "참고 빌드 연결:" : "Link Reference:"}
                            </span>
                            <button 
                                onClick={() => setIsAssignOpen(!isAssignOpen)}
                                className="text-[10px] text-gray-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 bg-black/40 border border-gray-600 rounded hover:border-cyan-500"
                            >
                                {spell.assignedEntityName ? (
                                    <span className="text-green-400 font-bold max-w-[100px] truncate">{spell.assignedEntityName}</span>
                                ) : (
                                    <span className="italic opacity-70">{language === 'ko' ? "선택..." : "Select..."}</span>
                                )}
                                <svg className={`w-3 h-3 transition-transform ${isAssignOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                         </div>
                         
                         {isAssignOpen && (
                             <>
                                 <div className="fixed inset-0 z-10" onClick={() => setIsAssignOpen(false)}></div>
                                 <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-900 border border-gray-600 rounded shadow-xl z-20 animate-fade-in-up">
                                     {['companion', 'beast', 'vehicle', 'weapon'].map(type => (
                                         <button 
                                            key={type}
                                            onClick={() => { onOpenAssignment(spell.id, type as any); setIsAssignOpen(false); }}
                                            className="w-full text-left px-3 py-2 text-[10px] text-gray-300 hover:bg-gray-800 hover:text-white uppercase tracking-wider first:rounded-t last:rounded-b border-b border-gray-700 last:border-0"
                                         >
                                             {language === 'ko' ? (type === 'companion' ? '동료' : type === 'beast' ? '동물' : type === 'vehicle' ? '탈것' : '무기') : type}
                                         </button>
                                     ))}
                                     <div className="border-t border-gray-600"></div>
                                     <button 
                                        onClick={() => { onClearAssignment(spell.id); setIsAssignOpen(false); }} 
                                        className="w-full text-left px-3 py-2 text-[10px] text-red-400 hover:bg-red-900/20 uppercase tracking-wider rounded-b"
                                    >
                                         {language === 'ko' ? "해제" : "Clear"}
                                     </button>
                                 </div>
                             </>
                         )}
                     </div>
                 )}
             </div>
             
             {spell.mialgrathApplied && (
                 <div className="mt-2 animate-fade-in">
                     <textarea 
                        className="w-full bg-cyan-950/20 border border-cyan-800/50 rounded p-2 text-xs text-cyan-100 placeholder-cyan-800/50 focus:outline-none focus:border-cyan-500 transition-colors resize-none h-16"
                        placeholder={language === 'ko' ? "밀그라스 효과 설명..." : "Describe Milgrath override effect..."}
                        value={spell.mialgrathDescription}
                        onChange={(e) => onMialgrathDescriptionChange(spell.id, e.target.value)}
                     />
                 </div>
             )}
        </div>
    );
}

export const PageFour: React.FC = () => {
    const { 
        acquiredRunes,
        customSpells,
        handleRuneAction,
        handleSpellDescriptionChange,
        handleMialgrathDescriptionChange,
        handleToggleMialgrath,
        mialgrathRunesApplied,
        mialgrathRunesPurchased,
        handleAssignEntityToSpell,
        fontSize,
        selectedStarCrossedLovePacts,
        handleToggleKp,
        language,
        isOptimizationMode,
        isSimplifiedUiMode,
        totalRunes // New prop
    } = useCharacterContext();

    const activeDrysdeaData = language === 'ko' ? DRYADEA_DATA_KO : DRYADEA_DATA;
    const activeLimitlessData = language === 'ko' ? LIMITLESS_POTENTIAL_DATA_KO : LIMITLESS_POTENTIAL_DATA;
    const activeRulesData = language === 'ko' ? CUSTOM_SPELL_RULES_DATA_KO : CUSTOM_SPELL_RULES_DATA;
    const activeRunesData = language === 'ko' ? LIMITLESS_POTENTIAL_RUNES_DATA_KO : LIMITLESS_POTENTIAL_RUNES_DATA;

    const [fallingRunes, setFallingRunes] = React.useState<Array<{
        id: number;
        src: string;
        top: number;
        left: number;
        width: number;
        height: number;
        xOffsetEnd: number;
        rotation: number;
    }>>([]);

    const [modalState, setModalState] = useState<{
        spellId: number;
        type: 'companion' | 'beast' | 'vehicle' | 'weapon';
    } | null>(null);

    const handleRuneAnimation = (rect: DOMRect, src: string) => {
        if (isOptimizationMode) return;
        
        const xOffsetEnd = (Math.random() - 0.5) * 200;
        const rotation = (Math.random() - 0.5) * 60;
        const newRune = {
            id: Date.now() + Math.random(),
            src,
            top: rect.top,
            left: rect.left,
            width: rect.width, 
            height: rect.height, 
            xOffsetEnd,
            rotation,
        };
        setFallingRunes(prev => [...prev, newRune]);
    };

    const handleOpenAssignment = (spellId: number, type: 'companion' | 'beast' | 'vehicle' | 'weapon') => {
        setModalState({ spellId, type });
    };

    const handleClearAssignment = (spellId: number) => {
        handleAssignEntityToSpell(spellId, null, null);
    };

    const handleSelection = (name: string | null) => {
        if (modalState && name) {
            handleAssignEntityToSpell(modalState.spellId, modalState.type, name);
        }
        setModalState(null);
    };

    const getCurrentName = () => {
        if (!modalState) return null;
        const spell = customSpells.find(s => s.id === modalState.spellId);
        return spell?.assignedEntityName || null;
    };

    // Use totalRunes for display counts to reflect Sandbox bonuses
    const totalRuhaiCount = totalRunes.get('ruhai') ?? 0;
    const usedRuhaiCount = customSpells.filter(s => s.description.trim().length > 0).length;
    const availableRuhaiCount = Math.max(0, totalRuhaiCount - usedRuhaiCount);

    const availableMialgrathCount = mialgrathRunesPurchased - mialgrathRunesApplied;

    const hasKuriOdanCharm = selectedStarCrossedLovePacts.has('kuri_odans_charm');

    return (
        <>
            {fallingRunes.map(rune => (
                <img
                    key={rune.id}
                    src={rune.src}
                    className="sigil-fall-animation"
                    style={{ 
                        top: rune.top, 
                        left: rune.left,
                        width: `${rune.width}px`,
                        height: `${rune.height}px`,
                        '--x-offset-end': `${rune.xOffsetEnd}px`,
                        '--rotation': `${rune.rotation}deg`,
                    } as React.CSSProperties}
                    onAnimationEnd={() => {
                        setFallingRunes(prev => prev.filter(s => s.id !== rune.id));
                    }}
                />
            ))}
            
            {/* Standard Rune Counter - Hidden if Simplified UI is ON */}
            {!isSimplifiedUiMode && (
                <RuneCounter 
                    ruhaiCount={availableRuhaiCount} 
                    availableMialgrathCount={availableMialgrathCount} 
                    onAction={handleRuneAction}
                    language={language}
                    runeData={activeRunesData}
                />
            )}

            <BlessingIntro {...activeDrysdeaData} />
            <BlessingIntro {...activeLimitlessData} reverse />
            
            <section className="my-16 max-w-4xl mx-auto bg-black/40 backdrop-blur-md p-8 border border-gray-700/50 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                <h3 className="text-center font-cinzel text-2xl text-amber-100 mb-6 tracking-wide drop-shadow-md">{renderFormattedText(activeRulesData.title)}</h3>
                <ol className="space-y-4 text-gray-300 text-sm leading-relaxed">
                    {activeRulesData.rules.map((rule, index) => (
                        <li key={index} className="flex gap-4 items-start">
                            <span className="font-mono text-amber-500 font-bold">0{index + 1}.</span>
                            <span>{renderFormattedText(rule)}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="my-16" id="rune-purchase-section">
                <SectionHeader>{language === 'ko' ? "룬 획득" : "ACQUIRE RUNES"}</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
                    <RuneCard 
                        rune={activeRunesData[0]} 
                        count={totalRuhaiCount}
                        onAction={(action) => handleRuneAction('ruhai', action)}
                        onAnimate={(rect) => handleRuneAnimation(rect, activeRunesData[0].imageSrc)}
                        fontSize={fontSize}
                        language={language}
                    />
                    <RuneCard 
                        rune={activeRunesData[1]}
                        count={mialgrathRunesPurchased}
                        onAction={(action) => handleRuneAction('mialgrath', action)}
                        onAnimate={(rect) => handleRuneAnimation(rect, activeRunesData[1].imageSrc)}
                        fontSize={fontSize}
                        language={language}
                    />
                </div>
            </section>
            
            {totalRuhaiCount > 0 && (
                 <section className="my-24 max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="h-px w-16 bg-amber-800"></div>
                        <h2 className="font-cinzel text-3xl text-amber-100 tracking-[0.2em] text-center">{language === 'ko' ? "주문 설정" : "SPELL CONFIGURATION"}</h2>
                        <div className="h-px w-16 bg-amber-800"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {customSpells.map((spell, index) => (
                            <CustomSpellInput
                                key={spell.id}
                                spell={spell}
                                index={index}
                                onDescriptionChange={handleSpellDescriptionChange}
                                onMialgrathToggle={handleToggleMialgrath}
                                onMialgrathDescriptionChange={handleMialgrathDescriptionChange}
                                canApplyMialgrath={availableMialgrathCount > 0 || spell.mialgrathApplied}
                                onOpenAssignment={handleOpenAssignment}
                                onClearAssignment={handleClearAssignment}
                                showKpButton={hasKuriOdanCharm}
                                onToggleKp={handleToggleKp}
                                language={language}
                                mialgrathImageSrc={activeRunesData[1].imageSrc}
                            />
                        ))}
                    </div>
                </section>
            )}
             <div className="flex justify-center my-24 px-4">
                 <div className="relative w-full max-w-7xl rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                    <img src="/images/4RLbmnFv-travler.webp" alt="Cityscape" className="w-full object-cover no-glow" />
                 </div>
            </div>

            {/* Selection Modals */}
            {modalState && modalState.type === 'companion' && (
                <CompanionSelectionModal 
                    onClose={() => setModalState(null)}
                    onSelect={handleSelection}
                    currentCompanionName={getCurrentName()}
                    pointLimit={100}
                    title={language === 'ko' ? "밀그라스 동료 할당" : "Assign Milgrath Companion"}
                    colorTheme="cyan"
                />
            )}
            {modalState && modalState.type === 'beast' && (
                <BeastSelectionModal 
                    onClose={() => setModalState(null)}
                    onSelect={handleSelection}
                    currentBeastName={getCurrentName()}
                    pointLimit={100}
                    title={language === 'ko' ? "밀그라스 동물 할당" : "Assign Milgrath Beast"}
                    colorTheme="cyan"
                />
            )}
            {modalState && modalState.type === 'vehicle' && (
                <VehicleSelectionModal 
                    onClose={() => setModalState(null)}
                    onSelect={handleSelection}
                    currentVehicleName={getCurrentName()}
                    pointLimit={100}
                    title={language === 'ko' ? "밀그라스 탈것 할당" : "Assign Milgrath Vehicle"}
                    colorTheme="cyan"
                />
            )}
            {modalState && modalState.type === 'weapon' && (
                <WeaponSelectionModal 
                    onClose={() => setModalState(null)}
                    onSelect={handleSelection}
                    currentWeaponName={getCurrentName()}
                    pointLimit={100}
                    title={language === 'ko' ? "밀그라스 무기 할당" : "Assign Milgrath Weapon"}
                    colorTheme="cyan"
                />
            )}
        </>
    );
};
