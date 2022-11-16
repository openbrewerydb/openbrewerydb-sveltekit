import * as env from '$env/static/public';

export const API_URL: string =
  env?.PUBLIC_API_URL || 'https://api.openbrewerydb.org';

export const mappings = {
  countries: {
    united_states: {
      label: 'United States',
      id: 'united-states',
    },
    south_korea: {
      label: 'South Korea',
      id: 'south-korea',
    },
  },
};
