
import React, { useEffect, useMemo, useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import * as Constants from '../constants';

interface CurseEncyclopediaModalProps {
    onClose: () => void;
}

const CURSE_DATA = [
    {
        blessing: "The Blessing of Good Tidings",
        curses: [
            { id: "quick_twitch", name: "Quick Twitch", effect: "Reaction time is made incredibly slow." },
            { id: "incredible_will", name: "Incredible Will", effect: "Sensation of pain doubled." },
            { id: "sensory_master", name: "Sensory Master", effect: "Range and acuity of senses are halved." },
            { id: "cowards_boon", name: "Coward’s Boon", effect: "Slowed down slightly while fleeing." },
            { id: "charisma_plus", name: "Charisma +", effect: "Charisma reduced significantly." },
            { id: "strength_plus", name: "Strength +", effect: "Strength reduced significantly." },
            { id: "speed_plus", name: "Speed +", effect: "Speed reduced significantly." },
            { id: "smarts_plus", name: "Smarts +", effect: "Intelligence reduced significantly." },
            { id: "hokuto_senjukai_ken", name: "Hokuto Senjukai Ken", effect: "Reduced to mundane levels of strength." },
            { id: "dont_blink", name: "Don’t Blink", effect: "Reduced to mundane levels of speed." },
            { id: "superpowered_mind", name: "Super-Powered Mind", effect: "Reduced to mundane levels of intellect." },
        ]
    },
    {
        blessing: "The Blessing of Compelling Will",
        curses: [
            { id: "psychic_force_i", name: "Psychic Force", effect: "Feelings of a constant crushing psychic force." },
            { id: "pyromaniac_i", name: "Pyromaniac", effect: "Constantly feelings of pain from a burning sensation." },
            { id: "ice_cold_i", name: "Ice Cold", effect: "Constantly feelings of pain from frostbite." },
            { id: "plasma_strike", name: "Plasma Strike", effect: "Constantly feelings of pain from static electricity." },
        ]
    },
    {
        blessing: "The Blessing of Worldly Wisdom",
        curses: [
            { id: "healing_bliss", name: "Healing Bliss", effect: "Healing spells worsen damage instead of healing." },
            { id: "chloromancy", name: "Chloromancy", effect: "Plants mutate around victim and attack." },
            { id: "the_reinmans_curse", name: "The Reinman’s Curse", effect: "Ages twice as quickly." },
        ]
    },
    {
        blessing: "The Blessing of Bitter Dissatisfaction",
        curses: [
            { id: "mages_familiar_i", name: "Mage’s Familiar", effect: "Any mythological creatures become more hostile towards victim." },
            { id: "self_duplication", name: "Self Duplication", effect: "Tormented by cruel “evil twin” doppelgangers." },
            { id: "personification", name: "Personification", effect: "Objects come to life around victim and begin attacking them." },
            { id: "material_transmutation", name: "Material Transmutation", effect: "Mundane inanimate objects they touch turn to useless junk." },
            { id: "internal_manipulation", name: "Internal Manipulation", effect: "Extreme sickness and internal pain." },
            { id: "supersize_me", name: "Supersize Me", effect: "Shrunken to half height." },
        ]
    },
    {
        blessing: "The Blessing of Lost Hope",
        curses: [
            { id: "spirit_medium", name: "Spirit Medium", effect: "Can conjure spirits physically to manifest and aid you." },
            { id: "spectral_form", name: "Spectral Form", effect: "Phases through objects they try to interact with." },
            { id: "life_drain", name: "Life Drain", effect: "Slowly loses life force." },
            { id: "rise_from_your_graves", name: "Rise From Your Graves", effect: "All corpses in range reanimate and attack the victim." },
            { id: "vampirism", name: "Vampirism", effect: "Becomes a vampire but with none of the upsides." },
        ]
    },
    {
        blessing: "The Blessing of Fallen Peace",
        curses: [
            { id: "thoughtseer", name: "Thoughtseer", effect: "Broadcasts thoughts and feelings telepathically to all those around them." },
            { id: "lucid_dreamer", name: "Lucid Dreamer", effect: "Tormented by nightmares." },
            { id: "memory_lane", name: "Memory Lane", effect: "Become incredibly forgetful." },
            { id: "perfect_stranger", name: "Perfect Stranger", effect: "Has extreme difficulty detecting anyone sneaking." },
            { id: "masquerade", name: "Masquerade", effect: "Destroys ability to recognize people." },
            { id: "psychic_vampire", name: "Psychic Vampire", effect: "Experiences the negative emotions of those around them." },
            { id: "master_telepath", name: "Master Telepath", effect: "Experiences schizophrenic hallucinations." },
            { id: "crowd_control", name: "Crowd Control", effect: "Mundanes nearby may become enraged and attack." },
            { id: "hypnotist", name: "Hypnotist", effect: "Much more open to suggestion." },
        ]
    },
    {
        blessing: "The Blessing of Closed Circuits",
        curses: [
            { id: "weapon_sabotage", name: "Weapon Sabotage", effect: "Weapon prone to breaking and hacks." },
            { id: "vehicle_sabotage", name: "Vehicle Sabotage", effect: "Vehicle prone to breaking and hacks." },
            { id: "digital_infiltrator", name: "Digital Infiltrator", effect: "Electronic devices prone to breaking and hacks." },
            { id: "counter_hacker", name: "Counter Hacker", effect: "Halved effectiveness against other avatars." },
            { id: "verse_hijack", name: "Verse Hijack", effect: "Destabilizes and damages verses they enter." },
            { id: "grey_goo", name: "Grey Goo", effect: "Constant feeling of pain from nanite decomposition." },
        ]
    }
];

const CURSE_DATA_KO = [
    {
        blessing: "길조의 축복",
        curses: [
            { id: "quick_twitch", name: "재빠른 반사신경", effect: "반응 속도가 극도로 느려집니다." },
            { id: "incredible_will", name: "초인적인 의지", effect: "통각이 두 배가 됩니다." },
            { id: "sensory_master", name: "감각 극대화", effect: "감각의 범위와 예민함이 반감됩니다." },
            { id: "cowards_boon", name: "겁쟁이의 선물", effect: "도망칠 때의 속도가 소폭 감소합니다." },
            { id: "charisma_plus", name: "카리스마+", effect: "카리스마가 대폭 줄어듭니다." },
            { id: "strength_plus", name: "힘+", effect: "힘이 대폭 줄어듭니다." },
            { id: "speed_plus", name: "속도+", effect: "속도가 대폭 줄어듭니다." },
            { id: "smarts_plus", name: "지능+", effect: "지능이 대폭 줄어듭니다." },
            { id: "hokuto_senjukai_ken", name: "북두천수괴권", effect: "힘이 일반인 수준으로 하락합니다." },
            { id: "dont_blink", name: "눈 깜짝할 사이", effect: "속도가 일반인 수준으로 하락합니다." },
            { id: "superpowered_mind", name: "초월자의 정신", effect: "지능이 일반인 수준으로 하락합니다." },
        ]
    },
    {
        blessing: "강렬한 의지의 축복",
        curses: [
            { id: "psychic_force_i", name: "염동력", effect: "어떤 힘에 짓눌리는 느낌을 지속적으로 받게 됩니다." },
            { id: "pyromaniac_i", name: "방화광", effect: "화상의 고통을 지속적으로 느끼게 됩니다." },
            { id: "ice_cold_i", name: "한기", effect: "동상의 고통을 지속적으로 느끼게 됩니다." },
            { id: "plasma_strike", name: "플라즈마 타격", effect: "정전기로 인한 고통을 지속적으로 느끼게 됩니다." },
        ]
    },
    {
        blessing: "경험과 지혜의 축복",
        curses: [
            { id: "healing_bliss", name: "황홀한 치유", effect: "치유 주문이 상처를 치유하지 않고 오히려 악화시킵니다." },
            { id: "chloromancy", name: "식물술사", effect: "대상 주위의 식물이 변이하여 대상을 공격합니다." },
            { id: "the_reinmans_curse", name: "마부의 저주", effect: "대상의 노화 속도가 두 배가 됩니다." },
        ]
    },
    {
        blessing: "씁쓸한 불만족의 축복",
        curses: [
            { id: "mages_familiar_i", name: "마녀의 패밀리어", effect: "모든 신화생물이 대상을 적대합니다." },
            { id: "self_duplication", name: "자기 복제", effect: "\"사악한 쌍둥이\" 도플갱어들에게 고통받게 됩니다." },
            { id: "personification", name: "개성화", effect: "대상 주변의 물체들이 살아 움직이며 대상을 공격합니다." },
            { id: "material_transmutation", name: "물질 연금술", effect: "대상의 손에 닿는 일반적인 무기체가 쓰레기로 변합니다." },
            { id: "internal_manipulation", name: "체내 조작", effect: "깊은 병증과 엄청난 통증에 시달리게 됩니다." },
            { id: "supersize_me", name: "거대화", effect: "두 배 작아집니다." },
        ]
    },
    {
        blessing: "잃어버린 희망의 축복",
        curses: [
            { id: "spirit_medium", name: "망자와의 대화", effect: "대상은 때때로 망자의 혼들에게 시달리게 됩니다." },
            { id: "spectral_form", name: "영체화", effect: "무언가를 만지려고 하면 손이 그것을 통과해 버립니다." },
            { id: "life_drain", name: "생명력 흡수", effect: "생명력을 서서히 잃습니다." },
            { id: "rise_from_your_graves", name: "무덤에서 일어나라", effect: "주위 일정한 반경 내에 있는 모든 시체가 좀비로 되살아나 대상을 공격합니다." },
            { id: "vampirism", name: "흡혈", effect: "흡혈귀가 되지만, 모든 이점을 잃습니다." },
        ]
    },
    {
        blessing: "무너진 평화의 축복",
        curses: [
            { id: "thoughtseer", name: "생각을 읽는 자", effect: "자신의 생각과 감정을 주변인들에게 텔레파시로 전달하게 됩니다." },
            { id: "lucid_dreamer", name: "꿈의 방문자", effect: "악몽에 시달립니다." },
            { id: "memory_lane", name: "기억의 길", effect: "건망증이 극도로 심해집니다." },
            { id: "perfect_stranger", name: "완벽한 타인", effect: "누군가 위장하는 것을 거의 알아차리지 못합니다." },
            { id: "masquerade", name: "가면 무도회", effect: "사람을 알아보는 능력을 잃어버립니다." },
            { id: "psychic_vampire", name: "정신 흡수자", effect: "주변인의 부정적인 감정을 같이 경험하게 됩니다." },
            { id: "master_telepath", name: "텔레파시 달인", effect: "조현병성 환각에 시달립니다." },
            { id: "crowd_control", name: "군중 제어", effect: "주변 일반인들이 공격적으로 변해 대상을 공격할 수 있습니다." },
            { id: "hypnotist", name: "최면술사", effect: "암시에 훨씬 취약해집니다." },
        ]
    },
    {
        blessing: "폐쇄회로의 축복",
        curses: [
            { id: "weapon_sabotage", name: "무기 사보타주", effect: "무기가 파손이나 해킹에 취약해집니다." },
            { id: "vehicle_sabotage", name: "탈것 사보타주", effect: "탈것이 파손이나 해킹에 취약해집니다." },
            { id: "digital_infiltrator", name: "디지털 침투자", effect: "전자 장비가 파손이나 해킹에 취약해집니다." },
            { id: "counter_hacker", name: "카운터 해커", effect: "다른 아바타를 상대하는 것이 두 배 힘들어집니다." },
            { id: "verse_hijack", name: "가상 우주 하이재킹", effect: "대상이 방문하는 소우주가 피해를 입고 불안정해집니다." },
            { id: "grey_goo", name: "회색 점액질", effect: "나나이트의 분해 과정으로 인한 고통을 지속적으로 느낍니다." },
        ]
    }
];

const ALL_POWERS = [
    ...Constants.ESSENTIAL_BOONS_DATA, ...Constants.MINOR_BOONS_DATA, ...Constants.MAJOR_BOONS_DATA,
    ...Constants.TELEKINETICS_DATA, ...Constants.METATHERMICS_DATA,
    ...Constants.ELEANORS_TECHNIQUES_DATA, ...Constants.GENEVIEVES_TECHNIQUES_DATA,
    ...Constants.BREWING_DATA, ...Constants.SOUL_ALCHEMY_DATA, ...Constants.TRANSFORMATION_DATA,
    ...Constants.CHANNELLING_DATA, ...Constants.NECROMANCY_DATA, ...Constants.BLACK_MAGIC_DATA,
    ...Constants.TELEPATHY_DATA, ...Constants.MENTAL_MANIPULATION_DATA,
    ...Constants.NET_AVATAR_DATA, ...Constants.TECHNOMANCY_DATA, ...Constants.NANITE_CONTROL_DATA,
];

export const CurseEncyclopediaModal: React.FC<CurseEncyclopediaModalProps> = ({ onClose }) => {
    const ctx = useCharacterContext();
    const rightPanelRef = useRef<HTMLDivElement>(null);
    
    const activeCurseData = ctx.language === 'ko' ? CURSE_DATA_KO : CURSE_DATA;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Create a Set of all selected power IDs
    const selectedPowerIds = useMemo(() => {
        const ids = new Set<string>();
        const sets = [
            ctx.selectedEssentialBoons, ctx.selectedMinorBoons, ctx.selectedMajorBoons,
            ctx.selectedTelekinetics, ctx.selectedMetathermics,
            ctx.selectedEleanorsTechniques, ctx.selectedGenevievesTechniques,
            ctx.selectedBrewing, ctx.selectedSoulAlchemy, ctx.selectedTransformation,
            ctx.selectedChannelling, ctx.selectedNecromancy, ctx.selectedBlackMagic,
            ctx.selectedTelepathy, ctx.selectedMentalManipulation,
            ctx.selectedNetAvatars, ctx.selectedTechnomancies, ctx.selectedNaniteControls
        ];
        sets.forEach(s => s.forEach(id => ids.add(id)));
        return ids;
    }, [ctx]);

    const scrollToId = (id: string) => {
        const element = document.getElementById(`curse-${id}`);
        if (element && rightPanelRef.current) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#120b18] border-2 border-purple-500/50 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.2)] w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" stroke="#a855f7" strokeWidth="1" />
                        <path d="M50 20 L50 80 M20 50 L80 50" stroke="#a855f7" strokeWidth="1" />
                    </svg>
                </div>

                <header className="flex items-center justify-between p-6 border-b border-purple-900/50 bg-[#0a050e]">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">👁‍🗨</span>
                        <div>
                            <h2 className="font-cinzel text-3xl text-purple-200 tracking-widest text-shadow-purple">
                                {ctx.language === 'ko' ? "저주 백과사전" : "CURSE ENCYCLOPEDIA"}
                            </h2>
                            <p className="text-xs text-purple-400/60 font-mono tracking-wider mt-1">
                                {ctx.language === 'ko' ? "주의: 눈으로 보기만 하시오" : "/// VIEW ONLY ///"}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-purple-400/50 hover:text-purple-200 text-4xl transition-colors leading-none"
                    >
                        &times;
                    </button>
                </header>

                <div className="flex flex-grow overflow-hidden">
                    {/* Left Sidebar (Map/Grid) */}
                    <div className="w-1/3 md:w-1/4 bg-[#0a050e]/80 border-r border-purple-900/30 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-purple-900 hidden md:block">
                        {activeCurseData.map((group) => (
                            <div key={group.blessing} className="mb-6">
                                <h4 className="font-cinzel text-[10px] text-purple-400/70 mb-2 uppercase tracking-wider text-center">{group.blessing.replace("The Blessing of ", "")}</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {group.curses.map((curse) => {
                                        const powerItem = ALL_POWERS.find(p => p.id === curse.id);
                                        const isSelected = selectedPowerIds.has(curse.id);
                                        const imageSrc = powerItem?.imageSrc || '';

                                        return (
                                            <div 
                                                key={curse.id}
                                                onClick={() => scrollToId(curse.id)}
                                                className={`
                                                    aspect-square rounded border cursor-pointer transition-all relative overflow-hidden group
                                                    ${isSelected 
                                                        ? 'border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                                                        : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-purple-500/50'
                                                    }
                                                `}
                                                title={curse.name}
                                            >
                                                <img 
                                                    src={imageSrc} 
                                                    alt={curse.name} 
                                                    className={`w-full h-full object-cover transition-all ${isSelected ? '' : 'grayscale'}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Content Panel */}
                    <main ref={rightPanelRef} className="w-full md:w-3/4 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent bg-black/20">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-purple-900/10 border border-purple-500/30 p-3 rounded mb-8 text-center">
                                <p className="text-sm text-purple-200/80 italic font-serif">
                                    {ctx.language === 'ko' ? "* 목록에 없는 주문은 적용되지 않습니다." : "* Any spells not listed are not applicable."}
                                </p>
                            </div>

                            <div className="space-y-8 pb-8">
                                {activeCurseData.map((group) => (
                                    <div 
                                        key={group.blessing} 
                                        className="bg-black/40 border border-purple-800/30 rounded-lg overflow-hidden flex flex-col"
                                    >
                                        <div className="bg-purple-950/30 p-3 border-b border-purple-900/30">
                                            <h3 className="font-cinzel text-lg text-amber-100/90 text-center tracking-wide">
                                                {group.blessing}
                                            </h3>
                                        </div>
                                        <div className="p-4">
                                            <ul className="space-y-4">
                                                {group.curses.map((curse) => {
                                                    const powerItem = ALL_POWERS.find(p => p.id === curse.id);
                                                    const isSelected = selectedPowerIds.has(curse.id);
                                                    const imageSrc = powerItem?.imageSrc || '';

                                                    return (
                                                        <li 
                                                            id={`curse-${curse.id}`}
                                                            key={curse.id} 
                                                            className={`
                                                                flex flex-col sm:flex-row items-start gap-4 p-3 rounded-lg border transition-all
                                                                ${isSelected 
                                                                    ? 'border-purple-400 bg-purple-900/20' 
                                                                    : 'border-gray-800/50 bg-black/20 text-gray-500'
                                                                }
                                                            `}
                                                        >
                                                            {/* Image next to text */}
                                                            <div className={`flex-shrink-0 w-24 h-24 sm:w-20 sm:h-20 rounded overflow-hidden border ${isSelected ? 'border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-gray-700 opacity-60'}`}>
                                                                <img 
                                                                    src={imageSrc} 
                                                                    alt={curse.name} 
                                                                    className={`w-full h-full object-cover transition-all ${isSelected ? '' : 'grayscale'}`} 
                                                                />
                                                            </div>

                                                            <div className="flex-grow">
                                                                <span className={`font-bold block text-lg mb-1 ${isSelected ? 'text-purple-300' : 'text-gray-400'}`}>
                                                                    {curse.name}
                                                                </span>
                                                                <span className={`text-sm leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                    {curse.effect}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            
            <style>{`
                .text-shadow-purple {
                    text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
                }
            `}</style>
        </div>
    );
};
