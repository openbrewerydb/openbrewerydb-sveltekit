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
