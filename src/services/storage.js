import { PATTERN_RUSH_MODE } from '../config/pattern-rush.js';

export function getModeRecordKey(mode, op, max, suffix) {
  return `mathSnap_${mode}_${op}_${max}_${suffix}`;
}

export function getLegacyRecordKey(op, max, suffix) {
  return `mathSnap_${op}_${max}_${suffix}`;
}

export function getStoredNumber(key) {
  const value = localStorage.getItem(key);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getHighScore(mode, op, max) {
  const value = getStoredNumber(getModeRecordKey(mode, op, max, 'HS'));
  if (value !== null) return value;
  if (mode === 'sprint') {
    return getStoredNumber(getLegacyRecordKey(op, max, 'HS')) || 0;
  }
  return 0;
}

export function getHighCorrect(mode, op, max) {
  if (mode !== 'sprint' && mode !== 'overdrive' && mode !== PATTERN_RUSH_MODE) return 0;
  const value = getStoredNumber(getModeRecordKey(mode, op, max, 'HC'));
  if (value !== null) return value;
  return getStoredNumber(getLegacyRecordKey(op, max, 'HC')) || 0;
}

export function getHighCombo(mode, op, max) {
  const value = getStoredNumber(getModeRecordKey(mode, op, max, 'HCO'));
  if (value !== null) return value;
  if (mode === 'sprint') {
    return getStoredNumber(getLegacyRecordKey(op, max, 'HCO')) || 0;
  }
  return 0;
}

export function getBestTime(mode, op, max) {
  if (mode !== 'race10') return null;
  return getStoredNumber(getModeRecordKey(mode, op, max, 'BT'));
}

export function setHighScore(mode, op, max, val) {
  localStorage.setItem(getModeRecordKey(mode, op, max, 'HS'), String(val));
}

export function setHighCorrect(mode, op, max, val) {
  if (mode !== 'sprint' && mode !== 'overdrive' && mode !== PATTERN_RUSH_MODE) return;
  localStorage.setItem(getModeRecordKey(mode, op, max, 'HC'), String(val));
}

export function setHighCombo(mode, op, max, val) {
  localStorage.setItem(getModeRecordKey(mode, op, max, 'HCO'), String(val));
}

export function setBestTime(mode, op, max, val) {
  if (mode !== 'race10') return;
  localStorage.setItem(getModeRecordKey(mode, op, max, 'BT'), String(val));
}

export function clearAllProgress() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('mathSnap_'))
    .forEach((key) => localStorage.removeItem(key));
}
