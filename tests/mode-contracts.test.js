import { describe, expect, it } from 'vitest';

import { PATTERN_RUSH_MODE, PATTERN_RUSH_RECORD_OP } from '../src/config/pattern-rush.js';
import { getComboDuration, getPatternRushComboBonus } from '../src/engine/combo.js';
import { getGameDuration } from '../src/engine/timer.js';
import { getModeContract } from '../src/modes/index.js';

describe('Mode helpers and contracts', () => {
  it('uses Pattern Rush record scope without operation identity', () => {
    const contract = getModeContract(PATTERN_RUSH_MODE);
    const level = contract.getLevels()[2];
    const scope = contract.getRecordScope({ gameMode: PATTERN_RUSH_MODE, operation: 'addition' }, level);
    expect(scope.operation).toBe(PATTERN_RUSH_RECORD_OP);
  });

  it('returns the correct duration and combo window for each mode', () => {
    expect(getGameDuration('sprint')).toBe(60);
    expect(getGameDuration(PATTERN_RUSH_MODE)).toBe(90);
    expect(getComboDuration('sprint')).toBe(10);
    expect(getComboDuration(PATTERN_RUSH_MODE)).toBe(12);
  });

  it('keeps the Pattern Rush combo regression fixed', () => {
    expect(getPatternRushComboBonus(1, 12)).toBe(12);
    expect(getPatternRushComboBonus(2, 12)).toBe(24);
    expect(getPatternRushComboBonus(3, 7)).toBe(31);
  });
});
