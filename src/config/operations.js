import { DIFFICULTY_NAMES } from './constants.js';

export const OPERATIONS = {
  addition: {
    label: 'Addition',
    symbol: '+',
    icon: 'plus',
    desc: 'Test your adding speed',
    levels: [
      { max: 100, label: '1–100 + 1–100', difficultyName: DIFFICULTY_NAMES[0] },
      { max: 1000, label: '1–1K + 1–1K', difficultyName: DIFFICULTY_NAMES[1] },
      { max: 10000, label: '1–10K + 1–10K', difficultyName: DIFFICULTY_NAMES[2] },
      { max: 100000, label: '1–100K + 1–100K', difficultyName: DIFFICULTY_NAMES[3] },
      { max: 1000000, label: '1–1M + 1–1M', difficultyName: DIFFICULTY_NAMES[4] },
    ],
  },
  subtraction: {
    label: 'Subtraction',
    symbol: '-',
    icon: 'minus',
    desc: 'Sharpen your subtraction speed',
    levels: [
      { max: 100, label: '1–100 - 1–100', difficultyName: DIFFICULTY_NAMES[0] },
      { max: 1000, label: '1–1K - 1–1K', difficultyName: DIFFICULTY_NAMES[1] },
      { max: 10000, label: '1–10K - 1–10K', difficultyName: DIFFICULTY_NAMES[2] },
      { max: 100000, label: '1–100K - 1–100K', difficultyName: DIFFICULTY_NAMES[3] },
      { max: 1000000, label: '1–1M - 1–1M', difficultyName: DIFFICULTY_NAMES[4] },
    ],
  },
  multiplication: {
    label: 'Multiplication',
    symbol: '×',
    icon: 'multiply',
    desc: 'Master your times tables',
    levels: [
      { max: 10, label: '1–10 × 1–10', difficultyName: DIFFICULTY_NAMES[0] },
      { max: 30, label: '1–30 × 1–30', difficultyName: DIFFICULTY_NAMES[1] },
      { max: 100, label: '1–100 × 1–100', difficultyName: DIFFICULTY_NAMES[2] },
      { max: 300, label: '1–300 × 1–300', difficultyName: DIFFICULTY_NAMES[3] },
      { max: 1000, label: '1–1K × 1–1K', difficultyName: DIFFICULTY_NAMES[4] },
    ],
  },
  division: {
    label: 'Division',
    symbol: '÷',
    icon: 'divide',
    desc: 'Practice fast decimal division',
    levels: [
      { max: 10, label: '1–10 ÷ 1–10', difficultyName: DIFFICULTY_NAMES[0] },
      { max: 30, label: '1–30 ÷ 1–30', difficultyName: DIFFICULTY_NAMES[1] },
      { max: 100, label: '1–100 ÷ 1–100', difficultyName: DIFFICULTY_NAMES[2] },
      { max: 300, label: '1–300 ÷ 1–300', difficultyName: DIFFICULTY_NAMES[3] },
      { max: 1000, label: '1–1K ÷ 1–1K', difficultyName: DIFFICULTY_NAMES[4] },
    ],
  },
};
