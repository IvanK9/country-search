export interface RawCountry {
  name: string;
  capital?: string;
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  borders?: string[];
  flag?: string;
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  languages?: Array<{ name: string; nativeName?: string }>;
  currencies?: Array<{ code?: string; name: string; symbol?: string }>;
}

export interface Country {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
  area: number;
  borders: string[];
  currencies: string[];
  description: string;
}
