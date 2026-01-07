
import type { GoodTidingsSigilTier, ChoiceItem } from '../../types';

export const GOOD_TIDINGS_DATA = {
    title: "THE BLESSING OF GOOD TIDINGS",
    imageSrc: "/images/4ZTSFgvF-main4.jpg",
    description: `This Blessing is pretty much used by every mage who's ever lived — I genuinely can't think of a single one who hadn't taken it, or at least, not one who survived long enough to be remembered. There was a time, during the war, that the Mother considered making this the only Blessing people were allowed access to, but the arrival of the Allmillor put the kibosh on that. Perhaps most important is the included durability. Battles between mages can go on for hours, and even when at the point they'd normally die, they instead fall unconscious. Killing a mage would essentially require you to {i}coup de grâce{/i} them while they're knocked out, which is still surprisingly difficult. This blessing cannot be applied to weapons.`
};

export const GOOD_TIDINGS_DATA_KO = {
    title: "길조의 축복",
    imageSrc: "/images/4ZTSFgvF-main4.jpg",
    description: `가장 기본적인 축복입니다. 직접 사용해야 하는 전통적인 마법들과는 달리, 이 축복으로는 신체에 직접적인 영향을 주는 강화 버프를 받을 수 있습니다. 아마 모든 마법소녀와 마녀들이 이 축복을 사용했을 겁니다. 이 축복을 거른 사람이 있는지는 정말 생각이 안 나네요. 그런 사람이 있다면 적어도 제가 기억할 만큼 오래 살아남지는 못했을 거에요. 예전에 전쟁 중일 때는 어머니께서 이 축복만 모두에게 허락하실까 고민하셨던 적이 있었는데, 올밀러들이 도착해서 그건 흐지부지됐었죠.

개인적으로 여기서 제일 중요한 건 신체의 강인함이라고 생각합니다. 마녀들끼리 싸움이 붙으면 몇 시간씩 결판이 안 날 수도 있고, 그러다 죽을 만 하면 의식을 잃는 선에서 끝나죠. 만약 마녀를 죽이고자 한다면 의식을 잃고 무력화되었을 때 마지막 치명타를 날려야 합니다. 근데 그것도 의외로 어려워요. 이 축복의 표식은 무기에는 적용할 수 없습니다.`
};

export const GOOD_TIDINGS_SIGIL_TREE_DATA: GoodTidingsSigilTier[] = [
    { id: 'standard', title: 'STANDARD', description: 'The regular kit expected of every mage.', benefits: '+3 Essential Boons', cost: 'Costs 0 BP', imageSrc: '/images/zTm8fcLb-kaarn.png' },
    { id: 'journeyman', title: 'JOURNEYMAN', description: 'You far exceed the human limits in a few extra ways.', benefits: '+4 Minor Boons', cost: 'Costs 5 BP', imageSrc: '/images/Dg6nz0R1-purth.png' },
    { id: 'master', title: 'MASTER', description: 'You are far beyond a normal human, to you, they are ants.', benefits: '+1 Major Boon', cost: 'Costs 10 BP', imageSrc: '/images/rfs5FtF3-xuth.png' }
];

export const GOOD_TIDINGS_SIGIL_TREE_DATA_KO: GoodTidingsSigilTier[] = [
    { id: 'standard', title: '통상', description: '모든 마법소녀들이 갖고 있을 만한 기본적인 것들입니다.', benefits: '+3 필수 혜택', cost: '축복 점수 0점', imageSrc: '/images/zTm8fcLb-kaarn.png' },
    { id: 'journeyman', title: '저니맨', description: '몇몇 한정된 측면에서는 인간을 아득히 초월할 수 있게 됩니다.', benefits: '+4 하위 혜택', cost: '축복 점수 5점', imageSrc: '/images/Dg6nz0R1-purth.png' },
    { id: 'master', title: '달인', description: '당신은 평범한 인간 그 한참 위에 있습니다. 그들은 그저 개미들일 뿐입니다.', benefits: '+1 상위 혜택', cost: '축복 점수 10점', imageSrc: '/images/rfs5FtF3-xuth.png' }
];

export const ESSENTIAL_BOONS_DATA: ChoiceItem[] = [
    { id: 'flight', title: 'FLIGHT', cost: '', description: "With enough practice, you'll be able to fly agilely through the air with absolute ease! A pair of wings or a flying broomstick is stylish but optional. When soaring in one direction for long enough, you can reach upwards of 200 MPH, although changing direction is much slower the faster you're going.", imageSrc: '/images/RdkTwdp-b1.jpg', grade: 'kaarn' },
    { id: 'extreme_durability', title: 'EXTREME DURABILITY', cost: '', description: "Your will to survive strengthens your body in dangerous situations. Regular bullets will bounce off you, and falling from a mile's height will only bruise you; only magic has any chance of harming you. Even if you do take extreme damage, you'll likely just pass out rather than outright die.", imageSrc: '/images/1tj5QfXk-b2.jpg', grade: 'kaarn' },
    { id: 'superhuman_physicality', title: 'SUPERHUMAN PHYSICALITY', cost: '', description: "Toss a five ton truck at your enemies, outrun a speeding race car, resist any mundane poison or disease, leap and flip like an olympic acrobat, hold your breath indefinitely... mages may not always look tough, but even the weakest among them is terrifying compared to a regular human!", imageSrc: '/images/yB6KzqbQ-b3.jpg', grade: 'kaarn' },
];

export const ESSENTIAL_BOONS_DATA_KO: ChoiceItem[] = [
    { id: 'flight', title: '비행', cost: '', description: "충분한 연습을 하면 아주 민첩하게 하늘을 날 수 있게 됩니다. 날개나 빗자루는 있으면 멋있지만, 꼭 필요하지는 않아요. 한 방향으로 계속 난다면 최대 320km/h까지 속도를 낼 수 있지만, 그렇게 빨리 날면 날수록 방향 전환은 느려집니다.", imageSrc: '/images/RdkTwdp-b1.jpg', grade: 'kaarn' },
    { id: 'extreme_durability', title: '강인한 내구력', cost: '', description: "당신의 생존 의지가 신체를 강화시켜 위험한 상황에서도 버틸 수 있게 해 줍니다. 일반 총탄은 튕겨내고, 2km 높이에서 떨어져도 멍만 듭니다. 당신이 크게 다치려면 마법에 당해야 하죠. 그리고 엄청난 피해를 입어도 죽지 않고, 의식을 잃는 선에서 끝날 겁니다.", imageSrc: '/images/1tj5QfXk-b2.jpg', grade: 'kaarn' },
    { id: 'superhuman_physicality', title: '초인적인 육체', cost: '', description: "5톤 트럭을 들어서 적들에게 내던지고, 달리기로 경주용 차를 따라잡고, 흔한 병이나 독쯤은 그냥 이겨내고, 점프나 공중제비는 올림픽 체조 선수 수준에, 숨도 오랫동안 참고... 마법소녀들이 터프해 보이지는 않을지도 모릅니다. 하지만 가장 약한 마법소녀들도 일반인과 비교하면 무시무시한 인간 병기들이에요!", imageSrc: '/images/yB6KzqbQ-b3.jpg', grade: 'kaarn' },
];

export const MINOR_BOONS_DATA: ChoiceItem[] = [
    { id: 'quick_twitch', title: 'QUICK TWITCH', cost: '', description: "Your hand-eye coordination and ability to process stimuli is perfected, making you more perceptive and observant, and allowing you to react to things nearly instantly. This will allow you to, say, rapidly pull out your gun and hit a precise shot, or activate a force field milliseconds before a surprise attack.", imageSrc: '/images/qL5XGGmP-b4.jpg', grade: 'kaarn' },
    { id: 'incredible_will', title: 'INCREDIBLE WILL', cost: '', description: "You have such incredible willpower that it's almost scary! Your pain tolerance is elevated tenfold to the point that injuries barely slow you down, and it's harder for you to lose your nerve or concentration. You are also massively strengthened against, but not {i}immune{/i} to, psychic mental manipulation.", imageSrc: '/images/JFtxwBCG-b5.jpg', grade: 'kaarn' },
    { id: 'sensory_master', title: 'SENSORY MASTER', cost: '', description: "All of your senses are fine-tuned, able to pick up the tiniest sounds and smells, but you're at no risk of being overwhelmed by, say, loud noises. You can also pick out individual noises, like a conversation, even in a cacophony of a thousand sounds, and your eyesight is great even in pitch darkness.", imageSrc: '/images/mCvPByWZ-b6.png', grade: 'kaarn' },
    { id: 'cowards_boon', title: "COWARD'S BOON", cost: '', description: "Specifically when you are being chased by a foe, your maximum flying speed is boosted to 150%. This is good for 'tactical' retreats, racing, and for keeping a melee fighter from closing the distance. Your acceleration isn't boosted much, though, so don't expect to be able to get away on a dime.", imageSrc: '/images/ZRKCYFSH-b7.jpg', grade: 'kaarn' },
    { id: 'charisma_plus', title: 'CHARISMA +', cost: '', description: "You're far more charismatic than all but the suavest mundanes have any hope of being. Your persuasive ability is massively amplified, enough to get people to completely change their worldviews if you can get them to hear you out enough. You always know just what to say to get what you want.", imageSrc: '/images/8LL05BdP-b8.jpg', grade: 'kaarn' },
    { id: 'strength_plus', title: 'STRENGTH +', cost: '', description: "Exactly what it says on the tin. Now, you won't even strain to lift something until it reaches well into a hundred tons of weight, and your punches will shatter titanium hulls and can knock the wind out of even the toughest mages. And no, don't worry, you don't have to get buff for this.", imageSrc: '/images/JFpR5vnv-b9.png', grade: 'kaarn' },
    { id: 'speed_plus', title: 'SPEED +', cost: '', description: "Not only are you more swift and agile in all situations, but your speed and grace while flying is massively increased! Your maximum speed is boosted to 300 MPH, but that's not its true hard cap: from there, you can very slowly accelerate up to 400 MPH. Good luck turning, however.", imageSrc: '/images/c95thD3-b10.jpg', grade: 'kaarn' },
    { id: 'smarts_plus', title: 'SMARTS +', cost: '', description: "You've got an intellect that would be impressive even at a Mensa meeting, and a knack for thinking quickly and coming up with viable strategies while in the heat of battle. Your ability to calculate and remember is boosted greatly. You can also tell when someone is trying to psychically manipulate you.", imageSrc: '/images/1GK3Lcyp-b11.jpg', grade: 'kaarn' },
];

export const MINOR_BOONS_DATA_KO: ChoiceItem[] = [
    { id: 'quick_twitch', title: '재빠른 반사신경', cost: '', description: "당신은 완벽한 인식력과 협응력을 갖췄습니다. 관찰력과 지각력이 향상될 뿐 아니라 거의 즉각적인 반응 속도를 갖게 됩니다. 예를 들면 총을 재빨리 뽑아 목표를 정확히 맟춘다던가, 기습에 당하기 직전에 역장을 펼쳐 공격을 막아낼 수 있는 것이죠.", imageSrc: '/images/qL5XGGmP-b4.jpg', grade: 'kaarn' },
    { id: 'incredible_will', title: '초인적인 의지', cost: '', description: "당신의 의지력은 너무 높아서 무서울 정도입니다. 고통은 열 배 더 잘 견뎌낼 수 있어서 상처를 입어도 행동이 거의 느려지지 않고, 용기도 집중력도 쉽게 잃지 않습니다. 또한 정신 조작 마법에 엄청난 저항력을 갖게 되지만, 아주 면역이 되지는 않습니다.", imageSrc: '/images/JFtxwBCG-b5.jpg', grade: 'kaarn' },
    { id: 'sensory_master', title: '감각 극대화', cost: '', description: "모든 감각이 극도로 예민해져 가장 희미한 소리나 냄새조차 잡아 낼 수 있게 됩니다. 그렇다고 큰 소리를 들으면 더 고통스럽다거나 한 건 아닙니다. 이 소리 저 소리로 시끄러워도 개별적인 대화를 잡아 낼 수도 있고, 칠흑 같은 어둠에서도 뛰어난 시력을 유지할 수 있습니다.", imageSrc: '/images/mCvPByWZ-b6.png', grade: 'kaarn' },
    { id: 'cowards_boon', title: '겁쟁이의 선물', cost: '', description: "적에게 쫓기고 있을 때 최대 비행 속도가 150%로 향상됩니다. \"전략적\" 후퇴나 경주, 또는 근접전을 펼치는 상대에 맞서 거리를 벌리는 데 탁월합니다. 다만 가속도까지 그렇게 늘어나지는 않기 떄문에, '즉시 탈출' 같은 건 힘들 거에요.", imageSrc: '/images/ZRKCYFSH-b7.jpg', grade: 'kaarn' },
    { id: 'charisma_plus', title: '카리스마+', cost: '', description: "가장 매력 넘치는 일반인들도 당신과 비교하면 카리스마가 없는 수준입니다. 당신의 설득력은 몇십 배 강화되어 당신의 이야기를 충분히 듣는다면 누구든 세계를 대하는 관점이 뒤바뀔 정도입니다. 원하는 것을 얻기 위해 무슨 말을 해야 하는지 정확히 알 수 있는 건 물론이구요.", imageSrc: '/images/8LL05BdP-b8.jpg', grade: 'kaarn' },
    { id: 'strength_plus', title: '힘+', cost: '', description: "말 그대로입니다. 몇백 톤 나가는 것들이 아니고서야 인상 한 번 안 쓰고 들어올릴 수 있고, 주먹질 한 방이면 티타늄 동체도 박살이 나고 제일 터프한 마법소녀들도 나가떨어질 겁니다. 아, 걱정 마세요. 이거 고른다고 근육빵빵 되는 건 아닙니다.", imageSrc: '/images/JFpR5vnv-b9.png', grade: 'kaarn' },
    { id: 'speed_plus', title: '속도+', cost: '', description: "빠르고 민첩함은 기본이고, 당신이 비행할 때의 속도와 우아함이 몇십 배는 향상됩니다! 속도는 기본적으로 480km/h까지 낼 수 있고, 거기서 천천히 가속해서 640km/h 까지 찍을 수도 있습니다. 방향 전환은... 알아서 하세요.", imageSrc: '/images/c95thD3-b10.jpg', grade: 'kaarn' },
    { id: 'smarts_plus', title: '지능+', cost: '', description: "멘사도 한 수 접어 주는 지능을 갖게 됩니다. 생각도 빨라지고, 전장 한복판에서도 효과적인 전술을 재깍재깍 떠올릴 수 있습니다. 계산력과 기억력도 좋아지구요. 그리고 누군가가 당신의 정신을 조작하려 할 때 알아차릴 수 있을 겁니다.", imageSrc: '/images/1GK3Lcyp-b11.jpg', grade: 'kaarn' },
];

export const MAJOR_BOONS_DATA: ChoiceItem[] = [
    { id: 'hokuto_senjukai_ken', title: 'HOKUTO SENJUKAI KEN', cost: '', description: "{i}Requires {w}Strength +.{/w}{/i} Your strength is so incredible, you can now hold up an 18-wheeler with a pinky finger. A single punch can crack a 25,000-ton boulder into two halves and send other mages flying practically into the stratosphere, and pins are nearly inescapable. In fact, punching the air can create a blast of concussive force that will shatter all windows for a mile and deflect even magical attacks. This, combined with your vast knowledge of martial arts, will allow you to make quick work of even the toughest foes if you close the distance.", imageSrc: '/images/XkK62Tfs-b12.jpg', requires: 'strength_plus', grade: 'xuth' },
    { id: 'dont_blink', title: "DON'T BLINK", cost: '', description: "{i}Requires {w}Speed +.{/w}{/i} In bursts, you can now move fast enough that time moves so down, to the point that it's considered teleporting. This is absolutely exhausting, though, so don't overuse it or you'll crash and nap for a week. Plus, the rate at which you charge and use spells isn't sped up, and you need to be gentle when interacting with things, because Newton's third law still applies. So, if you punch someone while moving at super speed, they'll get messed up, but you'll get equally messed up. It's usually better to temporarily leave the super speed state before attacking.", imageSrc: '/images/yJ7j4kY-b13.jpg', requires: 'speed_plus', grade: 'xuth' },
    { id: 'superpowered_mind', title: 'SUPERPOWERED MIND', cost: '', description: "{i}Requires {w}Smarts +.{/w}{/i} Your brain operates like a supercomputer, and is capable of solving complex problems and equations in a matter of milliseconds, and has a eidetic memory that can hold limitless information indefinitely. Such is its might that you are totally immune to psychic interference by anybody but those rare few who rival you in intellect. Your calculation ability allows you to form predictive models of the near future with high levels of certainty, though gaps in your knowledge can affect these models' accuracies significantly.", imageSrc: '/images/3YFc3yqh-b14.jpg', requires: 'smarts_plus', grade: 'xuth' },
];

export const MAJOR_BOONS_DATA_KO: ChoiceItem[] = [
    { id: 'hokuto_senjukai_ken', title: '북두천수괴권', cost: '', description: "{i}{w}힘+{/w}가 필요합니다.{/i} 당신의 육체적인 힘은 너무나 강력해서 세미 트레일러를 새끼손가락 하나로 들어올릴 수 있고, 주먹질 한 번으로 25000톤 바위도 반으로 가를 수 있습니다. 다른 마법소녀가 맞으면 성층권까지 날아가겠네요. 누굴 발로 밟기라도 한다면 사실상 못 빠져나갈 겁니다. 아니, 사실, 허공에 주먹 한 번만 뻗어도 그 풍압으로 2km 내의 창문이란 창문은 다 깨고 마법까지 튕겨낼 수 있습니다. 거기에 뛰어난 무술 실력까지 더하면, 거리만 좁히면 그 어떤 강적이라도 쉽고 빠르게 해치울 수 있는 셈이죠.", imageSrc: '/images/XkK62Tfs-b12.jpg', requires: 'strength_plus', grade: 'xuth' },
    { id: 'dont_blink', title: "눈 깜짝할 사이", cost: '', description: "{i}{w}속도+{/w}가 필요합니다.{/i} 당신은 순간적으로 주변 시간의 흐름이 느려질 정도로 빠르게 이동할 수 있습니다. 남들에게는 순간이동하는 것처럼 보일 겁니다. 물론 엄청나게 몸에 부담이 되기 때문에 남용해서는 안 됩니다. 그러다가 제대로 뻗어서 일주일 동안 잠만 자게 되는 수가 있어요. 다만 마법을 사용하거나 충전하는 속도는 딱히 빨라지지 않습니다. 그리고 뉴턴 3법칙은 여전히 적용되기 때문에 조심해야 합니다. 가령 초신속으로 남을 때리면 그 사람도 뭉개지겠지만 당신 주먹도 뭉개져요. 공격하기 직전에 초신속 상태를 해제하는 게 좋을 겁니다.", imageSrc: '/images/yJ7j4kY-b13.jpg', requires: 'speed_plus', grade: 'xuth' },
    { id: 'superpowered_mind', title: '초월자의 정신', cost: '', description: "{i}{w}지능+{/w}가 필요합니다.{/i} 당신의 두뇌는 슈퍼컴퓨터처럼 작동합니다. 가장 복잡한 문제와 방정식도 몇 밀리초 안에 풀어내고, 모든 것을 영원히 기억할 수 있는 완전기억능력도 있습니다. 이 덕분에 당신에게 필적하는 지능을 갖는 존재가 아니라면 그 누구도 당신의 정신에 간섭할 수 없습니다. 계산을 통해서 가까운 미래를 거의 확실하게 예지할 수 있는 모델을 만들 수도 있습니다. 물론 당신의 지식이 불완전하다면 그 모델의 정확성도 떨어지겠지만요.", imageSrc: '/images/3YFc3yqh-b14.jpg', requires: 'smarts_plus', grade: 'xuth' },
];
