import { describe, expect, it } from 'vitest';

import { PATTERN_RUSH_DIFFICULTIES } from '../src/config/pattern-rush.js';
import { generatePatternRushPuzzle } from '../src/modes/pattern-rush/engine.js';

describe('Pattern Rush engine', () => {
  it('always generates integer non-negative values within the difficulty cap', () => {
    for (const level of PATTERN_RUSH_DIFFICULTIES) {
      for (let attempt = 0; attempt < 15; attempt += 1) {
        const puzzle = generatePatternRushPuzzle(level);
        expect(puzzle.answer).toSatisfy(Number.isInteger);
        expect(puzzle.answer).toBeGreaterThanOrEqual(0);
        expect(puzzle.answer).toBeLessThanOrEqual(level.max);
        expect(puzzle.sequence.length).toBeGreaterThanOrEqual(4);
        expect(puzzle.fullSequence.every((value) => Number.isInteger(value) && value >= 0 && value <= level.max)).toBe(true);
      }
    }
  });
});
