import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { HttpError } from './errors.js';
import { searchCountries } from './searchCountries.js';

describe('Search Countries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Ответ успешный', async () => {
    const fakeCountries = [{ name: 'Spain', capital: 'Madrid' }];
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(fakeCountries), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await searchCountries('spain');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://countries.dev/name/spain',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(result).toEqual(fakeCountries);
  });

  it('404 (совпадений нет) => пустой массив', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 404 }));

    const result = await searchCountries('abracadabra');

    expect(result).toEqual([]);
  });

  it('HttpError при неуспешных статусах', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 500 }));

    await expect(searchCountries('spain')).rejects.toThrow(HttpError);

    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 500 }));
    await expect(searchCountries('spain')).rejects.toMatchObject({
      status: 500,
    });
  });

  it('сетевая ошибка', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(searchCountries('spain')).rejects.toThrow(TypeError);
  });
});
