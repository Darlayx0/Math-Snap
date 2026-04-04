import { DIFFICULTY_TONES } from '../config/constants.js';

export function getDifficultyTone(level) {
  if (!level) return 'easy';
  return DIFFICULTY_TONES[level.difficultyName] || 'easy';
}
