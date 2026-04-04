import { OPERATIONS } from '../config/operations.js';
import { PATTERN_RUSH_MODE } from '../config/pattern-rush.js';
import sprintMode from './sprint.js';
import race10Mode from './race10.js';
import overdriveMode from './overdrive.js';
import patternRushMode from './pattern-rush.js';
import { getDifficultyTone } from './index-helpers.js';

const MODE_CONTRACTS = {
  sprint: sprintMode,
  race10: race10Mode,
  overdrive: overdriveMode,
  [PATTERN_RUSH_MODE]: patternRushMode,
};

export function isPatternRushMode(mode) {
  return mode === PATTERN_RUSH_MODE;
}

export function getModeContract(mode) {
  return MODE_CONTRACTS[mode] || sprintMode;
}

export function getActiveDifficultyLevels(gameMode, operation) {
  return getModeContract(gameMode).getLevels({ gameMode, operation });
}

export function getSelectedDifficultyLevel(state) {
  const levels = getActiveDifficultyLevels(state.gameMode, state.operation);
  return levels[Math.min(state.selectedLevelIdx, levels.length - 1)] || levels[0] || null;
}

export function getRecordOperation(state, level = state.level) {
  return getModeContract(state.gameMode).getRecordScope(state, level).operation;
}

export function getSessionMetaData(state, level = state.level) {
  return getModeContract(state.gameMode).getSessionMeta(state, level);
}

export function getModeMenuPanel(state) {
  return getModeContract(state.gameMode).getMenuPanel(state);
}

export function getHudVariant(state) {
  return getModeContract(state.gameMode).getHudVariant(state);
}

export function getEndStatsVariant(state) {
  return getModeContract(state.gameMode).getEndStats(state);
}

export function getOperationConfig(operation) {
  return OPERATIONS[operation];
}

export { getDifficultyTone };
