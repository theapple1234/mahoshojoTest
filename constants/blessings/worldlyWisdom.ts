
import type { WorldlyWisdomSigil, WorldlyWisdomPower } from '../../types';

export const WORLDLY_WISDOM_DATA = {
    title: "THE BLESSING OF WORLDLY WISDOM",
    imageSrc: "/images/SXMHZJ5n-main7.png",
    description: `Once thought to just be a form of temporal magic limited to organic tissue. It was unknown what it was useful for besides age manipulation and making crops grow, up until the two Braningan Sisters, Eleanor and Genevieve. They found that by applying this Blessing in very specific ways, they could not only accelerate or reverse natural processes, they could {i}modify{/i} them. Eleanor, a simple girl, dabbled in only the most practical applications of this art, but Genevieve, ever the scientist, delved deeper, perfecting truly amazing techniques with the ambition of one day inventing perfect immortality and invincibility. It seems she took her research {bpx}too far{/bpx}, however, and abandoned it out of horror.
    
A side note: on undead creatures, this magic actually increases the rate at which they {i}rot{/i}, rather than heal. Therefore, it's possible to actually {i}deal{/i} damage to them in this way. It's very entertaining!`
};

export const WORLDLY_WISDOM_DATA_KO = {
    title: "경험과 지혜의 축복",
    imageSrc: "/images/SXMHZJ5n-main7.png",
    description: `한때 이 부류의 마법은 단지 유기체의 시간을 조작하는 것으로만 알려져 있었습니다. 나이를 바꾸거나 작물을 키우는 것 외에 다른 쓸모가 알려져 있지 않았는데, 그러던 어느 날 엘레노어와 제네비브라는 두 자매가 나타났습니다. 이들은 이 축복을 특정한 방법으로 적용하면 자연의 흐름을 가속, 역전시키는 것을 뛰어넘어 그것을 조정할 수 있다는 것을 알아냈습니다. 엘레노어는 심성이 단순해서 이 능력의 실용적인 활용에만 중점을 두었지만, 탐구심 넘치는 제네비브는 깊고 철저한 연구를 통해 실로 놀라운 일들을 해내며, 언젠가는 진정한 불로불사에 도달하고자 하였습니다. 그러나 그녀의 연구는 어느 순간 선을 넘어 버렸고, 그녀는 두려움에 질려 연구를 포기했습니다.

유의점: 언데드 생물에게 이 마법을 사용하면 재생 속도 대신 부패 속도가 상승합니다. 즉 이 마법으로 언데드에 피해를 줄 수 있습니다. 꽤 재미있죠!`
};

export const WORLDLY_WISDOM_SIGIL_TREE_DATA: WorldlyWisdomSigil[] = [
    { id: 'arborealist', title: 'ARBOREALIST', description: 'Expect popularity with these skills.', imageSrc: '/images/SFbsP2R-juathas.png', prerequisites: [], type: 'Arborealist', benefits: { eleanors: 1 } },
    { id: 'sanctified_i', title: 'SANCTIFIED I', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['arborealist'], type: 'Sanctified', benefits: { genevieves: 1 } },
    { id: 'healer_i', title: 'HEALER I', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['arborealist'], type: 'Healer', benefits: { eleanors: 1 } },
    { id: 'healer_ii', title: 'HEALER II', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['healer_i'], type: 'Healer', benefits: { eleanors: 1 } },
    { id: 'healer_iii', title: 'HEALER III', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['healer_i'], type: 'Healer', benefits: { eleanors: 1 } },
    { id: 'sanctified_ii', title: 'SANCTIFIED II', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['healer_ii'], type: 'Sanctified', benefits: { genevieves: 1 } },
    { id: 'healer_iv', title: 'HEALER IV', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['healer_iii'], type: 'Healer', benefits: { eleanors: 1 } },
    { id: 'dark_art', title: 'DARK ART', description: "Unlocks: The Reinman's Curse", imageSrc: '/images/nq80Y3pk-sinthru.png', prerequisites: ['healer_iv'], type: 'Dark Art', benefits: { genevieves: 1 }, unlocks: "the_reinmans_curse" },
    { id: 'sanctified_iii', title: 'SANCTIFIED III', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['healer_iv'], type: 'Sanctified', benefits: { genevieves: 1 } },
];

export const WORLDLY_WISDOM_SIGIL_TREE_DATA_KO: WorldlyWisdomSigil[] = [
    { id: 'arborealist', title: '자연주의자', description: '이 마법들은 인기가 많을 겁니다.', imageSrc: '/images/SFbsP2R-juathas.png', prerequisites: [], type: 'Arborealist', benefits: { eleanors: 1 } },
    { id: 'sanctified_i', title: '축성 I', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['arborealist'], type: 'Sanctified', benefits: { genevieves: 1 } },
    { id: 'healer_i', title: '치유사 I', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['arborealist'], type: 'Healer', benefits: { eleanors: 1 } },
    { id: 'healer_ii', title: '치유사 II', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['healer_i'], type: 'Healer', benefits: { eleanors: 1 } },
    { id: 'healer_iii', title: '치유사 III', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['healer_i'], type: 'Healer', benefits: { eleanors: 1 } },
    { id: 'sanctified_ii', title: '축성 II', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['healer_ii'], type: 'Sanctified', benefits: { genevieves: 1 } },
    { id: 'healer_iv', title: '치유사 IV', description: '', imageSrc: '/images/zTm8fcLb-kaarn.png', prerequisites: ['healer_iii'], type: 'Healer', benefits: { eleanors: 1 } },
    { id: 'dark_art', title: '어둠의 마법', description: "마부의 저주 해금", imageSrc: '/images/nq80Y3pk-sinthru.png', prerequisites: ['healer_iv'], type: 'Dark Art', benefits: { genevieves: 1 }, unlocks: "the_reinmans_curse" },
    { id: 'sanctified_iii', title: '축성 III', description: '', imageSrc: '/images/Dg6nz0R1-purth.png', prerequisites: ['healer_iv'], type: 'Sanctified', benefits: { genevieves: 1 } },
];

export const ELEANORS_TECHNIQUES_DATA: WorldlyWisdomPower[] = [
    { id: 'healing_bliss', title: 'HEALING BLISS', imageSrc: '/images/PzCsWSh2-e1.jpg', description: "Focusing your power upon yourself or a single ally up close will allow you to stabilize even the worst condition and completely heal them, though it will still take a long while if they were in incredibly severe condition. This is the fastest healing power, but requires your undivided attention for a time.", grade: 'kaarn' },
    { id: 'defensive_circle', title: 'DEFENSIVE CIRCLE', imageSrc: '/images/F4fpqwpb-e2.png', description: "Creates a runic circle of light upon the ground beneath you with a radius of about 10 meters. You and any of your allies who stay within this circle will find themselves energized, less affected by fear or pain, moderately more magically powerful and durable, and enjoying a modest healing effect.", grade: 'kaarn' },
    { id: 'rejuvenating_bolt', title: 'REJUVENATING BOLT', imageSrc: '/images/TBFsbXVF-e3.jpg', description: "When you need healing {i}now!{/i} You can fire a magical bolt that can travel with extreme accuracy over very long distances — but don't miss, or it will be wasted! When it hits, it will near instantly heal a significant portion of the target's damage. Alas, it will take a couple minutes to charge another bolt.", grade: 'kaarn' },
    { id: 'guardian_angels', title: 'GUARDIAN ANGELS', imageSrc: '/images/YFJRmLNC-e4.jpg', description: "You can manifest your desire to protect a friend in the form of a tiny angel that will float around their head, significantly boosting their luck and providing a moderate passive healing effect. You can create up to three of these angels at a time; however, they can be targeted and destroyed by enemies.", grade: 'kaarn' },
    { id: 'psychic_surgery', title: 'PSYCHIC SURGERY', imageSrc: '/images/ymT4fgLy-e5.png', description: "{i}Requires {w}Healing Bliss.{/w}{/i} Slower and less fun than {w}Healing Bliss{/w}, but much more thorough! Almost anything can be healed through magical surgeries, from genetic disabilities, to metamagical debuffs, to minor curses and hexes, or even sadness or bad luck! Certain upgrades to the body can even be made by the brave.", requires: ['healing_bliss'], grade: 'kaarn' },
    { id: 'chloromancy', title: 'CHLOROMANCY', imageSrc: '/images/MDy5DD1N-e6.jpg', description: "You have absolute control over nearby plants and can grow and mutate them rapidly. Transform grass into massive vines that constrict and strangle foes, flowers into poison sprayers, tree branches into jutting spikes, etc. Gain vibrational sense of any movement near a plant within a mile radius.", grade: 'kaarn' },
    { id: 'botanic_mistresses', title: 'BOTANIC MISTRESSES', imageSrc: '/images/nNHHMVLd-e7.jpg', description: "From arable earth, you can summon servile dryads dedicated to serving your whims. It requires a bit of a ritual, and they only last for a couple hours, before returning to the earth; however, you can choose three other of {w}Eleanor's Techniques{/w} for them to be proficient in. Vulnerable to fire.", specialRequirement: 'requires_3_eleanor', grade: 'kaarn' },
    { id: 'maneaters', title: 'MANEATERS', imageSrc: '/images/jkfLzZ0Z-e8.jpg', description: "Can create and plant seeds that will, within seconds, grow into towering carnivorous plant monsters, from venus fly traps to pitcher plants, attempting to snatch mages with tentacles lined with a weakening poison. Trapped mages will take constant damage until they manage to escape.", grade: 'kaarn' },
];

export const ELEANORS_TECHNIQUES_DATA_KO: WorldlyWisdomPower[] = [
    { id: 'healing_bliss', title: '황홀한 치유', imageSrc: '/images/PzCsWSh2-e1.jpg', description: "당신의 힘을 자기 자신이나 동료 한 명에게 집중하면, 가장 극심한 상처도 안정화시킨 후 완벽히 치유할 수 있습니다. 물론 중상일수록 치유에 걸리는 시간이 길어집니다. 가장 빠르게 치유를 할 수 있는 마법이지만, 그 동안은 온전히 집중하고 있어야 합니다.", grade: 'kaarn' },
    { id: 'defensive_circle', title: '방어의 원', imageSrc: '/images/F4fpqwpb-e2.png', description: "당신을 중심으로 반경 10m 정도의 룬이 새겨진 빛의 원이 지면에 나타납니다. 원 안에 있는 당신과 동료들은 기력이 회복되고, 공포나 고통에 더 적은 영향을 받고, 마력이 약간 상승하고, 소정의 치유 효과를 받습니다.", grade: 'kaarn' },
    { id: 'rejuvenating_bolt', title: '치유의 화살', imageSrc: '/images/TBFsbXVF-e3.jpg', description: "당장 치유가 필요할 때 사용하는 마법입니다! 정확하게 장거리를 날아갈 수 있는 마법 화살를 발사합니다. 물론 빗나가면 마법이 낭비되니 주의하세요! 화살에 맞은 대상은 입은 피해의 상당량을 즉시 회복합니다. 다만 다음 화살을 충전하기까지는 몇 분이 걸린다는 것이 단점입니다.", grade: 'kaarn' },
    { id: 'guardian_angels', title: '수호천사', imageSrc: '/images/YFJRmLNC-e4.jpg', description: "동료를 보호하고자 하는 당신의 의지를, 동료의 머리 위를 따라다니는 작은 천사의 형태로 구현합니다. 동료의 행운이 상당히 높아지고, 적당한 지속 치유 효과를 받게 됩니다. 동시에 3체의 수호천사를 만들 수 있습니다. 하지만 적들 또한 수호천사를 공격해 파괴할 수 있습니다.", grade: 'kaarn' },
    { id: 'psychic_surgery', title: '초능력 수술', imageSrc: '/images/ymT4fgLy-e5.png', description: "{i}{w}황홀한 치유{/w}가 필요합니다.{/i} 황홀한 치유보다는 느리고 재미도 없지만, 훨씬 치밀합니다! 마법을 동원한 수술이면 거의 모든 것을 치료할 수 있습니다. 유전적 결함, 메타마법으로 인한 약화, 저주나 사술, 슬픔이나 불운까지도요! 용감한 사람이라면 신체 강화 시술을 받을 수도 있을 겁니다.", requires: ['healing_bliss'], grade: 'kaarn' },
    { id: 'chloromancy', title: '식물술사', imageSrc: '/images/MDy5DD1N-e6.jpg', description: "당신은 주위의 식물들을 완벽히 제어할 수 있고, 초고속의 성장이나 변이를 촉진할 수 있습니다. 잔디를 거대한 덩굴로 바꿔 적들을 속박하거나, 꽃들을 독을 뿌려대는 식물로, 나뭇가지를 삐죽삐죽한 가시로 바꾸는 식입니다. 또한 진동을 통해 반경 1.6km 내에 있는 식물들 근처에서 움직이는 것들을 감지할 수 있게 됩니다.", grade: 'kaarn' },
    { id: 'botanic_mistresses', title: '자연의 여주인', imageSrc: '/images/nNHHMVLd-e7.jpg', description: "{i}{w}엘레노어의 기술{/w}이 3개 이상 필요합니다.{/i} 경작지의 흙에서 당신의 명령에 복종하는 드리아드를 소환할 수 있습니다. 의식과 같은 절차가 필요하고, 소환 후 몇 시간이 지나면 흙으로 돌아가지만, 이들은 당신이 정해 주는 3가지 엘레노어의 기술에 능숙하게 됩니다. 드리아드들은 불에 취약합니다.", specialRequirement: 'requires_3_eleanor', grade: 'kaarn' },
    { id: 'maneaters', title: '식인 식물', imageSrc: '/images/jkfLzZ0Z-e8.jpg', description: "식물 씨앗을 만들어내어 땅에 심으면, 수 초 내에 거대한 파리지옥이나 네펜데스의 형상을 한 괴식물체로 자라납니다. 이들은 약화 독이 묻은 촉수로 마법소녀들을 붙잡아 가두려 합니다. 갇힌 마법소녀들은 탈출할 때까지 지속 피해를 받습니다.", grade: 'kaarn' },
];

export const GENEVIEVES_TECHNIQUES_DATA: WorldlyWisdomPower[] = [
    { id: 'flashback', title: 'FLASHBACK', imageSrc: '/images/JwHQd2ff-e9.jpg', description: "When within a certain range from a foe, you can expel a constant flow of energy from your hand that absorbs magical energy. Not only is this slightly painful for them, but it reverses their natural healing, causing their wounds to bleed more and slowly grow more severe rather than staunch or shrink. Once a large amount of energy is stored, you will be able to use it all in a quick burst to revert a target's body back to the way it was within two hours in the past, which can effectively instantly heal all damage if used correctly.", grade: 'purth' },
    { id: 'sustaining_bond', title: 'SUSTAINING BOND', imageSrc: '/images/yBR6pG0g-e10.png', description: "This magic requires you to have another individual with whom you share a deep and dedicated friendship or bond, to such an extent that it transcends the material realm. When their life is truly endangered, you will be overcome by emotion and release a burst of magic energy; for the next few minutes, their healing effect will be strengthened to the point they instantly recover from all damage, rendering them functionally invincible for the duration. This energy burst will leave you utterly exhausted for days afterwards.", grade: 'purth' },
    { id: 'tree_of_life', title: 'TREE OF LIFE', imageSrc: '/images/JWBhyh11-e11.jpg', description: "Scarcely, perhaps every year or so, you'll be able to create seeds that cause the surrounding few acres to explode with flora from the Garden of Eden. Buildings in this area will be completely overgrown. Just like in the real Garden, the forces of good shall be gradually healed while inside, while the forces of evil shall be gradually burned (this might include you, so be careful!). Most importantly, once in your life, you can consult the Tree of Life in the center of a garden to bring a person of your choice back to life, as long as they died in the past hour or so.", grade: 'purth' },
    { id: 'the_reinmans_curse', title: "THE REINMAN'S CURSE", imageSrc: '/images/JRx8GcwZ-e12.png', description: "{i}Requires {bp}Dark Art.{/bp}{/i} Nothing can completely kill a mage in a single hit - except for this one simple, yet feared, technique. Enchanted runes serve as 'land mines', exploding whenever a creature comes into proximity and afflicting them with a curse that causes aging to occur at tens of thousands of times the regular rate. The victim must have the curse removed quickly by an experienced exorcist, or face a slow and horrible death as their faculties leave them and their aging body becomes immobilized. A few hours later, all that's left is a decrepit skeleton.", requires: ['dark_art'], grade: 'sinthru' },
];

export const GENEVIEVES_TECHNIQUES_DATA_KO: WorldlyWisdomPower[] = [
    { id: 'flashback', title: '역행', imageSrc: '/images/JwHQd2ff-e9.jpg', description: "당신은 일정 거리 내에 있는 적에게 에너지를 지속적으로 투사하여 그들의 마력을 흡수할 수 있습니다. 대상에게 약간의 고통을 줄 뿐만 아니라, 모든 자연 치유 효과를 역전시켜 상처가 줄어들거나 피가 멎는 대신 상처가 덧나고 출혈이 심해지게 됩니다. 충분한 마력이 흡수되면 마력을 일시에 방출해, 한 대상의 신체를 두 시간 전의 과거로 되돌릴 수 있습니다. 정확히 사용한다면 대상이 입은 모든 피해를 즉시 회복시킬 수 있겠죠.", grade: 'purth' },
    { id: 'sustaining_bond', title: '수호의 결속', imageSrc: '/images/yBR6pG0g-e10.png', description: "이 마법을 사용하려면 깊고 헌신적인, 현실의 한계마저 초월한 관계를 맺은 다른 대상이 필요합니다. 대상이 죽음의 위기를 맞으면 당신이 수많은 감정에 휩싸인 채 거대한 마력을 방출합니다. 그 후, 대상은 몇 분 동안 받는 모든 피해를 초고속으로 회복하는 효과를 받아 사실상 무적이 됩니다. 당신은 마력을 방출한 후 며칠간 완전히 탈진합니다.", grade: 'purth' },
    { id: 'tree_of_life', title: '생명의 나무', imageSrc: '/images/JWBhyh11-e11.jpg', description: "이 마법은 드물게 (1년에 한 번 정도) 사용할 수 있습니다. 씨앗을 만들어내어 주변 1헥타르의 땅을 에덴의 정원에서 피어나는 꽃들로 뒤덮습니다. 반경 안의 모든 건물은 만발하는 식물로 뒤덮입니다. 진짜 에덴의 정원에서도 그러하듯이, 범위 안에 있는 선의 세력들은 서서히 치유되고, 악의 세력들은 지속적으로 화상을 입습니다. (악의 세력에 당신이 포함될 수도 있으니 조심하세요) 더 중요한 것은, 당신은 일생에 단 한 번 정원 중앙에 있는 생명의 나무를 통해 원하는 사람을 부활시킬 수 있게 됩니다. 대신 그 사람이 죽은 지 한 시간이 지나지 않아야 합니다.", grade: 'purth' },
    { id: 'the_reinmans_curse', title: "마부의 저주", imageSrc: '/images/JRx8GcwZ-e12.png', description: "{i}{bp}어둠의 마법{/bp}이 필요합니다.{/i} 마법소녀를 일격에 죽일 수 있는 방법은 없습니다. 이 단순하지만 악명높은 기술을 빼면 말이죠. 마법 걸린 룬을 지뢰처럼 심어 놓으면, 생명체가 근접할 때 폭발하여 저주를 겁니다. 저주에 걸린 대상은 노화 속도가 몇만 배 빨라집니다. 메타마법의 전문가가 빨리 저주를 풀어 주지 않는다면, 곧 모든 능력을 잃고 늙어가는 몸을 가누지 못하며 끔찍한 죽음을 맞게 될 겁니다. 저주에 걸리고 몇 시간만 지나면 백골밖에 남지 않게 됩니다.", requires: ['dark_art'], grade: 'sinthru' },
];
