
import React, { useState, useMemo } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import {
    SCHOOLS_DATA, HEADMASTERS_DATA, TEACHERS_DATA,
    DURATION_DATA, CLUBS_DATA, MISC_ACTIVITIES_DATA, CLASSMATES_DATA,
    DOMINIONS, UNIFORMS_DATA, CUSTOM_CLASSMATE_CHOICES_DATA
} from '../constants';
import { ChoiceCard } from './TraitCard';
import { ClassmateCard } from './ClassmateCard';
import { SectionHeader, SectionSubHeader, CompanionIcon, renderFormattedText } from './ui';
import { UniformSelectionModal } from './UniformSelectionModal';
import { CompanionSelectionModal } from './SigilTreeOptionCard';
import { MentorSelectionModal } from './MentorSelectionModal';
import type { CustomClassmateInstance } from '../types';

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
        fontSize
    } = useCharacterContext();

    const userSchoolKey = selectedDominionId || 'halidew'; // Default to halidew if nothing is selected
    const userSchool = SCHOOLS_DATA[userSchoolKey];
    
    const topClubs = CLUBS_DATA.slice(0, 3);
    const otherClubs = CLUBS_DATA.slice(3);

    const [uniformModalState, setUniformModalState] = useState<{
        isOpen: boolean;
        classmateId: string | null;
        classmateName: string | null;
    }>({ isOpen: false, classmateId: null, classmateName: null });

    const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

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
        // First handle standard tags via renderFormattedText
        const node = renderFormattedText(text);
        
        // Then handle special case for numbers + FP (this is specific to Page 2 Custom Companion description)
        if (typeof node === 'string') {
            const parts = node.split(/(-?\d+\s*FP)|(Companion Points)/g);
            return parts.map((part, i) => {
                if (!part) return null;
                if (part.match(/-?\d+\s*FP/)) {
                    return <span key={i} className="text-green-400 font-bold">{part}</span>;
                }
                if (part === 'Companion Points') {
                    return <span key={i} className="text-white font-bold">{part}</span>;
                }
                return part;
            });
        }
        
        // If it was already processed into a list (array), we need to recursively handle strings within it
        if (Array.isArray(node)) {
            return node.map((child, idx) => {
                if (typeof child === 'string') {
                    const parts = child.split(/(-?\d+\s*FP)|(Companion Points)/g);
                    return <span key={idx}>{parts.map((part, i) => {
                        if (!part) return null;
                        if (part.match(/-?\d+\s*FP/)) {
                            return <span key={i} className="text-green-400 font-bold">{part}</span>;
                        }
                        if (part === 'Companion Points') {
                            return <span key={i} className="text-white font-bold">{part}</span>;
                        }
                        return part;
                    })}</span>;
                }
                return child;
            });
        }

        return node;
    };

    // Dynamically process Misc Activities
    const displayMiscActivities = useMemo(() => {
        return MISC_ACTIVITIES_DATA.map(item => {
            let newItem = { ...item };
            if (item.id === 'mentor') {
                // Exact requested string with capitalization
                newItem.cost = 'Costs varies, Grants varies'; 
            }
            return newItem;
        });
    }, []);

    return (
        <>
            {/* Stage II: Your Schooling Section */}
            <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16">
                <div className="flex-shrink-0 relative">
                    <img src="https://i.ibb.co/YBY6X7dF/main2.jpg" alt="Student" className="w-96 md:w-[36rem] rounded-full border-4 border-gray-700" />
                </div>
                <div className="max-w-2xl text-center lg:text-left">
                    <h2 className="text-2xl font-cinzel tracking-widest text-gray-400">STAGE II</h2>
                    <h1 className="text-5xl font-bold font-cinzel my-2 text-white">YOUR SCHOOLING</h1>
                    <hr className="border-gray-600 my-4" />
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Mundane school is notoriously dull. You remember how your old history teacher used to prattle on in monotone for what felt like hours. <span className="text-[#C7DE95]">"Really, we should have known from the very beginning,"</span> you vaguely remember from one of his many lectures. <span className="text-[#C7DE95]">"Since simulations can be vested within other simulations limitlessly, the cardinality of the set of all simulations exceeds that of the set of all natural numbers. In other words, 'real' universes, even assuming the multiverse is unlimited, are infinitely outnumbered by simulated universes. Therefore, it was always a statistical certainty that the world we are living in isn't 'real', so to speak. In fact, it's just as certain that the universe simulating ours is, itself, simulated..."</span> You were so bored, all you could focus on was counting the flecks of grey in his beard.
                        <br/><br/>
                        Fortunately, most of the things that would ordinarily require blunt memorization were instead magically transmitted directly into your mind. Therefore, by the time you were roughly ten, you already had the knowledge of a college grad (by real world standards). Thus began your real education: your assignment to your Dominion's prestigious school of magecraft! The studying you're doing here will define your future career, but don't get too stressed out. Graduation rates are near 100%, and enrollment is free, allowing you to take as much time as you need to accomplish your goals: many students have been here for decades!
                    </p>
                    <img src="https://i.ibb.co/zhnmY0f0/main3.jpg" alt="Classroom" className="rounded-lg shadow-lg shadow-orange-500/10 w-full max-w-md mx-auto lg:mx-0" />
                </div>
            </section>

            {/* School Display Section */}
            <div className="my-16 bg-gradient-to-b from-[#2a1d15]/80 to-[#1f1612]/80 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">YOUR ASSIGNED ACADEMY</h3>
                <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">The mage school you are assigned to depends on the Dominion in which you were born.</p>
                {userSchool ? (
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-black/30 p-6 rounded-lg border border-amber-800 max-w-7xl mx-auto shadow-inner shadow-black/30">
                        <img src={userSchool.imageSrc} alt={userSchool.title} className="w-full md:w-1/2 aspect-[4/3] object-cover rounded-md flex-shrink-0" />
                        <div className="md:w-1/2 text-left">
                            <h4 className="font-bold text-3xl font-cinzel text-amber-100">{userSchool.title}</h4>
                            <p className="text-base text-gray-300 leading-relaxed mt-4">{userSchool.description}</p>
                            <div className="mt-6 border-t-2 border-dashed border-amber-900/50 pt-4">
                               <p className="text-sm font-semibold text-amber-300 tracking-wider">DOMINION PERK:</p>
                               <p className="text-sm text-amber-300/80 italic">{userSchool.costBlurb}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-yellow-100/60 py-10 bg-black/30 rounded-lg max-w-4xl mx-auto">
                        <p>Select a Dominion on Page 1 to see your school.</p>
                    </div>
                )}
            </div>

            {/* Boarding School Section */}
            <div className="my-16 bg-gradient-to-b from-[#2a1d15]/80 to-[#1f1612]/80 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
                    <img src="https://i.ibb.co/B2VMLm0N/boarding.jpg" alt="Dormitory" className="w-full md:w-80 h-auto object-cover rounded-md flex-shrink-0" />
                    <div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Since commuting across even vast distances is extremely quick for a Mage, you have two options: either stay home with your family and simply travel to school every day, or move into one of the dorms during your education.
                        </p>
                        <button
                            onClick={handleBoardingSchoolSelect}
                            className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${isBoardingSchool ? 'border-amber-400 bg-amber-900/30' : 'border-gray-700 bg-black/20 hover:border-amber-400/50'}`}
                        >
                            <h4 className="font-cinzel text-lg font-bold text-white">CHOOSE BOARDING SCHOOL</h4>
                            <p className="text-xs text-gray-400 mt-1">This option is free by default, but if you chose <span className="text-white font-bold">Ragamuffin</span>, it will cost <span className="text-green-400 font-bold">8 FP</span>.</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Headmaster Section */}
            <div className="my-16 bg-gradient-to-b from-[#2a1d15]/80 to-[#1f1612]/80 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">YOUR HEADMASTER</h3>
                <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">What kind of person is your school's headmaster / headmistress? In Multiplayer, this is locked to Competent.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {HEADMASTERS_DATA.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedHeadmasterId === item.id} onSelect={handleHeadmasterSelect} disabled={isMultiplayer && item.id !== 'competent'} selectionColor="brown" />)}
                </div>
            </div>

            {/* Teacher Section */}
            <div className="my-16 bg-gradient-to-b from-[#2a1d15]/80 to-[#1f1612]/80 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">YOUR TEACHERS</h3>
                <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">Now, choose the archetypes of 3-5 teachers whom you will interact with the most during your education here. No repeats!</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {TEACHERS_DATA.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedTeacherIds.has(item.id)} onSelect={handleTeacherSelect} disabled={!selectedTeacherIds.has(item.id) && selectedTeacherIds.size >= 5} selectionColor="brown" />)}
                </div>
            </div>
            
             {/* Duration Section */}
            <div className="my-16 bg-gradient-to-b from-[#2a1d15]/80 to-[#1f1612]/80 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">DURATION OF STUDY</h3>
                <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">And, at last: just how long do you think you'll be going to be studying at this institution? Don't be afraid to take your time!</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {DURATION_DATA.map(item => (
                        <ChoiceCard key={item.id} item={item} isSelected={selectedDurationId === item.id} onSelect={handleDurationSelect} selectionColor="brown" objectFit="contain" />
                    ))}
                </div>
            </div>
            
            {/* Clubs Section */}
            <div className="my-16 bg-gradient-to-b from-[#2a1d15]/80 to-[#1f1612]/80 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">CLUBS & TEAMS</h3>
                <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">You can also choose any teams or clubs you may want to join. These may even aid in pursuing your future career prospects! Just try not to make yourself too busy.</p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {topClubs.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedClubIds.has(item.id)} onSelect={handleClubSelect} selectionColor="brown" />)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {otherClubs.map(item => <ChoiceCard key={item.id} item={item} isSelected={selectedClubIds.has(item.id)} onSelect={handleClubSelect} selectionColor="brown" />)}
                </div>
            </div>
            
             {/* Misc Activities Section */}
            <div className="my-16 bg-gradient-to-b from-[#2a1d15]/80 to-[#1f1612]/80 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">EXTRACURRICULAR ACTIVITIES</h3>
                <p className="text-center text-yellow-100/60 italic max-w-3xl mx-auto text-sm mb-10">And finally, choose any miscellaneous activities you may get up to make the most out of your time at the academy.</p>
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
             <div className="my-16 bg-gradient-to-b from-[#2a1d15]/80 to-[#1f1612]/80 backdrop-blur-sm border border-yellow-900/70 rounded-xl p-8 shadow-2xl shadow-black/40">
                <h3 className="font-cinzel text-3xl text-amber-200 text-center tracking-widest mb-4">YOUR CLASSMATES</h3>
                {isEvoghosVowActive ? (
                    <p className="text-center text-red-400 font-bold max-w-3xl mx-auto text-lg mb-10">
                        Classmate selection disabled due to Ev'oghos' Vow.
                    </p>
                ) : (
                    <p className="text-center text-yellow-100/60 italic max-w-5xl mx-auto text-sm mb-10 leading-relaxed">
                        Obviously you will have many classmates in your time at the school, but this will select the ones who will be most prominent in your life. Perhaps circumstances will conspire to make you friends? Fellow school club members? Maybe even teammates? You can pick as many as you can afford. At first, you'll usually only know their alter ego. Signature powers are permanently <strong>boosted</strong>. They all have the essential powers. <strong className="text-amber-200">Click the shirt icon to set their uniform.</strong> Additionally, you get a <span className="text-green-400 font-bold">2 FP</span> refund when purchasing classmates from your own dominion.
                    </p>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {CLASSMATES_DATA.map(classmate => {
                        const dominion = DOMINIONS.find(d => d.id === selectedDominionId);
                        const hasRefund = dominion && classmate.birthplace.toUpperCase() === dominion.title.toUpperCase();
                        const selectedUniformId = classmateUniforms.get(classmate.id);
                        const uniform = UNIFORMS_DATA.find(u => u.id === selectedUniformId);

                        return (
                            <ClassmateCard 
                                key={classmate.id} 
                                classmate={classmate} 
                                isSelected={selectedClassmateIds.has(classmate.id)} 
                                onSelect={handleClassmateSelect} 
                                disabled={isMultiplayer || isEvoghosVowActive}
                                selectionColor="brown"
                                refundText={hasRefund ? 'Grants +2 FP' : undefined}
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
                            src="https://i.ibb.co/BHnbDZyY/new.jpg" 
                            alt="Create your own companion" 
                            className="w-2/5 sm:w-1/3 aspect-[4/3] object-cover object-left rounded-md flex-shrink-0"
                        />
                        <div className="flex flex-col flex-grow">
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {formatText("If you have something specific in mind you're after, you may want to create your own companion! If you spend -4 FP, you can create a companion with {w}25 Companion Points{/w} on the {i}Reference Page{/i}; if you spend -6 FP, you are given {w}35 Companion Points{/w} instead; and if you spend -8 FP, you are given {w}50 Companion Points{/w}.")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {CUSTOM_CLASSMATE_CHOICES_DATA.map(option => (
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
                                    <h4 className="font-cinzel text-amber-200 tracking-wider">Your Custom Classmates</h4>
                                    {customClassmates.map(c => {
                                        const optionData = CUSTOM_CLASSMATE_CHOICES_DATA.find(opt => opt.id === c.optionId);
                                        return (
                                            <div key={c.id} className="bg-black/20 p-2 rounded-md flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleRemoveCustomClassmate(c.id)} className="text-red-500 hover:text-red-400 text-xl font-bold px-2" title="Remove Companion Slot">&times;</button>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{optionData?.description}</p>
                                                        <p className="text-xs text-gray-400">Assigned: <span className="font-bold text-amber-300">{c.companionName || 'None'}</span></p>
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
                    title={`Assign Custom Classmate (${pointLimit} CP)`}
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
        </>
    );
}
