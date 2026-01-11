
import { 
    CLOSED_CIRCUITS_SIGIL_TREE_DATA, 
    LOST_HOPE_SIGIL_TREE_DATA, 
    COMPELLING_WILL_SIGIL_TREE_DATA, 
    GOOD_TIDINGS_SIGIL_TREE_DATA, 
    WORLDLY_WISDOM_SIGIL_TREE_DATA, 
    BITTER_DISSATISFACTION_SIGIL_TREE_DATA, 
    FALLEN_PEACE_SIGIL_TREE_DATA, 
    GRACIOUS_DEFEAT_SIGIL_TREE_DATA, 
    RIGHTEOUS_CREATION_SIGIL_TREE_DATA, 
    STAR_CROSSED_LOVE_SIGIL_TREE_DATA 
} from '../constants';

export const PARENT_COST_MAP: { [key: number]: number } = { 0: -20, 1: -10, 2: 0, 3: 3, 4: 6, 5: 9, 6: 12 }; // FP cost
export const SIBLING_COST_PER = 3; // FP cost per sibling
export const STORAGE_KEY = 'seinaru_magecraft_builds';
export const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export type Cost = { fp: number; bp: number };

export const parseCost = (costString: string): Cost => {
  const cost: Cost = { fp: 0, bp: 0 };
  if (!costString) return cost;
  
  const lowerStr = costString.toLowerCase();
  if (lowerStr.includes('free') || lowerStr.includes('costs 0') || lowerStr.includes('variable') || lowerStr.includes('costs varies') || lowerStr.includes('소모값 변동')) {
    return cost;
  }
  
  let processedString = costString;
  if (lowerStr.includes('or')) {
    processedString = costString.split(/or/i)[0];
  }

  processedString = processedString.replace(/use\s+(-?\d+)/gi, '$1');
  
  const parts = processedString.split(',');

  parts.forEach(part => {
    const lowerPart = part.toLowerCase();
    const isGrant = lowerPart.includes('grants') || lowerPart.includes('제공');

    const fpMatch = part.match(/(-?\d+)\s*FP/i);
    if (fpMatch) {
      let value = parseInt(fpMatch[1], 10);
      cost.fp += isGrant ? -Math.abs(value) : Math.abs(value);
    }

    const bpMatch = part.match(/(-?\d+)\s*BP/i);
    if (bpMatch) {
      let value = parseInt(bpMatch[1], 10);
      cost.bp += isGrant ? -Math.abs(value) : Math.abs(value);
    }
  });
  
  return cost;
};

// Helper to determine parent blessing
export const getBlessingForNode = (nodeId: string): string | null => {
    if (CLOSED_CIRCUITS_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'closed_circuits';
    if (LOST_HOPE_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'lost_hope';
    if (COMPELLING_WILL_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'compelling_will';
    if (GOOD_TIDINGS_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'good_tidings';
    if (WORLDLY_WISDOM_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'worldly_wisdom';
    if (BITTER_DISSATISFACTION_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'bitter_dissatisfaction';
    if (FALLEN_PEACE_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'fallen_peace';
    if (GRACIOUS_DEFEAT_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'gracious_defeat';
    if (RIGHTEOUS_CREATION_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'righteous_creation';
    if (STAR_CROSSED_LOVE_SIGIL_TREE_DATA.some(s => s.id === nodeId)) return 'star_crossed_love';
    return null;
}
