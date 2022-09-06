import { InitialOptionsTsJest } from 'ts-jest/dist/types';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
} as InitialOptionsTsJest;
