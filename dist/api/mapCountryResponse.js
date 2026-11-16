const NO_DATA_TEXT = 'Нет данных';
export function mapCountryResponse(raw) {
    const flag = raw.flags?.png ?? raw.flags?.svg ?? '';
    const languages = (raw.languages ?? []).map((lang) => lang.name);
    const currencies = (raw.currencies ?? []).map((currency) => currency.symbol ? `${currency.name} (${currency.symbol})` : currency.name);
    const description = raw.subregion
        ? `${raw.name} — ${raw.subregion}`
        : raw.name;
    return {
        name: raw.name,
        flag,
        capital: raw.capital || NO_DATA_TEXT,
        region: raw.region || NO_DATA_TEXT,
        population: raw.population ?? 0,
        languages,
        area: raw.area ?? 0,
        borders: raw.borders ?? [],
        currencies,
        description,
    };
}
