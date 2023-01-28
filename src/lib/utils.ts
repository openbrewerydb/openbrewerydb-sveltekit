import * as env from '$env/static/public';

export const API_URL: string =
  env?.PUBLIC_API_URL || 'https://api.openbrewerydb.org';

export const mappings = {
  countries: {
    england: {
      label: 'England',
      id: 'england',
    },
    france: {
      label: 'France',
      id: 'france',
    },
    ireland: {
      label: 'Ireland',
      id: 'ireland',
    },
    poland: {
      label: 'Poland',
      id: 'poland',
    },
    scotland: {
      label: 'Scotland',
      id: 'scotland',
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
