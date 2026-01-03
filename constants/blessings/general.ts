
import type { ChoiceItem, Sigil } from '../../types';

export const BLESSING_ENGRAVINGS: ChoiceItem[] = [
    { id: 'skin', title: 'SKIN', cost: 'Costs 0 FP', description: "Not a very pleasant process, getting these sigils etched onto your bare skin... but what are you gonna do? At least the Blessing can't be taken away, unless that part of your body is chopped off. However, this is required for Blessings affected by the trait {w}Magician{/w}.", imageSrc: '/images/N68jJM5s-where1.jpg' },
    { id: 'clothes', title: 'CLOTHES', cost: 'Costs 0 FP', description: "Probably the simplest option: have it emblazoned on your dress! The dress that comes with your alter ego is massively strengthened compared to normal fabric, but still, if it's torn or stolen, you'll lose the blessing until you can get it repaired or replaced.", imageSrc: '/images/W4yFYW8w-where2.png' },
    { id: 'weapon', title: 'WEAPON', cost: 'Costs 0 FP', description: "A weapon will grant you {w}20 Weapon Points{/w} on the {i}Reference Page{/i}. Carving a Blessing onto a weapon will grant a {bp}1 BP{/bp} refund on its {j}Juathas{/j} sigil. However, in the 'Engrave this Blessing' section, choosing a 'new' weapon costs {fp}5 FP{/fp}. The power will be limited to the weapon and useless if you are disarmed.", imageSrc: '/images/tPJVNydk-where3.jpg' },
];

export const COMMON_SIGILS_DATA: Sigil[] = [
  { id: 'kaarn', title: 'KAARN', cost: 'Costs 3 BP', imageSrc: '/images/zTm8fcLb-kaarn.png', description: "Named after a mage whose village was terrorized by a despotic Sinubih archmage. The archmage was technically more magically powerful, yet was overthrown with creative use of insect telepathy. The tale's moral? Never underestimate seemingly 'weak' magic." },
  { id: 'purth', title: 'PURTH', cost: 'Costs 5 BP', imageSrc: '/images/Dg6nz0R1-purth.png', description: "These represent breakthroughs in your understanding of a Blessing, as you unlock power that you didn't even know you had in you. For an average mage, this is about the greatest sort of power they'd acquire, with, perhaps, a single Xuth sigil of some sort." },
  { id: 'juathas', title: 'JUATHAS', cost: 'Costs 8 BP', imageSrc: '/images/SFbsP2R-juathas.png', description: "The most renowned and famous sigil, for it implies the attainment of a brand new blessing. One becomes worthy of them either throw acts of great valor, impressing one of the Daughters, or, of course, training for long periods to unlock one's innate potential." },
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
      { id: 'xuth_trial_2', imageSrc: '/images/PsWVCWVV-xuth2.png', description: "After the archlich Elvira was captured, the members of her inner cabinet fell further into cruelty and insanity, to the point even the covens ousted them and left them to fend for themselves. They decided exploiting the Schism, a distorted rupture brought about by a destabilization of our reality, could be their way of achieving a false Theosis and becoming gods. Of course, it went horribly, and left them these... {i}creatures{/i} known as the Sellith. They have just about every power you can imagine, but are too delirious to use them smartly, mostly throwing out devastating spells at random. They are faster and more durable than any mage, so you'll have to corner the thing. Killing one is considered harder than slaying a Grimsayer, so expect the fight of your life!" },
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
