import { createDefaultEsmPreset } from 'ts-jest';

const defaultEsmPreset = createDefaultEsmPreset({ useESM: true });

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  ...defaultEsmPreset,
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  passWithNoTests: true,
  clearMocks: true,
};
