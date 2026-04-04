import {
  getBestTime,
  getHighCombo,
  getHighCorrect,
  getHighScore,
  setBestTime,
  setHighCombo,
  setHighCorrect,
  setHighScore,
} from '../services/storage.js';

export function readSessionRecords(scope) {
  return {
    bestScore: getHighScore(scope.mode, scope.operation, scope.max),
    bestCorrect: getHighCorrect(scope.mode, scope.operation, scope.max),
    bestCombo: getHighCombo(scope.mode, scope.operation, scope.max),
    bestTime: getBestTime(scope.mode, scope.operation, scope.max),
  };
}

export function commitSessionRecords(state, scope) {
  const previous = readSessionRecords(scope);
  const records = { score: false, correct: false, time: false, combo: false };

  if (state.score > previous.bestScore) {
    setHighScore(scope.mode, scope.operation, scope.max, state.score);
    records.score = true;
    previous.bestScore = state.score;
  }

  if (scope.trackCorrect && state.correct > previous.bestCorrect) {
    setHighCorrect(scope.mode, scope.operation, scope.max, state.correct);
    records.correct = true;
    previous.bestCorrect = state.correct;
  }

  if (scope.trackTime && (previous.bestTime === null || state.elapsedMs < previous.bestTime)) {
    setBestTime(scope.mode, scope.operation, scope.max, state.elapsedMs);
    records.time = true;
    previous.bestTime = state.elapsedMs;
  }

  if (state.maxCombo > previous.bestCombo) {
    setHighCombo(scope.mode, scope.operation, scope.max, state.maxCombo);
    records.combo = true;
    previous.bestCombo = state.maxCombo;
  }

  return { records, previous };
}
