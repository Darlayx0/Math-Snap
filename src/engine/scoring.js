import { CORRECT_SCORE } from '../config/constants.js';
import { getModeComboBonus } from './combo.js';

export function getAwardForCorrectAnswer(mode, combo, comboTimer) {
  return CORRECT_SCORE + getModeComboBonus(mode, combo, comboTimer);
}
