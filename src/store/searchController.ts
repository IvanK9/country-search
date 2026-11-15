import type { Country } from '../utils/types.js';

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

  constructor(
    private readonly onStateChange: (state: SearchState) => void,
    private readonly delay: number = 300
  ) {
    void this.onStateChange;
    void this.delay;
  }

  public getState(): SearchState {
    return this.state;
  }

  public handleInput(query: string): void {
    void query;
  }

  public async retry(): Promise<void> {}
}
