
import type { ChoiceItem } from '../types';

export const LOST_BLESSING_INTRO = {
    title: "THE LOST BLESSING",
    description_p1: `You poor, silly thing. I'm sure your head's been pumped full o' the queen bitch's propaganda, saying we want to destroy the universe when all we want is to pull it, and that poor little girl, out from beneath {i}her{/i} totalitarian rule. But anybody smart enough to find their way here is surely smart enough to see through all that bullshit, right? Either way, little bird, it doesn't matter. What I've got here is a little misfit island of premium spells - that's right, this is the lost blessing! The one that bitch stuffed full of spells she thought were too "powerful" for everybody before sealing it away...`,
    description_p2: `First time here? Or perhaps a familiar face? It matters not. We aren't that stingy. Anyone with the resolve to save 'that child' has the right to claim these sigils. However, if you intend to settle for a peaceful world, or live your life flattering that 'queen's' reign... then say goodbye to these sigils forever!

None of these sigils can be earned through the {bp}Sinthru's Contract{/bp} alone, but there is one bonus: as a reward for your effort and courage in making it all the way here, you're entitled to one pick for free.`
};

export const LOST_BLESSING_INTRO_KO = {
    title: "잃어버린 축복",
    description_p1: `가엾고 어리석은 것. 지금쯤 분명 그 잘난 어머니의 프로파간다가 머릿속에 꽉 차 있겠지. 우리가 이 우주를 멸망시킬 거라고, 그렇지? 우리가 하고 싶은 건 이 세상을, 그리고 그 불쌍한 아이를 그녀의 철권통치에서 구해 내는 건데 말이야. 뭐, 이걸 찾아낼 정도로 똑똑한 사람이라면 진작에 저들의 같잖은 거짓말 따위는 다 꿰뚫어봤겠지만. 그게 아니더라도 별 상관은 없어. 여기 내가 모아 둔 것들은 아주 특별한 마법의 이단아들이거든 - 맞아, 바로 그 잃어버린 축복이지. 그년이 마법소녀들에게 주기에는 "너무나 강력한" 마법들을 이렇게 한군데 쑤셔넣고 봉인해 버린 결과가 이거야.`,
    description_p2: `처음 왔니? 아니면 낯익은 얼굴인가? 뭐 상관없어. 우린 그렇게 꽉 막힌 사람들이 아니거든. '그 아이'를 구하겠다는 결심만 있다면 누구든 이 표식들을 가질 자격이 있어. 하지만, 이 평화로운 세상에 안주하겠다거나, 그 '여왕'의 통치에 아부하며 살 생각이라면... 이 표식들과는 영영 작별이야!

이 표식들은 {bp}신스루의 계약{/bp}만으로는 얻을 수 없어. 하지만 보너스는 하나 챙겨줄게. 여기까지 찾아온 네 노력과 용기에 대한 상으로, 하나는 그냥 공짜로 가져가도 좋아.`
};

export const LOST_POWERS_DATA: ChoiceItem[] = [
    {
        id: 'save_point',
        title: 'SAVE POINT',
        imageSrc: '/images/qLcyp2Fb-lost1.jpg',
        description: "The Mother always insisted that temporal powers were simply \"impossible\". A bold-faced lie. They experimented with them once and found they were very possible, but canned the whole experiment and sealed them away, worried what sort of Pandora's Box they were opening. Once in your life, this spell will allow you to set a \"save point\". At any point in the next 5 years, you can revert everything back to that save point at will. This destroys the save point permanently. If you die, or if the 5 years passes on its own, you'll flash back to the point automatically."
    },
    {
        id: 'anguish',
        title: 'ANGUISH',
        imageSrc: '/images/C320LCkf-lost2.png',
        description: "That Nero Inc shit has got limits. Limits on the sorts of feelings you can evoke, the experiences you can create. But with this, if you've got a Verse, you don't have any more limits. You can create emotions more intense than any that are possible within the surface verse. Sure, you can create pleasure powerful enough to fry the mind... or you can create a hellscape of agony so unspeakable it will fundamentally break the psyches of even the most legendary and stalwart of souls. Imagine getting one of those Daughters into a hell like that..."
    },
    {
        id: 'power_drain',
        title: 'POWER DRAIN',
        imageSrc: '/images/ZRy57f0r-lost3.jpg',
        description: "Granting powers through Theosis is easy to do, but hard as fuck to undo. They once experimented with ways to strip a mage of their powers, but the queen bitch shut it down, fearing it might lead to 'authoritarianism', the fuckin' hypocrite. We've got a hack job of our that come pretty close, though. Once you've got a mage down for the count, really knocked out cold, you can perform a ritual that strips their every power — permanently. You even get some of their powers at random after, though they only stick around temporarily."
    },
    {
        id: 'angelic_greatblade',
        title: 'ANGELIC GREATBLADE',
        imageSrc: '/images/NgPJN7p9-lost4.jpg',
        description: "The sword of the executioner Angels up in the Garden of Eden back when capital punishment was still a thing. It slices through mages as easy as it would mundanes — seriously, lobbing off limbs and splitting through torsos more easily than any other weapons in existence. However, they are so powerful that it's painful just to holds its handle. They are also enchanted to feel extremely heavy and exhausting to wield, and even the strongest mages will find them slow and unwieldy in combat, so they're best used to finish off weakened foes."
    }
];

export const LOST_POWERS_DATA_KO: ChoiceItem[] = [
    {
        id: 'save_point',
        title: '세이브 포인트',
        imageSrc: '/images/qLcyp2Fb-lost1.jpg',
        description: "'어머니'는 언제나 시간 조작은 \"불가능\"하다고 못박았지. 낮짝도 두껍게 거짓말을 한 거야. 실험을 해 본 적이 있었고, 가능했어. 하지만 판도라의 상자를 열면 무슨 일이 터질지 몰라서 그냥 없었던 걸로 하고 봉인시킨 거야.\n\n이 마법은 인생에 단 한 번만 사용할 수 있고, 사용하면 \"세이브 포인트\"를 만들 수 있어. 향후 5년 동안 언제라도 세이브 포인트로 돌아갈 수 있는데, 그렇게 돌아가면 세이브 포인트는 영구히 소실되지. 네가 죽거나 5년이 아무 일 없이 흘러간다면, 그 순간 다시 세이브 포인트로 복귀하게 돼."
    },
    {
        id: 'anguish',
        title: '비련',
        imageSrc: '/images/C320LCkf-lost2.png',
        description: "네로 주식회사의 그것들은 한계가 뚜렷해. 불러일으킬 수 있는 감정이나, 만들어낼 수 있는 경험에 제한이 많아. 하지만 이 마법이 있으면 가상우주에서의 한계를 완전히 돌파할 수 있어. 아니, 진짜보다 더 강렬한 감정들을 만들어낼 수도 있지. 이를테면 뇌가 타 버릴 정도의 엄청난 쾌락이라든가... 아니면 형언할 수 없을 정도로 끔찍한 고통, 초월적으로 강인한 정신력의 소유자들까지도 망가뜨릴 수 있는 그런 생지옥을 만들어낼 수도 있지. \"딸들\" 중 하나를 거기 빠뜨리면 어떻겠어?"
    },
    {
        id: 'power_drain',
        title: '능력 흡수',
        imageSrc: '/images/ZRy57f0r-lost3.jpg',
        description: "테오시스로 힘을 부여하는 건 쉽지만, 그걸 되돌리는 건 더럽게 어렵단 말씀. 한 번 마법소녀의 힘을 빼앗는 실험을 해 본 적이 있긴 한데, 그년이 그런 건 두고 볼 수 없다면서 금지해 버렸지. '독재'에 악용될 가능성이 있다나... 빌어먹을 위선자 같으니. 그래도 우린 비슷한 걸 해킹으로 만들어내긴 했어. 네가 다른 마법소녀를 완전히 기절시켜 놓은 상태라면, 이 간단한 의식 한 번으로 능력 전부를 없애 버릴 수 있을 거야. 영원히. 그리고 그렇게 없앤 능력들 중 일부가 너한테 건너오지. 뭐가 넘어올지는 모르고, 시간이 지나면 결국 사라지지만."
    },
    {
        id: 'angelic_greatblade',
        title: '천사의 대검',
        imageSrc: '/images/NgPJN7p9-lost4.jpg',
        description: "사형이 아직 집행되던 시절에 에덴 동산에 있던 천사들이 쓰던 처형용 대검이야. 일반인, 마법소녀 가릴 것 없이 무 자르듯이 베어 버릴 수 있어. 아니, 농담이 아니라 그 어떤 무기보다 사람 몸에는 더 잘 들걸. 대신, 너무 강력한 무기라서 손잡이를 잡는 것만으로도 고통스러울 거야. 들고 휘두를 때 엄청 무겁게 느껴지는 마법이 걸려 있어서 체력이 정말 빨리 빠질 거야. 세상에서 근력이 제일 강한 마법소녀가 잡아도 전투용으로 쓰기에는 너무 느리고 거추장스럽지. 그러니까 적을 무력화한 뒤에 마무리할 때 쓰는 게 제일 좋겠지?"
    }
];
