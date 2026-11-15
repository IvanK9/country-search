import { describe, expect, it } from '@jest/globals';
import type { RawCountry } from '../utils/types.js';
import { mapCountryResponse } from './mapCountryResponse.js';

describe('mapCountryResponse', () => {
  it('полный ответ API', () => {
    const rawSpain: RawCountry = {
      name: 'Spain',
      capital: 'Madrid',
      region: 'Europe',
      subregion: 'Southern Europe',
      population: 47351567,
      area: 505992,
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      flag: 'es',
      flags: {
        png: 'https://flagcdn.com/w320/es.png',
        svg: 'https://flagcdn.com/es.svg',
      },
      languages: [{ name: 'Spanish', nativeName: 'Español' }],
      currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    };

    const result = mapCountryResponse(rawSpain);

    expect(result).toEqual({
      name: 'Spain',
      flag: 'https://flagcdn.com/w320/es.png',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: ['Spanish'],
      area: 505992,
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      currencies: ['Euro (€)'],
      description: 'Spain — Southern Europe',
    });
  });

  it('значения по умолчанию', () => {
    const rawMinimal: RawCountry = {
      name: 'Antarctica',
    };

    const result = mapCountryResponse(rawMinimal);

    expect(result).toEqual({
      name: 'Antarctica',
      flag: '',
      capital: 'Нет данных',
      region: 'Нет данных',
      population: 0,
      languages: [],
      area: 0,
      borders: [],
      currencies: [],
      description: 'Antarctica',
    });
  });
});
