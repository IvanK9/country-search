import { classifyError } from '../api/errors.js';
import { mapCountryResponse } from '../api/mapCountryResponse.js';
import { searchCountries } from '../api/searchCountries.js';
import type { Country } from '../utils/types.js';
import { debounce } from '../utils/debounce.js';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface SearchState {
  status: SearchStatus;
  countries: Country[];
  errorMessage: string | null;
}

export class CountrySearchController {
  private state: SearchState = {
    status: 'idle',
    countries: [],
    errorMessage: null,
  };

  private abortController: AbortController | null = null;
  private lastQuery = '';
  private readonly debouncedSearch: (query: string) => void;

  constructor(
    private readonly onStateChange: (state: SearchState) => void,
    delay = 300
  ) {
    this.debouncedSearch = debounce((query: string) => {
      void this.executeSearch(query);
    }, delay);
  }

  public getState(): SearchState {
    return this.state;
  }

  public handleInput(rawQuery: string): void {
    this.abortController?.abort();
    this.abortController = null;

    const query = rawQuery.trim();
    this.lastQuery = query;

    if (!query) {
      this.setState({
        status: 'idle',
        countries: [],
        errorMessage: null,
      });
      return;
    }

    this.debouncedSearch(query);
  }

  public async retry(): Promise<void> {
    if (!this.lastQuery) {
      return;
    }
    await this.executeSearch(this.lastQuery);
  }

  private async executeSearch(query: string): Promise<void> {
    if (query !== this.lastQuery) {
      return;
    }

    this.abortController?.abort();
    const controller = new AbortController();
    this.abortController = controller;

    this.setState({
      status: 'loading',
      countries: [],
      errorMessage: null,
    });

    try {
      const rawCountries = await searchCountries(query, controller.signal);
      const countries = rawCountries.map(mapCountryResponse);

      this.setState({
        status: countries.length > 0 ? 'success' : 'empty',
        countries,
        errorMessage: null,
      });
    } catch (error: unknown) {
      const classified = classifyError(error);

      if (classified.type === 'abort') {
        return;
      }

      this.setState({
        status: 'error',
        countries: [],
        errorMessage: classified.message,
      });
    }
  }

  private setState(nextState: SearchState): void {
    this.state = nextState;
    this.onStateChange(this.state);
  }
}
