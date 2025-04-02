// In newer SvelteKit versions, we need to create a .env file with PUBLIC_API_URL
// For now, we'll default to the API URL
export const API_URL = 'https://api.openbrewerydb.org/v1';

export const mappings = {
  countries: {
    austria: {
      label: 'Austria',
      id: 'austria',
    },
    england: {
      label: 'England',
      id: 'england',
    },
    france: {
      label: 'France',
      id: 'france',
    },
    isle_of_man: {
      label: 'Isle of Man',
      id: 'isle-of-man',
    },
    ireland: {
      label: 'Ireland',
      id: 'ireland',
    },
    poland: {
      label: 'Poland',
      id: 'poland',
    },
    portugal: {
      label: 'Portugal',
      id: 'portugal',
    },
    scotland: {
      label: 'Scotland',
      id: 'scotland',
    },
    singapore: {
      label: 'Singapore',
      id: 'singapore',
    },
    south_korea: {
      label: 'South Korea',
      id: 'south-korea',
    },
    united_states: {
      label: 'United States',
      id: 'united-states',
    },
  },
};

export function titleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function locationString({
  country,
  city,
  state,
}: {
  country: string;
  city?: string;
  state?: string;
}) {
  const cityPart = city ? titleCase(city) + ', ' : '';
  const statePart = state ? titleCase(state) + ', ' : '';
  const countryPart = titleCase(country) ?? '';
  return cityPart + statePart + countryPart;
}
