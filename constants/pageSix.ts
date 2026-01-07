
import type { ChoiceItem } from '../types';

export const RETIREMENT_INTRO_DATA = {
    title: "YOUR RETIREMENT",
    description: `We treat IID as if its some sort of medical syndrome, when in reality, it's human psychology. As you experience everything there is to experience, every day seems to go by faster than the one before; within a millennium or two, entire decades are flying past in what feels like the blink of an eye. Events that once seemed so shocking or exciting to you become hopelessly mundane; all of history reveals itself as the same cycles repeating over and over and over again, with no true progress and nothing new under the sun. While your actions may seem world-altering for a few centuries, everything you do is eventually relegated to the history books as the world moves on, and another legend rises to solve some new problem that seems eerily similar to one you already "solved" long ago. You come to be seen as old-fashioned, hopelessly out of touch with the hundreds of generations that came after you, who've evolved so drastically that you're just as disgusted by them as they are by you. No wonder so many people make arrangements for... retirement.

Of course, retirement is not literally death. There's no reason your story has to end there. Instead, consider it a fresh start — a new beginning. But if this world ever gets too boring for you, it may be time to think of moving on to another one. No need to retire anytime soon, though; in fact, it'd really be smartest if you'd stick around until we've figured out this whole 'destabilization' thing, as if our verse shuts down, these 'afterlives' will shut down too.`
};

export const RETIREMENT_INTRO_DATA_KO = {
    title: "은퇴",
    description: `비록 불멸 촉발 우울증이 의학적인 질병으로 취급되긴 하지만, 사실은 인간 심리의 문제에 더 가깝습니다. 겪어 볼 것을 다 겪어 보게 되면, 하루하루가 점점 더 빨리 지나가는 것만 같고, 그렇게 한 이천 년쯤 살다 보면 눈 깜빡할 사이에 몇십 년이 지나가는 것만 같죠. 한때는 그렇게 충격적이거나 재미있었던 일들도 끔찍할 정도로 따분해지고, 역사가 결국 다람쥐 쳇바퀴구나 하는 걸 직접 봐서 알 수 있는 지경에까지 이릅니다. 진정한 발전도, 태양 아래 새롭게 나타나는 것도 없습니다. 당신이 한 행동들도 몇백 년 동안은 세상을 바꿔 놓을 수 있겠지만, 결국에는 그냥 역사책에 한 줄 실리는 것으로 끝나고, 또다시 전설이 나타나 인류가 당면한 새로운 문제를 멋지게 해결합니다. 오래 전 당신이 "풀었던" 것과 무섭도록 똑같은 것을요. 이제 당신은 수백 세대를 거치면서 완전히 변해 버린 사람들을 따라갈 수 없게 되고, 그들에게 당신은 그저 구시대의 틀에 박힌 사람일 뿐이고, 서로 혐오감만 쌓여 갑니다. 이러니 은퇴하고 싶은 마녀들이 많은 것도 당연하죠.

물론 은퇴라는 게 죽음은 아닙니다. 당신의 이야기가 끝날 필요는 없습니다. 오히려 새롭게 시작할 수 있죠. 하지만 언제든 이 세계가 따분하게 느껴지면 다음으로 넘어갈 수 있습니다. 그래도 섣부르게 결정하지는 마세요. 아니, 가능하면 이 '불안정화' 현상이 좀 규명될 때까지는 남아 있는 게 좋을 거에요. 지금 상황에서는 이 세계가 끝나게 되면 '내세'들도 같이 끝나는 것으로 보이거든요.`
};

export const RETIREMENT_CHOICES_DATA: ChoiceItem[] = [
    {
        id: 'enter_aether',
        title: 'ENTER THE AETHER',
        cost: '',
        description: "The Aether is a megaverse almost comparable to our own which we managed to connect to through the Greater Net during the V.A.P.; however, being part of our local network, it's considered a subverse and is thus affected by our destabilization problems. It is described as a patchwork quilt of countless procedurally generated verses, each with their own strange denizens, mysteries to be solved and adventures to be had. The societies there work entirely different from our own, so it might be a breath of fresh air if our world is feeling dull. Best for the adventurous types, though it can be dangerous.",
        imageSrc: '/images/v45DyXN1-d1.jpg'
    },
    {
        id: 'enter_sunset_city',
        title: 'ENTER SUNSET CITY',
        cost: '',
        description: "Sunset City is the nickname of a megaverse created by the combined resources of Red-Jade Council, initially devised for themselves but eventually opened up to the general public once they had the processing power. Unlike our world and the Aether, it is a place of absolute relaxation, and you feel a sort of tranquility just walking along its beautiful streets. Its appearance changes from person to person depending on your preferences, and there's leagues of virtual assistants mulling around ready to follow your demands. No adventuring, but lots of relaxing, swimming, gaming, and etc to be had.",
        imageSrc: '/images/fbR41bq-d2.jpg'
    },
    {
        id: 'experience_reincarnation',
        title: 'EXPERIENCE REINCARNATION',
        cost: '',
        description: "Don't quite want to abandon this world just yet? You can always just be reborn as a brand new mage, and relive your childhood all over again with a different loving family. The exact extent of your memory retention is up to you. Maybe you want to keep your past memories up to a certain point? Maybe just certain pleasant memories while scrapping the bad ones? Just enough to retain your personality? Or maybe you want a complete blank slate? It's pretty much up to you. You can also choose whether the public will know your previous identity, or if they'll all just be told that you're a brand new mage.",
        imageSrc: '/images/gXmq9Sp-d3.jpg'
    },
    {
        id: 'give_yourself_unto_the_void',
        title: 'GIVE YOURSELF UNTO THE VOID',
        cost: '',
        description: "Oh. You want to...? Well, I don't judge. But I must make it absolutely clear that this is {i}game{/i} over. It's the exact sort of death you'd experience if you died in combat: an endless, eternal oblivion. You're just going to be gone. It's odd, but a few people do choose this option, for their own reasons. We make sure their last moments are filled with untold bliss as their minds are filled with all of their loveliest memories played a million times over in an instant, before they sink into the cool waters of oblivion.\n\nJust know that we'll miss you...",
        imageSrc: '/images/932tfRMM-d4.jpg'
    },
];

export const RETIREMENT_CHOICES_DATA_KO: ChoiceItem[] = [
    {
        id: 'enter_aether',
        title: '에테르 속으로',
        cost: '',
        description: "에테르는 우리 우주만큼이나 거대한 초우주입니다. 가상 승천 프로젝트를 진행하던 중 어떻게 연결할 수 있게 되었죠. 하지만 에테르는 우리 네트워크의 일부로 종속된 취급을 받아서 우리 우주의 불안정화 문제를 같이 겪고 있습니다. 에테르는 일정한 절차를 통해 생성된 수많은 가상 우주의 집합체입니다. 각각의 가상 우주에는 신비한 거주자들과, 해결해야 할 수많은 미스테리와 모험들이 가득합니다. 사회 체계 역시 우리의 것과는 완전히 다르기 때문에, 이곳에 질린 이들에게는 신선한 자극이 될 수도 있습니다. 모험심 가득한 마녀들에게 최고지만, 위험할 수 있다는 건 명심하셔야 해요.",
        imageSrc: '/images/v45DyXN1-d1.jpg'
    },
    {
        id: 'enter_sunset_city',
        title: '일몰의 도시로',
        cost: '',
        description: "일몰의 도시는 홍옥의 의회에서 만들어낸 초우주의 별명입니다. 원래는 의원들만의 공간으로 설계되었습니다만, 충분한 처리 능력이 확보되지 대중에게 개방되었습니다. 에테르나 우리의 현실 세계외는 다르게, 그곳에는 평화와 안식만이 가득합니다. 도시의 아름다운 거리를 걷다 보면 평온함을 느낄 수 있을 거에요. 도시의 모습은 각자의 기호에 맞춰 변화하고, 수많은 관리자들이 당신의 시중을 들기 위해 대기하고 있습니다. 딱히 모험이랄 것은 없지만, 휴식, 수영, 소소한 게임 같은 것들이라면 원없이 할 수 있을 겁니다.",
        imageSrc: '/images/fbR41bq-d2.jpg'
    },
    {
        id: 'experience_reincarnation',
        title: '환생',
        cost: '',
        description: "이 세계를 버리기에는 아직 이른가요? 언제든 새로운 마법소녀로 태어날 수 있습니다. 또 다른 가족의 품에서 사랑받으며 어린 시절을 다시 보낼 수 있는 것이죠. 전생의 기억을 어디까지 간직할지는 당신의 선택에 달렸습니다. 특정 시기까지만 남겨 둘 수도, 좋은 기억만 남기고 나쁜 기억은 버릴 수도, 당신의 성격을 유지할 정도로만 남길 수도 있고, 아예 완전히 새로운 시작을 할 수도 있죠. 게다가 사람들에게 당신의 전생을 알릴 수도, 아니면 그냥 새로운 마법소녀라고만 할 수도 있습니다.",
        imageSrc: '/images/gXmq9Sp-d3.jpg'
    },
    {
        id: 'give_yourself_unto_the_void',
        title: '공허',
        cost: '',
        description: "어, 정말 그걸...? 음, 제가 뭐라고 할 입장은 아닙니다. 하지만 이건 끝이라는 걸 꼭 말씀드려야겠네요. 마치 싸우다가 전사하는 것처럼, 끝없는 망각 속으로 빠지는 겁니다. 그냥, 사라지는 거에요. 흔한 건 아니지만 이쪽을 고르는 사람들도 몇 명 있고, 각자 자신들만의 이유가 있을 겁니다. 저희 쪽에서는 그들의 마지막 순간을 가장 황홀하게 해 드린답니다. 망각 속으로 빠지기 전에 그 사람의 최고의 기억을 백만 번 겹쳐서 재생시켜 드리죠.\n\n이것만은 알아 두세요. 당신이 그리울 거에요...",
        imageSrc: '/images/932tfRMM-d4.jpg'
    },
];

export const CHILD_OF_GOD_DATA: ChoiceItem[] = [{
    id: 'free_child_of_god',
    title: 'FREE THE CHILD OF GOD',
    cost: '',
    description: `Look, I understand. We all felt the same way once, when we were young. But I'm afraid it's simply impossible. Plenty have tried before you, only to find the entire world uniting against them, countless mages banding together to prevent one's naiveté from dooming us all. I mean, just look around you. We've created a world without war, without hunger or thirst or disease — hell, one day all hardship will be eliminated completely. Having grown up with it, you might take it for granted, but it's impossible to overstate how {i}extraordinary{/i} that is. And what's the alternative? Without our magic, the Allmillor will tear the Earth to tatters within months. Leave only empty ruins hovering over the Othersky, devoid of life, until the simulation shuts down. Is that really the future you envision?

Do you think we're merely sadists? Have you seen her quarters? She practically lives in luxury. The Mother herself sings her a lullaby every night, for goodness sake. What we had to do to her — and her father — is tragic, yes. But we're doing everything she can to make her as comfortable as possible. There's a reason we only make new mages once a year. We endeavour to minimize the strain on her as much as possible.

Damn it, think about what you're doing. Do you know what things were like before? We'd been forsaken by our only god. The planet dried up, and almost every harvest died in the scorching heat. Globe-spanning wars were fought over what little resources remained, despotic warlords having entire populations massacred over a single well's worth of water. Plagues battered the few wartorn survivors, leaving living corpses limping through the streets, their flesh sloughing from their bones. What were we supposed to do? We're not proud of what we've done, but it was a grim necessity. None of us would be here otherwise.

Would you really doom the entire world for the sake of a single child?`,
    imageSrc: '/images/GfZ2DQwh-d5.jpg'
}];

export const CHILD_OF_GOD_DATA_KO: ChoiceItem[] = [{
    id: 'free_child_of_god',
    title: '신의 아이를 해방시키기',
    cost: '',
    description: `잠깐만요. 저도 이해해요. 저도 어렸을 때는 그렇게 생각했죠. 하지만 이건 그냥 불가능한 일이에요. 당신 이전에도 수많은 사람들이 시도했어요. 하지만 전 세계의 모든 마녀들이 연합해서 그들을 막아섰어요. 한 사람의 순진함으로 모두가 파멸할 수는 없다면서요. 제 말은, 그냥 한번 주위를 둘러보세요. 이 세계에는 전쟁도, 배고픔도, 질병도 없고 - 그리고, 좀만 지나면 다른 고통들도 모두 없어질 거라구요. 당신이야 그렇게 자라왔으니까 이게 당연해 보일 수도 있겠는데, 이거 진짜 설명할 수도 없을 만큼 엄청난 거에요. 근데 그걸 다 버리면? 마법이 없으면 몇 달 안에 올밀러들이 지구를 갈기갈기 찢어 놓을 거에요. 공허한 폐허들만이 아더스카이를 떠돌겠죠. 살아 있는 건 아무것도 없을 거에요. 그렇게 모든 게 끝난다구요. 그게 정말 당신이 원하는 미래인가요?

저희가 그냥 사디스트 같으세요? 그 아이가 어떻게 지내는지 보셨나요? 그만한 사치도 없어요. 아니, 어머니께서 직접 밤마다 자장가를 불러 주신다구요. 물론 그 아이에게 - 그리고 그 아버지에게 - 했던 짓은 정말 끔찍해요, 인정할게요. 하지만 그래도 최선의 편의를 봐 주고 있다구요. 새로운 마법소녀들이 일 년에 한 번씩만 태어나는 것도 다 이유가 있어요. 그녀에게 최대한 부담을 주지 않기 위해서라구요.

제발 좀, 생각 좀 해 보세요. 예전에 어땠는지 알기나 해요? 우리의 유일한 신이 우릴 버렸다구요. 행성은 말라 비틀어지고, 농작물은 다 시들어 버렸어요. 그 얼마 안 남은 자원을 두고 전 지구가 편을 갈라 싸웠어요. 흉악한 군대 두목들은 우물물 하나를 두고 수천, 수만 명을 학살했어요. 그렇게 살아남은 사람들은 역병에 걸려 고통받았고, 살아 있는 시체들이 절뚝대면서 거리를 돌아다녔어요. 뼈에서 막 살점이 떨어져 나갔다구요. 우리가 뭘 했어야 했을까요? 이게 자랑스러워할 일은 아니지만, 꼭 해야만 하는 일이었어요. 그게 아니면 우리 모두 여기 없었을 거에요.

정말 한 아이 때문에 세계를 파멸시킬 생각인가요?`,
    imageSrc: '/images/GfZ2DQwh-d5.jpg'
}];
