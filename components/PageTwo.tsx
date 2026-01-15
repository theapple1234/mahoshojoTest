
import React, { useState, useEffect, useMemo } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import {
    SCHOOLS_DATA, SCHOOLS_DATA_KO, HEADMASTERS_DATA, HEADMASTERS_DATA_KO, TEACHERS_DATA, TEACHERS_DATA_KO,
    DURATION_DATA, DURATION_DATA_KO, CLUBS_DATA, CLUBS_DATA_KO, MISC_ACTIVITIES_DATA, MISC_ACTIVITIES_DATA_KO, 
    CLASSMATES_DATA, CLASSMATES_DATA_KO,
    DOMINIONS, DOMINIONS_KO, UNIFORMS_DATA, UNIFORMS_DATA_KO, CUSTOM_CLASSMATE_CHOICES_DATA, CUSTOM_CLASSMATE_CHOICES_DATA_KO
} from '../constants';
import { ChoiceCard } from './TraitCard';
import { ClassmateCard } from './ClassmateCard';
import { SectionHeader, SectionSubHeader, CompanionIcon, renderFormattedText, AdvancedTypewriter } from './ui';
import { UniformSelectionModal } from './UniformSelectionModal';
import { CompanionSelectionModal } from './SigilTreeOptionCard';
import { MentorSelectionModal } from './MentorSelectionModal';
import { SchoolDirectoryModal } from './SchoolDirectoryModal';
import type { CustomClassmateInstance, Mentor } from '../types';

const getPerkExplanation = (dominionId: string | null, language: 'en' | 'ko') => {
    const id = dominionId || 'halidew';
    if (language === 'ko') {
        switch (id) {
            case 'halidew': return "마그라가 관장하는 축복(폐쇄회로, 정당한 창조, 불행한 사랑)의 표식 트리에서 자타스를 선택할 때마다 축복 점수 2점을 환급해줍니다.";
            case 'shinar': return "신스루 표식을 선택할 때마다 축복 점수 2점을 환급해줍니다.";
            case 'unterseeisch': return "피델리아가 관장하는 축복(잃어버린 희망, 무너진 평화, 품위있는 패배)의 표식 트리에서 자타스를 선택할 때마다 축복 점수 2점을 환급해줍니다.";
            case 'valsereth': return "주스 표식을 선택할 때마다 축복 점수 3점을 환급해줍니다.";
            case 'gohwood': return "아라벨라가 관장하는 축복(강렬한 의지, 경험과 지혜)의 표식 트리에서 자타스를 선택할 때마다 축복 점수 2점을 환급해줍니다.";
            case 'palisade': return "레콜루 표식을 선택할 때마다 축복 점수 2점을 환급해줍니다.";
            case 'rovines': return "어떤 축복이든 자타스 표식을 선택할 때마다 축복 점수 1점을 환급해줍니다.";
            case 'jipangu': return "커스텀 마법(4페이지)의 룬을 선택할 때마다 축복 점수(또는 KP) 1점을 환급해줍니다.";
            default: return "";
        }
    }
    // English
    switch (id) {
        case 'halidew': return "Refunds 2 BP for every Juathas sigil selected in Blessings administered by Margra (Closed Circuits, Righteous Creation, Star Crossed Love).";
        case 'shinar': return "Refunds 2 BP for every Sinthru sigil selected.";
        case 'unterseeisch': return "Refunds 2 BP for every Juathas sigil selected in Blessings administered by Fidelia (Lost Hope, Fallen Peace, Gracious Defeat).";
        case 'valsereth': return "Refunds 3 BP for every Xuth sigil selected.";
        case 'gohwood': return "Refunds 2 BP for every Juathas sigil selected in Blessings administered by Arabella (Compelling Will, Worldly Wisdom).";
        case 'palisade': return "Refunds 2 BP for every Lekolu sigil selected.";
        case 'rovines': return "Refunds 1 BP for every Juathas sigil selected.";
        case 'jipangu': return "Refunds 1 BP/KP for every Rune selected in Custom Magic (Page 4).";
        default: return "";
    }
};

export const PageTwo: React.FC = () => {
    const {
        selectedDominionId, isMultiplayer,
        selectedHeadmasterId, handleHeadmasterSelect,
        selectedTeacherIds, handleTeacherSelect,
        selectedDurationId, handleDurationSelect,
        selectedClubIds, handleClubSelect,
        selectedMiscActivityIds, handleMiscActivitySelect,
        selectedClassmateIds, handleClassmateSelect,
        classmateUniforms, handleClassmateUniformSelect,
        isBoardingSchool, handleBoardingSchoolSelect,
        customClassmates,
        handleAddCustomClassmate,
        handleRemoveCustomClassmate,
        assigningClassmate,
        handleOpenAssignModal,
        handleCloseAssignModal,
        handleAssignCustomClassmateName,
        // Mentor stuff
        selectedMentors, handleMentorSelect, handleMentorRemove, customColleagues,
        // Pact check
        selectedStarCrossedLovePacts,
        fontSize,
        language,
        setIsPageTwoIntroDone, // New function from hook to notify App
        isPageTwoIntroDone
    } = useCharacterContext();

    // Intro Animation State
    const [introStage, setIntroStage] = useState(isPageTwoIntroDone ? 5 : 0); 
    const [showSkipButton, setShowSkipButton] = useState(false);
    // 0: Init
    // 1: Background Fade In
    // 2: Image & Title Fade In
    // 3: Typing P1
    // 4: Typing P2
    // 5: Complete

    useEffect(() => {
        // If already done, ensure state is set (though context should hold it)
        if (isPageTwoIntroDone) {
            setIntroStage(5);
            return;
        }

        // Start sequence on mount
        const t1 = setTimeout(() => setIntroStage(1), 300); // BG Fade In
        const t2 = setTimeout(() => setIntroStage(2), 1500); // Image/Title Fade In
        const t3 = setTimeout(() => setIntroStage(3), 3000); // Start Typing P1
        
        // Show Skip Button after 3s
        const t4 = setTimeout(() => setShowSkipButton(true), 3000);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [isPageTwoIntroDone]);

    // Notify context when stage 5 is reached
    useEffect(() => {
        if (introStage === 5 && !isPageTwoIntroDone) {
            setIsPageTwoIntroDone(true);
        }
    }, [introStage, setIsPageTwoIntroDone, isPageTwoIntroDone]);

    const skipIntro = () => {
        setIntroStage(5);
    };

    const activeSchools = language === 'ko' ? SCHOOLS_DATA_KO : SCHOOLS_DATA;
    const activeHeadmasters = language === 'ko' ? HEADMASTERS_DATA_KO : HEADMASTERS_DATA;
    const activeTeachers = language === 'ko' ? TEACHERS_DATA_KO : TEACHERS_DATA;
    const activeDurations = language === 'ko' ? DURATION_DATA_KO : DURATION_DATA;
    const activeClubs = language === 'ko' ? CLUBS_DATA_KO : CLUBS_DATA;
    const activeMiscActivities = language === 'ko' ? MISC_ACTIVITIES_DATA_KO : MISC_ACTIVITIES_DATA;
    const activeClassmates = language === 'ko' ? CLASSMATES_DATA_KO : CLASSMATES_DATA;
    const activeCustomClassmateOptions = language === 'ko' ? CUSTOM_CLASSMATE_CHOICES_DATA_KO : CUSTOM_CLASSMATE_CHOICES_DATA;
    const activeUniforms = language === 'ko' ? UNIFORMS_DATA_KO : UNIFORMS_DATA;
    
    const userSchoolKey = selectedDominionId || 'halidew'; 
    const userSchool = activeSchools[userSchoolKey];
    
    const topClubs = activeClubs.slice(0, 3);
    const otherClubs = activeClubs.slice(3);

    const [uniformModalState, setUniformModalState] = useState<{
        isOpen: boolean;
        classmateId: string | null;
        classmateName: string | null;
    }>({ isOpen: false, classmateId: null, classmateName: null });

    const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
    const [isSchoolDirectoryOpen, setIsSchoolDirectoryOpen] = useState(false);

    const pointLimit = useMemo(() => {
        if (!assigningClassmate) return 0;
        return assigningClassmate.optionId === 'custom_classmate_25' ? 25 :
               assigningClassmate.optionId === 'custom_classmate_35' ? 35 :
               assigningClassmate.optionId === 'custom_classmate_50' ? 50 : 0;
    }, [assigningClassmate]);

    const isEvoghosVowActive = selectedStarCrossedLovePacts.has('evoghos_vow');

    const handleOpenUniformModal = (classmateId: string, classmateName: string) => {
        setUniformModalState({ isOpen: true, classmateId, classmateName });
    };

    const handleCloseUniformModal = () => {
        setUniformModalState({ isOpen: false, classmateId: null, classmateName: null });
    };

    const handleSelectUniformInModal = (uniformId: string) => {
        if (uniformModalState.classmateId) {
            handleClassmateUniformSelect(uniformModalState.classmateId, uniformId);
        }
        handleCloseUniformModal();
    };

    // Helper to format text for Custom Classmate description
    const formatText = (text: string) => {
        const node = renderFormattedText(text);
        if (typeof node === 'string') {
            const parts = node.split(/(\{bp\}.*?\{\/bp\}|\{w\}.*?\{\/w\}|\{i\}.*?\{\/i\}|\{c\}.*?\{\/c\})/g); // Using simple fallback or just direct render
            return renderFormattedText(text);
        }
        return node;
    };

    // Dynamically process Misc Activities
    const displayMiscActivities = useMemo(() => {
        return activeMiscActivities.map(item => {
            let newItem = { ...item };
            if (item.id === 'mentor') {
                newItem.cost = language === 'ko' ? '소모값 변동' : 'Costs varies, Grants varies'; 
            }
            return newItem;
        });
    }, [activeMiscActivities, language]);

    const stageTitle = language === 'ko' ? '스테이지 2' : 'STAGE II';
    const introTitle = language === 'ko' ? '학교 생활' : 'YOUR SCHOOLING';
    const dominionList = language === 'ko' ? DOMINIONS_KO : DOMINIONS;

    // Intro Text Content
    const introP1 = language === 'ko' ? 
        "평범한 학교생활은 지루하기 짝이 없죠. 역사 선생님이 그 졸린 목소리로 누가 듣든 말든 중얼중얼... 겨우 기억나는 수업 내용 중에는 이런 게 떠오릅니다. {c}\"그러니까 이게 우리가 처음부터 알고 있어야 하는 건데, 가상의 세계 안에 또다른 가상 세계를 한없이 넣을 수 있는 걸 생각하면, 그 숫자는 자연수의 개수보다 많아진다. 다시 말해서 아무리 다중우주가 무한하더라도 '현실'우주의 숫자는 가상 우주의 숫자보다 무한히 적을 수밖에 없지. 즉 통계적으로 말하면 우리가 살고 있는 세계가 '진짜'가 아닐 확률은 1에 수렴한다. 사실 같은 논리로 우리의 삶이 놓인 가상 우주도 다른 가상 우주의 일부분...\"{/c} 뭐 이런 말을 하고 있으니 당신이 선생님의 흰머리 개수나 세고 있던 것도 무리는 아니죠."
        : "Mundane school is notoriously dull. You remember how your old history teacher used to prattle on in monotone for what felt like hours. {c}\"Really, we should have known from the very beginning,\"{/c} you vaguely remember from one of his many lectures. {c}\"Since simulations can be vested within other simulations limitlessly, the cardinality of the set of all simulations exceeds that of the set of all natural numbers. In other words, 'real' universes, even assuming the multiverse is unlimited, are infinitely outnumbered by simulated universes. Therefore, it was always a statistical certainty that the world we are living in isn't 'real', so to speak. In fact, it's just as certain that the universe simulating ours is, itself, simulated...\"{/c} You were so bored, all you could focus on was counting the flecks of grey in his beard.";
    
    const introP2 = language === 'ko' 
        ? "다행스럽게도 당신은 평범한 사람들이 죽어라 외워야 하는 지식들을 마법적으로 직접 전송받을 수 있었습니다. 그 덕에 열 살쯤 되었을 때 이미 (현실 세계 기준으로) 대학 졸업생에 견줄 만한 지식을 갖게 되었고요. 이제 당신의 진짜 학업이 시작됩니다. 당신은 국립 명문 마법학교의 학생이 되었으니까요! 이 곳에서 하는 공부에 따라 당신의 진로가 정해지게 되지만, 그렇게 스트레스 받을 필요는 없습니다. 졸업률은 거의 100%이고, 학비는 무료니까, 충분한 능력을 갖출 때까지 마음껏 공부할 수 있어요. 실제로 많은 사람들이 몇십 년 동안 등록되어 있다니까요!"
        : "Fortunately, most of the things that would ordinarily require blunt memorization were instead magically transmitted directly into your mind. Therefore, by the time you were roughly ten, you already had the knowledge of a college grad (by real world standards). Thus began your real education: your assignment to your Dominion's prestigious school of magecraft! The studying you're doing here will define your future career, but don't get too stressed out. Graduation rates are near 100%, and enrollment is free, allowing you to take as much time as you need to accomplish your goals: many students have been here for decades!";

    // Dynamic Speed Config
    const typingSpeedP1 = language === 'ko' ? 30 : 10;
    const typingSpeedP2 = language === 'ko' ? 30 : 10;
    
    const perkExplanation = getPerkExplanation(selectedDominionId, language);

    return (
        <>
            {/* Stage II: Intro Section */}
            <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16 min-h-[60vh] relative">
                <div className={`flex-shrink-0 relative transition-all duration-1000 transform ${introStage >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <img src="/images/YBY6X7dF-main2.webp" alt="Student" className="w-96 md:w-[36rem] rounded-full border-4 border-amber-900/50 shadow-2xl shadow-black/60" />
                </div>
                
                <div className="max-w-2xl text-center lg:text-left relative">
                    {/* Intro Control */}
                    {introStage < 5 && showSkipButton && (
                        <button 
                            onClick={skipIntro} 
                            className="absolute -top-6 right-0 text-xs uppercase tracking-widest text-gray-500 hover:text-amber-200 transition-colors border border-amber-900/50 rounded px-2 py-1 bg-black/40 z-50 animate-fade-in-up-toast"
                        >
                            Skip Intro »
                        </button>
                    )}

                     <div className={`transition-opacity duration-1000 ${introStage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                        <h2 className="text-2xl font-cinzel tracking-widest text-amber-500/70">{stageTitle}</h2>
                        <h1 className="text-5xl font-bold font-cinzel my-2 text-amber-100 drop-shadow-md">{introTitle}</h1>
                        <hr className="border-amber-900/50 my-4" />
                    </div>
                    
                    <div className="text-gray-300 leading-relaxed mb-6 space-y-4 min-h-[300px]">
                        {introStage >= 3 && (
                            <div>
                                {introStage === 3 ? (
                                     <AdvancedTypewriter 
                                        text={introP1} 
                                        speed={typingSpeedP1}
                                        onComplete={() => setIntroStage(4)} 
                                        className="text-amber-100/90 drop-shadow-sm mb-4 block" 
                                    />
                                ) : (
                                    <div className="text-amber-100/90 drop-shadow-sm mb-4 block whitespace-pre-wrap">{renderFormattedText(introP1)}</div>
                                )}

                                {introStage >= 4 && (
                                    introStage === 4 ? (
                                        <AdvancedTypewriter 
                                            text={introP2} 
                                            speed={typingSpeedP2}
                                            onComplete={() => setIntroStage(5)} 
                                            className="text-gray-300 drop-shadow-sm block" 
                                        />
                                    ) : (
                                        <div className="text-gray-300 drop-shadow-sm block whitespace-pre-wrap">{renderFormattedText(introP2)}</div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                     <div className={`transition-all duration-1000 delay-500 transform ${introStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <img src="/images/zhnmY0f0-main3.webp" alt="Classroom" className="rounded-lg shadow-lg shadow-black/50 border border-amber-900/30 w-full max-w-md mx-auto lg:mx-0" />
                    </div>
                </div>
            </section>
            
            {/* Main Content Fades In */}
            <div className={`transition-opacity duration-1000 ${introStage >= 5 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* School Display Section */}
                <div className="my-16 bg-gradient-to-b from-[#2a1d15]/90 to-[#1f1612]/90 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40 relative group/container">
                    <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">
                        {language === 'ko' ? "배정된 학교" : "YOUR ASSIGNED ACADEMY"}
                    </h3>
                    <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-6">
                        {language === 'ko' ? "할 건 해야죠. 당신이 다니게 될 마법학교는 당신의 출신 국가에 따라 달라집니다." : "The mage school you are assigned to depends on the Dominion in which you were born."}
                    </p>

                    {/* High Quality Directory Button */}
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={() => setIsSchoolDirectoryOpen(true)}
                            className="group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden font-bold rounded-lg group-hover:bg-gradient-to-br from-amber-600 to-yellow-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-amber-300 dark:focus:ring-amber-800 transition-all duration-500 ease-out transform hover:scale-105"
                        >
                            <span className="relative px-8 py-3 transition-all ease-in duration-75 bg-[#1f1612] rounded-md group-hover:bg-opacity-0 flex items-center gap-3">
                                {/* Magical Icon Container */}
                                <div className="relative w-8 h-8 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md animate-pulse"></div>
                                    <span className="text-2xl relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-transform duration-700 group-hover:rotate-[360deg]">
                                        🔍
                                    </span>
                                </div>
                                
                                <div className="flex flex-col items-start">
                                    <span className="font-cinzel text-amber-100 tracking-[0.15em] text-sm group-hover:text-white transition-colors duration-300 drop-shadow-md">
                                        {language === 'ko' ? "다른 지역에는 물론 또다른 시설들이 있지만요." : "ACADEMY DIRECTORY"}
                                    </span>
                                    <span className="text-[9px] text-amber-500/80 uppercase tracking-widest group-hover:text-yellow-200 transition-colors duration-300">
                                        {language === 'ko' ? "다른 학교 살펴보기" : "VIEW ALL SCHOOLS"}
                                    </span>
                                </div>

                                {/* Animated Particles/Glow */}
                                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:animate-ping opacity-0 group-hover:opacity-50 transition-opacity"></div>
                            </span>
                        </button>
                    </div>

                    {userSchool ? (
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-black/40 p-6 rounded-lg border border-amber-800/60 max-w-7xl mx-auto shadow-inner shadow-black/50">
                            <img src={userSchool.imageSrc} alt={userSchool.title} className="w-full md:w-1/2 aspect-[4/3] object-cover rounded-md flex-shrink-0 border border-amber-900/30" />
                            <div className="md:w-1/2 text-left">
                                <h4 className="font-bold text-3xl font-cinzel text-amber-100">{userSchool.title}</h4>
                                <div className="text-base text-gray-300 leading-relaxed mt-4">{renderFormattedText(userSchool.description)}</div>
                                <div className="mt-6 border-t-2 border-dashed border-amber-900/50 pt-4 relative">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-amber-300 tracking-wider">
                                            {language === 'ko' ? "지역 특전:" : "DOMINION PERK:"}
                                        </p>
                                        <div className="group relative cursor-help">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 hover:text-amber-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-black/90 border border-amber-500/30 rounded-lg text-xs text-gray-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center leading-relaxed">
                                                {perkExplanation}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-amber-300/80 italic">{renderFormattedText(userSchool.costBlurb)}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-yellow-100/60 py-10 bg-black/30 rounded-lg max-w-4xl mx-auto">
                            <p>{language === 'ko' ? "1페이지에서 지역을 선택하여 학교를 확인하세요." : "Select a Dominion on Page 1 to see your school."}</p>
                        </div>
                    )}
                </div>

                {/* Boarding School Section */}
                <div className="my-16 bg-gradient-to-b from-[#2a1d15]/90 to-[#1f1612]/90 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                    <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
                        <img src="/images/B2VMLm0N-boarding.webp" alt="Dormitory" className="w-full md:w-80 h-auto object-cover rounded-md flex-shrink-0 border border-amber-900/30" />
                        <div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {language === 'ko' 
                                    ? "마법소녀라면 먼 거리를 통학하는 것도 식은 죽 먹기기 때문에, 당신에게는 두 가지 선택지가 있습니다. 하나는 집에서 가족들과 지내면서 매일 통학을 하는 거고, 다른 하나는 기숙사 생활을 하는 거죠."
                                    : "Since commuting across even vast distances is extremely quick for a Mage, you have two options: either stay home with your family and simply travel to school every day, or move into the dorms during your education."
                                }
                            </p>
                            <button
                                onClick={handleBoardingSchoolSelect}
                                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${isBoardingSchool ? 'border-amber-400 bg-amber-900/40' : 'border-gray-700 bg-black/40 hover:border-amber-400/50'}`}
                            >
                                <h4 className="font-cinzel text-lg font-bold text-white">
                                    {language === 'ko' ? "기숙사 생활 선택" : "CHOOSE BOARDING SCHOOL"}
                                </h4>
                                <p className="text-xs text-gray-400 mt-1">
                                    {language === 'ko' 
                                        ? <>이 선택지는 기본적으로 무료지만, 만약 <span className="text-white font-bold">부랑자</span>를 선택했다면 <span className="text-green-400 font-bold">행운 점수 8점</span>이 소모됩니다.</>
                                        : <>This option is free by default, but if you chose <span className="text-white font-bold">Ragamuffin</span>, it will cost <span className="text-green-400 font-bold">8 FP</span>.</>
                                    }
                                </p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Headmaster Section */}
                <div className="my-16 bg-gradient-to-b from-[#2a1d15]/90 to-[#1f1612]/90 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                    <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">
                        {language === 'ko' ? "교장 선생님" : "YOUR HEADMASTER"}
                    </h3>
                    <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">
                        {language === 'ko' ? "마법학교의 교장 선생님은 어떤 분일까요? 멀티플레이어라면 유능함으로 고정됩니다." : "What kind of person is your school's headmaster / headmistress? In Multiplayer, this is locked to Competent."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {activeHeadmasters.map(item => (
                            <ChoiceCard 
                                key={item.id} 
                                item={item} 
                                isSelected={selectedHeadmasterId === item.id} 
                                onSelect={handleHeadmasterSelect} 
                                disabled={isMultiplayer && item.id !== 'competent'} 
                                selectionColor="brown" 
                                imageAspectRatio="aspect-square"
                            />
                        ))}
                    </div>
                </div>

                {/* Teacher Section */}
                <div className="my-16 bg-gradient-to-b from-[#2a1d15]/90 to-[#1f1612]/90 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                    <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">
                        {language === 'ko' ? "담당 교수님" : "YOUR TEACHERS"}
                    </h3>
                    <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">
                        {language === 'ko' ? "이제 당신의 학교 생활 동안 가장 많이 마주칠, 3~5명의 교수님들이 어떤 분들인지 골라 주세요. 중복은 안 돼요!" : "Now, choose the archetypes of 3-5 teachers whom you will interact with the most during your education here. No repeats!"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {activeTeachers.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedTeacherIds.has(item.id)} onSelect={handleTeacherSelect} disabled={!selectedTeacherIds.has(item.id) && selectedTeacherIds.size >= 5} selectionColor="brown" />)}
                    </div>
                </div>
                
                {/* Duration Section */}
                <div className="my-16 bg-gradient-to-b from-[#2a1d15]/90 to-[#1f1612]/90 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                    <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">
                        {language === 'ko' ? "재학 기간" : "DURATION OF STUDY"}
                    </h3>
                    <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">
                        {language === 'ko' ? "자, 마지막으로, 여기에서 얼마나 공부하실 것 같으신가요? 시간을 오래 쓰는 걸 두려워하지는 마세요!" : "And, at last: just how long do you think you'll be going to be studying at this institution? Don't be afraid to take your time!"}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                        {activeDurations.map(item => (
                            <ChoiceCard key={item.id} item={item} isSelected={selectedDurationId === item.id} onSelect={handleDurationSelect} selectionColor="brown" objectFit="contain" />
                        ))}
                    </div>
                </div>
                
                {/* Clubs Section */}
                <div className="my-16 bg-gradient-to-b from-[#2a1d15]/90 to-[#1f1612]/90 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                    <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">
                        {language === 'ko' ? "동아리" : "CLUBS & TEAMS"}
                    </h3>
                    <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">
                        {language === 'ko' ? "학교의 동아리나 클럽에 가입할 수도 있습니다. 향후 진로 탐색에 도움이 될 수도 있구요! 그냥 너무 바쁜 일정을 만들지만 마세요." : "You can also choose any teams or clubs you may want to join. These may even aid in pursuing your future career prospects! Just try not to make yourself too busy."}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {topClubs.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedClubIds.has(item.id)} onSelect={handleClubSelect} selectionColor="brown" />)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {otherClubs.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedClubIds.has(item.id)} onSelect={handleClubSelect} selectionColor="brown" />)}
                    </div>
                </div>
                
                {/* Misc Activities Section */}
                <div className="my-16 bg-gradient-to-b from-[#2a1d15]/90 to-[#1f1612]/90 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                    <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">
                        {language === 'ko' ? "기타 활동" : "EXTRACURRICULAR ACTIVITIES"}
                    </h3>
                    <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">
                        {language === 'ko' ? "마지막으로 마법학교에서의 시간을 최대한 유익하게 보내기 위해, 기타 활동으로 무엇을 할지 정해 보세요." : "And finally, choose any miscellaneous activities you may get up to make the most out of your time at the academy."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayMiscActivities.map(item => {
                            let isDisabled = false;
                            if (item.id === 'teachers_assistant') {
                                isDisabled = !['10_years', '15_years', '20_years'].includes(selectedDurationId ?? '');
                            } else if (item.id === 'adjunct_professor') {
                                const hasDuration = ['15_years', '20_years'].includes(selectedDurationId ?? '');
                                const hasTA = selectedMiscActivityIds.has('teachers_assistant');
                                isDisabled = !(hasDuration && hasTA);
                            }
                            
                            const isMentor = item.id === 'mentor';
                            const hasSelectedMentors = selectedMentors.length > 0;

                            return (
                                <ChoiceCard 
                                    key={item.id} 
                                    item={item} 
                                    isSelected={isMentor ? hasSelectedMentors : selectedMiscActivityIds.has(item.id)} 
                                    onSelect={isMentor ? () => setIsMentorModalOpen(true) : handleMiscActivitySelect} 
                                    selectionColor="brown" 
                                    imageShape="circle"
                                    disabled={isDisabled}
                                    iconButton={isMentor && hasSelectedMentors ? <CompanionIcon /> : undefined}
                                    onIconButtonClick={isMentor && hasSelectedMentors ? () => setIsMentorModalOpen(true) : undefined}
                                    hideImageBorder={true}
                                    imagePaddingTop={true}
                                >
                                    {isMentor && hasSelectedMentors && (
                                        <div className="mt-2 text-center text-xs text-gray-300">
                                            <p className="font-bold mb-1">Selected Mentors:</p>
                                            {selectedMentors.map(m => (
                                                <div key={m.id} className="truncate text-amber-300">{m.name}</div>
                                            ))}
                                        </div>
                                    )}
                                </ChoiceCard>
                            );
                        })}
                    </div>
                </div>

                {/* Classmates Section */}
                <div className="my-16 bg-gradient-to-b from-[#2a1d15]/90 to-[#1f1612]/90 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                    <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">
                        {language === 'ko' ? "클래스메이트" : "YOUR CLASSMATES"}
                    </h3>
                    {isEvoghosVowActive ? (
                        <p className="text-center text-red-400 font-bold max-w-3xl mx-auto text-lg mb-10">
                            {language === 'ko' ? "엡'오고스의 맹세로 인해 클래스메이트를 선택할 수 없습니다." : "Classmate selection disabled due to Ev'oghos' Vow."}
                        </p>
                    ) : (
                        <p className="text-center text-yellow-100/60 italic max-w-5xl mx-auto text-sm mb-10 leading-relaxed">
                            {language === 'ko' 
                                ? <>물론 학교를 다니는 동안 반 친구들은 많이 생기겠지만, 여기서는 당신의 인생에 가장 큰 영향을 줄 사람들을 고르게 될 겁니다. 상황이 맞아서 이들이 당신의 친구가 되게 될까요? 아니면 동아리 부원들? 아니면 같은 팀원들일지도 모르죠. 점수가 허락하는 한, 원하는 만큼 클래스메이트들을 고를 수 있습니다. 처음에는 이들의 겉보기 자아만 파악할 수 있을 겁니다. 이들의 주력기는 영구히 <strong>강화된</strong> 상태입니다. 모두 필수 능력은 갖추고 있습니다. <strong className="text-amber-200">선택지 우측 상단의 아이콘을 눌러 이들의 제복을 맞춰 줄 수 있습니다.</strong> 또한, 당신과 같은 국가의 급우를 고르게 되면 비용이 <span className="text-green-400 font-bold">2점</span> 감소합니다.</>
                                : <>Obviously you will have many classmates in your time at the school, but this will select the ones who will be most prominent in your life. Perhaps circumstances will conspire to make you friends? Fellow school club members? Maybe even teammates? You can pick as many as you can afford. At first, you'll usually only know their alter ego. Signature powers are permanently <strong>boosted</strong>. They all have the essential powers. <strong className="text-amber-200">Click the shirt icon to set their uniform.</strong> Additionally, you get a <span className="text-green-400 font-bold">2 FP</span> refund when purchasing classmates from your own dominion.</>
                            }
                        </p>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {activeClassmates.map(classmate => {
                            const dominion = dominionList.find(d => d.id === selectedDominionId);
                            // Note: birthplace in KO data is localized, so we must check localized title.
                            // For English data, birthplace is English. 
                            const hasRefund = dominion && classmate.birthplace.trim().toUpperCase() === dominion.title.trim().toUpperCase();
                            const selectedUniformId = classmateUniforms.get(classmate.id);
                            const uniform = activeUniforms.find(u => u.id === selectedUniformId);

                            return (
                                <ClassmateCard 
                                    key={classmate.id} 
                                    classmate={classmate} 
                                    isSelected={selectedClassmateIds.has(classmate.id)} 
                                    onSelect={handleClassmateSelect} 
                                    disabled={isMultiplayer || isEvoghosVowActive}
                                    selectionColor="brown"
                                    refundText={hasRefund ? (language === 'ko' ? '행운 점수 +2 제공' : 'Grants +2 FP') : undefined}
                                    onUniformButtonClick={() => handleOpenUniformModal(classmate.id, classmate.name)}
                                    uniformId={selectedUniformId}
                                    uniformName={uniform?.title}
                                />
                            );
                        })}
                    </div>
                    <div className="mt-8">
                        <div className="relative flex flex-row items-start p-6 bg-black/40 border border-yellow-800/60 rounded-lg gap-6">
                            <img 
                                src="/images/BHnbDZyY-new.webp" 
                                alt="Create your own companion" 
                                className="w-2/5 sm:w-1/3 aspect-[4/3] object-cover object-left rounded-md flex-shrink-0"
                            />
                            <div className="flex flex-col flex-grow">
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    {language === 'ko' 
                                        ? formatText("원하는 캐릭터가 없다면, 당신이 직접 동료를 만들 수도 있습니다! {fp}-4 행운 점수{/fp}를 사용하면 {i}참고 페이지{/i}에서 {w}동료 점수 25점{/w}으로 동료를 만들 수 있습니다. {fp}-6 행운 점수{/fp}를 사용하면 {w}동료 점수 35점{/w}, {fp}-8 행운 점수{/fp}를 사용하면 {w}동료 점수 50점{/w}이 주어집니다.")
                                        : formatText("If you have something specific in mind you're after, you may want to create your own companion! If you spend -4 FP, you can create a companion with {w}25 Companion Points{/w} on the {i}Reference Page{/i}; if you spend -6 FP, you are given {w}35 Companion Points{/w} instead; and if you spend -8 FP, you are given {w}50 Companion Points{/w}.")
                                    }
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {activeCustomClassmateOptions.map(option => (
                                        <div 
                                            key={option.id}
                                            onClick={!isEvoghosVowActive ? () => handleAddCustomClassmate(option.id) : undefined}
                                            className={`relative p-4 bg-gray-900/50 border border-gray-700 rounded-md transition-colors text-center ${isEvoghosVowActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-amber-300/70'}`}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Add a ${option.description}`}
                                        >
                                            <div
                                                className="absolute top-1 right-1 p-1 text-amber-200/50"
                                                aria-hidden="true"
                                            >
                                                <CompanionIcon />
                                            </div>
                                            <p className="font-semibold text-sm text-green-400 font-bold">{option.cost.toUpperCase()}</p>
                                            <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                                        </div>
                                    ))}
                                </div>
                                {customClassmates.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-yellow-800/30 space-y-2">
                                        <h4 className="font-cinzel text-amber-200 tracking-wider">
                                            {language === 'ko' ? "커스텀 클래스메이트" : "Your Custom Classmates"}
                                        </h4>
                                        {customClassmates.map(c => {
                                            const optionData = activeCustomClassmateOptions.find(opt => opt.id === c.optionId);
                                            return (
                                                <div key={c.id} className="bg-black/20 p-2 rounded-md flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => handleRemoveCustomClassmate(c.id)} className="text-red-500 hover:text-red-400 text-xl font-bold px-2" title="Remove Companion Slot">&times;</button>
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{optionData?.description}</p>
                                                            <p className="text-xs text-gray-400">{language === 'ko' ? "할당됨: " : "Assigned: "} <span className="font-bold text-amber-300">{c.companionName || (language === 'ko' ? '없음' : 'None')}</span></p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleOpenAssignModal(c)}
                                                        className="p-2 rounded-full bg-black/50 text-amber-200/70 hover:bg-yellow-900/50 hover:text-amber-100 transition-colors"
                                                        title="Assign Companion"
                                                    >
                                                        <CompanionIcon />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {uniformModalState.isOpen && uniformModalState.classmateId && uniformModalState.classmateName && (
                <UniformSelectionModal
                    classmateName={uniformModalState.classmateName}
                    currentUniformId={classmateUniforms.get(uniformModalState.classmateId)}
                    onClose={handleCloseUniformModal}
                    onSelect={handleSelectUniformInModal}
                />
            )}
            
            {assigningClassmate && (
                <CompanionSelectionModal
                    currentCompanionName={assigningClassmate.companionName}
                    onClose={handleCloseAssignModal}
                    onSelect={(name) => {
                        handleAssignCustomClassmateName(assigningClassmate.id, name);
                        handleCloseAssignModal();
                    }}
                    pointLimit={pointLimit}
                    title={language === 'ko' ? `커스텀 클래스메이트 할당 (${pointLimit}점)` : `Assign Custom Classmate (${pointLimit} CP)`}
                    categoryFilter="mage"
                />
            )}

            {isMentorModalOpen && (
                <MentorSelectionModal 
                    onClose={() => setIsMentorModalOpen(false)}
                    onSelect={handleMentorSelect}
                    onRemove={handleMentorRemove}
                    selectedMentors={selectedMentors}
                    customColleagues={customColleagues}
                />
            )}

            {isSchoolDirectoryOpen && (
                <SchoolDirectoryModal onClose={() => setIsSchoolDirectoryOpen(false)} />
            )}
        </>
    );
}
