import { DIFFICULTY_NAMES } from './constants.js';

export const PATTERN_RUSH_MODE = 'patternrush';
export const PATTERN_RUSH_RECORD_OP = 'patternrush';
export const PATTERN_RUSH_COMBO_DURATION = 12;
export const PATTERN_RUSH_DURATION = 90;
export const PATTERN_RUSH_MAX_ATTEMPTS = 100;
export const PATTERN_RUSH_DISPLAY_LENGTH_CAP = 34;

export const PATTERN_FAMILY_PRECEDENCE = [
  'arithmetic',
  'geometric',
  'alternating',
  'second-difference',
  'position-based',
  'recursive-light',
];

export const PATTERN_RUSH_DIFFICULTIES = [
  {
    max: 99,
    label: 'Arithmetic',
    difficultyName: DIFFICULTY_NAMES[0],
    sequenceLengths: [4],
    familyWeights: { arithmetic: 100 },
    arithmeticStepRange: [2, 8],
    geometricRatioRange: [2, 3],
  },
  {
    max: 300,
    label: 'Arithmetic + Geometric',
    difficultyName: DIFFICULTY_NAMES[1],
    sequenceLengths: [4],
    familyWeights: { arithmetic: 65, geometric: 35 },
    arithmeticStepRange: [3, 15],
    geometricRatioRange: [2, 3],
  },
  {
    max: 900,
    label: '+ Alternating',
    difficultyName: DIFFICULTY_NAMES[2],
    sequenceLengths: [5],
    familyWeights: { arithmetic: 30, geometric: 30, alternating: 40 },
    arithmeticStepRange: [5, 25],
    geometricRatioRange: [2, 4],
  },
  {
    max: 2500,
    label: '+ 2nd Diff + Odd/Even',
    difficultyName: DIFFICULTY_NAMES[3],
    sequenceLengths: [5],
    familyWeights: {
      arithmetic: 15,
      geometric: 20,
      alternating: 30,
      'second-difference': 20,
      'position-based': 15,
    },
    arithmeticStepRange: [7, 40],
    geometricRatioRange: [2, 4],
  },
  {
    max: 9999,
    label: 'All Families',
    difficultyName: DIFFICULTY_NAMES[4],
    sequenceLengths: [5, 6],
    familyWeights: {
      arithmetic: 10,
      geometric: 15,
      alternating: 25,
      'second-difference': 20,
      'position-based': 15,
      'recursive-light': 15,
    },
    arithmeticStepRange: [10, 60],
    geometricRatioRange: [2, 5],
  },
];
