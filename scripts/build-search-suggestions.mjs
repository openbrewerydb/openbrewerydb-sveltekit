import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outFile = path.join(
  projectRoot,
  'src',
  'lib',
  'data',
  'search-suggestions.json'
);

const FALLBACK_SUGGESTIONS = [
  // States
  'California',
  'Colorado',
  'Oregon',
  'Vermont',
  'Michigan',
  'Texas',
  'Washington',
  'New York',
  'North Carolina',
  'Maine',
  'Wisconsin',
  'Massachusetts',
  'Ohio',
  'Florida',
  'Illinois',
  // Cities
  'Portland',
  'Asheville',
  'Denver',
  'San Diego',
  'Austin',
  'Seattle',
  'Chicago',
  'Boston',
  'Grand Rapids',
  'Milwaukee',
  'Fort Collins',
  'Burlington',
  'Nashville',
  'Minneapolis',
  'San Francisco',
  // Brewery keywords/names
  'Dogfish',
  'Sierra Nevada',
  'Stone',
  'Harpoon',
  'Lagunitas',
  'Founders',
  'Bells',
  'Deschutes',
  'Allagash',
  'Russian River',
  'New Glarus',
  'Tree House',
  'Trillium',
  'Alchemist',
  'Hill Farmstead',
  'Jester King',
  'Firestone Walker',
  'Odell',
  'Oskar Blues',
  'Left Hand',
];

const STOP_WORDS = new Set([
  'brewing',
  'brewery',
  'company',
  'co',
  'inc',
  'beer',
  'pub',
  'and',
  'the',
  'of',
  'cider',
  'cidery',
  'craft',
  'bottleshop',
  'brands',
  'brand',
  'group',
  'house',
  'room',
  'cellars',
  'cellar',
  'works',
  'factory',
  'project',
  'ale',
  'ales',
  'tavern',
  'distillery',
  'distilling',
  'meadery',
  'winery',
  'soda',
  'beverage',
  'beverages',
]);

function cleanWord(word) {
  return word.replace(/[^a-zA-Z0-9]/g, '');
}

function extractBreweryBrandName(fullName) {
  if (!fullName) return null;
  const words = fullName
    .split(/[\s-]+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const cleanWords = [];
  for (const word of words) {
    const cleaned = cleanWord(word);
    if (!cleaned) continue;
    if (STOP_WORDS.has(cleaned.toLowerCase())) continue;
    cleanWords.push(word); // Keep original casing/punctuation for presentation
  }

  if (cleanWords.length === 0) return null;
  // Grab up to first 2 words for a clean, short brand suggestion
  const brand = cleanWords.slice(0, 2).join(' ');

  // Validate the resulting brand name
  if (brand.length < 3 || brand.length > 25) return null;
  // Ensure it doesn't contain weird characters
  if (!/^[a-zA-Z0-9\s'.&]+$/.test(brand)) return null;

  return brand;
}

async function main() {
  const suggestions = new Set(FALLBACK_SUGGESTIONS);

  try {
    console.log('[suggestions] Fetching random breweries from API...');
    const response = await fetch(
      'https://api.openbrewerydb.org/v1/breweries/random?size=50'
    );

    if (response.ok) {
      const breweries = await response.json();
      console.log(
        `[suggestions] Successfully fetched ${breweries.length} breweries.`
      );

      for (const b of breweries) {
        // 1. Add clean state suggestion
        if (b.state_province && b.state_province.trim()) {
          const state = b.state_province.trim();
          if (
            /^[a-zA-Z\s]+$/.test(state) &&
            state.length >= 3 &&
            state.length <= 25
          ) {
            suggestions.add(state);
          }
        }

        // 2. Add clean city suggestion
        if (b.city && b.city.trim()) {
          const city = b.city.trim();
          if (
            /^[a-zA-Z\s]+$/.test(city) &&
            city.length >= 3 &&
            city.length <= 20
          ) {
            suggestions.add(city);
          }
        }

        // 3. Add clean brand name suggestion
        const brand = extractBreweryBrandName(b.name);
        if (brand) {
          suggestions.add(brand);
        }
      }
    } else {
      console.warn(
        `[suggestions] Failed to fetch: ${response.status} ${response.statusText}. Using fallback.`
      );
    }
  } catch (error) {
    console.error(
      '[suggestions] Error fetching random breweries, using fallback list:',
      error
    );
  }

  // Convert to sorted array
  const finalSuggestions = Array.from(suggestions).sort();

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(finalSuggestions, null, 2) + '\n');
  console.log(
    `[suggestions] Successfully wrote ${finalSuggestions.length} suggestions to ${path.relative(
      projectRoot,
      outFile
    )}`
  );
}

main().catch((err) => {
  console.error('[suggestions] Critical error in build script:', err);
  process.exitCode = 1;
});
