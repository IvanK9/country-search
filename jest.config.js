import { createDefaultPreset } from 'ts-jest';

const defaultPreset = createDefaultPreset({ useESM: true });

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    ...defaultPreset.transform,
  },

  passWithNoTests: true,

  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [],
      },
    },
  },

  clearMocks: true,
};
