import { mappings, titleCase } from './utils';

function normalize(str: string) {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function fixKnownVariants(str: string) {
  const map: Record<string, string> = {
    niederosterreich: 'niederoesterreich',
    oberosterreich: 'oberoesterreich',
    karnten: 'kaernten',
  };
  return map[str] ?? str;
}

const c = mappings.countries;
const countryId = (k: keyof typeof mappings.countries) => c[k].id;

const usSubdivisions = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'district of columbia', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming',
];

const irelandSubs = [
  'carlow',
  'clare',
  'cork',
  'donegal',
  'dublin',
  'galway',
  'kerry',
  'kildare',
  'kilkenny',
  'laois',
  'limerick',
  'longford',
  'louth',
  'mayo',
  'meath',
  'monaghan',
  'offaly',
  'roscommon',
  'sligo',
  'tipperary',
  'waterford',
  'westmeath',
  'wexford',
  'wicklow',
];

const portugalSubs = [
  'aveiro',
  'beja',
  'coimbra',
  'faro',
  'leiria',
  'lisboa',
  'portalegre',
  'porto',
];

const austriaSubs = [
  'kaernten',
  'niederoesterreich',
  'oberoesterreich',
  'salzburg',
  'steiermark',
];

const swedenSubs = [
  'halland',
  'blekinge',
];

const englandSubs = [
  'east sussex',
  'west sussex',
];
const scotlandSubs = [
  'argyll',
  'bute',
  'east dunbartonshire',
  'west dunbartonshire',
];

const southKoreaSubs = [
  'busan',
  'chungcheongbukdo',
  'chungcheongnamdo',
  'daejeon',
  'deagu',
  'gangwondo',
  'gwangju',
  'gyeonggido',
  'gyeongsangbukdo',
  'gyeongsangnamdo',
  'incheon',
  'jejudo',
  'jeollabukdo',
  'jeollanamdo',
  'seoul',
];

const germanySubs = ['berlin'];
const italySubs = ['bolzano'];
const japanSubs = ['osaka'];
const singaporeSubs = ['singapore'];
const polandSubs = ['dolnoslaskie'];

const lookup = new Map<string, string>();

for (const name of usSubdivisions) lookup.set(name, countryId('united_states'));
for (const name of irelandSubs) lookup.set(name, countryId('ireland'));
for (const name of portugalSubs) lookup.set(name, countryId('portugal'));
for (const name of austriaSubs) lookup.set(name, countryId('austria'));
for (const name of swedenSubs) lookup.set(name, countryId('sweden'));
for (const name of englandSubs) lookup.set(name, countryId('england'));
for (const name of scotlandSubs) lookup.set(name, countryId('scotland'));
for (const name of southKoreaSubs) lookup.set(name, countryId('south_korea'));
for (const name of germanySubs) lookup.set(name, countryId('germany'));
for (const name of italySubs) lookup.set(name, countryId('italy'));
for (const name of japanSubs) lookup.set(name, countryId('japan'));
for (const name of singaporeSubs) lookup.set(name, countryId('singapore'));
for (const name of polandSubs) lookup.set(name, countryId('poland'));

export function mapSubdivisionToCountryId(input: string): string | 'unknown' {
  const n1 = normalize(input);
  const n = fixKnownVariants(n1);
  return lookup.get(n) ?? 'unknown';
}

export function countryIdToLabel(id: string): string {
  for (const key of Object.keys(c)) {
    const k = key as keyof typeof mappings.countries;
    if (c[k].id === id) return c[k].label;
  }
  return titleCase(id);
}
