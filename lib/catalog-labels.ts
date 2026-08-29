import type { Lang } from '@/lib/translations';

/**
 * Ngjyrat dhe zonat e printimit ruhen në databazë me një vlerë të vetme (anglisht),
 * që porositë e vjetra të mos ndryshojnë kuptim kur ndërrohet gjuha. Këtu ajo vlerë
 * kthehet në etiketën që sheh klienti.
 */

const COLORS: Record<string, { sq: string; en: string }> = {
  Black: { sq: 'E zezë', en: 'Black' },
  White: { sq: 'E bardhë', en: 'White' },
  Blue: { sq: 'Blu', en: 'Blue' },
  Red: { sq: 'E kuqe', en: 'Red' },
  Gray: { sq: 'Gri', en: 'Gray' },
  Green: { sq: 'Jeshile', en: 'Green' },
  Navy: { sq: 'Blu e errët', en: 'Navy' },
  Beige: { sq: 'Bezhë', en: 'Beige' },
};

const PRINT_AREAS: Record<string, { sq: string; en: string }> = {
  'Left Chest (9x4cm)': { sq: 'Gjoksi majtas (9×4 cm)', en: 'Left Chest (9×4 cm)' },
  'Sleeve (3x8cm)': { sq: 'Mëngë (3×8 cm)', en: 'Sleeve (3×8 cm)' },
  'Neck (4x2.5cm)': { sq: 'Qafë (4×2,5 cm)', en: 'Neck (4×2.5 cm)' },
  'Full Front (22x9cm)': { sq: 'Pjesa e përparme (22×9 cm)', en: 'Full Front (22×9 cm)' },
  'Full Back (30x25cm)': { sq: 'Pjesa e pasme (30×25 cm)', en: 'Full Back (30×25 cm)' },
};

function lookup(map: Record<string, { sq: string; en: string }>, value: string | null | undefined, lang: Lang) {
  if (!value) return '';
  return map[value]?.[lang] ?? value;
}

export function colorLabel(value: string | null | undefined, lang: Lang) {
  return lookup(COLORS, value, lang);
}

export function printAreaLabel(value: string | null | undefined, lang: Lang) {
  return lookup(PRINT_AREAS, value, lang);
}
