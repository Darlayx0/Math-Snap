import { OPERATIONS } from '../config/operations.js';
import { createClassicProblem } from './classic-helpers.js';

const sprintMode = {
  id: 'sprint',
  getLevels(state) {
    return OPERATIONS[state.operation].levels;
  },
  getRecordScope(state, level) {
    return {
      mode: state.gameMode,
      operation: state.operation,
      max: level.max,
      trackCorrect: true,
      trackTime: false,
    };
  },
  getMenuPanel() {
    return { type: 'operations' };
  },
  getSessionMeta(state, level) {
    return {
      difficultyName: level.difficultyName,
      tertiary: {
        kind: 'operation',
        value: level.label,
      },
    };
  },
  createProblem(state, level) {
    return createClassicProblem(state.operation, level.max);
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

export default sprintMode;
