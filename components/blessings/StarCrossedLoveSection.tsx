
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { 
    STAR_CROSSED_LOVE_DATA, STAR_CROSSED_LOVE_DATA_KO, 
    STAR_CROSSED_LOVE_SIGIL_TREE_DATA, STAR_CROSSED_LOVE_SIGIL_TREE_DATA_KO, 
    STAR_CROSSED_LOVE_PACTS_DATA, STAR_CROSSED_LOVE_PACTS_DATA_KO, 
    BLESSING_ENGRAVINGS 
} from '../../constants';
import type { StarCrossedLovePact, StarCrossedLoveSigil, ChoiceItem, MagicGrade } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, CompanionIcon, BoostedEffectBox, renderFormattedText } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { BeastSelectionModal } from '../BeastSelectionModal';
import { ImmunitySelectionModal } from '../ImmunitySelectionModal';

const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): string | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const PowerCard: React.FC<{
    power: ChoiceItem;
    isSelected: boolean;
    isDisabled: boolean;
    onToggle: (id: string) => void;
    children?: React.ReactNode;
    iconButton?: React.ReactNode;
    onIconButtonClick?: () => void;
    fontSize?: 'regular' | 'large';
}> = ({ power, isSelected, isDisabled, onToggle, children, iconButton, onIconButtonClick, fontSize = 'regular' }) => {
    const gradeStyles: Record<string, string> = {
        kaarn: 'border-white ring-white/50',
        purth: 'border-green-400 ring-green-400/50',
        xuth: 'border-red-500 ring-red-500/50',
        lekolu: 'border-yellow-400 ring-yellow-400/50',
        sinthru: 'border-purple-500 ring-purple-500/50',
    };
    const activeStyle = gradeStyles[(power.grade as string) || 'kaarn'] || gradeStyles.kaarn;

    const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all h-full ${
        isSelected
        ? `border-2 ${activeStyle} ring-2`
        : isDisabled
            ? 'opacity-50 cursor-not-allowed border-gray-800'
            : 'border-white/10 hover:border-white/40 cursor-pointer'
    }`;

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onIconButtonClick?.();
    };
    
    // Robust check for children to avoid empty borders
    const hasChildren = React.Children.toArray(children).some(child => child);

    const shadowMap: Record<string, string> = {
        purth: '#C7DE95',
        xuth: '#E16456',
        lekolu: '#F1E350',
        sinthru: '#D481DC',
    };
    const shadowColor = power.grade ? shadowMap[power.grade] : undefined;
    const textShadow = shadowColor ? `0 0 2px ${shadowColor}` : 'none';
    const titleColor = shadowColor || 'white';
    
    const descriptionClass = fontSize === 'large' ? 'text-sm' : 'text-xs';

    return (
        <div className={`${wrapperClass} relative`} onClick={() => !isDisabled && onToggle(power.id)}>
            {iconButton && onIconButtonClick && isSelected && (
                <button
                    onClick={handleIconClick}
                    className="absolute top-2 right-2 p-2 rounded-full bg-purple-900/50 text-purple-200/70 hover:bg-purple-800/60 hover:text-purple-100 transition-colors z-10"
                    aria-label="Card action"
                >
                    {iconButton}
                </button>
            )}
            <img src={power.imageSrc} alt={power.title} className="w-full aspect-[3/2] rounded-md mb-4 object-cover" />
            <h4 className="font-cinzel font-bold tracking-wider text-xl" style={{ textShadow, color: titleColor }}>{power.title}</h4>
            {power.cost && <p className="text-xs text-yellow-300/70 italic mt-1">{power.cost}</p>}
            
            {/* Separator Line */}
            {power.description && <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>}
            
            <p className={`${descriptionClass} text-gray-400 font-medium leading-relaxed flex-grow text-left whitespace-pre-wrap`} style={{ textShadow }}>{renderFormattedText(power.description)}</p>
            {hasChildren && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50 w-full">
                    {children}
                 </div>
            )}
        </div>
    );
};

const SinthruContractInterface: React.FC<{
    onGainSigil: () => void;
    onLoseSigil: () => void;
    currentCount: number;
    language: 'en' | 'ko';
}> = ({ onGainSigil, onLoseSigil, currentCount, language }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAnimating(true);
        onGainSigil();
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onLoseSigil();
    };

    return (
        <div className="mt-24 mb-12 relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl border-2 border-purple-900/50 bg-[#0a020a] shadow-[0_0_50px_rgba(88,28,135,0.2)] select-none">
            {/* Background Texture & Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_#a855f7]"></div>
            
            <div className="relative z-10 flex flex-col items-center p-10 text-center">
                <h3 className="font-cinzel text-3xl text-purple-200 tracking-[0.2em] mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                    {language === 'ko' ? "신스루 마녀단의 지원" : "THE COVEN'S SUPPLY"}
                </h3>
                <p className="text-purple-400/60 font-serif italic text-sm mb-10 tracking-wide">
                    {language === 'ko' ? "\"그럼, 세상을 등질 준비는 되셨나요?\"" : "\"Then… are you ready to turn your back on the world?\""}
                </p>

                <button 
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    className={`
                        group relative w-32 h-32 rounded-full bg-black border-2 border-purple-500/50 
                        shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300
                        hover:border-purple-400 hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105
                        active:scale-95 active:border-purple-300 cursor-pointer
                    `}
                    title={language === 'ko' ? "좌클릭: 표식 가져오기 | 우클릭: 표식 반납" : "Left Click: Take Sigil | Right Click: Return Sigil"}
                >
                    {/* Ripple Effect */}
                    <div className={`absolute inset-0 rounded-full border border-purple-500 opacity-0 transition-all duration-500 ${isAnimating ? 'animate-ping opacity-100' : ''}`}></div>
                    
                    {/* Inner Glow */}
                    <div className="absolute inset-2 rounded-full bg-purple-900/20 group-hover:bg-purple-900/40 transition-colors"></div>

                    {/* Icon */}
                    <img 
                        src="/images/nq80Y3pk-sinthru.png" 
                        alt="Sinthru Sigil" 
                        className={`
                            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 object-contain 
                            drop-shadow-[0_0_5px_rgba(168,85,247,0.8)] transition-all duration-300
                            group-hover:drop-shadow-[0_0_15px_rgba(216,180,254,1)] group-hover:brightness-125
                        `}
                    />
                </button>

                <div className="mt-8 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-purple-500 uppercase tracking-[0.3em] font-bold">{language === 'ko' ? "현재 재고" : "Current Stock"}</span>
                    <div className="flex items-center gap-3 px-6 py-2 bg-purple-950/30 rounded-lg border border-purple-500/20">
                        <span className="font-cinzel text-2xl text-purple-100">{currentCount}</span>
                        <span className="text-xs text-purple-400 font-mono">{language === 'ko' ? "표식" : "SIGILS"}</span>
                    </div>
                    <span className="text-[9px] text-purple-600/50 uppercase tracking-widest mt-2">{language === 'ko' ? "좌클릭: 획득 • 우클릭: 반납" : "L-Click: Take • R-Click: Return"}</span>
                </div>
            </div>
        </div>
    );
};

export const StarCrossedLoveSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isOnisBlessingModalOpen, setIsOnisBlessingModalOpen] = useState(false);
    const [isImmunityModalOpen, setIsImmunityModalOpen] = useState(false);

    const {
        selectedStarCrossedLoveSigils,
        handleStarCrossedLoveSigilSelect,
        selectedStarCrossedLovePacts,
        handleStarCrossedLovePactSelect,
        availablePactPicks,
        onisBlessingGuardianName,
        handleOnisBlessingGuardianAssign,
        lostKronackImmunity,
        handleLostKronackImmunityChange,
        jadeEmperorExtraXuthPurchased,
        handleToggleJadeEmperorExtraXuth,
        selectedSpecialSigilChoices,
        selectedDominionId,
        kpPaidNodes, toggleKpNode,
        handleCommonSigilAction,
        acquiredCommonSigils,
        fontSize,
        language
    } = useCharacterContext();

    const activeData = language === 'ko' ? STAR_CROSSED_LOVE_DATA_KO : STAR_CROSSED_LOVE_DATA;
    const activeTree = language === 'ko' ? STAR_CROSSED_LOVE_SIGIL_TREE_DATA_KO : STAR_CROSSED_LOVE_SIGIL_TREE_DATA;
    const activePacts = language === 'ko' ? STAR_CROSSED_LOVE_PACTS_DATA_KO : STAR_CROSSED_LOVE_PACTS_DATA;

    const isStarCrossedLoveSigilDisabled = (sigil: StarCrossedLoveSigil): boolean => {
        if (selectedStarCrossedLoveSigils.has(sigil.id)) return false; 
        
        if (sigil.prerequisites && !sigil.prerequisites.every(p => selectedStarCrossedLoveSigils.has(p))) return true;
        
        // KP check
        if (kpPaidNodes.has(String(sigil.id))) return false;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof typeof ctx.availableSigilCounts] < sigilCost) return true;

        return false;
    };

    const isStarCrossedLovePactDisabled = (pact: StarCrossedLovePact): boolean => {
        if (!selectedStarCrossedLovePacts.has(pact.id) && selectedStarCrossedLovePacts.size >= availablePactPicks) return true;
        return false;
    };

    const getStarCrossedLoveSigil = (id: string) => activeTree.find(s => s.id === id)!;

    const handleKpToggle = (sigil: StarCrossedLoveSigil) => {
        const type = getSigilTypeFromImage(sigil.imageSrc);
        if (type) {
            toggleKpNode(String(sigil.id), type);
        }
    };

    const renderSigilNode = (sigil: StarCrossedLoveSigil) => {
        const type = getSigilTypeFromImage(sigil.imageSrc);
        let color: SigilColor = 'purple';
        let benefitColor = 'text-purple-300';
        
        if (type === 'juathas') {
            color = 'orange';
            benefitColor = 'text-orange-300';
        } else if (type === 'xuth') {
            color = 'red';
            benefitColor = 'text-red-300';
        }

        const benefits = sigil.benefits.pacts ? <p className={benefitColor}>+ {sigil.benefits.pacts} {language === 'ko' ? "계약" : "Pact"}</p> : null;
        
        return (
            <CompellingWillSigilCard 
                sigil={sigil} 
                isSelected={selectedStarCrossedLoveSigils.has(sigil.id)} 
                isDisabled={isStarCrossedLoveSigilDisabled(sigil)} 
                onSelect={handleStarCrossedLoveSigilSelect} 
                benefitsContent={benefits} 
                color={color}
                compact={true}
                onToggleKp={() => handleKpToggle(sigil)}
                isKpPaid={kpPaidNodes.has(String(sigil.id))}
            />
        );
    };

    const staticScaleStyle: React.CSSProperties = fontSize === 'large' ? { zoom: 0.83333 } : {};

    const formatImmunityLabel = (id: string) => {
        if (language === 'ko') {
            const koMap: Record<string, string> = {
                telekinetics: '염력',
                metathermics: '메타열역학',
                eleanors_techniques: '엘레노어의 기술',
                genevieves_techniques: '제네비브의 기술',
                brewing: '양조',
                soul_alchemy: '영혼 연금술',
                transformation: '변신술',
                channelling: '혼령술',
                necromancy: '강령술',
                black_magic: '흑마법',
                telepathy: '텔레파시',
                mental_manipulation: '정신 조작',
                features: '특성',
                influence: '영향',
                technomancy: '기계마법',
                nanite_control: '나나이트 조종',
                magitech: '마법공학',
                arcane_constructs: '비전 구조체',
                metamagic: '메타마법'
            };
            return koMap[id] || id;
        }
        return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <section>
            <BlessingIntro {...activeData} />
            
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>{language === 'ko' ? "표식 트리" : "SIGIL TREE"}</SectionHeader>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                    {activeTree.map((sigil, index) => (
                        <div key={sigil.id} className="flex items-center">
                            {renderSigilNode(sigil)}
                            {index < activeTree.length - 1 && (
                                <div className="hidden md:block w-16 h-px bg-gray-600 mx-4"></div>
                            )}
                            {index < activeTree.length - 1 && (
                                <div className="md:hidden h-16 w-px bg-gray-600 my-4"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>{language === 'ko' ? "계약" : "Pacts"}</SectionHeader>
                <SectionSubHeader>
                    {language === 'ko' ? `선택 가능: ${availablePactPicks - selectedStarCrossedLovePacts.size} / ${availablePactPicks}` : `Picks Available: ${availablePactPicks - selectedStarCrossedLovePacts.size} / ${availablePactPicks}`}
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={staticScaleStyle}>
                    {activePacts.map(pact => {
                        const isSelected = selectedStarCrossedLovePacts.has(pact.id);
                        const isOnisBlessing = pact.id === 'onis_blessing';
                        const isLostKronack = pact.id === 'lost_kronacks_deal';
                        const isJadeEmperor = pact.id === 'jade_emperors_challenge';

                        return (
                            <PowerCard 
                                key={pact.id} 
                                power={{...pact, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={handleStarCrossedLovePactSelect} 
                                isDisabled={isStarCrossedLovePactDisabled(pact)}
                                iconButton={isOnisBlessing && isSelected ? <CompanionIcon /> : undefined}
                                onIconButtonClick={isOnisBlessing && isSelected ? () => setIsOnisBlessingModalOpen(true) : undefined}
                                fontSize={fontSize}
                            >
                                {isOnisBlessing && isSelected && onisBlessingGuardianName && (
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400">{language === 'ko' ? "오니 수호자:" : "Assigned Guardian:"}</p>
                                        <p className="text-sm font-bold text-amber-300">{onisBlessingGuardianName}</p>
                                    </div>
                                )}
                                {isLostKronack && isSelected && (
                                    <div className="mt-2 w-full" onClick={e => e.stopPropagation()}>
                                         <button 
                                            onClick={() => setIsImmunityModalOpen(true)}
                                            className={`w-full text-[10px] uppercase font-bold border rounded py-1.5 transition-all ${
                                                lostKronackImmunity 
                                                ? 'bg-purple-900/60 text-purple-200 border-purple-500 hover:bg-purple-800' 
                                                : 'bg-gray-900/50 text-gray-400 border-gray-600 hover:border-purple-500/50 hover:text-purple-300'
                                            }`}
                                        >
                                            {lostKronackImmunity ? (
                                                `${language === 'ko' ? "면역" : "Immunity"}: ${formatImmunityLabel(lostKronackImmunity)}`
                                            ) : (
                                                (language === 'ko' ? "면역 선택" : "Select Immunity")
                                            )}
                                        </button>
                                    </div>
                                )}
                                {isJadeEmperor && isSelected && (
                                    <div className="text-center" onClick={e => e.stopPropagation()}>
                                        {(() => {
                                            const trials = selectedSpecialSigilChoices.get('xuth')?.size || 0;
                                            const xuthCost = selectedDominionId === 'valsereth' ? 9 : 12;
                                            
                                            if (trials >= 1) {
                                                return (
                                                    <div>
                                                        <p className="text-xs text-green-400 font-bold mb-2">
                                                            {language === 'ko' ? `환급 활성화: -${xuthCost/2} BP` : `Refund Active: -${xuthCost/2} BP`}
                                                        </p>
                                                        {trials >= 2 ? (
                                                             <button
                                                                onClick={handleToggleJadeEmperorExtraXuth}
                                                                className={`w-full px-2 py-1 text-[10px] uppercase font-bold border rounded transition-all ${jadeEmperorExtraXuthPurchased ? 'bg-red-900/60 text-red-200 border-red-500' : 'bg-gray-900/50 text-gray-400 border-gray-600 hover:border-red-500/50'}`}
                                                            >
                                                                {jadeEmperorExtraXuthPurchased 
                                                                    ? (language === 'ko' ? "시련 추가 구매됨" : "Extra Trial Purchased")
                                                                    : (language === 'ko' ? `주스 표식 추가 구매 (${xuthCost} BP)` : `Buy Extra Xuth Sigil (${xuthCost} BP)`)
                                                                }
                                                            </button>
                                                        ) : (
                                                            <p className="text-[9px] text-gray-500 italic">
                                                                {language === 'ko' ? "시련 2개를 완료하여 추가 구매를 해금하세요." : "Complete 2 trials to unlock extra purchase."}
                                                            </p>
                                                        )}
                                                    </div>
                                                )
                                            }
                                            return <p className="text-[10px] text-gray-500 italic">{language === 'ko' ? "주스 시련을 완료하여 환급을 활성화하세요." : "Complete a Xuth trial to activate refund."}</p>;
                                        })()}
                                    </div>
                                )}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>

            {selectedStarCrossedLovePacts.has('sinthrus_contract') && (
                <SinthruContractInterface 
                    onGainSigil={() => handleCommonSigilAction('sinthru', 'buy')}
                    onLoseSigil={() => handleCommonSigilAction('sinthru', 'sell')}
                    currentCount={acquiredCommonSigils.get('sinthru') || 0}
                    language={language}
                />
            )}

            {isOnisBlessingModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsOnisBlessingModalOpen(false)}
                    onSelect={(name) => {
                        handleOnisBlessingGuardianAssign(name);
                        setIsOnisBlessingModalOpen(false);
                    }}
                    currentBeastName={onisBlessingGuardianName}
                    pointLimit={100}
                    title={language === 'ko' ? "오니 수호자 할당 (100 BP)" : "Assign Oni Guardian (100 BP)"}
                />
            )}

            {isImmunityModalOpen && (
                <ImmunitySelectionModal
                    onClose={() => setIsImmunityModalOpen(false)}
                    onSelect={(immunity) => {
                        handleLostKronackImmunityChange(immunity);
                        setIsImmunityModalOpen(false);
                    }}
                    currentSelection={lostKronackImmunity}
                />
            )}
        </section>
    );
};
