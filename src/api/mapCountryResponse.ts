import type { Country, RawCountry } from '../utils/types.js';

export function mapCountryResponse(raw: RawCountry): Country {
  void raw;
  return {
    name: '',
    flag: '',
    capital: '',
    region: '',
    population: 0,
    languages: [],
    area: 0,
    borders: [],
    currencies: [],
    description: '',
  };
}
