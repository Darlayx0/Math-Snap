import { describe, expect, it } from 'vitest';

import { getAwardForCorrectAnswer } from '../src/engine/scoring.js';

describe('Scoring', () => {
  it('uses classic combo math for sprint-like modes', () => {
    expect(getAwardForCorrectAnswer('sprint', 0, 10)).toBe(100);
    expect(getAwardForCorrectAnswer('sprint', 1, 10)).toBe(110);
    expect(getAwardForCorrectAnswer('overdrive', 2, 8)).toBe(118);
  });

  it('uses Pattern Rush combo math with combo scaling', () => {
    expect(getAwardForCorrectAnswer('patternrush', 0, 12)).toBe(100);
    expect(getAwardForCorrectAnswer('patternrush', 1, 12)).toBe(112);
    expect(getAwardForCorrectAnswer('patternrush', 2, 12)).toBe(124);
  });
});
