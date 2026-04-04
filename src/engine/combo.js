import { DEFAULT_COMBO_DURATION } from '../config/constants.js';
import { PATTERN_RUSH_COMBO_DURATION, PATTERN_RUSH_MODE } from '../config/pattern-rush.js';

export function getComboDuration(mode) {
  return mode === PATTERN_RUSH_MODE ? PATTERN_RUSH_COMBO_DURATION : DEFAULT_COMBO_DURATION;
}

export function getClassicComboBonus(combo, comboTimer, mode) {
  const comboDuration = getComboDuration(mode);
  return Math.max(0, (combo * comboDuration) - (comboDuration - comboTimer));
}

export function getPatternRushComboBonus(combo, comboTimer) {
  if (combo <= 0) return 0;
  const elapsed = PATTERN_RUSH_COMBO_DURATION - comboTimer;
  return Math.max(0, (combo * PATTERN_RUSH_COMBO_DURATION) - elapsed);
}

export function getModeComboBonus(mode, combo, comboTimer) {
  return mode === PATTERN_RUSH_MODE
    ? getPatternRushComboBonus(combo, comboTimer)
    : getClassicComboBonus(combo, comboTimer, mode);
}

export function tickCombo(state) {
  if (state.combo <= 0) return false;

  state.comboTimer -= 1;
  if (state.comboTimer <= 0) {
    if (state.gameMode === PATTERN_RUSH_MODE) {
      state.combo = 0;
      state.comboTimer = getComboDuration(state.gameMode);
    } else {
      state.combo = Math.max(0, state.combo - 1);
      state.comboTimer = getComboDuration(state.gameMode);
    }
  }

  return true;
}
