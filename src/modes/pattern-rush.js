import { PATTERN_RUSH_DIFFICULTIES, PATTERN_RUSH_MODE, PATTERN_RUSH_RECORD_OP } from '../config/pattern-rush.js';
import { generatePatternRushPuzzle } from './pattern-rush/engine.js';

const patternRushMode = {
  id: PATTERN_RUSH_MODE,
  getLevels() {
    return PATTERN_RUSH_DIFFICULTIES;
  },
  getRecordScope(state, level) {
    return {
      mode: state.gameMode,
      operation: PATTERN_RUSH_RECORD_OP,
      max: level.max,
      trackCorrect: true,
      trackTime: false,
    };
  },
  getMenuPanel() {
    return {
      type: 'info',
      items: [
        {
          icon: 'time',
          label: '90s Fixed',
          value: 'No bonus or penalty time',
        },
        {
          icon: 'answer',
          label: 'Manual Input',
          value: 'Integer only, same puzzle stays on wrong',
        },
        {
          icon: 'chart',
          label: 'Rule Engine',
          value: 'Procedural families with ambiguity checks',
        },
      ],
    };
  },
  getSessionMeta(state, level) {
    return {
      difficultyName: level.difficultyName,
      tertiary: {
        kind: 'custom',
        icon: 'answer',
        value: 'Next Number',
      },
    };
  },
  createProblem(state, level) {
    const puzzle = generatePatternRushPuzzle(level);
    return {
      currentPuzzleData: puzzle,
      currentAnswer: puzzle.answer,
      currentProblem: puzzle.displayText,
    };
  },
  getInitialRunState() {
    return {};
  },
  applyCorrectAnswer(state) {
    state.correct += 1;
    return { incrementCorrect: false, incrementProgress: false, shouldEnd: false };
  },
  applyWrongAnswer() {
    return { shouldEnd: false };
  },
  getHudVariant(state) {
    return {
      timeKind: 'countdown',
      tertiary: {
        icon: 'check',
        id: 'correct',
        value: state.correct,
        tone: 'ht-correct',
        title: 'Correct',
      },
      extraPanel: null,
    };
  },
  getEndStats() {
    return { usesTimeRecord: false, showsCorrectRecord: true };
  },
};

export default patternRushMode;
