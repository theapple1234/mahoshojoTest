
// FIX: Define and export the 'Dominion' type and remove circular self-import.
export interface Dominion {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

export interface Trait {
  id: string;
  title: string;
  cost: string;
  description: string;
  imageSrc: string;
}

export type MagicGrade = 'kaarn' | 'purth' | 'xuth' | 'lekolu' | 'sinthru';

export interface ChoiceItem {
  id:string;
  title: string;
  cost?: string;
  description: string;
  imageSrc: string;
  requires?: string | string[];
  grade?: MagicGrade;
}

export interface School {
  id: string;
  title: string;
  description: string;
  costBlurb: string;
  imageSrc: string;
}

export interface Classmate {
  id: string;
  name: string;
  cost: string;
  description: string;
  imageSrc: string;
  birthplace: string;
  signature: string;
  otherPowers: string;
}

export interface Colleague extends Classmate {}

export interface CustomColleagueOption {
    id: string;
    cost: string;
    description: string;
}

export interface CustomClassmateOption {
    id: string;
    cost: string;
    description: string;
}

export interface CustomClassmateInstance {
    id: number;
    optionId: string;
    companionName: string | null;
}

export interface CustomColleagueInstance {
    id: number;
    optionId: string;
    companionName: string | null;
}

export interface Mentor {
    id: string; // Colleague ID or Custom Colleague Instance ID (as string)
    type: 'premade' | 'custom';
    name: string;
    cost: number; // The base FP cost
}

export interface Mentee {
    id: string; // Classmate ID or Custom Option ID
    type: 'classmate' | 'custom';
    name: string;
    originalCost: number;
}

export interface VacationHome {
    id: string;
    name?: string; // New field for naming the home
    dominionId: string | null;
    houseId: string | null;
    upgradeIds: Set<string>;
    mansionExtraSqFt: number;
    islandExtraMiles: number;
    vrChamberCostType: 'fp' | 'bp' | null;
    mythicalPetName: string | null;
}

export interface MovingOutHome {
    id: string;
    dominionId: string | null;
    houseId: string | null;
    upgradeIds: Set<string>;
    isInherited: boolean;
    inheritedFromId?: string | null;
    vrChamberCostType: 'fp' | 'bp' | null;
}

export interface SigilSubOption {
  id: string;
  description: string;
  imageSrc: string;
}

export interface Sigil {
  id: string;
  title: string;
  cost: string;
  description: string;
  imageSrc: string;
  subOptions?: SigilSubOption[];
}

export interface GoodTidingsSigilTier {
    id: 'standard' | 'journeyman' | 'master';
    title: string;
    description: string;
    benefits: string;
    cost: string;
    imageSrc: string;
}

export interface CompellingWillSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    unlocks?: string[];
    benefits: {
        telekinetics?: number;
        metathermics?: number;
    };
}

export interface CompellingWillPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[]; // IDs of required sigils or other powers
    grade?: MagicGrade;
}

export interface WorldlyWisdomSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Arborealist' | 'Sanctified' | 'Healer' | 'Dark Art';
    benefits: {
        eleanors?: number;
        genevieves?: number;
    };
    unlocks?: string;
}

export interface WorldlyWisdomPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[]; 
    specialRequirement?: string;
    grade?: MagicGrade;
}

export interface BitterDissatisfactionSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Fireborn' | 'Brewer' | 'Beastmother' | 'Shifter' | 'Mageweaver' | 'Parasitology';
    benefits: {
        brewing?: number;
        soulAlchemy?: number;
        transformation?: number;
    };
    unlocks?: string;
}

export interface BitterDissatisfactionPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[]; 
    grade?: MagicGrade;
}

export interface LostHopeSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Young Witch' | 'Spirit Channel' | 'Deadseer' | 'Necromancer' | 'Lazarus' | 'Forbidden Arts' | 'Lich Queen';
    benefits: {
        channeling?: number;
        necromancy?: number;
        blackMagic?: number;
    };
    unlocks?: string;
}

export interface LostHopePower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[];
    grade?: MagicGrade;
}

export interface FallenPeaceSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Left Brained' | 'Lobe' | 'Frontal Lobe' | 'Right Brained';
    benefits: {
        telepathy?: number;
        mentalManipulation?: number;
    };
    unlocks?: string;
}

export interface FallenPeacePower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[];
    grade?: MagicGrade;
}

export interface GraciousDefeatPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[]; 
    grade?: MagicGrade;
}

export interface GraciousDefeatSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    type: 'Fireborn' | 'Cultivate' | 'Realmkeeper' | 'Strengthen' | 'Sweet Suffering' | 'Pocket God' | 'Realmmaster';
    benefits: {
        entrance?: number;
        features?: number;
        influence?: number;
    };
    unlocks?: string;
}

export interface ClosedCircuitsSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    unlocks?: string[];
    benefits: {
        netAvatar?: number;
        technomancy?: number;
        naniteControl?: number;
    };
}

export interface ClosedCircuitsPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[];
    grade?: MagicGrade;
}

export interface RighteousCreationSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites: string[];
    unlocks?: string[];
    benefits: {
        specialty?: number;
        magitech?: number;
        arcaneConstructs?: number;
        metamagic?: number;
    };
}

export interface RighteousCreationPower {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    requires?: string[];
    grade?: MagicGrade;
}

export interface SpecialtyChoice {
    id: 'magitech_specialty' | 'arcane_constructs_specialty' | 'metamagic_specialty';
    title: string;
    description: string;
    imageSrc: string;
    grade?: MagicGrade;
}

export interface StarCrossedLoveSigil {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    prerequisites?: string[];
    benefits: {
        pacts: number;
    };
}

export interface StarCrossedLovePact {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    grade?: MagicGrade;
}

export interface CustomSpell {
    id: number;
    description: string;
    mialgrathApplied: boolean;
    mialgrathDescription: string;
    // New fields for Mialgrath Entity Assignment
    assignedEntityName?: string | null;
    assignedEntityType?: 'companion' | 'beast' | 'vehicle' | 'weapon' | null;
    isRuhaiKpPaid?: boolean;
    isMilgrathKpPaid?: boolean;
}

export type SigilCounts = {
  kaarn: number;
  purth: number;
  juathas: number;
  xuth: number;
  sinthru: number;
  lekolu: number;
};

// Companion Reference Page Types
export interface CompanionOption {
    id: string;
    title: string;
    imageSrc: string;
    cost?: number;
    description: string;
    requirement?: string;
}

// Build Types for Reference Page
export type CompanionSelections = { 
    category: string | null; 
    relationship: string | null; 
    traits: Set<string>; 
    perks: Map<string, number>; 
    powerLevel: string | null; 
    bpSpent: number; 
    inhumanFormBeastName?: string | null;
    specialWeaponName?: string | null;
    specialWeaponMap?: Set<string>;
    signaturePowerMap?: Set<string>;
    darkMagicianMap?: Set<string>;
    powerLevelMap?: Set<string>;
    customImage?: string | null;
};
export type WeaponSelections = { 
    category: string[]; 
    perks: Map<string, number>; 
    traits: Set<string>; 
    bpSpent: number; 
    attunedSpellMap?: Set<string>;
    customImage?: string | null;
};
export type BeastSelections = { 
    category: string[]; 
    size: string | null; 
    perks: Map<string, number>; 
    traits: Set<string>; 
    bpSpent: number; 
    magicalBeastCount?: number;
    magicalBeastMap?: Set<string>;
    customImage?: string | null;
};
export type VehicleSelections = { 
    category: string[]; 
    perks: Map<string, number>; 
    traits: Set<string>; 
    bpSpent: number; 
    customImage?: string | null;
};

export type SavedBuildData = { version: number; data: any; };
export type BuildType = 'companions' | 'weapons' | 'beasts' | 'vehicles';
export type AllBuilds = Record<BuildType, Record<string, SavedBuildData>>;