import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
  DOMINIONS, DOMINIONS_KO, TRAITS_DATA, TRAITS_DATA_KO, HOUSES_DATA, HOUSES_DATA_KO, HOUSE_UPGRADES_DATA, HOUSE_UPGRADES_DATA_KO,
  TRUE_SELF_TRAITS, TRUE_SELF_TRAITS_KO, ALTER_EGO_TRAITS, ALTER_EGO_TRAITS_KO, UNIFORMS_DATA, UNIFORMS_DATA_KO, MAGICAL_STYLES_DATA, MAGICAL_STYLES_DATA_KO,
  BUILD_TYPES_DATA, BUILD_TYPES_DATA_KO
} from '../constants';
import type { Dominion } from '../types';
import { DominionCard } from './DominionCard';
import { PointCard } from './PointCard';
import { ChoiceCard } from './TraitCard';
import { SectionHeader, SectionSubHeader, VehicleIcon, CompanionIcon, HouseIcon, renderFormattedText, AdvancedTypewriter } from './ui';
import { VehicleSelectionModal } from './VehicleSelectionModal';
import { CompanionSelectionModal } from './SigilTreeOptionCard';
import { BeastSelectionModal } from './BeastSelectionModal';
import { VacationHomeModal } from './VacationHomeModal';

// Main Component
interface CounterProps {
    label: string;
    count: number;
    onCountChange: (newCount: number) => void;
    unit: string;
    cost: string;
    displayMultiplier?: number;
}

const Counter: React.FC<CounterProps> = ({ label, count, onCountChange, unit, cost, displayMultiplier = 1 }) => (
    <div className="text-center">
        <label className="text-xs text-gray-300 font-semibold">{label} <span className={cost && cost.includes('FP') ? "text-green-400 font-bold" : "text-red-400 font-normal"}>({cost})</span></label>
        <div className="flex items-center justify-center gap-2 mt-1">
            <button onClick={(e) => { e.stopPropagation(); onCountChange(count - 1); }} disabled={count === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
            <span className="font-semibold text-white w-24 text-center">{count * displayMultiplier} {unit}</span>
            <button onClick={(e) => { e.stopPropagation(); onCountChange(count + 1); }} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
        </div>
    </div>
);

const PARENT_IMAGES = [
    '/images/PZJmzncs-parent1.webp',
    '/images/DPffzsyr-parent2.webp'
];

const SIBLING_IMAGES = [
    '/images/m58qFCRf-sib1.webp',
    '/images/99DpjRKC-sib2.webp',
    '/images/7JSPLK9W-sib3.webp',
    '/images/Fk5N4YbF-sib4.webp'
];

export const PageOne: React.FC = () => {
    const {
        selectedDominionId,
        numParents, numSiblings, assignedTraits, selectedHouseId,
        selectedUpgrades, selectedTrueSelfTraits, selectedAlterEgoTraits,
        selectedUniforms, selectedMagicalStyles, selectedBuildTypeId,
        selectedFamilyMemberId, handleSelectFamilyMember,
        familyMemberNotes, handleFamilyMemberNoteChange,
        familyMemberImages, handleSetFamilyMemberImage,
        handleSelectDominion, handleNumParentsChange, handleNumSiblingsChange,
        handleTraitSelect, handleHouseSelect, handleUpgradeSelect,
        handleTrueSelfTraitSelect, handleAlterEgoTraitSelect,
        handleUniformSelect, handleMagicalStyleSelect, handleBuildTypeSelect,
        vacationHomes, 
        mansionExtraSqFt, handleMansionSqFtChange,
        islandExtraMiles, handleIslandMilesChange,
        vrChamberCostType, handleVrChamberCostSelect,
        assignedVehicleName, handleAssignVehicle,
        blessedCompanions, handleAssignBlessedCompanion,
        mythicalPetBeastName, handleAssignMythicalPet,
        inhumanAppearanceBeastName, handleAssignInhumanAppearance,
        fontSize,
        language,
        isIntroDone, setIsIntroDone
    } = useCharacterContext();

    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isBlessedModalOpen, setIsBlessedModalOpen] = useState(false);
    const [isMythicalPetModalOpen, setIsMythicalPetModalOpen] = useState(false);
    const [isInhumanAppearanceModalOpen, setIsInhumanAppearanceModalOpen] = useState(false);
    const [isVacationHomeModalOpen, setIsVacationHomeModalOpen] = useState(false);

    // Intro Animation State
    const [introStage, setIntroStage] = useState(isIntroDone ? 4 : 0); 
    const [showSkipButton, setShowSkipButton] = useState(false);
    // 0: Init
    // 1: Yasmin Fade In
    // 2: Typing Paragraph 1
    // 3: Typing Rest
    // 4: Full Reveal

    useEffect(() => {
        // If already done, skip animation logic
        if (isIntroDone) return;

        // Start sequence on mount
        const t1 = setTimeout(() => setIntroStage(1), 500); // Image Fade In
        const t2 = setTimeout(() => setIntroStage(2), 1500); // Start Typing P1
        const t3 = setTimeout(() => setShowSkipButton(true), 3000); // Show Skip Button after 3s

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [isIntroDone]);

    useEffect(() => {
        if (introStage === 4) {
            setIsIntroDone(true);
        }
    }, [introStage, setIsIntroDone]);

    const skipIntro = () => {
        setIntroStage(4);
    };


    const getFamilyMemberColor = (index: number): string => {
        const colors = [
            '#ef4444', // Red
            '#f97316', // Orange
            '#eab308', // Yellow
            '#22c55e', // Green
            '#0ea5e9', // Sky Blue
            '#3b82f6', // Blue
            '#a855f7', // Purple
        ];
        const rainbowColor = '#d946ef'; // Magenta as "rainbow"
        return index < colors.length ? colors[index] : rainbowColor;
    };
    
    const cycleImage = (id: string, pool: string[], defaultImage: string) => {
        const current = familyMemberImages.get(id) || defaultImage;
        const currentIndex = pool.indexOf(current);
        const nextIndex = (currentIndex + 1) % pool.length;
        handleSetFamilyMemberImage(id, pool[nextIndex]);
    };

    useEffect(() => {
        if (numParents === 0 && numSiblings === 0) {
            if (selectedHouseId !== 'ragamuffin') {
                handleHouseSelect('ragamuffin');
            }
        } else if (numParents > 0) {
            if (selectedHouseId === 'ragamuffin') {
                handleHouseSelect('ragamuffin'); 
            }
        }
    }, [numParents, numSiblings, selectedHouseId, handleHouseSelect]);

    const activeDominions = language === 'ko' ? DOMINIONS_KO : DOMINIONS;
    const activeTraits = language === 'ko' ? TRAITS_DATA_KO : TRAITS_DATA;
    const activeHouses = language === 'ko' ? HOUSES_DATA_KO : HOUSES_DATA;
    const activeUpgrades = language === 'ko' ? HOUSE_UPGRADES_DATA_KO : HOUSE_UPGRADES_DATA;
    
    const activeTrueSelfTraits = language === 'ko' ? TRUE_SELF_TRAITS_KO : TRUE_SELF_TRAITS;
    const activeAlterEgoTraits = language === 'ko' ? ALTER_EGO_TRAITS_KO : ALTER_EGO_TRAITS;
    const activeUniforms = language === 'ko' ? UNIFORMS_DATA_KO : UNIFORMS_DATA;
    const activeMagicalStyles = language === 'ko' ? MAGICAL_STYLES_DATA_KO : MAGICAL_STYLES_DATA;
    const activeBuildTypes = language === 'ko' ? BUILD_TYPES_DATA_KO : BUILD_TYPES_DATA;

    const introTitle = language === 'ko' ? '탄생' : 'YOUR BIRTH';
    const stageTitle = language === 'ko' ? '스테이지 1' : 'STAGE I';
    
    // Intro Text Content
    const introP1 = language === 'ko' ? "거리에서 테오시스 축제의 행렬이 행진하고 있습니다. 오늘은 500년 전 인류가 끝내 바벨탑을 정복하고 신을 죽인 것을 기념하는 날입니다." : "Today, the Theosis Festival parades through the streets, celebrating the 500th anniversary of the day mankind finally ascended the Tower of Babel, and killed God.";
    
    const introRest = language === 'ko' 
        ? `모두 이것이 무엇을 뜻하는지 알지요; 1년간 열렬히 기다려온 더 많은 마법사들의 탄생입니다. 모든 지역에서요! 수백만 명의 사람들이 이 역사적인 사건을 보기 위해 각자의 수도로 여행을 떠납니다. 군중을 이끄는 사람은, 밤하늘의 별들로 빛나는 망토를 입은 낯설고 작은 소녀입니다. 그녀의 이름은 야스민으로, 이 부서진 세계를 좌지우지하는 수많은 마녀들 중 한 명입니다. {bp}“오세요, 모두 오세요! 식이 곧 시작될거고-누구도 놓치고 싶진 않을 거에요! 어머니께서 올해에는 몇 명의 특별한 마법사들이 태어날 거라고 말씀하셨어요. 맞아요; 어머니의 무한한 관대함 속에서, 일반적인 마법사보다도 더욱 강력한 특별한 마법사들이 우리에게 오게 될 거에요. 분명히, 어머니께서 인류를 위해 장대한 계획을 세워 두고 있으시겠죠.”{/bp} 야스민은 환호하네요. 대부분의 관중은 그저 감탄사를 내뱉고 있습니다. 개중에 몇몇 지혜로운 자들은, 신경질적으로 얼굴을 찌푸리고 있습니다. 그런 극단적인 조치는 분명 어머니가 진심으로 다급하다는 것을 의미함을 알기 때문입니다.\n\n{bp}“그들 중 누군가가 여기서 태어날까요? 알 방법은 한 가지밖에 없겠네요. 오, 보세요, 시작됐어요!”{/bp}\n\n관중들은 푸른 소용돌이에 가까이 모여, 생명의 기적적인 창조에서 우주의 손을 인도하는 하늘빛의 어머니를 경외하며 바라보고 있습니다...`
        : `Everyone knows what that means; the eagerly awaited annual birth of more mages, a few for every Dominion in the land! Millions of people travel miles to their respective capitals to witness these historic events. Leading the crowd is a strange, small girl with a cloak that glows with all the stars of the night sky. She is Yasmin, one of the countless mages that make up all the movers and shakers of this fractured verse. {bp}“Come one, come all! The ceremony is about to begin — and this is one you won’t want to miss! The Mother tells me a few special mages are going to be born this year. That’s right; in her infinite generosity, the Mother is bequeathing unto us a few mages far more powerful than the standard this year. All part of her grand plan for all mankind, I’m sure,”{/bp} Yasmin cheers. Most of the crowd simply oos and aas. A few, the wiser among them, grimace nervously, knowing such drastic measures imply the Mother must be becoming truly desperate.\n\n{bp}“I wonder if one of them will be born right here? There’s only one way to find out. Oooo, look, it’s starting!”{/bp}\n\nThe crowd gathers closely around that swirling blue vortex, beholding in awe as the Mother of Azure guides the universe’s hand in the miraculous creation of life…`;

    // Dynamic Speed Config
    const typingSpeedP1 = language === 'ko' ? 50 : 15; // Extremely fast in English
    const typingSpeedRest = language === 'ko' ? 30 : 5; // Near instant in English

    const getBlessedModalTitle = () => {
        if (!selectedFamilyMemberId) return "";
        const [type, indexStr] = selectedFamilyMemberId.split('-');
        const index = parseInt(indexStr) + 1;
        
        if (language === 'ko') {
            const memberType = type === 'parent' ? '부모님' : '형제';
            return `${memberType} ${index}의 축복받은 동료 할당`;
        }
        return `Assign a Blessed Companion for ${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`;
    };

    return (
        <>
        {/* Stage I: Your Birth Section with Cinematic Intro */}
        <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16 min-h-[60vh] relative">
            <div className={`flex-shrink-0 relative transition-all duration-1000 transform ${introStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <img 
                    src="/images/DDHNTZDF-main2.webp" 
                    alt="Yasmin, the guide" 
                    className="w-96 md:w-[36rem] drop-shadow-2xl"
                />
            </div>
            
            <div className="max-w-2xl text-center lg:text-left relative">
                {/* Intro Control */}
                {introStage < 4 && showSkipButton && (
                    <button 
                        onClick={skipIntro} 
                        className="absolute -top-12 right-0 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors border border-gray-700 rounded px-2 py-1 bg-black/40 animate-fade-in-up-toast"
                    >
                        Skip Intro »
                    </button>
                )}

                <div className={`transition-opacity duration-1000 ${introStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <h2 className="text-2xl font-cinzel tracking-widest text-gray-400">{stageTitle}</h2>
                    <h1 className="text-5xl font-bold font-cinzel my-2 text-white">{introTitle}</h1>
                    <hr className="border-gray-600 my-4" />
                </div>
                
                <div className="text-gray-300 leading-relaxed mb-6 space-y-4 min-h-[200px]">
                    {introStage >= 2 && (
                        <div>
                            {/* Paragraph 1 */}
                            {introStage === 2 ? (
                                <AdvancedTypewriter 
                                    text={introP1} 
                                    speed={typingSpeedP1}
                                    onComplete={() => setIntroStage(3)} 
                                    className="text-white drop-shadow-md mb-4 block" 
                                />
                            ) : (
                                <p className="text-white drop-shadow-md mb-4">{introP1}</p>
                            )}

                            {/* Paragraph 2 (Rest) - Only start if stage >= 3 */}
                            {introStage >= 3 && (
                                introStage === 3 ? (
                                    <AdvancedTypewriter 
                                        text={introRest} 
                                        speed={typingSpeedRest}
                                        onComplete={() => setIntroStage(4)} 
                                        className="block" 
                                    />
                                ) : (
                                    <div className="whitespace-pre-wrap">
                                        {renderFormattedText(introRest)}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                <div className={`transition-all duration-1000 delay-500 transform ${introStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <img 
                        src="/images/5gP1n3vK-main3.webp" 
                        alt="Swirling blue vortex" 
                        className="rounded-lg shadow-lg shadow-blue-500/20 w-full max-w-lg mx-auto lg:mx-0" 
                    />
                </div>
            </div>
        </section>

        {/* Content Fades In only after intro is complete */}
        <div className={`transition-opacity duration-1000 ${introStage >= 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Dominion Choice Section */}
            <section className="my-16">
                <SectionHeader>{language === 'ko' ? "당신이 다시 태어날 지역을 고르십시오" : "Choose the Dominion in which you shall be reborn"}</SectionHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {activeDominions.map((dominion: Dominion) => (
                    <DominionCard
                    key={dominion.id}
                    dominion={dominion}
                    isSelected={selectedDominionId === dominion.id}
                    onSelect={handleSelectDominion}
                    />
                ))}
                </div>
            </section>
            
            {/* Points & Intro Section */}
            <section className="mt-24 text-center max-w-7xl mx-auto">
                <hr className="border-gray-700 mb-8" />
                <p className="text-gray-400 italic leading-relaxed mb-12 max-w-4xl mx-auto text-sm">
                {language === 'ko' 
                    ? "'버림받은 시대'가 끝난 이후로 지구는 모두가 꿈꾸는 이상향이 되었습니다. 한때 인류를 괴롭히던 가난, 기근, 역병, 노화와 같은 문제들은 모두 인류의 손에 정복되었죠. 사회의 최하층도 놀라울 정도로 편하고 안락한 삶을 살 수 있습니다. 하지만 가장 지체 높은 일반인이라도 당신이 누리게 될 힘과 호사를 질투해 마지않을 것입니다. 어머니께서 당신의 삶을 직접 축복해 주셨으니까요..."
                    : "Earth, as it's been since the end of the Forsaken Age, is an utopia. Problems that once plagued mankind — poverty, starvation, disease, old age — have been all but eliminated. Even the lowest classes in this society live lives of incredible ease and comfort; but even the most aristocratic of mundanes burn with envy at the power and good fortune you shall enjoy, for your life has been blessed by the Mother herself..."
                }
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <PointCard 
                        amount={100} 
                        pointName={language === 'ko' ? "축복 점수 (BP)" : "BLESSING POINTS (BP)"} 
                        description={language === 'ko' ? "훔쳐온 축복, 강화 마법, 기타 마법적인 혜택에 사용됩니다" : "for use on Stolen Blessings, enchantments, and other magical boons"} 
                        color="purple" 
                        title={language === 'ko' ? "축복 점수 100점으로 시작합니다" : "You start with"} 
                        backgroundImage="/images/Q3X6rTbD-BP.webp"
                    />
                    <PointCard 
                        amount={100} 
                        pointName={language === 'ko' ? "행운 점수 (FP)" : "FORTUNE POINTS (FP)"} 
                        description={language === 'ko' ? "친구, 기회, 운 좋은 일들, 기타 물질적인 혜택에 사용됩니다" : "for use on friends, opportunities, strokes of luck, and other material comforts"} 
                        color="green" 
                        title={language === 'ko' ? "행운 점수 100점으로 시작합니다" : "You start with"} 
                        backgroundImage="/images/fYwqrgdr-FP.webp"
                    />
                </div>
                <div className="mt-6">
                    <p className="text-white italic text-sm">
                    {language === 'ko' ? "한 페이지에 점수를 과투자하지 마세요! 그 뒤에도 쓸 일이 많을 테니까요." : "Try not to spend too many of them on just one page! You will need them for future pages."}
                    </p>
                    <p className="text-gray-400 text-xs mt-4">
                    {language === 'ko' ? "설정 메뉴에서 배경 음악을 변경할 수 있습니다." : "You can change the background music in the settings menu."}
                    </p>
                </div>
            </section>

            {/* Foster Family Section */}
            <section className="my-16 max-w-7xl mx-auto">
                <SectionHeader>{language === 'ko' ? "당신의 양육을 맡게 될 가족을 디자인하세요" : "Design the foster family that has been selected to raise you"}</SectionHeader>
                <div className="flex flex-col md:flex-row justify-center items-start gap-12 lg:gap-24 mb-12">
                {/* Parents Selector */}
                <div className="flex flex-col items-center flex-1">
                    <img src="/images/PZJmzncs-parent1.webp" className="w-40 h-40 rounded-full mb-4" alt="Parent icon" />
                    <h3 className="font-cinzel text-xl font-bold tracking-wider">{language === 'ko' ? "부모님" : "PARENTS"}</h3>
                    <div className="flex items-center justify-center gap-4 my-2 text-white">
                    <button onClick={() => handleNumParentsChange(numParents - 1)} disabled={numParents === 0} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">-</button>
                    <span className="text-xl font-semibold w-10 text-center">{numParents}</span>
                    <button onClick={() => handleNumParentsChange(numParents + 1)} disabled={numParents === 6} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">+</button>
                    </div>
                    <div className="text-sm text-gray-400 text-center mt-2 max-w-xs bg-black/20 p-4 rounded-lg border border-gray-800">
                    {language === 'ko' ? (
                        <>
                            <p>부모님 없음: <span className="text-green-400 font-semibold">행운 점수 +20점</span></p>
                            <p>부모님 1명: <span className="text-green-400 font-semibold">행운 점수 +10점</span></p>
                            <p>부모님 2명: <span className="text-green-400 font-bold">행운 점수 +0점</span></p>
                            <p>부모님 3명: <span className="text-green-400 font-bold">행운 점수 -3점</span></p>
                            <p>부모님 4명: <span className="text-green-400 font-bold">행운 점수 -6점</span></p>
                            <p>등등...</p>
                            <hr className="border-gray-700 my-2" />
                            <p className="italic text-xs">각각 어머니인지 아버지인지 정할 수 있습니다.</p>
                        </>
                    ) : (
                        <>
                            <p>Having 0 parents grants <span className="text-green-400 font-semibold">+20 FP</span>.</p>
                            <p>Having 1 parent grants <span className="text-green-400 font-semibold">+10 FP</span>.</p>
                            <p>Having 2 parents costs <span className="text-green-400 font-bold">0 FP</span>.</p>
                            <p>Having 3 parents costs <span className="text-green-400 font-bold">-3 FP</span>.</p>
                            <p>Having 4 parents costs <span className="text-green-400 font-bold">-6 FP</span>.</p>
                            <p>And so on...</p>
                            <hr className="border-gray-700 my-2" />
                            <p className="italic text-xs">With each you purchased, you decide if they're a mother or father.</p>
                        </>
                    )}
                    </div>
                </div>
                {/* Siblings Selector */}
                <div className="flex flex-col items-center flex-1">
                    <img src="/images/m58qFCRf-sib1.webp" className="w-40 h-40 rounded-full mb-4" alt="Sibling icon" />
                    <h3 className="font-cinzel text-xl font-bold tracking-wider">{language === 'ko' ? "형제" : "SIBLINGS"}</h3>
                    <div className="flex items-center justify-center gap-4 my-2 text-white">
                    <button onClick={() => handleNumSiblingsChange(numSiblings - 1)} disabled={numSiblings === 0} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">-</button>
                    <span className="text-xl font-semibold w-10 text-center">{numSiblings}</span>
                    <button onClick={() => handleNumSiblingsChange(numSiblings + 1)} disabled={numSiblings === 8} className="px-3 py-1 rounded-md bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 transition-colors text-lg">+</button>
                    </div>
                    <div className="text-sm text-gray-400 text-center mt-2 max-w-xs bg-black/20 p-4 rounded-lg border border-gray-800">
                    {language === 'ko' ? (
                        <>
                            <p>외동: <span className="text-green-400 font-bold">행운 점수 -0점</span></p>
                            <p>형제 1명: <span className="text-green-400 font-bold">행운 점수 -3점</span></p>
                            <p>형제 2명: <span className="text-green-400 font-bold">행운 점수 -6점</span></p>
                            <p>형제 3명: <span className="text-green-400 font-bold">행운 점수 -9점</span></p>
                            <p>등등...</p>
                            <hr className="border-gray-700 my-2" />
                            <p className="italic text-xs">오빠인지, 언니인지, 남동생인지, 여동생인지, 쌍둥이인지 등등을 정할 수 있습니다.</p>
                        </>
                    ) : (
                        <>
                            <p>Having 0 siblings costs <span className="text-green-400 font-bold">0 FP</span>.</p>
                            <p>Having 1 sibling costs <span className="text-green-400 font-bold">-3 FP</span>.</p>
                            <p>Having 2 siblings costs <span className="text-green-400 font-bold">-6 FP</span>.</p>
                            <p>Having 3 siblings costs <span className="text-green-400 font-bold">-9 FP</span>.</p>
                            <p>And so on...</p>
                            <hr className="border-gray-700 my-2" />
                            <p className="italic text-xs">With each you purchased, you decide if they're a brother or sister, and if you're older, younger, or twins.</p>
                        </>
                    )}
                    </div>
                </div>
                </div>
                <SectionSubHeader>
                    {language === 'ko' 
                        ? <>각 가족 구성원은 일반적으로는 아주 평범하지만, 직접 <span className="text-white font-bold">특성</span>을 정해 줄 수도 있습니다. 각 구성원별로 색상이 지정됩니다. 부정적 특성 (행운 점수를 제공하는)은 각 구성원별로 한 번씩만 고를 수 있습니다. 원형 아이콘을 클릭하여 초상화를 변경할 수 있습니다.</>
                        : <>Select a family member below to assign <span className="text-white font-bold">Traits</span> to them. Each member has a unique color. Each person can only have one negative trait. Click the circular refresh icon to change their portrait.</>
                    }
                </SectionSubHeader>
                
                <div className="flex justify-center items-center gap-4 mb-12 flex-wrap bg-black/20 p-4 rounded-lg border border-gray-800 min-h-[104px]">
                    {numParents === 0 && numSiblings === 0 && (
                        <p className="text-gray-500 italic">No family members have been added.</p>
                    )}
                    {Array.from({ length: numParents }).map((_, i) => {
                        const memberId = `parent-${i}`;
                        const color = getFamilyMemberColor(i);
                        const isSelected = selectedFamilyMemberId === memberId;
                        
                        // Logic for default image: Parent 2 gets the second image
                        const defaultImage = i === 1 ? PARENT_IMAGES[1] : PARENT_IMAGES[0];
                        const imageSrc = familyMemberImages.get(memberId) || defaultImage;

                        return (
                            <div key={memberId} onClick={() => handleSelectFamilyMember(memberId)} className="cursor-pointer flex flex-col items-center gap-2 group/avatar relative" title={`Parent ${i + 1}`}>
                                <div className="relative">
                                    <div className={`w-16 h-16 rounded-full p-1 transition-all ring-offset-2 ring-offset-[#0a101f] ${isSelected ? 'ring-2' : ''}`} style={{ '--tw-ring-color': color } as React.CSSProperties}>
                                        <img src={imageSrc} className="w-full h-full object-cover rounded-full" alt={`Parent ${i+1}`} />
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); cycleImage(memberId, PARENT_IMAGES, defaultImage); }}
                                        className="absolute -top-1 -right-1 p-1 bg-black/80 rounded-full text-white/70 hover:text-white border border-gray-600 hover:border-white transition-all opacity-0 group-hover/avatar:opacity-100 shadow-md z-10"
                                        title="Change Portrait"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                                <span className="text-xs text-gray-400">{language === 'ko' ? `부모님 ${i+1}` : `Parent ${i+1}`}</span>
                                <input 
                                    type="text" 
                                    placeholder={language === 'ko' ? "세부사항..." : "Details..."} 
                                    value={familyMemberNotes.get(memberId) || ''}
                                    onChange={(e) => handleFamilyMemberNoteChange(memberId, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-24 px-1 py-0.5 text-[0.625rem] bg-gray-900 border border-gray-700 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-center"
                                />
                            </div>
                        )
                    })}
                    {Array.from({ length: numSiblings }).map((_, i) => {
                        const memberId = `sibling-${i}`;
                        const color = getFamilyMemberColor(numParents + i);
                        const isSelected = selectedFamilyMemberId === memberId;
                        const defaultImage = SIBLING_IMAGES[0];
                        const imageSrc = familyMemberImages.get(memberId) || defaultImage;

                        return (
                            <div key={memberId} onClick={() => handleSelectFamilyMember(memberId)} className="cursor-pointer flex flex-col items-center gap-2 group/avatar relative" title={`Sibling ${i + 1}`}>
                                <div className="relative">
                                    <div className={`w-16 h-16 rounded-full p-1 transition-all ring-offset-2 ring-offset-[#0a101f] ${isSelected ? 'ring-2' : ''}`} style={{ '--tw-ring-color': color } as React.CSSProperties}>
                                        <img src={imageSrc} className="w-full h-full object-cover rounded-full" alt={`Sibling ${i+1}`} />
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); cycleImage(memberId, SIBLING_IMAGES, defaultImage); }}
                                        className="absolute -top-1 -right-1 p-1 bg-black/80 rounded-full text-white/70 hover:text-white border border-gray-600 hover:border-white transition-all opacity-0 group-hover/avatar:opacity-100 shadow-md z-10"
                                        title="Change Portrait"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                                <span className="text-xs text-gray-400">{language === 'ko' ? `형제 ${i+1}` : `Sibling ${i+1}`}</span>
                                <input 
                                    type="text" 
                                    placeholder={language === 'ko' ? "세부사항..." : "Details..."} 
                                    value={familyMemberNotes.get(memberId) || ''}
                                    onChange={(e) => handleFamilyMemberNoteChange(memberId, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-24 px-1 py-0.5 text-[0.625rem] bg-gray-900 border border-gray-700 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-center"
                                />
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...activeTraits.positive, ...activeTraits.negative].map(trait => {
                    const [memberType] = selectedFamilyMemberId ? selectedFamilyMemberId.split('-') : [null];
                    let isTraitDisabled = false;

                    // Rule 1: Family-member specific traits
                    const memberSpecificTraits: { [key: string]: string[] } = {
                        'loaded': ['parent'],
                        'abusive': ['parent'],
                        'disobedient': ['sibling'],
                        'strict': ['parent', 'sibling'],
                        'forgiving': ['parent', 'sibling'],
                    };

                    if (memberSpecificTraits[trait.id]) {
                        if (!memberType || !memberSpecificTraits[trait.id].includes(memberType)) {
                            isTraitDisabled = true;
                        }
                    }

                    // Rule 2: Negative trait limit (only one per person)
                    const isCurrentTraitNegative = activeTraits.negative.some(t => t.id === trait.id);
                    if (selectedFamilyMemberId && isCurrentTraitNegative && !isTraitDisabled) {
                        const memberTraits = assignedTraits.get(selectedFamilyMemberId) || new Set<string>();
                        const memberHasNegativeTrait = [...memberTraits].some(tId => activeTraits.negative.some(nt => nt.id === tId));

                        if (memberHasNegativeTrait && !memberTraits.has(trait.id)) {
                            isTraitDisabled = true;
                        }
                    }
                    
                    // Rule 3: Incompatibility between 'Strict' and 'Forgiving'
                    if (selectedFamilyMemberId && !isTraitDisabled) {
                        const memberTraits = assignedTraits.get(selectedFamilyMemberId) || new Set<string>();
                        if (trait.id === 'strict' && memberTraits.has('forgiving')) {
                            isTraitDisabled = true;
                        }
                        if (trait.id === 'forgiving' && memberTraits.has('strict')) {
                            isTraitDisabled = true;
                        }
                    }

                    const allAssignmentsForTrait = Array.from(assignedTraits.entries())
                        .filter(entry => entry[1].has(trait.id));
                    
                    let isSelectedForCard = false;
                    let displayedColors: string[] = [];

                    if (selectedFamilyMemberId) {
                        const selectedMemberAssignment = allAssignmentsForTrait.find(entry => entry[0] === selectedFamilyMemberId);
                        if (selectedMemberAssignment) {
                            isSelectedForCard = true;
                            const memberId = selectedMemberAssignment[0];
                            const [type, indexStr] = memberId.split('-');
                            const index = parseInt(indexStr, 10);
                            const colorIndex = type === 'parent' ? index : numParents + index;
                            displayedColors.push(getFamilyMemberColor(colorIndex));
                        }
                    } else {
                        isSelectedForCard = allAssignmentsForTrait.length > 0;
                        displayedColors = allAssignmentsForTrait.map(entry => {
                            const memberId = entry[0];
                            const [type, indexStr] = memberId.split('-');
                            const index = parseInt(indexStr, 10);
                            const colorIndex = type === 'parent' ? index : numParents + index;
                            return getFamilyMemberColor(colorIndex);
                        });
                    }

                    const isBlessedTrait = trait.id === 'blessed';
                    const selectedMemberHasBlessed = selectedFamilyMemberId ? (assignedTraits.get(selectedFamilyMemberId)?.has('blessed') ?? false) : false;
                    
                    return (
                        <ChoiceCard 
                            key={trait.id} 
                            item={trait} 
                            isSelected={isSelectedForCard} 
                            assignedColors={displayedColors} 
                            onSelect={handleTraitSelect} 
                            disabled={!selectedFamilyMemberId || isTraitDisabled}
                            layout="horizontal" 
                            imageShape="rect" 
                            aspect="square"
                            iconButton={isBlessedTrait && selectedMemberHasBlessed ? <CompanionIcon /> : undefined}
                            onIconButtonClick={isBlessedTrait && selectedMemberHasBlessed ? () => setIsBlessedModalOpen(true) : undefined}
                        >
                            {isBlessedTrait && selectedMemberHasBlessed && blessedCompanions.get(selectedFamilyMemberId) && (
                                <div className="text-center mt-2">
                                    <p className="text-xs text-gray-400">Assigned:</p>
                                    <p className="text-sm font-bold text-cyan-300">{blessedCompanions.get(selectedFamilyMemberId)}</p>
                                </div>
                            )}
                        </ChoiceCard>
                    );
                })}
                </div>
            </section>
            {/* House, House Upgrades, True Self, Alter Ego, Uniform, Styles, Build Type sections follow... (No change needed below) */}
            <section className="my-16">
                <SectionSubHeader>
                    {language === 'ko' 
                        ? <>당신이 가족들과 살게 될 집은 어떤가요? 기본적으로는 당신의 출신 국가에서 살게 되겠지만, 다른 국가에 <span className="text-white font-bold">휴가지</span>를 구입할 수도 있습니다. 각각 <span className="text-green-400 font-bold">행운 점수 3점</span>이 소모됩니다.</>
                        : <>What kind of house does your family own? Your default house will be in your Dominion of birth, but you can also buy extra <span className="text-white font-bold">Vacation Homes</span> in any dominion you choose, for <span className="text-green-400 font-bold">-3 FP</span> each.</>
                    }
                </SectionSubHeader>
                <div className="flex justify-center mb-8">
                    <button 
                        onClick={() => setIsVacationHomeModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-black/40 border border-gray-700 hover:border-cyan-500 rounded-lg text-gray-300 hover:text-white transition-all group"
                    >
                        <HouseIcon />
                        <span>{language === 'ko' ? "휴가지 관리" : "Manage Vacation Homes"}</span>
                        <span className="bg-cyan-900/40 text-cyan-200 px-2 py-0.5 rounded text-xs font-bold border border-cyan-700/50 group-hover:bg-cyan-800/60">
                            {vacationHomes.length} {language === 'ko' ? "설정됨" : "Configured"}
                        </span>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {activeHouses.map(house => {
                        const isRagamuffin = house.id === 'ragamuffin';
                        const isForcedRagamuffin = numParents === 0 && numSiblings === 0;
                        
                        let isDisabled = false;
                        if (isRagamuffin) {
                            if (numParents > 0) isDisabled = true;
                        } else {
                            if (isForcedRagamuffin) isDisabled = true;
                        }

                        return (
                            <ChoiceCard 
                                key={house.id} 
                                item={house} 
                                isSelected={selectedHouseId === house.id} 
                                onSelect={(id) => {
                                    if (isForcedRagamuffin && id === 'ragamuffin') return;
                                    handleHouseSelect(id);
                                }}
                                disabled={isDisabled}
                            >
                                {house.id === 'mansion' && (
                                    <Counter 
                                        label={language === 'ko' ? "추가 공간" : "Additional Space"} 
                                        count={mansionExtraSqFt} 
                                        onCountChange={handleMansionSqFtChange} 
                                        unit={language === 'ko' ? "평" : "sq ft"} 
                                        cost={language === 'ko' ? "1점당 28평" : "-1 FP per 1,000"} 
                                        displayMultiplier={language === 'ko' ? 28 : 1000} 
                                    />
                                )}
                            </ChoiceCard>
                        );
                    })}
                </div>
            </section>
            
            <section className="my-16">
                <SectionSubHeader>
                    {language === 'ko'
                        ? <>가족들과 마찬가지로 집에도 <span className="text-white font-bold">업그레이드</span>를 적용시킬 수 있습니다. 마찬가치로 부정적인 업그레이드는 하나만 선택 가능합니다.</>
                        : <>And just like buying traits for your family, you can buy <span className="text-white font-bold">Upgrades</span> for your houses! The same rules apply.</>
                    }
                </SectionSubHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {activeUpgrades.map(upgrade => {
                        const isVrChamber = upgrade.id === 'virtual_reality';
                        const isMythicalPet = upgrade.id === 'mythical_pet';
                        const isMythicalPetSelected = selectedUpgrades.has('mythical_pet');

                        const negativeUpgrades = ['creepy_crawlies', 'terrible_neighbors', 'haunted'];
                        const isCurrentNegative = negativeUpgrades.includes(upgrade.id);
                        const otherNegativeSelected = negativeUpgrades.some(id => id !== upgrade.id && selectedUpgrades.has(id));

                        let isDisabled = false;
                        
                        if (!selectedHouseId || selectedHouseId === 'ragamuffin') {
                            isDisabled = true;
                        }
                        
                        if (isCurrentNegative && otherNegativeSelected) {
                            isDisabled = true;
                        }

                        if (upgrade.id === 'great_neighbors' && selectedUpgrades.has('terrible_neighbors')) {
                            isDisabled = true;
                        }
                        if (upgrade.id === 'terrible_neighbors' && selectedUpgrades.has('great_neighbors')) {
                            isDisabled = true;
                        }

                        return (
                            <ChoiceCard
                                key={upgrade.id}
                                item={upgrade}
                                isSelected={isVrChamber ? vrChamberCostType !== null : selectedUpgrades.has(upgrade.id)}
                                alwaysShowChildren={isVrChamber ? selectedUpgrades.has(upgrade.id) : false}
                                onSelect={handleUpgradeSelect}
                                disabled={isDisabled}
                                iconButton={isMythicalPet && isMythicalPetSelected ? <CompanionIcon /> : undefined}
                                onIconButtonClick={isMythicalPet && isMythicalPetSelected ? () => setIsMythicalPetModalOpen(true) : undefined}
                                imageAspectRatio="aspect-square" 
                            >
                            {upgrade.id === 'private_island' && (
                                <Counter 
                                    label={language === 'ko' ? "추가 섬" : "Additional Space"} 
                                    count={islandExtraMiles} 
                                    onCountChange={handleIslandMilesChange} 
                                    unit={language === 'ko' ? "개" : "sq miles"} 
                                    cost={language === 'ko' ? "1점당 1개" : "-1 FP each"} 
                                    displayMultiplier={1} 
                                />
                            )}
                            {upgrade.id === 'virtual_reality' && (
                                <div className="flex justify-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleVrChamberCostSelect('fp'); }}
                                            className={`px-3 py-1 text-xs rounded border transition-colors ${vrChamberCostType === 'fp' ? 'bg-green-800/50 border-green-500' : 'bg-gray-800/50 border-gray-700 hover:border-green-500/50'}`}
                                        >
                                            <span className="text-green-400 font-bold">{language === 'ko' ? "행운 점수 -5" : "-5 FP"}</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleVrChamberCostSelect('bp'); }}
                                            className={`px-3 py-1 text-xs rounded border transition-colors ${vrChamberCostType === 'bp' ? 'bg-purple-800/50 border-purple-500' : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'}`}
                                        >
                                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-400 drop-shadow-[0_0_2px_rgba(192,38,211,0.5)]">{language === 'ko' ? "축복 점수 -2" : "-2 BP"}</span>
                                        </button>
                                </div>
                            )}
                            {isMythicalPet && isMythicalPetSelected && mythicalPetBeastName && (
                                <div className="text-center mt-2">
                                    <p className="text-xs text-gray-400">Assigned:</p>
                                    <p className="text-sm font-bold text-cyan-300">{mythicalPetBeastName}</p>
                                </div>
                            )}
                            </ChoiceCard>
                        );
                    })}
                </div>
            </section>
            {/* The rest of the sections... */}
            <section className="my-16">
                <SectionHeader>{language === 'ko' ? "당신과 당신의 겉보기 자아를 디자인하십시오" : "DESIGN YOURSELF AND YOUR ALTER EGO"}</SectionHeader>
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 max-w-6xl mx-auto px-4">
                    <div className="hidden md:block w-96 h-96 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-700 shadow-xl shadow-purple-900/20">
                        <img src="/images/hxkBp4M6-main4.webp" alt="Alter Ego" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow border-l-2 border-gray-600 pl-6 py-2">
                        <p className="text-gray-300 leading-relaxed text-justify text-sm">
                            {renderFormattedText(language === 'ko' ? 
                                `대략 3000년경에 마도사 의회와 비밀 조직들에서 마법소녀를 양육하는 방식을 전면적으로 재고하기 시작했습니다. 골자는 어렸을 때부터 모두가 아는 유명인사인 상태로 자라나는 것이 심리적인 발달에 악영향을 준다는 것이었죠. 더 심각한 문제는 이렇게 주변인들이 다 노출되는 만큼, 나중에 적들이 가족이나 기타 소중한 이들을 인질로 잡고 마법소녀들을 협박하기가 너무 편하다는 것이었습니다. 이에 전 국가의 동의 아래 {w}겉보기 자아{/w} 시스템이 확립되었습니다. 당신에게는 두 가지 모습이 주어지게 됩니다. 모두가 아는 겉보기 자아와, 위치와 본성 모든 것이 비밀인 진짜 정체입니다. 당신의 진짜 정체를 누군가 우연찮게 발견한다면, 기억 소거 주문으로 대처할 수 있을 겁니다. 대부분의 일반인들은 마법소녀들을 지지하기 때문에 기꺼이 응해 주겠지만, 당신의 약점을 잡고 휘두르려는 사람들도 분명 있으니 조심하세요! 언제든 진짜 모습과 겉보기 자아를 오가며 변신할 수 있습니다. 다만 변신하는 데에는 시간이 몇 초 정도 걸려요.` 
                                : `In around the 3000's, the Magus councils and secret societies began to rethink the raising of Mages. It was found being a celebrity from early childhood often had a harmful effect on their psychological development; worse, their enemies would often force them into acquiescing by threatening to go after their family members and other loved ones. Thus, the Dominions agreed on the establishment of the {w}Alter Ego{/w} system. You will have two forms: your alter ego, who will be known by all, and your secret identity, whose location and nature will be kept confidential. Memory wiping cantrips can easily be used in the case someone accidentally finds out about your identity. Most people support mages, and will thus happily submit to this process: however, some may want to use their knowledge to sabotage you, so be careful! You will be able to transform between your real self and your alter ego at will, though this will take a few seconds.`
                            )}
                        </p>
                    </div>
                </div>
                
                <SectionSubHeader>
                    {language === 'ko'
                        ? <>당신의 <span className="text-white font-bold">진짜 모습</span>에 적용되는 특성을 고를 수 있습니다.</>
                        : <>Here, you can purchase traits for your <span className="text-white font-bold">True Self</span>.</>
                    }
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeTrueSelfTraits.map(trait => (
                        <ChoiceCard 
                            key={trait.id} 
                            item={trait} 
                            isSelected={selectedTrueSelfTraits.has(trait.id)} 
                            onSelect={handleTrueSelfTraitSelect} 
                        />
                    ))}
                </div>
            </section>

             <section className="my-16">
                <SectionSubHeader>
                    {language === 'ko'
                        ? <>당신의 <span className="text-white font-bold">겉보기 자아</span>에 적용되는 특성을 고를 수 있습니다.</>
                        : <>Here, you can purchase traits for your <span className="text-white font-bold">Alter Ego</span>.</>
                    }
                </SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeAlterEgoTraits.map(trait => {
                        const isInhumanAppearance = trait.id === 'inhuman_appearance';
                        const isSignatureVehicle = trait.id === 'signature_vehicle';
                        const isSelected = selectedAlterEgoTraits.has(trait.id);
                        
                        let isDisabled = false;
                        if (trait.id === 'inhuman_appearance' && !selectedAlterEgoTraits.has('exotic_appearance')) isDisabled = true;
                        if (trait.id === 'exotic_appearance' && !selectedAlterEgoTraits.has('unique_appearance')) isDisabled = true;

                        return (
                            <ChoiceCard 
                                key={trait.id} 
                                item={trait} 
                                isSelected={isSelected} 
                                onSelect={handleAlterEgoTraitSelect} 
                                disabled={isDisabled}
                                iconButton={
                                    (isInhumanAppearance && isSelected) ? <CompanionIcon /> :
                                    (isSignatureVehicle && isSelected) ? <VehicleIcon /> : undefined
                                }
                                onIconButtonClick={
                                    (isInhumanAppearance && isSelected) ? () => setIsInhumanAppearanceModalOpen(true) :
                                    (isSignatureVehicle && isSelected) ? () => setIsVehicleModalOpen(true) : undefined
                                }
                            >
                                {isInhumanAppearance && isSelected && inhumanAppearanceBeastName && (
                                    <div className="text-center mt-2">
                                        <p className="text-xs text-gray-400">Assigned:</p>
                                        <p className="text-sm font-bold text-cyan-300">{inhumanAppearanceBeastName}</p>
                                    </div>
                                )}
                                {isSignatureVehicle && isSelected && assignedVehicleName && (
                                    <div className="text-center mt-2">
                                        <p className="text-xs text-gray-400">Assigned:</p>
                                        <p className="text-sm font-bold text-cyan-300">{assignedVehicleName}</p>
                                    </div>
                                )}
                            </ChoiceCard>
                        );
                    })}
                </div>
            </section>
            
            <section className="my-16">
                <SectionSubHeader>
                    {language === 'ko'
                        ? <>당신의 겉보기 자아에는 고유 유니폼이 필요합니다! 하나는 무료로 지급되고, 그 후에는 <span className="text-green-400 font-bold">행운 점수 1점</span>이 필요합니다.</>
                        : <>Your Alter Ego will also need a distinctive uniform! Choose one for free. You can also buy extras for <span className="text-green-400 font-bold">-1 FP</span> each.</>
                    }
                </SectionSubHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {activeUniforms.map(uniform => {
                        const isSelected = selectedUniforms.includes(uniform.id);
                        const isFirstSelection = selectedUniforms.length > 0 && selectedUniforms[0] === uniform.id;
                        const isFree = selectedUniforms.length === 0 || isFirstSelection;

                        const displayItem = {
                            ...uniform,
                            cost: isSelected && isFree ? 'Free' : (isSelected && !isFree ? uniform.cost : (selectedUniforms.length > 0 ? uniform.cost : 'Free'))
                        };
                        
                        return (
                            <ChoiceCard 
                                key={uniform.id} 
                                item={displayItem} 
                                isSelected={isSelected} 
                                onSelect={handleUniformSelect}
                                layout="horizontal-tall"
                            />
                        );
                    })}
                </div>
            </section>

             <section className="my-16">
                <SectionHeader className="mb-2">{language === 'ko' ? "마법 스타일 선택" : "Choose Your Magical Style"}</SectionHeader>
                <p className="text-center italic max-w-5xl mx-auto text-sm mb-8 text-gray-400">
                    {language === 'ko' ? (
                        <>
                            당신의 <b className="text-white">마법 스타일</b>을 정할 수도 있습니다! 당신의 마법에 시각적인 효과가 더해집니다. 가령 <b className="text-white">불</b>을 고르면 날아다닐 때마다 그 경로에 불길을 남기게 되는 식이죠. 다른 마법소녀들과 차별화하기에 좋은 방법입니다! 여러 스타일을 골라서 매치하거나 섞을 수도 있습니다. 축복마다 다른 스타일을 적용할 수도 있죠.<br /><br />
                            <b className="text-white">주의</b>: 특정 원소를 다루는 마법과는 관련이 없습니다. 순수하게 시각적인 효과입니다.
                        </>
                    ) : (
                        <>
                            You can also choose your <b className="text-white">Magical Style</b>! This is a purely visual upgrade applied to your spells; for example, if you choose <b className="text-white">Fire</b>, you can have a gust of flame bellowing behind you whenever you fly around. This helps distinguish you from the other mages! You can even buy multiple styles, and either mix & match them, or apply different styles to different Blessings.<br /><br />
                            <b className="text-white">Note</b>: this is not the same thing as having control over an element. It's purely visual.
                        </>
                    )}
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-4">
                    {activeMagicalStyles.map(style => {
                        const title = language === 'ko' ? style.title : style.title.replace('/', '/\n');
                        return (
                            <ChoiceCard 
                                key={style.id} 
                                item={{...style, title}} 
                                isSelected={selectedMagicalStyles.has(style.id)} 
                                onSelect={handleMagicalStyleSelect}
                                disabled={false}
                                layout="vertical"
                                imageAspectRatio="aspect-square" 
                                objectFit="cover" 
                                textScale={0.9}
                            />
                        );
                    })}
                </div>
            </section>

            <section className="my-16">
                <SectionHeader>{language === 'ko' ? "당신이 선호하는 빌드를 선택하세요" : "SELECT THE KIND OF BUILD YOU DESIRE"}</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {activeBuildTypes.map(buildType => (
                        <ChoiceCard 
                            key={buildType.id} 
                            item={buildType} 
                            isSelected={selectedBuildTypeId === buildType.id} 
                            onSelect={handleBuildTypeSelect}
                            textScale={fontSize === 'large' ? 1.25 : 1}
                            descriptionSizeClass={fontSize === 'large' ? 'text-base' : undefined}
                        />
                    ))}
                </div>
            </section>

        </div>

        {/* Modals */}
        {isVehicleModalOpen && (
            <VehicleSelectionModal 
                currentVehicleName={assignedVehicleName} 
                onClose={() => setIsVehicleModalOpen(false)} 
                onSelect={(name) => {
                    handleAssignVehicle(name);
                    setIsVehicleModalOpen(false);
                }}
            />
        )}
        {isBlessedModalOpen && selectedFamilyMemberId && (
            <CompanionSelectionModal
                currentCompanionName={blessedCompanions.get(selectedFamilyMemberId) || null}
                onClose={() => setIsBlessedModalOpen(false)}
                onSelect={(name) => {
                    handleAssignBlessedCompanion(selectedFamilyMemberId, name);
                    setIsBlessedModalOpen(false);
                }}
                pointLimit={35}
                title={getBlessedModalTitle()}
                categoryFilter="mage"
            />
        )}
        {isMythicalPetModalOpen && (
             <BeastSelectionModal
                currentBeastName={mythicalPetBeastName}
                onClose={() => setIsMythicalPetModalOpen(false)}
                onSelect={(name) => {
                    handleAssignMythicalPet(name);
                    setIsMythicalPetModalOpen(false);
                }}
                pointLimit={30}
                title={language === 'ko' ? "신비한 애완동물 할당" : "Assign Mythical Pet"}
            />
        )}
        {isInhumanAppearanceModalOpen && (
             <BeastSelectionModal
                currentBeastName={inhumanAppearanceBeastName}
                onClose={() => setIsInhumanAppearanceModalOpen(false)}
                onSelect={(name) => {
                    handleAssignInhumanAppearance(name);
                    setIsInhumanAppearanceModalOpen(false);
                }}
                pointLimit={40}
                title={language === 'ko' ? "인간이 아닌 모습 할당" : "Assign Inhuman Appearance"}
                excludedPerkIds={['chatterbox_beast', 'magical_beast']}
            />
        )}
        {isVacationHomeModalOpen && (
            <VacationHomeModal onClose={() => setIsVacationHomeModalOpen(false)} />
        )}
        </>
    );
};