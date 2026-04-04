import { describe, expect, it } from 'vitest';

import { PATTERN_RUSH_DIFFICULTIES } from '../src/config/pattern-rush.js';
import {
  createPatternCandidate,
  validatePatternCandidate,
} from '../src/modes/pattern-rush/validator.js';

describe('Pattern Rush validator', () => {
  it('rejects a higher-family candidate that also matches a simpler family', () => {
    const level = PATTERN_RUSH_DIFFICULTIES[3];
    const candidate = createPatternCandidate(level, 'geometric', [2, 5, 8, 11, 14, 17]);
    expect(validatePatternCandidate(candidate, level)).toBe(false);
  });
});
