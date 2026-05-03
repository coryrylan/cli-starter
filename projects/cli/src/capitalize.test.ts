import { describe, it, expect } from 'bun:test';
import { capitalize } from './capitalize.js';

describe('capitalize', () => {
  it('returns the text unchanged when shouldCapitalize is false', () => {
    expect(capitalize('hello', false)).toBe('hello');
  });

  it('returns uppercased text when shouldCapitalize is true', () => {
    expect(capitalize('hello', true)).toBe('HELLO');
  });

  it('preserves mixed case when not capitalizing', () => {
    expect(capitalize('bUn', false)).toBe('bUn');
  });

  it('uppercases mixed case when capitalizing', () => {
    expect(capitalize('bUn', true)).toBe('BUN');
  });

  it('handles empty string', () => {
    expect(capitalize('', false)).toBe('');
    expect(capitalize('', true)).toBe('');
  });
});
