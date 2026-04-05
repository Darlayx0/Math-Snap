import { resetRunState, state } from './state.js';
import { isTouchDevice } from '../services/device.js';
import { clearAllProgress } from '../services/storage.js';
import { getModeContract, getSelectedDifficultyLevel } from '../modes/index.js';
import { getComboDuration, tickCombo } from '../engine/combo.js';
import { getGameDuration, isRaceMode, syncElapsedMs } from '../engine/timer.js';
import {
  appendDecimalPoint,
  appendInputDigit,
  deleteInputChar,
  isIntegerOnlyMode,
  parseSubmittedValue,
  resetInputValue,
  sanitizeInputValue,
  scrollViewportToTop,
  toggleNegative,
} from '../engine/input.js';
import { getAwardForCorrectAnswer } from '../engine/scoring.js';
import { generateProblemForState } from '../engine/problem-generator.js';
import { commitSessionRecords } from '../engine/records.js';
import {
  animateProblem,
  showFeedback,
  updateAnswerDisplay,
  updateAnswerInput,
  updateComboUI,
  updateStatsUI,
  updateTimeUI,
} from '../ui/game-screen.js';
import {
  removeConfirmResetOverlay,
  removePauseOverlay,
  renderConfirmResetOverlay,
  renderPauseOverlay,
} from '../ui/overlays.js';

const runtime = {
  render: () => {},
};

export function setRuntimeHooks(hooks) {
  runtime.render = hooks.render;
}

function clearActiveIntervals() {
  clearInterval(state.timerInterval);
  clearInterval(state.comboInterval);
  state.timerInterval = null;
  state.comboInterval = null;
}

function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function generateProblem() {
  const nextProblem = generateProblemForState(state);
  state.currentAnswer = nextProblem.currentAnswer;
  state.currentProblem = nextProblem.currentProblem;
  state.currentPuzzleData = nextProblem.currentPuzzleData;
}

function startTimerLoop() {
  clearInterval(state.timerInterval);

  if (isRaceMode(state.gameMode)) {
    state.timerStartedAt = Date.now() - state.elapsedMs;
    state.timerInterval = setInterval(() => {
      if (state.screen !== 'playing') return;
      syncElapsedMs(state);
      updateTimeUI(state);
    }, 100);
    return;
  }

  state.timerInterval = setInterval(() => {
    if (state.screen !== 'playing') return;
    state.timeLeft = Math.max(0, state.timeLeft - 1);
    updateTimeUI(state);
    if (state.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function startComboLoop() {
  clearInterval(state.comboInterval);
  state.comboInterval = setInterval(() => {
    if (state.screen !== 'playing') return;
    if (tickCombo(state)) {
      updateComboUI(state);
    }
  }, 1000);
}

function checkAnswer(userAnswer) {
  if (Number.isNaN(userAnswer)) return;

  const normalizedAnswer = state.gameMode === 'patternrush'
    ? Number.parseInt(userAnswer, 10)
    : (state.operation === 'division' ? roundToTwo(userAnswer) : userAnswer);

  if (Number.isNaN(normalizedAnswer)) return;

  const modeContract = getModeContract(state.gameMode);

  if (normalizedAnswer === state.currentAnswer) {
    const totalAward = getAwardForCorrectAnswer(state.gameMode, state.combo, state.comboTimer);
    state.score += totalAward;
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.comboTimer = getComboDuration(state.gameMode);

    const outcome = modeContract.applyCorrectAnswer(state, state.level, { userAnswer: normalizedAnswer });
    showFeedback(`+${totalAward}`, 'success');
    updateStatsUI(state);
    updateComboUI(state);
    updateTimeUI(state);

    if (outcome?.shouldEnd) {
      endGame();
      return;
    }

    generateProblem();
    animateProblem(state);
    return;
  }

  state.wrong += 1;
  state.combo = 0;
  state.comboTimer = getComboDuration(state.gameMode);
  modeContract.applyWrongAnswer(state, state.level, { userAnswer: normalizedAnswer });
  showFeedback('Wrong', 'error');
  updateStatsUI(state);
  updateComboUI(state);
}

function focusCurrentInput() {
  document.removeEventListener('keydown', handlePhysicalKeyboard);
  document.addEventListener('keydown', handlePhysicalKeyboard);
  const input = document.getElementById('answer-input');
  if (input) {
    input.focus();
  }
}

export function startGame() {
  clearActiveIntervals();
  document.removeEventListener('keydown', handlePhysicalKeyboard);

  resetRunState();
  state.level = getSelectedDifficultyLevel(state);
  state.screen = 'playing';
  state.comboTimer = getComboDuration(state.gameMode);
  state.timeLeft = getGameDuration(state.gameMode);
  state.useKeypad = isTouchDevice();
  Object.assign(state, getModeContract(state.gameMode).getInitialRunState(state, state.level));

  generateProblem();
  scrollViewportToTop();
  runtime.render();
  animateProblem(state);
  updateStatsUI(state);
  updateTimeUI(state);
  updateComboUI(state);
  startTimerLoop();
  startComboLoop();
}

export function submitAnswer() {
  const parsed = parseSubmittedValue(state.inputValue, state.gameMode);
  if (parsed !== null) {
    checkAnswer(parsed);
  }
  state.inputValue = resetInputValue();
  updateAnswerDisplay(state.inputValue);
  updateAnswerInput(state.inputValue);
}

export function handleKeypadPress(key) {
  if (key >= '0' && key <= '9') {
    state.inputValue = appendInputDigit(state.inputValue, key);
  } else if (key === 'decimal') {
    state.inputValue = appendDecimalPoint(state.inputValue, state.gameMode, state.operation);
  } else if (key === 'del') {
    state.inputValue = deleteInputChar(state.inputValue);
  } else if (key === 'clear') {
    state.inputValue = resetInputValue();
  } else if (key === 'neg') {
    state.inputValue = toggleNegative(state.inputValue, state.gameMode);
  } else if (key === 'submit') {
    submitAnswer();
    return;
  }

  updateAnswerDisplay(state.inputValue);
  updateAnswerInput(state.inputValue);
}

export function handleSharedInputKey(key) {
  if (key >= '0' && key <= '9') {
    state.inputValue = appendInputDigit(state.inputValue, key);
  } else if ((key === '.' || key === ',') && !isIntegerOnlyMode(state.gameMode)) {
    state.inputValue = appendDecimalPoint(state.inputValue, state.gameMode, state.operation);
  } else if (key === 'Backspace') {
    state.inputValue = deleteInputChar(state.inputValue);
  } else if (key === 'Delete') {
    state.inputValue = resetInputValue();
  } else if (key === 'Enter') {
    submitAnswer();
    return true;
  } else if (key === '-' && !isIntegerOnlyMode(state.gameMode)) {
    state.inputValue = toggleNegative(state.inputValue, state.gameMode);
  } else {
    return false;
  }

  updateAnswerDisplay(state.inputValue);
  updateAnswerInput(state.inputValue);
  return true;
}

export function handlePhysicalKeyboard(event) {
  if (state.screen !== 'playing') {
    document.removeEventListener('keydown', handlePhysicalKeyboard);
    return;
  }
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  if (handleSharedInputKey(event.key)) {
    event.preventDefault();
  }
}

export function handleDesktopInputChange(value) {
  state.inputValue = sanitizeInputValue(value, state.gameMode, state.operation);
  updateAnswerInput(state.inputValue);
}

export function confirmResetProgress() {
  renderConfirmResetOverlay({
    onConfirm: () => {
      clearAllProgress();
      removeConfirmResetOverlay();
      runtime.render();
    },
    onCancel: removeConfirmResetOverlay,
  });
}

export function pauseGame() {
  if (state.screen !== 'playing') return;
  if (isRaceMode(state.gameMode)) {
    syncElapsedMs(state);
  }
  state.screen = 'paused';
  clearActiveIntervals();
  document.removeEventListener('keydown', handlePhysicalKeyboard);
  renderPauseOverlay(actions);
}

export function resumeGame() {
  removePauseOverlay();
  state.screen = 'playing';
  scrollViewportToTop();
  startTimerLoop();
  startComboLoop();
  updateTimeUI(state);
  focusCurrentInput();
}

export function restartGame() {
  removePauseOverlay();
  clearActiveIntervals();
  startGame();
}

export function backToMenu() {
  removePauseOverlay();
  clearActiveIntervals();
  document.removeEventListener('keydown', handlePhysicalKeyboard);
  state.screen = 'menu';
  runtime.render();
}

export function endGame() {
  clearActiveIntervals();
  document.removeEventListener('keydown', handlePhysicalKeyboard);

  if (isRaceMode(state.gameMode)) {
    syncElapsedMs(state);
  }

  state.screen = 'end';
  const scope = getModeContract(state.gameMode).getRecordScope(state, state.level);
  state.lastEndData = commitSessionRecords(state, scope);
  runtime.render();
}

export const actions = {
  backToMenu,
  confirmResetProgress,
  endGame,
  handleDesktopInputChange,
  handleKeypadPress,
  handlePhysicalKeyboard,
  handleSharedInputKey,
  pauseGame,
  restartGame,
  resumeGame,
  startGame,
  submitAnswer,
};
