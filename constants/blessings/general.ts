
import type { ChoiceItem, Sigil } from '../../types';

export const PAGE_THREE_INTRO_DATA = {
    title: "IT'S TIME TO DESIGN YOUR MAGIC!",
    p1: "Your time at the academy has taught you so much. Of course, it hasn't given you anything you didn't already possess; it merely showed you how to make full use of the potential that's been inside you all along. The deeper you delved into the inner workings of magecraft, the more your nights were beset by strange dreams of murky glimpses of a higher realm, reminding you of your smallness in a great and terrifying multiverse.",
    p2: "Pay close attention here, for this is where it gets slightly complicated. Each {w}Stolen Blessing{/w} is a chunk of power ripped from the soul of the Child of God and bestowed upon Mages by the Mother of Azure, administered by her five well, four Daughters. She currently institutes the Sinusur Doctrine of Magecraft: the power of the Blessings may only be harnessed using various {w}Sigils{/w} as catalysts. Beneath each blessing, you may see sigils laid out something like this:"
};

export const PAGE_THREE_INTRO_DATA_KO = {
    title: "당신만의 마법을 만들어 보세요!",
    p1: "마법학교에서 당신은 정말로 많은 것을 배웠습니다. 물론 모두 당신이 원래 타고난 것들입니다. 그 동안 간직하고 있었던 잠재력을 개화시키는 법을 배운 것이죠. 당신은 마법의 이치를 더욱 깊이 탐구할수록, 자꾸만 잠결에 이상한 꿈을 꾸게 되었습니다. 꿈 속에서 더 높은 차원을 흐릿하게나마 엿보며, 이 위대하고도 두려운 다중우주에서 당신이 얼마나 작은 존재인지 거듭 깨닫게 되었습니다.",
    p2: "정신 바짝 차리세요. 여기서부터 살짝 복잡해집니다. 신의 아이의 영혼으로부터 뜯어 낸 일단의 힘은 {w}훔쳐온 축복{/w}이 되어, 하늘빛의 어머니께서 마법소녀들에게 내려 주십니다. 그 권능을 직접적으로 부여하는 이들은 어머니의 다섯-, 아니, 네 딸들이지요. 지금은 사이누수르 마법 대원칙에 의거하여 축복의 힘을 {w}표식{/w}이라는 촉매를 통해서만 행사할 수 있게 됩니다. 각각의 축복마다 표식들이 특정 배열을 하고 있는 것을 볼 수 있을 겁니다:"
};

export const PAGE_THREE_RULES_DATA = {
    intro: "Each sigil you purchase will entitle you to a great amount of that Blessing's power, in accordance with the following rules:",
    rules: [
        "Before buying a sigil, you must have purchased every sigil connected to it from its left. Think of it like a perk tree in an RPG. You start at the leftmost side, and make your way to the very right.",
        "Buying more sigils allows you to choose more of the Blessing's {w}Modifiers{/w}, listed in the menu beneath. For example, if you buy a sigil with the description {w}\"+1 Minor Spell\"{/w}, you may then take one more option from the category marked \"Minor Spells\".",
        "\"Unlocking\" a spell or boon is not the same as acquiring it. You still have to purchase it as described in rule #2.",
        "You can press the BOOST button under a Sigil tree to enhance a sub-category. Once selected, the specific boost effects will be displayed below each option."
    ],
    engravingTitle: "For each Blessing, you can decide where its sigils shall be engraved",
    engravingSubtitle: "You can set this individually for each Blessing, but for now, please pick a default location."
};

export const PAGE_THREE_RULES_DATA_KO = {
    intro: "당신이 선택하는 표식은 당신에게 상당한 축복의 힘을 부여합니다. 다음 규칙이 적용됩니다:",
    rules: [
        "한 표식을 선택하기 전에 그 표식 좌측에 연결된 모든 표식을 선택해야 합니다. RPG의 스킬트리 개념입니다. 항상 맨 왼쪽에서 시작해서 오른쪽으로 진행합니다.",
        "표식을 하나 선택하면 그 아래 명시된 소분류의 종류와 개수에 따라 {w}능력{/w}을 선택할 수 있습니다. 예를 들어 {w}\"+2 염력\"{/w}이 쓰여 있는 표식을 선택했다면 \"염력\" 소분류에서 하나의 선택지를 추가로 고르게 되는 형식입니다.",
        "무언가를 \"해금\"한다고 해서 즉시 사용할 수 있는 것은 아닙니다. 규칙 2번에 따라 비용을 지불하고 선택해야 합니다.",
        "표식 트리 아래에 있는 {w}BOOST{/w} 버튼을 눌러 소분류 하나를 강화할 수 있으며, 선택 시 각 선택지 아래에 구체적인 강화 효과가 표시됩니다. 물론 강화된 능력을 활용하려면 직접 선택해야 합니다."
    ],
    engravingTitle: "각각의 축복마다 그에 해당하는 표식들이 어디에 새겨지게 될지 정할 수 있습니다",
    engravingSubtitle: "각 축복마다 개별적으로 설정할 수 있지만, 일단은 기본 위치를 정해 주세요."
};

export const BLESSING_ENGRAVINGS: ChoiceItem[] = [
    { id: 'skin', title: 'SKIN', cost: 'Costs 0 FP', description: "Not a very pleasant process, getting these sigils etched onto your bare skin... but what are you gonna do? At least the Blessing can't be taken away, unless that part of your body is chopped off. However, this is required for Blessings affected by the trait {w}Magician{/w}.", imageSrc: '/images/N68jJM5s-where1.jpg' },
    { id: 'clothes', title: 'CLOTHES', cost: 'Costs 0 FP', description: "Probably the simplest option: have it emblazoned on your dress! The dress that comes with your alter ego is massively strengthened compared to normal fabric, but still, if it's torn or stolen, you'll lose the blessing until you can get it repaired or replaced.", imageSrc: '/images/W4yFYW8w-where2.png' },
    { id: 'weapon', title: 'WEAPON', cost: 'Costs 0 FP', description: "A weapon will grant you {w}20 Weapon Points{/w} on the {i}Reference Page{/i}. Carving a Blessing onto a weapon will grant a {bp}1 BP{/bp} refund on its {j}Juathas{/j} sigil. However, in the 'Engrave this Blessing' section, choosing a 'new' weapon costs {fp}5 FP{/fp}. The power will be limited to the weapon and useless if you are disarmed.", imageSrc: '/images/tPJVNydk-where3.jpg' },
];

export const BLESSING_ENGRAVINGS_KO: ChoiceItem[] = [
    { id: 'skin', title: '피부', cost: '행운 점수 0', description: "맨살에 표식을 새긴다니, 딱히 기분 좋은 과정은 아닙니다. 하지만... 이미 선택했잖아요? 적어도 표식을 새긴 부위가 떨어져나가지 않는 한 축복을 사용하지 못할 일은 없을 겁니다. {w}마법사{/w} 특성으로 선택한 축복이 있다면, 반드시 그 표식은 피부에 새겨야 합니다.", imageSrc: '/images/N68jJM5s-where1.jpg' },
    { id: 'clothes', title: '의복', cost: '행운 점수 0', description: "제일 간단한 방법이죠. 드레스에 문양을 남기는 겁니다! 당신의 겉보기 자아에 딸려오는 드레스는 일반적인 옷보다 훨씬 튼튼하지만, 그래도 도둑맞거나 찢어지거나 한다면 옷을 교체하거나 수선하기 전까지 축복을 잃어버릴 겁니다.", imageSrc: '/images/W4yFYW8w-where2.png' },
    { id: 'weapon', title: '무기', cost: '행운 점수 0', description: "새로운 무기를 적용하는 데에는 {fp}행운 점수 5점{/fp}이 필요합니다. {w}20 무기 점수{/w}가 주어지고, {i}참고 페이지{/i}에서 무기를 디자인할 수 있습니다. 표식을 무기에 새긴다면, {j}자타스{/j} 표식에 소모되는 {bp}축복 점수{/bp}를 1점 환급받을 수 있습니다. 하지만, 능력이 무기에 묶이기 때문에 당신이 무장해제당한다면 능력을 사용할 수 없을 겁니다.", imageSrc: '/images/tPJVNydk-where3.jpg' },
];

export const COMMON_SIGILS_DATA: Sigil[] = [
  { id: 'kaarn', title: 'KAARN', cost: 'Costs 3 BP', imageSrc: '/images/zTm8fcLb-kaarn.png', description: "Named after a mage whose village was terrorized by a despotic Sinubih archmage. The archmage was technically more magically powerful, yet was overthrown with creative use of insect telepathy. The tale's moral? Never underestimate seemingly 'weak' magic." },
  { id: 'purth', title: 'PURTH', cost: 'Costs 5 BP', imageSrc: '/images/Dg6nz0R1-purth.png', description: "These represent breakthroughs in your understanding of a Blessing, as you unlock power that you didn't even know you had in you. For an average mage, this is about the greatest sort of power they'd acquire, with, perhaps, a single Xuth sigil of some sort." },
  { id: 'juathas', title: 'JUATHAS', cost: 'Costs 8 BP', imageSrc: '/images/SFbsP2R-juathas.png', description: "The most renowned and famous sigil, for it implies the attainment of a brand new blessing. One becomes worthy of them either throw acts of great valor, impressing one of the Daughters, or, of course, training for long periods to unlock one's innate potential." },
];

export const COMMON_SIGILS_DATA_KO: Sigil[] = [
  { id: 'kaarn', title: '카른', cost: '축복 점수 3점', imageSrc: '/images/zTm8fcLb-kaarn.png', description: "폭압적인 시누비 대마법사의 손아귀에 마을이 공포에 떨고 있을 때 나선 마녀의 이름이 붙은 표식입니다. 대마법사 쪽이 마력도 기술도 월등했지만, 곤충 텔레파시를 창의적으로 이용해서 격퇴할 수 있었습니다. 교훈이 뭐냐구요? '약해' 보이는 마법도 무시하면 안 된다는 겁니다." },
  { id: 'purth', title: '퍼르스', cost: '축복 점수 5점', imageSrc: '/images/Dg6nz0R1-purth.png', description: "이 표식은 당신이 축복을 한 차원 더 높게 이해하게 되었고, 그에 따라 가지고 있는지도 몰랐던 힘을 해방하게 되었음을 의미합니다. 평균적인 마법소녀에게는 이 정도의 힘이 최대한의 전력일 것입니다. 뭐, 거기에 주스 표식 하나 정도 추가할 수는 있겠죠." },
  { id: 'juathas', title: '자타스', cost: '축복 점수 8점', imageSrc: '/images/SFbsP2R-juathas.png', description: "가장 이름값 높은 표식입니다. 새로운 축복을 얻게 되었음을 나타내기 때문이지요. 대단한 용기를 보이거나, 어머니의 딸들 중 하나에게 깊은 인상을 남기거나, 수많은 훈련을 통해 개인의 잠재력을 개화시킨 이들만이 이 표식을 얻을 수 있습니다." },
];

export const SPECIAL_SIGILS_DATA: Sigil[] = [
  { 
    id: 'xuth', 
    title: 'XUTH', 
    cost: 'Costs -12 BP per trial', 
    imageSrc: '/images/rfs5FtF3-xuth.png', 
    description: "The grandest sigils, the absolute pinnacles of their respective blessings. They were possessed by all during the Sinjade Doctrine, but nowadays, only rare and particularly powerful mages have any hope of obtaining one.",
    subOptions: [
      { id: 'xuth_trial_1', imageSrc: '/images/h3FPzxn-xuth1.jpg', description: "Hosted by the Strasmiara, the Irrun Gauntlet can be considered the \"final exam\" of one's mage training, and one that only about 1% of mages even come close to passing. It is hosted with the Virinthian Core, a great vessel of magical energy, at the very center of Valsereth, which is able to read your mind and restructure itself in accordance with your powers. It caters itself to your strengths; for example, if you are an all-rounder, it will test all of those abilities, while if you are a specialist, it'll push that skill to the test. However, it will also detect your every weakness, every flaw and insecurity, and absolutely brutally punish them. It will even dredge up traumas and regrets. You'll have to absolutely overcome your every failing, or you'll be devastated." },
      { id: 'xuth_trial_2', imageSrc: '/images/PsWVCWVV-xuth2.png', description: "After the archlich Elvira was captured, the members of her inner cabinet fell further into cruelty and insanity, to the point even the covens ousted them and left them to fend for themselves. They decided exploiting the Schism, a distorted rupture brought about by a destabilization of our reality, could be their way of achieving a false Theosis and becoming gods. Of course, it went horribly, and left them these... creatures known as the Sellith. They have just about every power you can imagine, but are too delirious to use them smartly, mostly throwing out devastating spells at random. They are faster and more durable than any mage, so you'll have to corner the thing. Killing one is considered harder than slaying a Grimsayer, so expect the fight of your life!" },
    ]
  },
  { 
    id: 'lekolu', 
    title: 'LEKOLU', 
    cost: 'Costs -4 BP and -6 FP per job', 
    imageSrc: '/images/DD9xYmP9-lekolu.png', 
    description: "Earth is currently a post-scarcity environment as far as necessities go, but artificial scarcity is created for luxuries and brand commodities. Proprietary sigils are the most controversial, yet most profitable, of these.",
    subOptions: [
      { id: 'lekolu_job_1', imageSrc: '/images/Dh3rP3K-lekolu1.jpg', description: "Spend a few weeks hyping up a brand new product to make sure it succeeds. Participate in press tours, model in marketing photos, and even star in commercials. You'll only be fully rewarded if the product gets enough sales, so do your best to get people excited!" },
      { id: 'lekolu_job_2', imageSrc: '/images/d0sX3Sq7-lekolu2.jpg', description: "Pretty much every big-budget movie these days is made by a big company to improve their brand image. All you have to do is accept a role in one of these blockbuster films in which the corporation inevitably saves the day. At least acting is pretty fun." },
      { id: 'lekolu_job_3', imageSrc: '/images/xtB6Ynf1-lekolu3.jpg', description: "You know the old mantra: {i}all{/i} publicity is good publicity. You'll be working directly with a corporate celebrity to stir up some huge scandal or drama! Stir up outrage while running damage control to keep it in the goldilocks zone of outrageous yet forgivable." },
      { id: 'lekolu_job_4', imageSrc: '/images/qFLBx3v6-lekolu4.jpg', description: "Your employer wants you to infiltrate a rival company (either by posing as an employee, or through sheer stealthiness) and steal one of their trade secrets! Sure, corporate espionage is technically illegal, but it's not like that law is ever enforced. Go nuts!" },
    ]
  },
  { 
    id: 'sinthru', 
    title: 'SINTHRU', 
    cost: 'Costs -10 BP per favor', 
    imageSrc: '/images/nq80Y3pk-sinthru.png', 
    description: "With great power grandfathered in from the Sinthru Doctrine, certain ancient covens offer those ambitious souls who serve their whims great and illicit powers. These sigils are as forbidden as they come, but coveted all the same.",
    subOptions: [
      { id: 'sinthru_favor_1', imageSrc: '/images/WNpHjXvV-sinthru1.jpg', description: "You must destroy one of the Effigies of the Mother, weakening her ability to survey the realm. They are placed in heavily guarded temples all around the globe. Pull off a stealthy heist, or prepare for battle against multiple mages. Look out for booby traps!" },
      { id: 'sinthru_favor_2', imageSrc: '/images/xKDTS4fz-sinthru2.jpg', description: "You must help a few coven members get set up in a city they do not yet have a hideout in. This will be a game of discretion; bribing and fooling guards, smuggling in contraband reagents, securing a base, and wiping the memories of any witnesses." },
      { id: 'sinthru_favor_3', imageSrc: '/images/7xVHmzfT-sinthru3.png', description: "They'll tell you how to avoid every boobytrap in an old Sinthru stash from before the war, then, all you have to worry about is defeating the hellbeasts they left inside, and bringing them back their old gear. Definitely a good job for those who prefer to be more direct." },
      { id: 'sinthru_favor_4', imageSrc: '/images/G4X09cp8-sinthru4.png', description: "This task is simple: the covens ask that another mage be killed, so that they may gorge themselves upon their soul. Will you target a deserving fiend? Or ambush an unlucky innocent? The choice is yours, for it makes no difference to them whether the soul is pure." },
    ]
  },
];

export const SPECIAL_SIGILS_DATA_KO: Sigil[] = [
  { 
    id: 'xuth', 
    title: '주스', 
    cost: '시련당 축복 점수 -12', 
    imageSrc: '/images/rfs5FtF3-xuth.png', 
    description: "한 축복의 정점에 있는 가장 위대한 표식입니다. 신제이드 대원칙이 적용되던 시기에는 모두가 가질 수 있었지만, 지금은 아주 강력한 극소수의 마법소녀들만이 하나를 얻을까 말까 한 정도입니다.",
    subOptions: [
      { id: 'xuth_trial_1', imageSrc: '/images/h3FPzxn-xuth1.jpg', description: "스트라스미아라에서 주최하는 이룬의 건틀릿은 마법소녀 육성 과정의 \"최종 시험\"이라고 할 수 있습니다. 통과 가능성이 있는 마법소녀들이 전체의 1%에 불과할 정도입니다. 이 행사는 발세레스의 중심부에 위치한 거대한 마력원인 바이린티아의 핵에서 주최되는데, 이 핵은 당신의 마음을 읽고 당신이 보유한 능력에 맞춰 구조를 변형할 수 있습니다. 당신이 가진 힘 자체가 시험대에 오르게 됩니다. 만약 당신이 올라운더라면 모든 능력을 시험받게 되고, 한 능력에 특화되어 있다면 그 능력의 한계를 시험받겠죠. 하지만 동시에 당신의 모든 약점과 불안함, 결점이 노출되어 무자비한 응징을 받을 것입니다. 가장 깊은 후회와 트라우마를 끄집어 낼지도 모릅니다. 모든 실패를 극복하고 넘어서지 못한다면, 당신은 통과하지 못할 것입니다." },
      { id: 'xuth_trial_2', imageSrc: '/images/PsWVCWVV-xuth2.png', description: "고위 리치 엘비라가 생포된 후, 그녀의 최측근들은 더욱 깊은 광기와 잔혹성의 늪에 빠졌습니다. 결국 휘하 마녀단마저 그들에게 등을 돌리게 되자, 그들은 시키즘을 이용하고자 하였습니다. 현실의 불안정성에서 비롯된 왜곡된 균열을 통해 가짜 신성을 얻고 신의 반열에 서고자 했지만, 참혹한 실패 뒤에 남은 것은... '셀리스'라 불리는 생물들이었습니다. 이들의 힘은 가공할 수준이지만, 그 힘을 알맞게 사용할 정신이 없습니다. 이들은 그저 파괴적인 마법을 아무 전략 없이 난사할 뿐입니다. 일반적인 마녀들보다 훨씬 빠르고 강인하기 때문에, 한 구석에 몰아놓아야 할 겁니다. 셀리스를 죽이는 것은 그림세이어보다 훨씬 어렵다고들 합니다. 목숨을 걸어야 할 거에요!" },
    ]
  },
  { 
    id: 'lekolu', 
    title: '레콜루', 
    cost: '일당 축복 점수 -4, 행운 점수 -6', 
    imageSrc: '/images/DD9xYmP9-lekolu.png', 
    description: "이 세계에는 생필품은 풍족하지만, 사치품이나 브랜드 물품은 어느 정도 공급량이 제한됩니다. 이 자본주의의 표식은 가장 많은 논란의 대상이 되지만 그 수익성은 확실합니다.",
    subOptions: [
      { id: 'lekolu_job_1', imageSrc: '/images/Dh3rP3K-lekolu1.jpg', description: "몇 주 동안 신상품 하나를 열심히 팔아야 합니다. 언론 투어에 참가하거나, 마케팅 모델로 서거나, 필요하다면 광고도 찍어야겠죠. 상품이 대박을 쳐야만 보상을 받을 수 있기 때문에, 최선을 다해 사람들을 끌어모아 보세요!" },
      { id: 'lekolu_job_2', imageSrc: '/images/d0sX3Sq7-lekolu2.jpg', description: "요즘 고예산 영화라고 하면 대기업들이 브랜드 이미지 제고를 위해 찍는 경우가 많습니다. 당신은 한 회사가 결국 세계를 구한다는 내용의 블록버스터 영화에 출연하기만 하면 됩니다. 연기하는 것도 꽤 재미있어요." },
      { id: 'lekolu_job_3', imageSrc: '/images/xtB6Ynf1-lekolu3.jpg', description: "옛말에 틀린 건 없습니다. 유명한 건 그냥 좋은 거에요. 당신은 거물 기업가와 협력해서 커다란 스캔들 같은 걸 터뜨리게 될 겁니다! 사람들은 열받겠지만, 그걸 어떻게 교묘하게 조절하면 열받는데 미워할 수 없는 이미지 마케팅을 할 수 있죠." },
      { id: 'lekolu_job_4', imageSrc: '/images/qFLBx3v6-lekolu4.jpg', description: "당신을 고용한 회사 측에서 경쟁 회사에 잠입해서 (사원으로 위장하든 그냥 은신해 들어가든) 기업 비밀을 빼 와 달라고 합니다! 산업 스파이는 물론 불법이지만, 뭐 누가 그 법을 무서워하나요. 제대로 미쳐 볼까요!" },
    ]
  },
  { 
    id: 'sinthru', 
    title: '신스루', 
    cost: '요청당 축복 점수 -10', 
    imageSrc: '/images/nq80Y3pk-sinthru.png', 
    description: "신스루 대원칙 하에서 강력한 힘을 독점적으로 손에 넣게 된 몇몇 고대의 마녀단들은 그들을 따르는 야심 넘치는 마법소녀들에게 이 표식을 내려 줍니다. 이 표식과 그에 따라오는 힘은 금지된 만큼 강력하고, 많은 이들이 탐내고는 합니다.",
    subOptions: [
      { id: 'sinthru_favor_1', imageSrc: '/images/WNpHjXvV-sinthru1.jpg', description: "어머니의 신상 중 하나를 파괴해서 이 세계를 살피는 힘을 약화시켜야 합니다. 신상은 이 세계 곳곳에 있는 사원 안에 배치되어 엄중한 경비를 받고 있습니다. 은밀히 신상을 훔쳐 내거나, 수많은 마녀들과 맞서 싸워야 할 겁니다. 함정도 물론 조심해야 하구요!" },
      { id: 'sinthru_favor_2', imageSrc: '/images/xKDTS4fz-sinthru2.jpg', description: "마녀단 단원들이 새로운 도시에 교단 은신처를 세우는 것을 도와야 합니다. 아주 신중하게 일을 처리해야겠죠. 치안대원들에게 뇌물을 주거나 속이고, 밀수 약물을 들여오고, 안전한 거점을 잡고, 혹시나 목격자가 생기면 모든 기억을 지워야 합니다." },
      { id: 'sinthru_favor_3', imageSrc: '/images/7xVHmzfT-sinthru3.png', description: "전쟁 이전에 세워진 고대의 신스루 창고에 있는 함정을 피하는 법은 마녀단에서 알려 줄 겁니다. 그러면 당신이 그곳에 들어가 아직까지 남아 있는 지옥야수들을 처치하고 마녀단의 옛 장비들을 회수해 와야 합니다. 직접적인 방식을 선호하는 사람들에게는 안성맞춤이지요." },
      { id: 'sinthru_favor_4', imageSrc: '/images/G4X09cp8-sinthru4.png', description: "마녀단에서 그들이 영혼을 포식할 수 있도록 다른 마법소녀를 죽이라고 합니다. 친구를 배신하겠습니까? 무고한 이를 습격하겠습니까? 선택은 당신의 몫입니다. 사실 그 쪽에서는 영혼의 순수성 같은 건 상관하지 않으니까요." },
    ]
  },
];
