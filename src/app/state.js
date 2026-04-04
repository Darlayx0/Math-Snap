import { GAME_DURATION, DEFAULT_COMBO_DURATION } from '../config/constants.js';

export const app = document.querySelector('#app');

export const state = {
  screen: 'menu',
  gameMode: 'sprint',
  operation: 'addition',
  selectedLevelIdx: 0,
  level: null,
  score: 0,
  correct: 0,
  wrong: 0,
  progressSolved: 0,
  combo: 0,
  maxCombo: 0,
  comboTimer: DEFAULT_COMBO_DURATION,
  timeLeft: GAME_DURATION,
  elapsedMs: 0,
  timerStartedAt: 0,
  currentAnswer: 0,
  currentProblem: '',
  currentPuzzleData: null,
  timerInterval: null,
  comboInterval: null,
  inputValue: '0',
  useKeypad: false,
  lastEndData: null,
  overdriveLevel: 0,
  overdriveTarget: 1000,
  overdriveMax: 0,
  overdriveLabel: '',
};

export function resetRunState() {
  state.level = null;
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  state.progressSolved = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.comboTimer = DEFAULT_COMBO_DURATION;
  state.timeLeft = GAME_DURATION;
  state.elapsedMs = 0;
  state.timerStartedAt = 0;
  state.currentAnswer = 0;
  state.currentProblem = '';
  state.currentPuzzleData = null;
  state.inputValue = '0';
  state.useKeypad = false;
  state.lastEndData = null;
  state.overdriveLevel = 0;
  state.overdriveTarget = 1000;
  state.overdriveMax = 0;
  state.overdriveLabel = '';
}
