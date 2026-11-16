import { classifyError } from '../api/errors.js';
import { mapCountryResponse } from '../api/mapCountryResponse.js';
import { searchCountries } from '../api/searchCountries.js';
import { debounce } from '../utils/debounce.js';
export class CountrySearchController {
    onStateChange;
    state = {
        status: 'idle',
        countries: [],
        errorMessage: null,
    };
    abortController = null;
    lastQuery = '';
    debouncedSearch;
    constructor(onStateChange, delay = 300) {
        this.onStateChange = onStateChange;
        this.debouncedSearch = debounce((query) => {
            void this.executeSearch(query);
        }, delay);
    }
    getState() {
        return this.state;
    }
    handleInput(rawQuery) {
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
    async retry() {
        if (!this.lastQuery) {
            return;
        }
        await this.executeSearch(this.lastQuery);
    }
    async executeSearch(query) {
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
        }
        catch (error) {
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
    setState(nextState) {
        this.state = nextState;
        this.onStateChange(this.state);
    }
}
