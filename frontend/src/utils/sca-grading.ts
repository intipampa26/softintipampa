

export interface DefectEntry {
  key: string;
  name: string;
  category: 1 | 2;
  equivalence: number;
  quantity: number;
}

export interface ScoreRange {
  min: number;
  max: number;
  estimated: number;
}

export interface GradeResult {
  totalDefects: number;
  category1Total: number;
  category2Total: number;
  grade: 1 | 2 | 3 | 4 | 5;
  label: string;
  score: ScoreRange;
  interpretation: string;
  specialty: boolean;
}

export const GRADE_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Specialty',
  2: 'Premium',
  3: 'Exchange',
  4: 'Below Standard',
  5: 'Off Grade',
};

export const GRADE_INTERPRETATIONS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'High quality specialty coffee with minimal defects.',
  2: 'Premium coffee with very few defects.',
  3: 'Commercial exchange grade coffee.',
  4: 'Coffee below specialty standards.',
  5: 'Off grade coffee with excessive defects.',
};

export const DEFECT_CATALOG: Omit<DefectEntry, 'quantity'>[] = [
  { key: 'full_black',             name: 'Full Black',              category: 1, equivalence: 1  },
  { key: 'full_sour',              name: 'Full Sour',               category: 1, equivalence: 1  },
  { key: 'pod_or_cherry',          name: 'Pod / Cherry',            category: 1, equivalence: 1  },
  { key: 'fungus_damage',          name: 'Fungus Damage',           category: 1, equivalence: 1  },
  { key: 'foreign_matter',         name: 'Foreign Matter',          category: 1, equivalence: 1  },
  { key: 'severe_insect_damage',   name: 'Severe Insect Damage',    category: 1, equivalence: 1  },
  { key: 'partial_black',          name: 'Partial Black',           category: 2, equivalence: 3  },
  { key: 'partial_sour',           name: 'Partial Sour',            category: 2, equivalence: 3  },
  { key: 'parchment',              name: 'Parchment',               category: 2, equivalence: 5  },
  { key: 'floaters',               name: 'Floaters',                category: 2, equivalence: 5  },
  { key: 'immature',               name: 'Immature',                category: 2, equivalence: 5  },
  { key: 'withered',               name: 'Withered',                category: 2, equivalence: 5  },
  { key: 'shell',                  name: 'Shell',                   category: 2, equivalence: 5  },
  { key: 'broken_chipped_cut',     name: 'Broken / Chipped / Cut',  category: 2, equivalence: 5  },
  { key: 'hull_husk',              name: 'Hull / Husk',             category: 2, equivalence: 5  },
  { key: 'slight_insect_damage',   name: 'Slight Insect Damage',    category: 2, equivalence: 10 },
];

const SCORE_RANGES: Array<{ maxDefects: number; min: number; max: number }> = [
  { maxDefects: 0,  min: 90, max: 92 },
  { maxDefects: 1,  min: 88, max: 90 },
  { maxDefects: 2,  min: 86, max: 88 },
  { maxDefects: 3,  min: 84, max: 86 },
  { maxDefects: 4,  min: 82, max: 84 },
  { maxDefects: 5,  min: 80, max: 82 },
  { maxDefects: 8,  min: 78, max: 80 },
  { maxDefects: 23, min: 74, max: 78 },
  { maxDefects: 86, min: 65, max: 74 },
];

export function validateDefectEntries(entries: DefectEntry[]): string[] {
  const errors: string[] = [];
  for (const e of entries) {
    if (e.quantity < 0)      errors.push(`"${e.key}": quantity must be >= 0`);
    if (e.equivalence <= 0)  errors.push(`"${e.key}": equivalence must be > 0`);
    if (![1, 2].includes(e.category)) errors.push(`"${e.key}": category must be 1 or 2`);
  }
  return errors;
}

export function calculateEstimatedScore(totalDefects: number): ScoreRange {
  const range = SCORE_RANGES.find(r => totalDefects <= r.maxDefects)
    ?? { min: 55, max: 65 };
  return {
    min: range.min,
    max: range.max,
    estimated: Math.round((range.min + range.max) / 2),
  };
}

export function calculateCoffeeGrade(entries: DefectEntry[]): GradeResult {
  const errors = validateDefectEntries(entries);
  if (errors.length > 0) {
    throw new Error(`Invalid defect entries:\n${errors.join('\n')}`);
  }

  let category1Total = 0;
  let category2Total = 0;

  for (const e of entries) {
    const equiv = Math.ceil(e.quantity / e.equivalence);
    if (e.category === 1) category1Total += equiv;
    else                  category2Total += equiv;
  }

  const totalDefects = category1Total + category2Total;

  let grade: 1 | 2 | 3 | 4 | 5;
  if (category1Total === 0 && totalDefects <= 5)       grade = 1;
  else if (category1Total === 0 && totalDefects <= 8)  grade = 2;
  else if (totalDefects <= 23)                         grade = 3;
  else if (totalDefects <= 86)                         grade = 4;
  else                                                 grade = 5;

  return {
    totalDefects,
    category1Total,
    category2Total,
    grade,
    label:          GRADE_LABELS[grade],
    score:          calculateEstimatedScore(totalDefects),
    interpretation: GRADE_INTERPRETATIONS[grade],
    specialty:      grade === 1,
  };
}

export function buildDefectEntries(
  quantities: Record<string, number>,
): DefectEntry[] {
  return DEFECT_CATALOG.map(d => ({
    ...d,
    quantity: quantities[d.key] ?? 0,
  }));
}

export const MOCK_SPECIALTY_SAMPLE: DefectEntry[] = buildDefectEntries({
  floaters: 5,
  immature: 5,
});

export const MOCK_EXCHANGE_SAMPLE: DefectEntry[] = buildDefectEntries({
  full_black:         1,
  partial_black:      3,
  immature:           5,
  broken_chipped_cut: 10,
});

export const MOCK_OFF_GRADE_SAMPLE: DefectEntry[] = buildDefectEntries({
  full_black:           10,
  full_sour:            5,
  fungus_damage:        8,
  partial_black:        15,
  slight_insect_damage: 30,
});

