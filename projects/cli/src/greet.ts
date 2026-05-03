import { capitalize } from './capitalize.js';

export function greet(message?: string, shouldCapitalize = false): string {
  return `hello, ${capitalize(message ?? 'world', shouldCapitalize)}!`;
}
