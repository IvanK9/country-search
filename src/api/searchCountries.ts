import type { RawCountry } from '../utils/types.js';

export async function searchCountries(
  query: string,
  signal?: AbortSignal
): Promise<RawCountry[]> {
  void query;
  void signal;
  return [];
}
