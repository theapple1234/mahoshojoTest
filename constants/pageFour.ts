
import type { ChoiceItem } from '../types';

export const DRYADEA_DATA = {
    title: "DRYSDEA, GODDESS OF STABILITY",
    imageSrc: "/images/Y7cqGgf2-main5.jpg",
    description: `Oh! I see you've found your way down to my section at last! It may not seem impressive compared to my sisters', but I assure you, it's bursting with potential. Can you believe I'm the second eldest of them all? I certainly don't act like it! After a few centuries or millennia, mages inevitably start to suffer from IID - Immortally Induced Depression - in which days pass by like seconds, and the world's events feel so repetitive, so pointless, so {i}boring{/i}. That's about when they usually retire... but being a Daughter, that wasn't an option for me, obviously. So, every few centuries or so, I copy my psyche to upload it into the Aether, and then, as for my physical body... I wipe most of its memories! It's like being born again. In reality, I'm not all {i}that{/i} much older than yourself, at least mentally. This means unlike my family, I can look at everything with a fresh perspective, and I have more energy to engage with our mages on a one-on-one basis. There's nothing I love more than suddenly visiting a new young mage, and seeing the starstruck smile on their face!

I used to simply offer the broadest selection of blessings and spells, since mages would keep coming to me with new ideas, and I wouldn't be able to resist adding them to the repertoire. Eventually, the Mother came up to me with a better idea: why not just allow each mage to create their own, custom spells? Of course, most mages are never allowed one of these treasured sigils, but since you're one of those special ones, I don't see why I couldn't make an exception...`
};

export const LIMITLESS_POTENTIAL_DATA = {
    title: "THE BLESSING OF LIMITLESS POTENTIAL",
    imageSrc: "/images/5gVcLdHy-main6.jpg",
    description: `What an exciting opportunity you have here! Have an entirely unique idea for a spell that you haven't seen offered by any of the other blessings? Or maybe you just want to make a slightly different version of an existing spell, customized according to your exact preferences? The other mages will seethe with jealousy once they've noticed you've gotten your grubby mitts onto one of these super rare {w}Ruhai{/w} sigils!

However, I must warn you these don't have the "satisfaction guaranteed" status of premade spells, since they haven't undergone nearly as much refinement. I've found the more powerful one tries to make a custom spell, the higher the chances are that it will backfire dramatically on them, especially when it comes to Ruhai sigils. Basically, if you want to push spells to their limits in order to utterly cheese fights, you'd have better luck doing it with the existing powers.`
};

export const CUSTOM_SPELL_RULES_DATA = {
    title: "I must remind you that the spells should be fair. This is doubly important in Multiplayer Mode, in which custom spells will obviously be subjected to increased scrutiny. Thus, keep the following in mind:",
    rules: [
        "Spells should have {i}counterplay{/i}. This means that almost every sort of build of Mage should have some way to adequately fight back against it. If it's particularly strong against one sort of build, it should be particularly weak against another.",
        "Spells should be {i}specific{/i}. You cannot bundle a wide array of powers into an 'all-in-one spell'. Every effect of the spell should be relevant to its premise.",
        "Spells cannot be 'meta' nor recursive. This means they cannot affect, weaken, or strengthen any other powers, nor can they create a feedback loop that makes you infinitely powerful.",
        "Controlling or travelling through time is not possible.",
        "Note, though, that I lot tend to be particularly lenient towards spells I find especially creative or amusing!",
    ]
};

export const LIMITLESS_POTENTIAL_RUNES_DATA: ChoiceItem[] = [
    {
        id: 'ruhai',
        title: 'RUHAI',
        cost: 'Costs 8 BP',
        description: "{c}Ruhai{/c} runes allow you to design a power that fits into one of the pre-established categories of any Blessing you've taken the {j}Juathas{/j} sigil for. For example, a spell that involves temperature control would fit into {i}Metathermics{/i}. These must be fairly limited in scope, and therefore cannot fit into multiple categories at once. For example, just because you took {i}Telekinetics{/i} does not mean that you can alter the cells of your body in a way that would encroach on the territory of {i}Transformation{/i}. You also cannot create any spells in the {i}Metamagic{/i} category, or any spells that would involve creating a companion, beast, vehicle, or weapon on the {i}Reference Page{/i}. You also can't play with temporal magic (time travel is always overpowered). Basically, these spells should be on the level of a {w}Kaarn{/w} or low-level {g}Purth{/g}-tier spell.",
        imageSrc: '/images/LzwcyY7z-ruhai.png'
    },
    {
        id: 'mialgrath',
        title: 'MILGRATH',
        cost: 'Costs 16 BP',
        description: "{b}Milgrath{/b} runes can defy {i}one{/i} of the prior rune's restrictions. They can either be more unique, fitting into multiple predefined spell categories at once or none at all; or they can be more powerful, while still being limited to one category. Of course, this still does not mean you can have an 'all-in-one' spell; you have to make a good faith attempt to stick to your premise and avoid turning the power into an instant win button. Anything that would fit into the category of {i}Metamagic{/i} or temporal manipulation is still off-limits, but you can now create vehicles, weapons, etc, and grant yourself up to {w}100 Points{/w} on the {i}Reference Page{/i} to do so, as well as add custom modifications that were not included on the {i}Reference Page{/i}. These spells should be on the level of a high-level {g}Purth{/g} or a {r}Xuth{/r}-tier spell (though the latter will still require a {w}trial.{/w})",
        imageSrc: '/images/nsKwSt0b-mialgrath.png'
    }
];
