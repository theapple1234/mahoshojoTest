
import type { FallenPeaceSigil, FallenPeacePower } from '../../types';

// Fallen Peace
export const FALLEN_PEACE_DATA = {
    title: "THE BLESSING OF FALLEN PEACE",
    imageSrc: "/images/9HXMmkzC-main4.png",
    description: `These mages are much maligned by some, considered cowards and cheaters... but they're respected by others, for they often solve conflicts without violence. Conquering a mage through telepathy is very different than through open combat. It quickly becomes a match-up of sheer willpower, wherein the slightest lapse in concentration, even a instant of distraction, could mean a complete mental takeover. Be wary, though; if you try to take over the mind of someone of much stronger will than yourself, they may turn the tables and fry your brain!

Another bonus of taking this blessing is that you'll know from experience just the right ways to ward off psychic assaults by other telepaths. A battle between two telepaths is truly a remarkable sight! Even if, I admit, most of it's going on inside their heads...`
};

export const FALLEN_PEACE_DATA_KO = {
    title: "무너진 평화의 축복",
    imageSrc: "/images/9HXMmkzC-main4.png",
    description: `몇몇 사람들은 이 축복을 사용하는 마녀들을 사기꾼이자 겁쟁이라고 깎아내립니다만... 다른 이들은 폭력 없이 갈등을 해결하는 그들의 능력을 존경합니다. 텔레파시만으로 마녀를 제압하는 것은 전투와는 완전히 다른 양상을 보입니다. 순수한 의지력이 부딪치고, 단 한 순간이라도 집중력이 흐트러지거나 단 한 번이라도 방해를 받으면 정신이 완전히 장악당할 수 있습니다. 그리고 자신보다 훨씬 강한 의지를 가진 사람의 정신을 장악하려고 했다가는 역으로 뇌가 타 버릴 수도 있구요!

이 축복을 받으면 한 가지 이점을 더 얻을 수 있는데, 정신 공격을 받아칠 수 있는 최선의 방법들을 경험적으로 터득하게 된다는 것입니다. 텔레파시 능력자들끼리의 싸움도 정말 웅장합니다! 물론, 대부분은 머릿속에서만 일어나는 싸움이지만요...`
};

export const FALLEN_PEACE_SIGIL_TREE_DATA: FallenPeaceSigil[] = [
    { id: 'left_brained', title: 'LEFT BRAINED', description: "I guess minds aren't so complicated after all.", imageSrc: '/images/SFbsP2R-juathas.png', prerequisites: [], type: 'Left Brained', benefits: { telepathy: 1 } },
    { id: 'parietal_lobe', title: 'PARIETAL LOBE', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['left_brained'], type: 'Lobe', benefits: { telepathy: 1 } },
    { id: 'brocas_area', title: "BROCA'S AREA", description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['left_brained'], type: 'Lobe', benefits: { telepathy: 1 } },
    { id: 'frontal_lobe', title: 'FRONTAL LOBE', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['parietal_lobe', 'brocas_area'], type: 'Frontal Lobe', benefits: { mentalManipulation: 2 } },
    { id: 'cerebellum', title: 'CEREBELLUM', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['frontal_lobe'], type: 'Lobe', benefits: { mentalManipulation: 1 } },
    { id: 'temporal_lobe', title: 'TEMPORAL LOBE', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['frontal_lobe'], type: 'Lobe', benefits: { mentalManipulation: 1 } },
    { id: 'right_brained', title: 'RIGHT BRAINED', description: 'Unlocks Breaker of Minds', imageSrc: '/images/rfs5FtF3-xuth.png', prerequisites: ['cerebellum', 'temporal_lobe'], type: 'Right Brained', benefits: { mentalManipulation: 1 }, unlocks: 'breaker_of_minds' },
];

export const FALLEN_PEACE_SIGIL_TREE_DATA_KO: FallenPeaceSigil[] = [
    { id: 'left_brained', title: '좌뇌 발달', description: "마음이라는 게 그렇게 복잡한 건 아닌가봐요.", imageSrc: '/images/SFbsP2R-juathas.png', prerequisites: [], type: 'Left Brained', benefits: { telepathy: 1 } },
    { id: 'parietal_lobe', title: '두정엽', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['left_brained'], type: 'Lobe', benefits: { telepathy: 1 } },
    { id: 'brocas_area', title: "브로카 영역", description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['left_brained'], type: 'Lobe', benefits: { telepathy: 1 } },
    { id: 'frontal_lobe', title: '전두엽', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['parietal_lobe', 'brocas_area'], type: 'Frontal Lobe', benefits: { mentalManipulation: 2 } },
    { id: 'cerebellum', title: '소뇌', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['frontal_lobe'], type: 'Lobe', benefits: { mentalManipulation: 1 } },
    { id: 'temporal_lobe', title: '측두엽', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['frontal_lobe'], type: 'Lobe', benefits: { mentalManipulation: 1 } },
    { id: 'right_brained', title: '우뇌 발달', description: '정신 파괴자 해금', imageSrc: '/images/rfs5FtF3-xuth.png', prerequisites: ['cerebellum', 'temporal_lobe'], type: 'Right Brained', benefits: { mentalManipulation: 1 }, unlocks: 'breaker_of_minds' },
];

export const TELEPATHY_DATA: FallenPeacePower[] = [
    { id: 'thoughtseer', title: 'THOUGHTSEER', imageSrc: '/images/s9dW4TRR-c1.png', description: "Just by looking at someone, you can know the general subject they're thinking about and the emotions that they're feeling. You'll become excellent at manipulating people, as you'll sense just how they'll react to everything you might say, so you'll know just how to get what you want.", grade: 'kaarn' },
    { id: 'lucid_dreamer', title: 'LUCID DREAMER', imageSrc: '/images/932qDS4b-c2.jpg', description: "You not only have full control of your own dreams, but you can invade the dreams of anybody on earth while you're both sleeping and take control of all events. Levels of vividness and detail are vastly increased. Torment foes with nightmares, or even transmit covert messages to allies across distances.", grade: 'kaarn' },
    { id: 'memory_lane', title: 'MEMORY LANE', imageSrc: '/images/4ntvw4k4-c3.jpg', description: "You can see into a person's memory by focusing on them, though the farther back the memories are, the more vague and unclear they become. Things they have to remember often are particularly clear, such as passcodes, secrets, locations of hideouts and treasures, and other things they won't share.", grade: 'kaarn' },
    { id: 'mental_block', title: 'MENTAL BLOCK', imageSrc: '/images/WvKH0sn1-c4.jpg', description: "You can perform rituals that create telepathic blocks in yourself or others. Want to make a certain memory off-limits? Prevent yourself from being made to feel a certain emotion? With only a few blocks, they're unbreakable except by a {r}Breaker of Minds{/r}, but the more blocks, the weaker each is.", grade: 'kaarn' },
];

export const TELEPATHY_DATA_KO: FallenPeacePower[] = [
    { id: 'thoughtseer', title: '생각을 읽는 자', imageSrc: '/images/s9dW4TRR-c1.png', description: "타인을 바라보기만 하면 대략 무슨 생각을 하고 있는지, 어떤 감정을 느끼고 있는지 알아차릴 수 있습니다. 사람들을 교묘히 조종하는 것에 정말 능숙해질 겁니다. 당신이 하는 말에 어떤 반응을 보일지를 알아차릴 수 있으니까요. 그러면 당신이 원하는 것을 쉽게 얻어낼 수 있겠죠.", grade: 'kaarn' },
    { id: 'lucid_dreamer', title: '꿈의 방문자', imageSrc: '/images/932qDS4b-c2.jpg', description: "당신은 완전한 자각몽을 꿀 수 있을 뿐만 아니라, 당신과 같은 시간에 자고 있는 이들의 꿈에 침입해서 모든 것들을 좌지우지할 수 있습니다. 꿈이 훨씬 더 생생해지고 자세해집니다. 적들에게 악몽을 꾸게 하며 고통을 주거나, 멀리 떨어진 동료들에게 비밀 메시지를 전달할 수도 있습니다.", grade: 'kaarn' },
    { id: 'memory_lane', title: '기억의 길', imageSrc: '/images/4ntvw4k4-c3.jpg', description: "타인에게 집중하는 것으로 그들의 기억을 읽을 수 있습니다. 다만 더 오래 된 기억일수록 희미해지고 불명확해집니다. 특별히 잊지 않아야 하는 정보들, 그러니까 암호, 은신처나 보물의 위치, 각종 비밀 같은 것들은 특별히 선명하게 나타납니다.", grade: 'kaarn' },
    { id: 'mental_block', title: '정신 차단벽', imageSrc: '/images/WvKH0sn1-c4.jpg', description: "의식을 통해 당신 자신이나 다른 이들에게 정신적 차단벽을 만들어 줄 수 있습니다. 특별한 기억을 지키고 싶으십니까? 누군가의 수작으로 특정한 감정을 느끼게 되는 것을 원치 않으십니까? 차단벽의 숫자가 적다면 {r}정신 파괴자{/r}가 아닌 이상 뚫을 수 없지만, 차단벽의 숫자가 많아지면 강도가 점차 약해집니다.", grade: 'kaarn' },
];

export const MENTAL_MANIPULATION_DATA: FallenPeacePower[] = [
    { id: 'perfect_stranger', title: 'PERFECT STRANGER', imageSrc: '/images/L4NDtHn-c5.png', description: "A \"stealth\" ability. When active, anyone who sees you will soon forget you were present. The duration depends on how focused they were on you. For example, if you were in combat with them, it will take minutes for them to forget you were there; if they only glanced you pass by, it will take seconds.", grade: 'purth' },
    { id: 'masquerade', title: 'MASQUERADE', imageSrc: '/images/R4c7C2Gn-c6.jpg', description: "At will, you can emanate a field that forces all around you to see you as having the same voice and appearance of a person of your choice. They will also feel a strong compelling drive to believe you {i}are{/i} that person regardless of how improbable it is, even if you hardly know how to emulate them.", grade: 'purth' },
    { id: 'psychic_vampire', title: 'PSYCHIC VAMPIRE', imageSrc: '/images/dwCXj4tm-c7.jpg', description: "When activated, you can absorb particularly powerful emotions from the people around you like a sponge. Then, you can focus your psychic energy on a target to fill them with a payload of collected emotions. Make a foe surrender by filling them with terror, or make them relax with bliss and comfort.", grade: 'purth' },
    { id: 'breaker_of_minds', title: 'BREAKER OF MINDS', imageSrc: '/images/ymp2vB3Q-c8.jpg', description: "{i}Requires {r}Right Brained.{/r}{/i} You have considerable influence over vulnerable minds. You can easily manipulate people in conversation, causing them to believe the unbelievable or coercing them to do the unthinkable. You can focus psychic energy on enemies to make them miss shots, whiff spells or be overcome with emotion. With certain lengthy rituals, you can turn 10 defeated foes into \"agents\". \n - {w}Sleeper Agent{/w}: They will forget all about their meeting with you and go about their lives none the wiser. Upon hearing a certain code phrase, they will be reduced to a mindless drone equivalent to {g}Hypnotist{/g}, but without a time limit. Once released again, they will forget all about it. Be warned it will be extremely obvious they're hypnotized, and their allies may try to free them. \n - {w}Active Agent{/w}: They will retain much of their agency and personality, but will abandon their loyalties and become subservient to you. They will march in line with your whims, but a dim part of their old self will still exist within them, causing them to (rarely) resist certain demands their old self would've considered particularly unconscionable. Agents can be freed by rituals and telepaths.", requires: ['right_brained'], grade: 'xuth' },
    { id: 'master_telepath', title: 'MASTER TELEPATH', imageSrc: '/images/nH94QpV-c9.jpg', description: "If you can control someone's perception, you can control their entire reality. At will, you will be able to induce vivid hallucinations of your choice in those around you, though you can't change how they see you. Those who see it coming and have high willpower might not fall for them, however.", grade: 'purth' },
    { id: 'crowd_control', title: 'CROWD CONTROL', imageSrc: '/images/dwKf4zGK-c10.png', description: "Mages often can defend themselves from psychic intrusion, but mundanes are usually completely vulnerable. When active, you can take complete psychic control over entire crowds of regular civilians with no time limit. Incredibly fragile, but good against mages who avoid civilian casualties.", grade: 'purth' },
    { id: 'hypnotist', title: 'HYPNOTIST', imageSrc: '/images/ymynB07C-c11.png', description: "You are adept at hypnotizing targets using regular means if they are either tricked or subdued. Victims become mindless drones that can be piloted like an extension of yourself for a few hours, though they'll still resist self harm. You will struggle making them use any spells which you do not share.", grade: 'purth' },
];

export const MENTAL_MANIPULATION_DATA_KO: FallenPeacePower[] = [
    { id: 'perfect_stranger', title: '완벽한 타인', imageSrc: '/images/L4NDtHn-c5.png', description: "\"은신\" 기술입니다. 이 마법을 사용하면 당신을 본 모든 이들이 그 사실을 금방 잊어버리게 됩니다. 효과의 지속 시간은 그들이 얼마나 당신에게 집중하고 있는지에 따라 달라집니다. 가령 전투 중이었다면 몇 분은 지나야 당신이 있었다는 사실을 잊겠지만, 그저 지나가다가 슬쩍 본 정도라면 몇 초 만에 잊을 겁니다.", grade: 'purth' },
    { id: 'masquerade', title: '가면무도회', imageSrc: '/images/R4c7C2Gn-c6.jpg', description: "당신의 주변에 마력을 투사해, 주변 사람들이 보고 듣는 당신의 모습과 목소리를 당신이 원하는 사람의 것으로 바꿀 수 있습니다. 또한, 주변인들은 당신이 실제로 그 사람이라는 강력하고 충동적인 믿음을 갖게 됩니다. 그게 이성적으로 말이 되든 안 되든, 당신이 그 사람의 흉내를 잘 내든 못 내든 상관없습니다.", grade: 'purth' },
    { id: 'psychic_vampire', title: '정신 흡수자', imageSrc: '/images/dwCXj4tm-c7.jpg', description: "이 마법을 발동하면 주변 사람들이 느끼는 강렬한 감정을 스펀지처럼 흡수할 수 있습니다. 그 후 정신 에너지를 한 대상에게 집중해, 흡수했던 모든 감정들을 방출할 수 있습니다. 적에게 극한의 공포를 심어 굴복시키거나, 황홀한 안락함에 빠져 늘어지게 만들 수도 있겠죠.", grade: 'purth' },
    { id: 'breaker_of_minds', title: '정신 파괴자', imageSrc: '/images/ymp2vB3Q-c8.jpg', description: "{i}{r}우뇌 발달{/r}이 필요합니다.{/i} 연약한 정신은 당신의 힘을 감당해 낼 수 없습니다. 대화로 사람을 조종하는 것은 당신에게는 식은 죽 먹기입니다. 믿을 수 없는 것들을 믿게 하거나, 생각조차 못 한 일을 행하게 할 수 있습니다. 정신 에너지를 적들에게 집중하면 총탄이 빗나가고, 마법은 실패하고, 넘치는 감정에 행동조차 둔해집니다. 또한, 당신이 제압한 적들을 대상으로 정교하고 긴 의식을 치르면 그들을 \"요원\"으로 부릴 수 있습니다. \"요원\"은 최대 10명까지 거느릴 수 있습니다.\n\n - {w}잠자는 요원{/w}: 이들은 당신을 만났던 사실을 깨끗이 잊어버리고, 아무것도 모른 채 일상으로 돌아갑니다. 그러다 특정한 암호문을 듣게 되면, {g}최면술사{/g}의 최면 대상처럼 이성 없는 꼭두각시가 되고, 그 효과는 반영구적으로 지속됩니다. 조종이 풀리면 그들은 마찬가지로 그 동안의 모든 일을 잊어버립니다. 다만, 최면 상태에 빠진 요원들은 표시가 명확히 나기 때문에, 그들의 동료들이 최면을 해제하려 할 수 있다는 것을 염두에 두어야 합니다.\n\n - {w}능동적 요원{/w}: 이들은 지성과 판단력을 대부분 유지하지만, 기존의 소속감 같은 것들은 모두 버리고 당신에게만 맹목적으로 충성합니다. 당신의 기분에 따라 행동하게 되지만, 본래의 인간성이 약하게나마 남아 있어서 원래라면 절대로 하지 않았을 일들을 명령받으면 극히 드물게나마 저항할 수도 있습니다.\n\n특정한 의식이나 정신 조작 능력자의 힘을 빌어 요원을 해방시킬 수 있습니다.", requires: ['right_brained'], grade: 'xuth' },
    { id: 'master_telepath', title: '텔레파시 달인', imageSrc: '/images/nH94QpV-c9.jpg', description: "한 사람의 감각을 조종할 수 있다면 그의 현실 전부도 마찬가지입니다. 당신은 주변 사람들에게 생생한 환각을 보여 줄 수 있습니다. 다만 당신 자신의 모습을 환각으로 바꿀 수는 없습니다. 그리고 이 마법을 예상하고 있거나 의지가 강한 이들에게는 마법이 통하지 않을 수 있습니다.", grade: 'purth' },
    { id: 'crowd_control', title: '군중 제어', imageSrc: '/images/dwKf4zGK-c10.png', description: "마녀들이야 정신적 간섭을 막을 수 있는 경우가 많지만, 일반인들은 사실상 무방비입니다. 이 마법을 발동하면 군중 단위의 일반인들의 정신을 반영구적으로 지배할 수 있습니다. 그래 봐야 일반인들이지만, 민간인 피해를 꺼리는 마녀들을 상대하기에는 좋은 능력입니다.", grade: 'purth' },
    { id: 'hypnotist', title: '최면술사', imageSrc: '/images/ymynB07C-c11.png', description: "대상을 속이거나 제압한 후에 최면 상태에 빠뜨릴 수 있게 됩니다. 최면에 걸린 대상은 이성을 잃고, 몇 시간 동안 당신의 수족처럼 부릴 수 있게 되지만, 자해하라는 명령에는 저항합니다. 또한, 당신과 대상이 공유하지 않는 마법을 사용하게 하려면 꽤나 노력이 필요할 겁니다.", grade: 'purth' },
];
