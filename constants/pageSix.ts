
import type { ChoiceItem } from '../types';

export const RETIREMENT_INTRO_DATA = {
    title: "YOUR RETIREMENT",
    description: `We treat IID as if its some sort of medical syndrome, when in reality, it's human psychology. As you experience everything there is to experience, every day seems to go by faster than the one before; within a millennium or two, entire decades are flying past in what feels like the blink of an eye. Events that once seemed so shocking or exciting to you become hopelessly mundane; all of history reveals itself as the same cycles repeating over and over and over again, with no true progress and nothing new under the sun. While your actions may seem world-altering for a few centuries, everything you do is eventually relegated to the history books as the world moves on, and another legend rises to solve some new problem that seems eerily similar to one you already "solved" long ago. You come to be seen as old-fashioned, hopelessly out of touch with the hundreds of generations that came after you, who've evolved so drastically that you're just as disgusted by them as they are by you. No wonder so many people make arrangements for... retirement.

Of course, retirement is not literally death. There's no reason your story has to end there. Instead, consider it a fresh start — a new beginning. But if this world ever gets too boring for you, it may be time to think of moving on to another one. No need to retire anytime soon, though; in fact, it'd really be smartest if you'd stick around until we've figured out this whole 'destabilization' thing, as if our verse shuts down, these 'afterlives' will shut down too.`
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
