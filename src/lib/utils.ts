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

export function formatLocalDateTime(datetime: string) {
  const d = new Date(datetime);
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function linkify(input?: string) {
  const value = input ?? '';
  const urlRe = /(https?:\/\/[^\s)]+)(?![^<]*>)/gi;
  const parts: Array<{
    type: 'text' | 'link';
    value: string;
    href?: string;
  }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = urlRe.exec(value)) !== null) {
    const start = match.index;
    const url = match[0];
    if (start > lastIndex) {
      parts.push({ type: 'text', value: value.slice(lastIndex, start) });
    }
    parts.push({ type: 'link', value: url, href: url });
    lastIndex = start + url.length;
  }
  if (lastIndex < value.length) {
    parts.push({ type: 'text', value: value.slice(lastIndex) });
  }
  return parts;
}
