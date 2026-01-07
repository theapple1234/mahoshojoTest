
import type { Dominion, Trait, ChoiceItem } from '../types';

export const DOMINIONS: Dominion[] = [
  {
    id: 'halidew',
    title: 'HALIDEW STATION',
    description: "The most powerful dominion, consisting of beautiful flying cities hovering above the immense void that was once the Atlantic Ocean. It is a center of industry and innovation; almost all new developments in spellcraft and magitech come from this Dominion's brilliant engineers. Mages from here love magitech and creativity.",
    imageSrc: '/images/b5dC1Bq2-reg1.jpg',
  },
  {
    id: 'shinar',
    title: 'SHINAR',
    description: "Centered around the Tower of Babel, this is the most ancient home of mages on Earth, and the very ground hums with magical radiance from the eons of spells cast upon its surface. It has a rather spooky aesthetic, and is host to countless mysterious, millenia-old families and clans, honing their trades in private. Mages from here love dark magic and secrecy.",
    imageSrc: '/images/qMRNWChB-reg2.jpg',
  },
  {
    id: 'unterseeisch',
    title: 'THE UNTERSEEISCH',
    description: "Starting as refugee havens as the Sinthru Uprising battered the surface, countless cities and treasure-laden ruins riddle the surface of the Pacific. Thanks to various enchantments, residents can breathe and walk around underwater just as easily as on land. Tech and magic live in harmony, and it's very laid-back. Mages from here love telepathy and charisma.",
    imageSrc: '/images/r2cmFftZ-reg3.jpg',
  },
  {
    id: 'valsereth',
    title: 'VALSERETH',
    description: "To call it subterranean is misleading; in reality, the Earth is a flat disk, and this Dominion hangs from its underbelly, above the beautiful bright void we call the Othersky. This ancient magocratic society shuns technology, and its brilliant intelligentsia is dedicated to pushing Blessings to their absolute limit. Mages from here love metamagic and shows of power.",
    imageSrc: '/images/vSVGFj5-reg4.png',
  },
  {
    id: 'gohwood',
    title: 'GOHWOOD',
    description: "A snowy, feudal land still proud of its heritage and rooted in its own political traditions. It's famous for its great and honorable knights, who were instrumental in fighting off the Sinthru Covens all those years ago. They don't shun technology like Valsereth, but look down strongly upon any overreliance. Mages from here love alchemy and fair combat.",
    imageSrc: '/images/5WTT1tLz-reg5.jpg',
  },
  {
    id: 'palisade',
    title: 'NEW PALISADE',
    description: "The most population dense Dominion by far, but Mages are very rare; high technology is generally preferred over magic here, since the latter tends to interfere with nearby electronic devices. Still, there's room to break through the stigma and become a big celebrity. Perfect for those who like hustle and bustle. Mages from here love technomancy and grandiosity.",
    imageSrc: '/images/YBBmyzfn-reg6.jpg',
  },
  {
    id: 'rovines',
    title: 'THE ROVINES',
    description: "What's left of much of Europe: concrete ruins rising above the Baltic Sea which floods the place. No central government. Instead, all sorts of people build small settlements among the ruins, creating a diaspora of cultures. Very massive and low density - perfect for those who prefer quiet, rural living. Mages from here love being well-rounded jacks-of-all-trades.",
    imageSrc: '/images/wrgYvcdy-reg7.jpg',
  },
  {
    id: 'jipangu',
    title: 'JIPANGU',
    description: "An island locked in an eternal autumn, where new innovations coexist with ancient traditions. Not too big, but with the highest density of mages in the world, and they are particularly venerated here, with each getting their own shrine for their fans and even their worshippers to congregate at. Mages here love individuality and creating unique spells.",
    imageSrc: '/images/Myq2fqzT-reg8.jpg',
  },
];

export const DOMINIONS_KO: Dominion[] = [
  {
    id: 'halidew',
    title: '할리듀 스테이션',
    description: "가장 국력이 강한 지역으로, 한 때 대서양이라 불렸던 거대한 공허를 맴도는, 아름다운 비행 도시 국가입니다. 이곳은 산업과 혁신의 중심가장 우수한 공학자들이 끊임없이 마술과 마법공학에서 새로운 성과를 내고 있습니다. 이곳의 마녀들은 마법공학과 창의성을 좋아합니다.",
    imageSrc: '/images/b5dC1Bq2-reg1.jpg',
  },
  {
    id: 'shinar',
    title: '시나르',
    description: "바벨탑을 중심으로 한 이곳은 지구상에서 가장 오래된 마법사들의 나라입니다. 이곳의 땅은 오랜 세월 동안 시전되었던 수많은 마법들이 남긴 광채로 은은히 빛나고 있습니다. 다소 으스스한 미관을 가지고 있고, 유서깊고 신비로운 가문과 연맹들이 조용히 능력을 갈고닦고 있습니다. 이곳의 마녀들은 흑마법과 비밀을 좋아합니다.",
    imageSrc: '/images/qMRNWChB-reg2.jpg',
  },
  {
    id: 'unterseeisch',
    title: '운터시쉬',
    description: "이곳의 전신은 신스루의 난이 전세계를 강타했을 때 난민들이 도망쳐 온 피난처였습니다. 지금은 셀 수 없는 도시와 보물로 가득찬 폐허가 태평양 표면을 뒤덮고 있습니다. 다양한 강화 마법 덕분에, 거주민들은 바다 속에서도 지상에서처럼 숨쉬고 걸어다닐 수 있습니다. 기술과 마법이 조화를 이루고 있고, 매우 여유롭습니다. 이곳의 마녀들은 텔레파시와 카리스마를 좋아합니다.",
    imageSrc: '/images/r2cmFftZ-reg3.jpg',
  },
  {
    id: 'valsereth',
    title: '발세레스',
    description: "이 곳을 지하라 부르는 것은 오해의 소지가 있습니다. 실제로는, 지구는 평평한 판이고, 이곳은 지구의 아랫면에 매달린 형상으로, 우리가 아더스카이라 부르는 아름답고 밝은 공허 위에 있습니다. 이 고대의 마법제일주의 사회는 기술을 배격하며, 최고의 지식인들이 그들에게 주어진 축복의 극한을 시험하는 데 전념하고 있습니다. 이곳의 마녀들은 메타마법과 힘의 과시를 좋아합니다.",
    imageSrc: '/images/vSVGFj5-reg4.png',
  },
  {
    id: 'gohwood',
    title: '고흐우드',
    description: "이 눈 덮인 땅에는 아직도 봉건주의가 성행하며, 이곳 사람들은 그들의 유산을 자랑스럽게 여기며 그들만의 정치적인 전통을 철저히 따릅니다. 고흐우드는 위대하고 긍지 높은 기사들이 있는 것으로 유명합니다. 한때 이 기사들이 신스루 마녀단의 침공을 막아내는 데 결정적인 역할을 했습니다. 발세레스만큼 기술을 천시하지는 않지만, 기술에 과도헤게 의존하는 것은 하등하게 취급합니다. 이곳의 마녀들은 연금술과 공정한 전투를 좋아합니다.",
    imageSrc: '/images/5WTT1tLz-reg5.jpg',
  },
  {
    id: 'palisade',
    title: '뉴 팰리세이드',
    description: "가장 인구가 많은 지역이지만, 마녀들의 수는 가장 적습니다. 이곳은 마법보다는 기술을 선호하는데, 마법이 전자 장비에 간섭하는 경우가 많기 때문입니다. 물론 편견을 딛고 유명한 마녀가 되는 것도 충분히 가능합니다. 이곳은 복잡한 도시의 삶을 좋아하는 이들에게 안성맞춤이며, 이곳의 마녀들은 기계마법과 화려함을 좋아합니다.",
    imageSrc: '/images/YBBmyzfn-reg6.jpg',
  },
  {
    id: 'rovines',
    title: '로바인',
    description: "한때 유럽이 있던 곳은 넘쳐흐른 발트 해 밑에 대부분 잠겼고, 콘크리트 폐허들만이 수면 위로 모습을 드러내고 있을 뿐입니다. 이곳에는 중앙 정부가 없고, 대신 온갖 사람들이 폐허 위에 작은 터전을 짓고 각양각색의 문화를 이루며 살아가고 있습니다. 지역은 아주 넓지만 인구는 적어서, 조용하고 목가적인 삶을 원하는 이들에게 안성맞춤입니다. 이곳의 마녀들은 팔방미인이 되는 것을 좋아합니다.",
    imageSrc: '/images/wrgYvcdy-reg7.jpg',
  },
  {
    id: 'jipangu',
    title: '지팡구',
    description: "새로운 발명과 옛 전통이 공존하는 이 섬은 일 년 내내 가을입니다. 아주 크지는 않지만, 마녀들의 인구 밀도는 가장 높습니다. 마녀들은 이곳에서 특별히 존경을 받아서, 팬들이나 추종자들이 결집할 수 있는 사원을 제공받을 정도입니다. 이곳의 마녀들은 개성과 고유한 마법의 창조를 좋아합니다.",
    imageSrc: '/images/Myq2fqzT-reg8.jpg',
  },
];

export const TRAITS_DATA: { positive: Trait[]; negative: Trait[] } = {
  positive: [
    { id: 'blessed', title: 'BLESSED (Female only)', cost: 'Costs -5 FP and -5 BP', description: "She's a Mage, just like you! Design her using {w}35 Companion Points{/w} on the {i}Reference Page{/i}.", imageSrc: '/images/8DqmDb6G-trait1.jpg' },
    { id: 'badass', title: 'BADASS', cost: 'Costs -3 FP', description: "Either they've got combat experience, or they're just naturally tough. Either way, bullies should beware!", imageSrc: '/images/Xr7fHNtn-trait2.jpg' },
    { id: 'brilliant', title: 'BRILLIANT', cost: 'Costs -3 FP', description: "They've got a genius-level IQ and tons to teach you! Expect to get lots of help on your homework.", imageSrc: '/images/zVHYbNP3-trait3.jpg' },
    { id: 'role_model', title: 'ROLE MODEL', cost: 'Costs -3 FP', description: "Hard-working, altruistic, kind... they're the pinnacle of whatever you consider the ideal kind of person to be.", imageSrc: '/images/ynWbvQDM-trait4.jpg' },
    { id: 'loaded', title: 'LOADED (Parent only)', cost: 'Costs -3 FP', description: "They have an extremely high-paying and prestigious job that lets them spoil you to your heart's content.", imageSrc: '/images/zVSFJtb1-trait5.png' },
    { id: 'doting', title: 'DOTING', cost: 'Costs -2 FP', description: "Even for family, they are incredibly affectionate, and would happily lay down their life for you.", imageSrc: '/images/tMpfkNv9-trait6.jpg' },
    { id: 'peas_in_pod', title: 'PEAS IN A POD', cost: 'Costs -2 FP', description: "You share very similar beliefs, hobbies, opinions, energies, and are generally on the same wavelength.", imageSrc: '/images/DHxhyT7q-trait7.jpg' },
    { id: 'creative_savant', title: 'CREATIVE SAVANT', cost: 'Costs -2 FP', description: "They're a prodigy in some manner of creative trade, and more than happy to make you stuff or teach you.", imageSrc: '/images/fzkT0NmL-trait8.jpg' },
    { id: 'forgiving', title: 'FORGIVING (Parent/Older Sibling only)', cost: 'Costs -2 FP', description: "Incompatible with {i}Strict{/i}. They act more like a buddy than like a parent, letting you get away with more.", imageSrc: '/images/zpqcBcj-trait9.jpg' },
    { id: 'stacked', title: 'STACKED', cost: 'Costs -2 FP', description: "They are the pinnacle of physical fitness and can help train your strength both in body and mind.", imageSrc: '/images/B2R7xKPZ-trait10.png' },
    { id: 'handyman', title: 'HANDYMAN', cost: 'Costs -1 FP', description: "They have a near supernatural ability to quickly repair anything and keep the home in perfect order.", imageSrc: '/images/8gPMHYhq-trait11.jpg' },
    { id: 'great_chef', title: 'GREAT CHEF', cost: 'Costs -1 FP', description: "Everyone begs to try their cooking after hearing about the restaurant-quality meals they whip up!", imageSrc: '/images/d4KwzR5n-trait12.png' },
  ],
  negative: [
    { id: 'bombshell', title: 'BOMBSHELL', cost: 'Costs -1 FP', description: "\"Stacy's mom has got it goin' on!\" Expect this to earn you cheap popularity with your peers.", imageSrc: '/images/JjhhzkSX-trait13.jpg' },
    { id: 'strict', title: 'STRICT (Parent/Older Sibling only)', cost: 'Grants +2 FP', description: "Incompatible with {i}Forgiving{/i}. They just want what's best for you, but they can be pretty unfair at times...", imageSrc: '/images/Hpdvh0fR-trait14.png' },
    { id: 'disobedient', title: 'DISOBEDIENT (Younger Sibling only)', cost: 'Grants +2 FP', description: "They have a strong urge to rebel against you and any other authority, and generally cause lots of trouble.", imageSrc: '/images/PzbJ3N0G-trait15.png' },
    { id: 'physically_disabled', title: 'PHYSICALLY DISABLED', cost: 'Grants +4 FP', description: "They are a pseudo-Distortion who will need extra help with even basic physical activities.", imageSrc: '/images/JRS2dKRw-trait16.jpg' },
    { id: 'mentally_disabled', title: 'MENTALLY DISABLED', cost: 'Grants +6 FP', description: "They are a pseudo-Distortion who will struggle taking care of themselves, much less others.", imageSrc: '/images/JwhhmZ0S-trait17.jpg' },
    { id: 'abusive', title: 'ABUSIVE (Parent only)', cost: 'Grants +12 FP', description: "How'd someone this {i}vile{/i} even get past the selection process? Somebody must have been bribed!", imageSrc: '/images/ym2nRyGv-trait18.png' },
  ]
};

export const TRAITS_DATA_KO: { positive: Trait[]; negative: Trait[] } = {
  positive: [
    { id: 'blessed', title: '축복받음 (여자만)', cost: 'Costs -5 FP and -5 BP', description: "그녀는 당신과 같은 마녀입니다! 참고 페이지에서 동료 점수 35점을 사용하여 디자인할 수 있습니다.", imageSrc: '/images/8DqmDb6G-trait1.jpg' },
    { id: 'badass', title: '싸움을 잘함', cost: 'Costs -3 FP', description: "실전 경험이 있거나 그냥 선천적으로 되게 셉니다. 일진들은 조심해야겠네요!", imageSrc: '/images/Xr7fHNtn-trait2.jpg' },
    { id: 'brilliant', title: '총명함', cost: 'Costs -3 FP', description: "IQ가 천재 수준이고, 당신에게 가르쳐 줄 것이 아주 많습니다! 숙제하다가 막혀도 걱정은 없겠죠.", imageSrc: '/images/zVHYbNP3-trait3.jpg' },
    { id: 'role_model', title: '롤모델', cost: 'Costs -3 FP', description: "근면성실, 이타심, 친절함... 당신이 되고 싶어하는 바로 그런 사람입니다.", imageSrc: '/images/ynWbvQDM-trait4.jpg' },
    { id: 'loaded', title: '금수저 (부모님만)', cost: 'Costs -3 FP', description: "돈도 많이 벌고 명망높은 직업에 종사하십니다. 당신이 원하는 건 뭐든 오냐오냐 들어 주실 거에요.", imageSrc: '/images/zVSFJtb1-trait5.png' },
    { id: 'doting', title: '애지중지', cost: 'Costs -2 FP', description: "가족이라지만 당신을 끔찍이 아낍니다. 당신을 위해서라면 목숨도 내놓을 겁니다.", imageSrc: '/images/tMpfkNv9-trait6.jpg' },
    { id: 'peas_in_pod', title: '똑같이 닮은', cost: 'Costs -2 FP', description: "가치관이나 취미, 생각 등이 아주 비슷하고, 마음도 잘 맞습니다.", imageSrc: '/images/DHxhyT7q-trait7.jpg' },
    { id: 'creative_savant', title: '창의적인 천재', cost: 'Costs -2 FP', description: "뭔가 만들어내는 일에 뛰어난 재주가 있습니다. 기꺼이 당신에게 한 수 가르쳐 주거나 선물을 해 줄 거에요.", imageSrc: '/images/fzkT0NmL-trait8.jpg' },
    { id: 'forgiving', title: '너그러움 (부모님, 손위형제만)', cost: 'Costs -2 FP', description: "엄격함과 같이 선택할 수 없습니다. 당신을 친구처럼 대하고, 많이 혼내지 않을 겁니다.", imageSrc: '/images/zpqcBcj-trait9.jpg' },
    { id: 'stacked', title: '탄탄함', cost: 'Costs -2 FP', description: "몸 좋기로는 따라갈 사람이 없습니다. 당신의 몸도 마음도 강하게 단련시켜 줄 수도 있습니다.", imageSrc: '/images/B2R7xKPZ-trait10.png' },
    { id: 'handyman', title: '손재주', cost: 'Costs -1 FP', description: "집에 뭐가 고장났다 하면 바로 순식간에 고쳐 냅니다. 거의 초능력이에요.", imageSrc: '/images/8gPMHYhq-trait11.jpg' },
    { id: 'great_chef', title: '뛰어난 셰프', cost: 'Costs -1 FP', description: "레스토랑 뺨치는 요리를 한다는 말을 듣고 아주 사람들이 줄을 섰습니다!", imageSrc: '/images/d4KwzR5n-trait12.png' },
  ],
  negative: [
    { id: 'bombshell', title: '섹시도발', cost: 'Costs -1 FP', description: "\"진짜 끝내준다니까!\" 동기들 사이에서 값싼 인기를 얻을 수 있게 되겠죠.", imageSrc: '/images/JjhhzkSX-trait13.jpg' },
    { id: 'strict', title: '엄격함 (부모님, 손위형제만)', cost: 'Grants +2 FP', description: "너그러움과 같이 선택할 수 없습니다. 다 당신을 위한 거겠지만, 가끔은 너무 심할 때도 있을 거에요...", imageSrc: '/images/Hpdvh0fR-trait14.png' },
    { id: 'disobedient', title: '불손함 (손아래 형제만)', cost: 'Grants +2 FP', description: "당신이 됐든 다른 어른들이 됐든 말을 잘 안 듣습니다. 온갖 사고를 치고 다닐 때도 많구요.", imageSrc: '/images/PzbJ3N0G-trait15.png' },
    { id: 'physically_disabled', title: '신체 장애', cost: 'Grants +4 FP', description: "가장 기본적인 신체 활동에도 도움이 필요한 가왜곡체입니다.", imageSrc: '/images/JRS2dKRw-trait16.jpg' },
    { id: 'mentally_disabled', title: '지적 장애', cost: 'Grants +6 FP', description: "남들을 돕는 건 고사하고 자기 앞가림 하기도 힘들어하는 가왜곡체입니다.", imageSrc: '/images/JwhhmZ0S-trait17.jpg' },
    { id: 'abusive', title: '학대 (부모님만)', cost: 'Grants +12 FP', description: "이렇게 사악한 사람이 애초에 어떻게 선정된 거죠? 분명 누가 뇌물을 받은 거에요!", imageSrc: '/images/ym2nRyGv-trait18.png' },
  ]
};

export const HOUSES_DATA: ChoiceItem[] = [
  { id: 'ragamuffin', title: 'RAGAMUFFIN', cost: 'Grants +15 FP', description: "Required if no parents or older sibling. Requires 0 parents. Cannot take vacation homes or upgrades. Mage childrearing programs are usually near flawless, yet you somehow fell through the cracks! Did you run away, or get abandoned? Whatever the case, you're out on the streets, kiddo.", imageSrc: '/images/QjPxQPL4-home1.jpg' },
  { id: 'apartment', title: 'APARTMENT', cost: 'Costs -0 FP', description: "This category can also include duplexes, lofts, and even modest cabins. Of course, even the most modest of accommodations for a mage are pretty comfy and luxurious, so you'll have around 2,000 sq ft of floor space with all the modern comforts. Your bedroom will be pretty huge, too!", imageSrc: '/images/ccjnQ9xK-home2.jpg' },
  { id: 'house', title: 'HOUSE', cost: 'Costs -2 FP', description: "Even more roomy and comfortable than most apartments, at 4,000 sq ft total, and even features a second floor for extra privacy. Enchantments allow the house to clean itself automatically, a restaurant-worthy kitchen, and a bunch of extra rooms that can be customized freely.", imageSrc: '/images/CKG1XFSL-home3.jpg' },
  { id: 'luxury_suite', title: 'LUXURY SUITE', cost: 'Costs -5 FP', description: "You're really living like a king now! Everything from the doorknobs to the curtains oozes wealth and excess, and you can control the various devices in the house in a million different ways with your thoughts alone. At 6,000 sq ft, you'll have plenty of room to work with.", imageSrc: '/images/5gVy8qfp-home4.jpg' },
  { id: 'mansion', title: 'MANSION', cost: 'Costs -7 FP', description: "The most opulent sort of home imaginable. Robot butlers make you breakfast in bed, telepathic sensors detect the perfect level of warmth for your blankets at night as well as surrounding you with comforting illusions. The works. Starts at 8,000 sq ft, but can buy more for {g}-1 FP{/g} per 1,000 sq ft.", imageSrc: '/images/hJ6HptD1-home5.jpg' },
];

export const HOUSES_DATA_KO: ChoiceItem[] = [
  { id: 'ragamuffin', title: '부랑자', cost: 'Grants +15 FP', description: "부모님이 없다면 반드시 선택해야 합니다. 휴가지나 집 업그레이드를 선택할 수 없습니다. 마법소녀 양육 프로그램은 거의 실수 없이 돌아가는데, 어쩌다 보니 당신이 누락됐네요! 혹시 도망갔거나 버려졌기 때문일까요? 사정이야 어떻든 간에, 이제 당신은 거리에서 살아가야 합니다.", imageSrc: '/images/QjPxQPL4-home1.jpg' },
  { id: 'apartment', title: '아파트', cost: 'Costs -0 FP', description: "복층 구조나 소박한 주택 같은 것도 포함됩니다. 물론 마법소녀가 사는 집이니만큼 아무리 소박해도 꽤 근사하고 편안합니다. 최신 문명의 이기를 다 들여놓은 55평 정도의 집이 제공됩니다. 침실도 꽤 넓을 거에요!", imageSrc: '/images/ccjnQ9xK-home2.jpg' },
  { id: 'house', title: '주택', cost: 'Costs -2 FP', description: "대부분의 아파트보다 훨씬 크고 편합니다. 100평을 살짝 넘기는데다 사생활 보장을 위한 2층까지 있습니다. 주택에는 마법이 걸려 청소가 자동으로 이루어지고, 주방은 레스토랑 부럽지 않습니다. 그리고 입맛대로 꾸밀 수 있는 여분의 방이 몇 칸 제공됩니다.", imageSrc: '/images/CKG1XFSL-home3.jpg' },
  { id: 'luxury_suite', title: '럭셔리 스위트', cost: 'Costs -5 FP', description: "이게 정말 왕 같은 삶이죠! 문고리부터 커튼까지 부티가 좔좔 흐릅니다. 집안에 있는 수많은 가구와 장비들을 생각만 하면 이리저리 움직이고 조종할 수도 있습니다. 크기도 160평 정도니까 공간 모자랄 일은 없을 거에요.", imageSrc: '/images/5gVy8qfp-home4.jpg' },
  { id: 'mansion', title: '대저택', cost: 'Costs -7 FP', description: "상상할 수 있는 가장 호화로운 집입니다. 아침에 일어나면 로봇 집사들이 침실까지 아침 식사를 가져오고, 밤에 잘 때는 텔레파시 센서를 통해 최적의 온도가 유지되고 마음이 편안해지는 풍경까지 보입니다. 아주 예술이죠. 기본적으로 220평 정도이고 행운 점수 1점을 추가로 투자할 때마다 28평씩 늘어납니다.", imageSrc: '/images/hJ6HptD1-home5.jpg' },
];

export const HOUSE_UPGRADES_DATA: ChoiceItem[] = [
  { id: 'mythical_pet', title: 'MYTHICAL PET', cost: 'Costs -5 FP and -5 BP', description: "You have a mystical pet that has run down your family line for many generations. Spend {w}30 Beast Points{/w} designing it on the {i}Reference Page{/i}. Know that, if it dies, it dies for good, however.", imageSrc: '/images/j94x4Nv3-uph1.png' },
  { id: 'swimming_pool', title: 'SWIMMING POOL', cost: 'Costs -2 FP', description: "Varies in size depending on the size of your property: with a mansion and private island, it's basically a private water park! Can be equipped with waterslides, lazy rivers, hot tubs, and et cetera.", imageSrc: '/images/LdZDPHCg-uph5.png' },
  { id: 'farmer', title: 'FARMER', cost: 'Costs -0 FP', description: "Your property doubles as a farm or a ranch for beasts! On the upside, it's a cooler, more bustling place to live. On the downside, it's more dirty and smelly, and you'll have to do farmyard chores.", imageSrc: '/images/Y4TLvRsG-uph9.png' },
  { id: 'virtual_reality', title: 'VIRTUAL REALITY CHAMBER', cost: 'Costs -5 FP or -2 BP', description: "Powered either by technology or magic, this chamber allows you to vividly enjoy all kinds of downloadable experiences in the Web. It feels so real! Just be careful not to get too addicted...", imageSrc: '/images/KxxmWqRX-uph2.png' },
  { id: 'home_entertainment', title: 'HOME ENTERTAINMENT', cost: 'Costs -2 FP', description: "This consists of two large rooms: your very own home theater with comfy, reclinable leather seats, and an entire arcade boasting all the greatest games! Expect your friends to be begging to come over.", imageSrc: '/images/G331qGrn-uph6.png' },
  { id: 'creepy_crawlies', title: 'CREEPY CRAWLIES', cost: 'Grants +2 FP', description: "Your house is prone to infestations, and you'll get a new one every three or four years. Roaches are hard enough to get rid of already, but magic roaches? You'll need a strong will, and a stronger stomach.", imageSrc: '/images/prMJRgBp-uph10.png' },
  { id: 'great_neighbors', title: 'GREAT NEIGHBORS', cost: 'Costs -3 FP', description: "Conflicts with {i}Terrible Neighbors{/i}. Your neighbors are really awesome and cheerful! In fact, you can choose one purchased {w}Classmate{/w} to have been your nextdoor best friend since the day of your birth.", imageSrc: '/images/yBQ9d09P-uph3.png' },
  { id: 'great_view', title: 'GREAT VIEW', cost: 'Costs -1 FP', description: "Your house is perched on a beautiful vista! Maybe it's right on a cozy beach, or nestled up on a gorgeous mountains? Or maybe it's even on a tower overlooking a sprawling cityscape? It's up to you.", imageSrc: '/images/LhhTDFzX-uph7.png' },
  { id: 'terrible_neighbors', title: 'TERRIBLE NEIGHBORS', cost: 'Grants +2 FP', description: "Conflicts with {i}Great Neighbors{/i}. Your neighbors are pretty much terrible. Well, they aren't {i}all{/i} bad, but expect a handful to occasionally stir up strife and drama for pretty much no reason.", imageSrc: '/images/nqyPqPW2-uph11.png' },
  { id: 'private_island', title: 'PRIVATE ISLAND', cost: 'Costs -3 FP', description: "Your family owns its very own private island! Most of it is wilderness, so there's lots of places to explore and develop. It starts at 3 square miles; you can buy as many more as you want for {g}-1 FP{/g} each.", imageSrc: '/images/ZpdmQMFg-uph4.png' },
  { id: 'business', title: 'BUILT-IN BUSINESS', cost: 'Costs -0 FP', description: "Part of your house is actually a family business of some kind, such as a store or performance stage. This means many folk will be coming and going, which can be a good or bad thing depending.", imageSrc: '/images/Fq5SZ44h-uph8.png' },
  { id: 'haunted', title: 'HAUNTED', cost: 'Grants +3 FP', description: "Your home was built on a cursed burial ground and is thus infested by a bunch of ghosts who are complete jerks, with a penchant for scaring, annoying or otherwise inconveniencing you. Can't get rid of 'em.", imageSrc: '/images/W4KRB258-uph12.png' },
];

export const HOUSE_UPGRADES_DATA_KO: ChoiceItem[] = [
  { id: 'mythical_pet', title: '신비한 애완동물', cost: 'Costs -5 FP and -5 BP', description: "당신의 가족 대대로 전해져 내려오는 애완동물입니다. 참고 페이지에서 동물 점수 30점으로 디자인할 수 있습니다. 하지만 한 번 죽기라도 하면 그걸로 끝이니 조심하세요.", imageSrc: '/images/j94x4Nv3-uph1.png' },
  { id: 'swimming_pool', title: '수영장', cost: 'Costs -2 FP', description: "당신의 집 크기에 따라 수영장 크기도 정해집니다. 개인 섬의 대저택 정도면 워터파크 수준이죠! 워터 슬라이드나 유수풀장, 온수 욕조 등등을 들여놓을 수도 있습니다.", imageSrc: '/images/LdZDPHCg-uph5.png' },
  { id: 'farmer', title: '농경', cost: 'Costs -0 FP', description: "집에 농장이나 가축 목장이 딸려 있습니다! 훨씬 더 활기찬 생활을 할 수 있다는 건 장점이지만, 대신 좀 더 더럽고, 냄새나고, 농장일을 거들어야 할 겁니다.", imageSrc: '/images/Y4TLvRsG-uph9.png' },
  { id: 'virtual_reality', title: '가상현실 방', cost: 'Costs -5 FP or -2 BP', description: "기술이나 마법으로 구동되는 이 방에서는 웹상에서 다운로드받은 수많은 가상현실을 체험해 볼 수 있습니다. 정말 현실적이에요! 대신 중독되지 않게 주의하시구요...", imageSrc: '/images/KxxmWqRX-uph2.png' },
  { id: 'home_entertainment', title: '홈 엔터테인먼트', cost: 'Costs -2 FP', description: "방 두 개가 딸려옵니다. 편히 기댈 수 있는 가죽 의자가 딸린 홈 시네마, 그리고 최신 게임들이 가득 들어찬 아케이드죠! 친구들이 집에 놀러오고 싶어서 안달날 거에요.", imageSrc: '/images/G331qGrn-uph6.png' },
  { id: 'creepy_crawlies', title: '바선생과 형제들', cost: 'Grants +2 FP', description: "당신의 집에는 벌레들이 많습니다. 3-4년 마다 한 번씩 못 보던 놈들까지 나타날 거에요. 그냥 바퀴벌레라도 퇴치하기 여간 힘든 게 아닌데, 마법 바퀴벌레라뇨?! 멘탈도 비위도 좋아야 할 겁니다.", imageSrc: '/images/prMJRgBp-uph10.png' },
  { id: 'great_neighbors', title: '멋진 이웃들', cost: 'Costs -3 FP', description: "끔찍한 이웃들과 같이 선택할 수 없습니다. 이웃 주민들이 아주 친절하고 멋집니다! 추가적으로, 뒤에서 선택하게 될 클래스메이트 중 한 명이 당신의 이웃 소꿉친구가 되게 할 수 있습니다.", imageSrc: '/images/yBQ9d09P-uph3.png' },
  { id: 'great_view', title: '좋은 전망', cost: 'Costs -1 FP', description: "당신의 집은 주변 경관이 끝내줍니다! 예쁜 해변가에 있거나, 웅장한 산을 바라보고 있을지도 모릅니다. 아니면 분주한 도시를 내려다보는 마천루일까요? 당신 선택입니다.", imageSrc: '/images/LhhTDFzX-uph7.png' },
  { id: 'terrible_neighbors', title: '끔찍한 이웃들', cost: 'Grants +2 FP', description: "멋진 이웃들과 같이 선택할 수 없습니다. 이웃 사람들이 좀 질이 나쁩니다. 음, 그렇게 나쁜 사람들은 아니지만, 가끔씩은 별 일도 아닌데 다툼이 벌어지거나 드라마를 찍게 될지도 몰라요.", imageSrc: '/images/nqyPqPW2-uph11.png' },
  { id: 'private_island', title: '개인 섬', cost: 'Costs -3 FP', description: "당신의 가족이 소유하고 있는 개인 섬입니다! 대부분은 자연 그대로라 탐험하거나 건드려 볼 구석이 많습니다. 섬의 크기는 3제곱마일입니다. 추가로 행운 점수를 1점 투자할 때마다 섬이 하나씩 늘어납니다.", imageSrc: '/images/ZpdmQMFg-uph4.png' },
  { id: 'business', title: '사업 공간', cost: 'Costs -0 FP', description: "집안 공간 중 일부는 당신의 가족 사업 공간으로 쓰입니다. 가령 가게라거나 공연 무대 같은 것이죠. 많은 사람들이 집을 드나들게 될 텐데, 좋을 수도, 나쁠 수도 있습니다.", imageSrc: '/images/Fq5SZ44h-uph8.png' },
  { id: 'haunted', title: '귀신들림', cost: 'Grants +3 FP', description: "알고 보니 집터가 저주받은 묘지였습니다. 집에 귀신들이 들끓는데 이분들 성격이 아주 고약합니다. 틈만 나면 당신에게 겁을 주고, 짜증나게 하고, 어떻게든 불편하게 합니다. 심지어 쫓아낼 방법도 없죠.", imageSrc: '/images/W4KRB258-uph12.png' },
];

export const TRUE_SELF_TRAITS: ChoiceItem[] = [
  { id: 'neoteny', title: 'NEOTENY', cost: 'Grants +2 BP', description: "Body modification magic is so easy that most people can just choose what physical age they want to be. However, many Mages suffer from NDS (Neotenic Development Syndrome) which ensures they are small and adorable forever. In your day-to-day life, it will be hard to get people to take you seriously.", imageSrc: '/images/4RM81DXN-true1.jpg' },
  { id: 'spidey_sense', title: 'SPIDEY SENSE', cost: 'Costs -3 BP', description: "Mages are at their most vulnerable while in their true forms. With this, if you're going to be in danger, you will automatically transform without having to consciously decide to, right in the nick of time. This is best for those who plan on not keeping their identity a secret; it probably won't be too useful otherwise.", imageSrc: '/images/HD9mXqJq-true2.jpg' },
  { id: 'magician', title: 'MAGICIAN', cost: 'Costs Varies', description: "You can use your Blessings while in your true form; however, its total cost will be multiplied by 1.25x. If someone sees your true self using magic, it will be obvious that you're secretly a mage, though they won't necessarily know {i}which{/i} mage. Can be purchased as many times as you want.", imageSrc: '/images/Xk2j9sPb-true3.jpg' },
  { id: 'y_chromosome', title: 'Y CHROMOSOME', cost: 'Costs 0 BP', description: "Oh my! You're a pseudo-Distortion! Mages are made in the image of the kidnapped child of God, whom Mother uses to bring all magic into the world. One in a million are born male, if that. You'll definitely be quite popular with the other mages. Your alter ego will be a boy too, albeit more androgynous.", imageSrc: '/images/zhPJrPTn-true4.jpg' },
];

export const TRUE_SELF_TRAITS_KO: ChoiceItem[] = [
    { id: 'neoteny', title: '영원한 소녀', cost: 'Grants +2 BP', description: "신체 변화 마법은 사실 아주 간단해서, 변신하는 모습의 연령대도 쉽게 정할 수 있습니다. 하지만 많은 마법소녀들은 유형성숙 증후군을 겪게 되는데, 이로 인해 영원히 작고 귀여운 모습으로 고정됩니다. 아마 평상시에 다른 사람들이 당신을 좀 진지하게 여기지 않을 거에요.", imageSrc: '/images/4RM81DXN-true1.jpg' },
    { id: 'spidey_sense', title: '직감', cost: 'Costs -3 BP', description: "마법소녀들은 진짜 모습을 하고 있을 때 가장 취약합니다. 이 특성이 있으면 위험할 때 무의식적으로 겉보기 자아로 변신할 수 있습니다. 딱히 정체를 비밀로 하고 싶지 않은 이들에게 가장 적합합니다. 그게 아니라면 별로 쓸모가 없을 겁니다.", imageSrc: '/images/HD9mXqJq-true2.jpg' },
    { id: 'magician', title: '마법사', cost: 'Costs Varies', description: "진짜 모습을 하고 있을 때에도 당신이 선택한 축복 중 하나를 다룰 수 있습니다. 단, 그 축복의 행운 및 축복 점수 소모량이 25% 증가합니다. 진짜 모습을 하고 마법을 사용하는 것을 누군가 본다면, 당신이 정체를 숨기고 있는 마법소녀라는 것을 눈치챌 수 있습니다. 하지만 어떤 마법소녀인지까지 알아낼 수는 없죠. 이 선택지는 여러 번 고를 수 있습니다.", imageSrc: '/images/Xk2j9sPb-true3.jpg' },
    { id: 'y_chromosome', title: 'Y염색체', cost: 'Costs 0 BP', description: "오, 이런! 당신도 가왜곡체군요! 마법소녀들은 납치된 신의 아이의 모습을 본따 만들어지죠. 어머니께서 그 아이를 이용해 마법을 이 세계에 구현하시거든요. 그래도 백만 명 중 한 명 꼴로 남자 마법사가 태어나기는 합니다. 다른 마법소녀들이 당신을 엄청 좋아하겠네요. 당신의 겉보기 자아 또한 남자가 될 거에요. 약간 중성적이긴 하겠지만요.", imageSrc: '/images/zhPJrPTn-true4.jpg' },
];

export const ALTER_EGO_TRAITS: ChoiceItem[] = [
  { id: 'unique_appearance', title: 'UNIQUE APPEARANCE', cost: 'Costs -1 BP', description: "Your overall shape stays the same, but you can modify other details. This can be as simple as changing your hair color, to as complex as making your hair style defy gravity, appear to be made of fire or the night sky, or making your skin purple and your eyes glow like sapphires. Get creative!", imageSrc: '/images/jZQ0fk7C-true5.jpg' },
  { id: 'exotic_appearance', title: 'EXOTIC APPEARANCE', cost: 'Costs -2 BP', description: "Requires {i}Unique Appearance{/i}. As long as you maintain a generally humanoid form, you can now add new features to your body altogether, like fur, weird ears, or whatever else springs to your mind. This is quite rare, so expect to really stand out even compared to your fellow mages!", imageSrc: '/images/WpWY273v-true6.jpg' },
  { id: 'inhuman_appearance', title: 'INHUMAN APPEARANCE', cost: 'Costs -3 BP', description: "Requires {i}Exotic Appearance{/i}. At this point, you don't even have to look vaguely humanoid! Such mages are extremely rare, so you'll definitely stand out, for better or worse. Create your monstrous form with {w}40 Beast Points{/w} on the {i}Reference Page{/i} excluding options marked with an *.", imageSrc: '/images/BKfT68wh-true7.jpg' },
  { id: 'power_requirement', title: 'POWER REQUIREMENT', cost: 'Grants +4 BP', description: "There's something or another you need regularly, or your powers will gradually drain. It can range from natural things like sunlight, to products like a certain chemical, to even things like friendship or a true love's kiss. The rarer it is, the slower your power drains when you are parted from it.", imageSrc: '/images/5hP8gJvm-true8.jpg' },
  { id: 'power_weakness', title: 'POWER WEAKNESS', cost: 'Grants +4 BP', description: "There's something or another you need to avoid, or it will temporarily sap you of your powers. It can range from physical objects like a certain crystal, to more aethereal things like a keyword or emotion. The more common it is, the less severe its effects are on you. Your enemies might figure out this weakness!", imageSrc: '/images/WN1N7TpQ-true9.jpg' },
  { id: 'signature_vehicle', title: 'SIGNATURE VEHICLE', cost: 'Costs -4 BP and -4 FP', description: "Create a vehicle on the {i}Reference Page{/i} using {w}30 Vehicle Points{/w}. To assign a vehicle, click the icon in the top-right corner. Your chosen vehicle will spawn at your location every time you transform to your alter ego. If it's destroyed, it will reappear the next time you transform again. Not super practical, but guarantees you lots of style points!", imageSrc: '/images/TMyMPTqc-true10.jpg' },
  { id: 'rival', title: 'RIVAL', cost: 'Grants +7 FP', description: "You have a self-professed rival! Their personality is seemingly fine-tuned to piss you off to the maximum possible extent, and their powers are almost designed to counter your own. No matter what you do, you can never seem to get rid of them for very long, and they're immune to psychic control.", imageSrc: '/images/Vcq4Yw0r-true11.jpg' },
  { id: 'corporate_mascot', title: 'CORPORATE MASCOT', cost: 'Grants +8 FP', description: "Some kitschy major company or another is sponsoring your career! They'll make life easier for you, at the cost of plastering their logo all over your dress, magical styles, and making you complete {w}4 Jobs{/w} from {i}page 3{/i} without the usual rewards. Some people will consider you a sellout.", imageSrc: '/images/WhY3gc8-true12.jpg' },
];

export const ALTER_EGO_TRAITS_KO: ChoiceItem[] = [
    { id: 'unique_appearance', title: '고유 외형', cost: 'Costs -1 BP', description: "전체적인 모습은 똑같지만, 세세한 부분을 조절할 수 있습니다. 머리색을 바꾸거나, 중력을 거스르는 헤어스타일을 만들거나, 불타는 머리카락이나 밤하늘 같은 머리카락을 갖거나, 아니면 피부색을 보라색으로 바꾸고 눈을 사파이어처럼 빛나게 할 수 있어요. 창의성을 발휘해 보시죠!", imageSrc: '/images/jZQ0fk7C-true5.jpg' },
    { id: 'exotic_appearance', title: '이국적인 외형', cost: 'Costs -2 BP', description: "고유 외형이 필요합니다. 인간 형상을 유지하기만 한다면, 털이나 동물귀, 기타 당신 떠올릴 수 있는 온갖 것들을 더할 수 있습니다. 이런 마녀들은 꽤 드물기 때문에, 동료 마법소녀들 사이에서 눈에 확 들어올 거에요!", imageSrc: '/images/WpWY273v-true6.jpg' },
    { id: 'inhuman_appearance', title: '인간이 아닌 모습', cost: 'Costs -3 BP', description: "이국적인 외형이 필요합니다. 이제는 인간 모습에 연연할 필요도 없습니다! 이런 경우는 거의 없어서 좋든 나쁘든 무조건 주목받을 수 있을 겁니다. 참고 페이지에서 동물 점수 40점을 사용해 당신의 모습을 정할 수 있습니다. 단, *로 표기된 선택지는 고를 수 없습니다.", imageSrc: '/images/BKfT68wh-true7.jpg' },
    { id: 'power_requirement', title: '능력 유지', cost: 'Grants +4 BP', description: "무언가를 주기적으로 얻지 않으면 당신의 힘이 점점 빠져나갑니다. 햇빛과 같은 자연물부터, 특정 화학물질과 같은 인공물이 될 수도 있고, 심지어는 우정이나 진정한 사랑의 키스 같은 것이 될 수도 있습니다. 그 무언가가 희귀할수록, 그것 없이도 더 오래 버틸 수 있습니다.", imageSrc: '/images/5hP8gJvm-true8.jpg' },
    { id: 'power_weakness', title: '약점', cost: 'Grants +4 BP', description: "특정한 무언가에 접촉하면 당신의 힘이 일시적으로 약해집니다. 어떤 수정과 같은 물체일 수도 있고, 특정 단어나 감정과 같은 추상적인 것일 수도 있습니다. 그것이 더 흔할수록 힘이 약화되는 정도도덜해집니다. 적들이 이 약점을 알아낼 수도 있습니다!", imageSrc: '/images/WN1N7TpQ-true9.jpg' },
    { id: 'signature_vehicle', title: '당신만의 탈것', cost: 'Costs -4 BP and -4 FP', description: "참고 페이지에서 탈것 점수 30점을 사용해 탈것을 만들 수 있습니다. 당신이 겉보기 자아로 변신할 때마다 어째서인지 이 탈것이 당신 옆에 놓이게 됩니다. 만약 파괴되면 다음 변신할 때 다시 나타납니다. 아주 실용적이지는 않지만, 스타일은 끝내줍니다!", imageSrc: '/images/TMyMPTqc-true10.jpg' },
    { id: 'rival', title: '라이벌', cost: 'Grants +7 FP', description: "당신에겐 '자칭' 라이벌이 있습니다! 성격을 일부러 조절하기라도 했나 싶을 만큼 당신의 속을 박박 긁어 대고, 마법도 거의 당신에게 상성이 좋은 것들만 사용합니다. 아무리 노력해도 이 라이벌을 오랫동안 떨쳐 낼 수가 없습니다. 정신 제어도 먹히지 않는 것은 덤입니다.", imageSrc: '/images/Vcq4Yw0r-true11.jpg' },
    { id: 'corporate_mascot', title: '기업 마스코트', cost: 'Grants +8 FP', description: "키치한 기업에서 당신의 커리어를 후원하고 있습니다! 삶은 좀 더 편해지겠지만, 그 대신 당신의 드레스나 마법에 자기들 기업 로고를 박아넣으라고 합니다. 그리고 3페이지에 있는 일 4개를 모두 무보수로 해야 합니다. 누군가는 당신을 자본주의의 노예라고 생각하겠죠.", imageSrc: '/images/WhY3gc8-true12.jpg' },
];

export const UNIFORMS_DATA: ChoiceItem[] = [
    { id: 'idol', title: 'IDOL', cost: 'Costs -1 FP', description: "This describes a large variety of outfits, mostly typified by bright colors, frilly dresses, big bows, and other girly things. Based on musical performers, this sort of outfit has been getting very popular amongst the younger generation of mages.", imageSrc: '/images/HD2tdfVk-uni1.jpg' },
    { id: 'witchy', title: 'WITCHY', cost: 'Costs -1 FP', description: "This used to be the most popular uniform for many millennia, but nowadays it's just about tied with Idol. Nowadays, this aesthetic is associated with traditional mages and ancient (and often spooky) magic, though anybody can wear it.", imageSrc: '/images/k69Y0jbY-uni2.png' },
    { id: 'boyish', title: 'BOYISH', cost: 'Costs -1 FP', description: "Not everybody wants to be the peak of femininity. This aesthetic encapsulates a range of outfits typically worn by guys and tomboys. Tends to be a tad boring, but at least you will look more cool and professional, and will be taken more seriously.", imageSrc: '/images/KxgY2hxQ-uni3.jpg' },
    { id: 'high_tech', title: 'HIGH TECH', cost: 'Costs -1 FP', description: "Pretty common in New Palisade, but you'll look kinda weird elsewhere. Still, these bodysuits and armor panels are just so comfortable and convenient! They even have hologram systems built in that let you browse the web from anywhere.", imageSrc: '/images/TxDJsrvY-uni4.jpg' },
    { id: 'animal_themed', title: 'ANIMAL-THEMED', cost: 'Costs -1 FP', description: "You're really trying to crank the cuteness dial up to maximum, huh? Well, you'll be well-liked wherever you go, but don't expect people to assume you're tough or competent. But maybe you want your enemies to underestimate you?", imageSrc: '/images/YFzGhgpR-uni5.jpg' },
    { id: 'old_timey', title: 'OLD TIMEY', cost: 'Costs -1 FP', description: "About a century or two ago, these kinds of outfits looked like they were about to take off, but then the Idol aesthetic came along and stole the spotlight. Still, these dresses are the perfect balance of cuteness and professionalism.", imageSrc: '/images/8Dr42fjh-uni6.jpg' },
    { id: 'oriental', title: 'ORIENTAL', cost: 'Costs -1 FP', description: "While the 'Witchy' aesthetic dominated elsewhere for most of history, mages in Jipangu have always had a completely different sort of traditional dress. You might get funny looks wearing it elsewhere, but it's the perfect mix of class and beauty.", imageSrc: '/images/cSZcdL2N-uni7.jpg' },
    { id: 'custom', title: 'CUSTOM', cost: 'Costs -1 FP', description: "Daringly defy fashion standards and come up with your own unique style! This will definitely help you stand out in a crowd, and who knows? If you get famous, other people might be inspired by your style. The sky's the limit with this option.", imageSrc: '/images/201KZxjn-uni8.png' },
];

export const UNIFORMS_DATA_KO: ChoiceItem[] = [
    { id: 'idol', title: '아이돌', cost: 'Costs -1 FP', description: "가수와 댄서들에게서 따온 스타일로, 밝은 색감, 프릴, 커다란 리본, 기타 소녀소녀한 것들로 특징되는 복장입니다. 최근에 어린 마법소녀들 사이에서 유행을 타고 있죠.", imageSrc: '/images/HD2tdfVk-uni1.jpg' },
    { id: 'witchy', title: '마녀', cost: 'Costs -1 FP', description: "역사와 근본을 자랑하는 스타일입니다만, 최근에는 아이돌과 인기가 비슷합니다. 지금은 전통적인 마녀들과 고대 (그리고 으스스한) 마법을 다루는 사람들과 주로 연관지어집니다. 그래도 아무나 입을 수 있기는 합니다.", imageSrc: '/images/k69Y0jbY-uni2.png' },
    { id: 'boyish', title: '보이시', cost: 'Costs -1 FP', description: "다들 여성미를 뽐내고 싶어하는 건 아니죠. 이 스타일은 주로 남자들이 주로 입는 복장입니다. 조금 진부할 수는 있지만, 더 쿨하고 전문적으로 보이는 데다가 남들과도 진지한 대화를 할 수 있죠.", imageSrc: '/images/KxgY2hxQ-uni3.jpg' },
    { id: 'high_tech', title: '하이테크', cost: 'Costs -1 FP', description: "뉴 팰리세이드에서는 익숙하지만, 다른 곳에서는 좀 어색해 보일 겁니다. 하지만 이 장갑판 달린 바디슈트는 아주 편리하고 편안합니다! 심지어 홀로그램 시스템까지 내장되어서 어디서든 웹에 접속할 수 있어요.", imageSrc: '/images/TxDJsrvY-uni4.jpg' },
    { id: 'animal_themed', title: '동물잠옷', cost: 'Costs -1 FP', description: "귀여움 최대로 하시게요? 어딜 가든 사람들이 좋아하겠지만, 세거나 유능하다는 인상을 주기는 어렵습니다. 아니면 혹시 적들의 방심을 노리기 위한 복장인가요?", imageSrc: '/images/YFzGhgpR-uni5.jpg' },
    { id: 'old_timey', title: '복고풍', cost: 'Costs -1 FP', description: "한 100-200년 전에 유행을 타나 했던 스타일인데 아이돌 스타일이 등장해서 밀려났습니다. 그래도 귀여움과 전문성 사이에서 완벽한 균형을 잡은 드레스라는 사실에는 변함이 없죠.", imageSrc: '/images/8Dr42fjh-uni6.jpg' },
    { id: 'oriental', title: '동양적', cost: 'Costs -1 FP', description: "다른 곳에서는 마녀 스타일이 주류였습니다만, 지팡구의 마녀들은 항상 결이 다른 전통 의상을 입었습니다. 다른 국가에서는 좀 이상한 시선을 받겠지만, 그래도 품격과 미모를 완벽히 조화시킨 디자인입니다.", imageSrc: '/images/cSZcdL2N-uni7.jpg' },
    { id: 'custom', title: '커스텀', cost: 'Costs -1 FP', description: "주류 패션을 과감히 거부하고 당신만의 의상을 디자인하세요! 사람들 사이에서 튀는 건 당연하고, 혹시 알아요? 당신이 유명해지면 사람들이 당신의 스타일에 영감을 받을 수도 있죠. 한계는 없습니다. 상상력을 맘껏 발휘하세요.", imageSrc: '/images/201KZxjn-uni8.png' },
];

export const MAGICAL_STYLES_DATA: ChoiceItem[] = [
    { id: 'generic', title: 'GENERIC', cost: 'Costs 0 BP', description: '', imageSrc: '/images/Cpf7Mpfg-vis1.png' },
    { id: 'light_sun', title: 'LIGHT/SUN', cost: 'Costs -1 BP', description: '', imageSrc: '/images/zwZKVHV-vis2.png' },
    { id: 'dark_moon', title: 'DARK/MOON', cost: 'Costs -1 BP', description: '', imageSrc: '/images/DDndPnYM-vis3.png' },
    { id: 'fire_smoke', title: 'FIRE/SMOKE', cost: 'Costs -1 BP', description: '', imageSrc: '/images/gMrGgy6d-vis4.png' },
    { id: 'water_bubbles', title: 'WATER/BUBBLES', cost: 'Costs -1 BP', description: '', imageSrc: '/images/fGMcp2XJ-vis5.png' },
    { id: 'nature', title: 'NATURE', cost: 'Costs -1 BP', description: '', imageSrc: '/images/WvXkgD0P-vis6.png' },
    { id: 'hearts', title: 'HEARTS', cost: 'Costs -1 BP', description: '', imageSrc: '/images/Z1pF3xG4-vis7.png' },
    { id: 'snow_ice', title: 'SNOW/ICE', cost: 'Costs -1 BP', description: '', imageSrc: '/images/Qjrj8HFp-vis8.png' },
    { id: 'electricity', title: 'ELECTRICITY', cost: 'Costs -1 BP', description: '', imageSrc: '/images/XfQZ4qZQ-vis9.png' },
    { id: 'confetti', title: 'CONFETTI', cost: 'Costs -1 BP', description: '', imageSrc: '/images/gLVNv5CW-vis10.png' },
    { id: 'stars', title: 'STARS', cost: 'Costs -1 BP', description: '', imageSrc: '/images/hRcKLcDv-vis11.png' },
    { id: 'bugs', title: 'BUGS', cost: 'Costs -1 BP', description: '', imageSrc: '/images/FqNs3Jc3-vis12.png' },
    { id: 'earth_rocks', title: 'EARTH/ROCKS', cost: 'Costs -1 BP', description: '', imageSrc: '/images/bMQ6mptF-vis13.png' },
    { id: 'digital_glitch', title: 'DIGITAL/GLITCH', cost: 'Costs -1 BP', description: '', imageSrc: '/images/yFJBpV6x-vis14.png' },
    { id: 'neon', title: 'NEON', cost: 'Costs -1 BP', description: '', imageSrc: '/images/7tjDwyvy-vis15.png' },
    { id: 'eldritch', title: 'ELDRITCH', cost: 'Costs -1 BP', description: '', imageSrc: '/images/4Z1BmNfq-vis16.png' },
    { id: 'cards', title: 'CARDS', cost: 'Costs -1 BP', description: '', imageSrc: '/images/qLfwBSMW-vis17.png' },
    { id: 'music_notes', title: 'MUSIC NOTES', cost: 'Costs -1 BP', description: '', imageSrc: '/images/5XjtPm5Y-vis18.png' },
    { id: 'abstract_chaos', title: 'ABSTRACT/CHAOS', cost: 'Costs -1 BP', description: '', imageSrc: '/images/VW3jwKkp-vis19.png' },
    { id: 'custom_style', title: 'CUSTOM', cost: 'Costs -1 BP', description: '', imageSrc: '/images/QjfFxmx2-vis20.png' },
];

export const MAGICAL_STYLES_DATA_KO: ChoiceItem[] = [
    { id: 'generic', title: '없음', cost: 'Costs 0 BP', description: '', imageSrc: '/images/Cpf7Mpfg-vis1.png' },
    { id: 'light_sun', title: '빛/태양', cost: 'Costs -1 BP', description: '', imageSrc: '/images/zwZKVHV-vis2.png' },
    { id: 'dark_moon', title: '어둠/달', cost: 'Costs -1 BP', description: '', imageSrc: '/images/DDndPnYM-vis3.png' },
    { id: 'fire_smoke', title: '불/연기', cost: 'Costs -1 BP', description: '', imageSrc: '/images/gMrGgy6d-vis4.png' },
    { id: 'water_bubbles', title: '물/거품', cost: 'Costs -1 BP', description: '', imageSrc: '/images/fGMcp2XJ-vis5.png' },
    { id: 'nature', title: '자연', cost: 'Costs -1 BP', description: '', imageSrc: '/images/WvXkgD0P-vis6.png' },
    { id: 'hearts', title: '하트', cost: 'Costs -1 BP', description: '', imageSrc: '/images/Z1pF3xG4-vis7.png' },
    { id: 'snow_ice', title: '눈/얼음', cost: 'Costs -1 BP', description: '', imageSrc: '/images/Qjrj8HFp-vis8.png' },
    { id: 'electricity', title: '전기', cost: 'Costs -1 BP', description: '', imageSrc: '/images/XfQZ4qZQ-vis9.png' },
    { id: 'confetti', title: '종이조각', cost: 'Costs -1 BP', description: '', imageSrc: '/images/gLVNv5CW-vis10.png' },
    { id: 'stars', title: '별', cost: 'Costs -1 BP', description: '', imageSrc: '/images/hRcKLcDv-vis11.png' },
    { id: 'bugs', title: '곤충', cost: 'Costs -1 BP', description: '', imageSrc: '/images/FqNs3Jc3-vis12.png' },
    { id: 'earth_rocks', title: '흙/바위', cost: 'Costs -1 BP', description: '', imageSrc: '/images/bMQ6mptF-vis13.png' },
    { id: 'digital_glitch', title: '디지털/버그', cost: 'Costs -1 BP', description: '', imageSrc: '/images/yFJBpV6x-vis14.png' },
    { id: 'neon', title: '네온', cost: 'Costs -1 BP', description: '', imageSrc: '/images/7tjDwyvy-vis15.png' },
    { id: 'eldritch', title: '엘드리치', cost: 'Costs -1 BP', description: '', imageSrc: '/images/4Z1BmNfq-vis16.png' },
    { id: 'cards', title: '카드', cost: 'Costs -1 BP', description: '', imageSrc: '/images/qLfwBSMW-vis17.png' },
    { id: 'music_notes', title: '음표', cost: 'Costs -1 BP', description: '', imageSrc: '/images/5XjtPm5Y-vis18.png' },
    { id: 'abstract_chaos', title: '추상/혼돈', cost: 'Costs -1 BP', description: '', imageSrc: '/images/VW3jwKkp-vis19.png' },
    { id: 'custom_style', title: '커스텀', cost: 'Costs -1 BP', description: '', imageSrc: '/images/QjfFxmx2-vis20.png' },
];

export const BUILD_TYPES_DATA: ChoiceItem[] = [
    { id: 'single_player', title: 'SINGLE PLAYER', cost: '', description: "Your build will not have to compete with anybody else's, for this adventure is yours and yours alone. This unlocks the option to choose Specific Classmates and Colleagues, though you can still make your own.", imageSrc: '/images/HD1zFR9g-singleplay.png' },
    { id: 'multiplayer', title: 'MULTIPLAYER', cost: '', description: "You will share a world with pretty much anybody who made a build that follows the rules and which selected this option. This unfortunately means you cannot pick any specific Classmates or Colleagues, and must instead create your own custom ones. This is a dangerous option, for other players may try to cause trouble! It is recommended that you form teams with other mages to try and keep eachother safe, and to work towards whatever your shared goals may be.", imageSrc: '/images/MySTx6BT-multiplay.jpg' },
];

export const BUILD_TYPES_DATA_KO: ChoiceItem[] = [
    { id: 'single_player', title: '싱글플레이어', cost: '', description: "다른 이들과 경쟁할 필요 없이 당신만의 모험을 떠나게 됩니다. 선택지로 제시된 클래스메이트나 동료를 고를 수 있습니다. 물론 직접 만드는 것도 가능합니다.", imageSrc: '/images/HD1zFR9g-singleplay.png' },
    { id: 'multiplayer', title: '멀티플레이어', cost: '', description: "규칙을 따르며 빌드를 만들고, 멀티플레이어를 선택한 모든 플레이어들과 같은 세계관을 공유합니다. 제시된 클래스메이트나 동료를 고를 수 없고, 직접 당신만의 클래스메이트나 동료를 설정해야만 합니다. 다른 플레이어들이 당신에게 훼방을 놓을 수도 있다는 위험을 감수해야 할 것입니다. 다른 마녀들과 팀을 이루어 서로서로를 지키고, 공동의 목표를 위해 나아가는 것을 추천합니다.", imageSrc: '/images/MySTx6BT-multiplay.jpg' },
];
