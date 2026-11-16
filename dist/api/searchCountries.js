import { HttpError } from './errors.js';
const BASE_URL = 'https://countries.dev/name';
const REQUEST_TIMEOUT_MS = 5000;
export async function searchCountries(query, signal) {
    const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const combinedSignal = signal
        ? AbortSignal.any([signal, timeoutSignal])
        : timeoutSignal;
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(query)}`, {
        signal: combinedSignal,
    });
    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        throw new HttpError(response.status);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        return [];
    }
    return data;
}
