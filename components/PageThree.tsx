
import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
    BLESSING_ENGRAVINGS, BLESSING_ENGRAVINGS_KO,
    COMMON_SIGILS_DATA, COMMON_SIGILS_DATA_KO, 
    SPECIAL_SIGILS_DATA, SPECIAL_SIGILS_DATA_KO,
    PAGE_THREE_INTRO_DATA, PAGE_THREE_INTRO_DATA_KO,
    PAGE_THREE_RULES_DATA, PAGE_THREE_RULES_DATA_KO
} from '../constants';
import { BlessingOptionCard } from './BlessingOptionCard';
import { SigilCard } from './SigilCard';
import { SpecialSigilCard } from './SpecialSigilCard';
import { SectionHeader, renderFormattedText } from './ui';
import { SigilCounter } from './SigilCounter';
import { GoodTidingsSection } from './blessings/GoodTidingsSection';
import { CompellingWillSection } from './blessings/CompellingWillSection';
import { WorldlyWisdomSection } from './blessings/WorldlyWisdomSection';
import { BitterDissatisfactionSection } from './blessings/BitterDissatisfactionSection';
import { LostHopeSection } from './blessings/LostHopeSection';
import { FallenPeaceSection } from './blessings/FallenPeaceSection';
import { GraciousDefeatSection } from './blessings/GraciousDefeatSection';
import { ClosedCircuitsSection } from './blessings/ClosedCircuitsSection';
import { RighteousCreationSection } from './blessings/RighteousCreationSection';
import { StarCrossedLoveSection } from './blessings/StarCrossedLoveSection';

export const PageThree: React.FC = () => {
    const { 
        selectedBlessingEngraving, handleBlessingEngravingSelect, 
        acquiredCommonSigils, handleCommonSigilAction,
        acquiredLekoluJobs, handleLekoluJobAction,
        selectedSpecialSigilChoices, handleSpecialSigilChoice,
        availableSigilCounts,
        fontSize,
        language,
        isOptimizationMode,
        isSimplifiedUiMode
    } = useCharacterContext();

    const [fallingSigils, setFallingSigils] = React.useState<Array<{
        id: number;
        src: string;
        top: number;
        left: number;
        xOffsetEnd: number;
        rotation: number;
    }>>([]);
        
    const handleSigilAnimation = (rect: DOMRect, src: string) => {
        if (isOptimizationMode) return;

        const xOffsetEnd = (Math.random() - 0.5) * 200; // -100px to 100px
        const rotation = (Math.random() - 0.5) * 60; // Random rotation between -30 and +30 degrees

        const newSigil = {
            id: Date.now() + Math.random(),
            src,
            top: rect.top,
            left: rect.left,
            xOffsetEnd,
            rotation,
        };
        setFallingSigils(prev => [...prev, newSigil]);
    };
    
    // Localization Selection
    const activeEngravings = language === 'ko' ? BLESSING_ENGRAVINGS_KO : BLESSING_ENGRAVINGS;
    const activeCommonSigils = language === 'ko' ? COMMON_SIGILS_DATA_KO : COMMON_SIGILS_DATA;
    const activeSpecialSigils = language === 'ko' ? SPECIAL_SIGILS_DATA_KO : SPECIAL_SIGILS_DATA;
    const activeIntroData = language === 'ko' ? PAGE_THREE_INTRO_DATA_KO : PAGE_THREE_INTRO_DATA;
    const activeRulesData = language === 'ko' ? PAGE_THREE_RULES_DATA_KO : PAGE_THREE_RULES_DATA;

    return (
        <>
            {fallingSigils.map(sigil => (
                <img
                    key={sigil.id}
                    src={sigil.src}
                    className="sigil-fall-animation"
                    style={{ 
                        top: sigil.top, 
                        left: sigil.left,
                        width: '96px', // w-24 from SigilCard
                        height: '96px', // h-24 from SigilCard
                        '--x-offset-end': `${sigil.xOffsetEnd}px`,
                        '--rotation': `${sigil.rotation}deg`,
                    } as React.CSSProperties}
                    onAnimationEnd={() => {
                        setFallingSigils(prev => prev.filter(s => s.id !== sigil.id));
                    }}
                />
            ))}
            
            {/* Standard Sigil Counter - Hidden if Simplified UI is ON */}
            {!isSimplifiedUiMode && (
                <SigilCounter 
                    counts={availableSigilCounts} 
                    onAction={handleCommonSigilAction} 
                    selectedSpecialSigilChoices={selectedSpecialSigilChoices}
                    onSpecialSigilChoice={handleSpecialSigilChoice}
                    acquiredLekoluJobs={acquiredLekoluJobs}
                    onLekoluJobAction={handleLekoluJobAction}
                />
            )}

            <section className="mb-24">
                <SectionHeader>{activeIntroData.title}</SectionHeader>

                <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-center bg-black/20 p-8 rounded-lg border border-gray-800">
                    <div className="md:w-1/3">
                        <img src="/images/YBjFrHDz-main2.webp" alt="Path of Magic" className="rounded-lg shadow-lg shadow-purple-500/20 w-full" />
                    </div>
                    <div className="md:w-2/3 text-gray-300 text-sm space-y-4">
                        <p>{renderFormattedText(activeIntroData.p1)}</p>
                        <p>{renderFormattedText(activeIntroData.p2)}</p>
                    </div>
                </div>
                
                <div className="flex justify-center my-8">
                    <img src="/images/rGnyWCV6-main3.webp" alt="Sigil Tree Example" className="max-w-lg" />
                </div>

                <div className="max-w-4xl mx-auto p-6 bg-black/20 border border-gray-800 rounded-lg">
                    <p className="text-gray-300 text-center mb-4">{activeRulesData.intro}</p>
                    <ol className="list-decimal list-inside space-y-3 text-gray-400 text-sm">
                        {activeRulesData.rules.map((rule, idx) => (
                            <li key={idx}>{renderFormattedText(rule)}</li>
                        ))}
                    </ol>
                </div>

                <section className="mt-24">
                    <SectionHeader>{activeRulesData.engravingTitle}</SectionHeader>
                    <SectionHeader className="!text-sm !text-gray-400 !italic !my-8 !normal-case">{activeRulesData.engravingSubtitle}</SectionHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {activeEngravings.map(engraving => {
                            const isSelected = selectedBlessingEngraving === engraving.id;

                            return (
                                <BlessingOptionCard
                                    key={engraving.id}
                                    item={engraving}
                                    isSelected={isSelected}
                                    onSelect={handleBlessingEngravingSelect}
                                />
                            );
                        })}
                    </div>
                </section>
            </section>
            
            <hr className="border-gray-700 my-24" />

            <section id="sigil-purchase-section">
                <SectionHeader>{language === 'ko' ? "기본 표식" : "The Common Sigils"}</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {activeCommonSigils.map(sigil => (
                    <SigilCard 
                        key={sigil.id} 
                        sigil={sigil} 
                        count={acquiredCommonSigils.get(sigil.id) || 0}
                        onAction={(action) => handleCommonSigilAction(sigil.id, action)} 
                        onAnimate={(rect) => handleSigilAnimation(rect, sigil.imageSrc)}
                    />
                ))}
                </div>
            </section>

            <section className="mt-24" id="special-sigil-section">
                <SectionHeader>{language === 'ko' ? "희귀 표식" : "The Special Sigils"}</SectionHeader>
                <div className="flex flex-col gap-12 max-w-7xl mx-auto">
                {activeSpecialSigils.map(sigil => (
                    <SpecialSigilCard 
                        key={sigil.id} 
                        sigil={sigil} 
                        selectedSubOptionIds={selectedSpecialSigilChoices.get(sigil.id) || null}
                        onSubOptionSelect={(subOptionId) => handleSpecialSigilChoice(sigil.id, subOptionId)}
                        lekoluJobCounts={acquiredLekoluJobs}
                        onLekoluJobAction={handleLekoluJobAction}
                        fontSize={fontSize}
                    />
                ))}
                </div>
                <div className="mt-12 text-center max-w-4xl mx-auto">
                    <p className="text-white text-xs md:text-sm font-medium italic opacity-80">
                         {language === 'ko' ? "시련이나 요청은 반복할 수 없지만, 일은 반복할 수 있습니다. 이제 본격적으로 시작하죠." : "Remember, though, that trials and favors cannot be repeated, although jobs can. Now that all that's explained, let us begin."}
                    </p>
                </div>
            </section>

            <hr className="border-gray-700 my-24" />
            <GoodTidingsSection />
            <hr className="border-gray-700 my-24" />
            <CompellingWillSection />
            <hr className="border-gray-700 my-24" />
            <WorldlyWisdomSection />
            <hr className="border-gray-700 my-24" />
            <BitterDissatisfactionSection />
            <hr className="border-gray-700 my-24" />
            <LostHopeSection />
            <hr className="border-gray-700 my-24" />
            <FallenPeaceSection />
            <hr className="border-gray-700 my-24" />
            <GraciousDefeatSection />
            <hr className="border-gray-700 my-24" />
            <ClosedCircuitsSection />
            <hr className="border-gray-700 my-24" />
            <RighteousCreationSection />
            <hr className="border-gray-700 my-24" />
            <StarCrossedLoveSection />
        </>
    );
};
