export enum BreweryType {
  'micro',
  'nano',
  'regional',
  'brewpub',
  'large',
  'planning',
  'bar',
  'contract',
  'proprietor',
  'taproom',
  'closed',
}

export type BreweryKey =
  | 'id'
  | 'name'
  | 'brewery_type'
  | 'address_1'
  | 'address_2'
  | 'address_3'
  | 'city'
  | 'state_province'
  | 'postal_code'
  | 'country'
  | 'website_url'
  | 'phone'
  | 'longitude'
  | 'latitude';

export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  address_1: string;
  address_2: string;
  address_3: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  website_url: string;
  phone: string;
  longitude: Float64Array;
  latitude: Float64Array;
}

export interface Metadata {
  total: string;
  per_page: string;
  page: string;
  query: string;
}

export type BlogMetadata = {
  layout?: string;
  title?: string;
  description?: string;
  date?: string;
  slug?: string;
  coverImageUrl?: string;
  author?: string;
  authors?: string[]
};
