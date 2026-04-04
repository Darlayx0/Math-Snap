import { GAME_DURATION, RACE_TARGET } from '../config/constants.js';
import { PATTERN_RUSH_DURATION } from '../config/pattern-rush.js';

export function isRaceMode(mode) {
  return mode === 'race10';
}

export function getGameDuration(mode) {
  return mode === 'patternrush' ? PATTERN_RUSH_DURATION : GAME_DURATION;
}

export function formatElapsedMs(ms) {
  if (!Number.isFinite(ms) || ms < 0) {
    return '--:--.--';
  }

  const totalMs = Math.max(0, ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

export function getProgressLabel(progressSolved) {
  return `${progressSolved}/${RACE_TARGET}`;
}

export function syncElapsedMs(state) {
  if (!isRaceMode(state.gameMode) || !state.timerStartedAt) return;
  state.elapsedMs = Math.max(0, Date.now() - state.timerStartedAt);
}
