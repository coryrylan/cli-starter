import { describe, it, expect } from 'bun:test';
import { greet } from './greet.js';

describe('greet', () => {
  it('defaults message to "world" when undefined', () => {
    expect(greet(undefined, false)).toBe('hello, world!');
  });

  it('defaults message to "world" when omitted', () => {
    expect(greet()).toBe('hello, world!');
  });

  it('uses the provided message', () => {
    expect(greet('bun', false)).toBe('hello, bun!');
  });

  it('uppercases when shouldCapitalize is true', () => {
    expect(greet('bun', true)).toBe('hello, BUN!');
  });

  it('defaults shouldCapitalize to false', () => {
    expect(greet('bun')).toBe('hello, bun!');
  });

  it('treats empty string as a real message (does not fall back to "world")', () => {
    expect(greet('', false)).toBe('hello, !');
  });
});
