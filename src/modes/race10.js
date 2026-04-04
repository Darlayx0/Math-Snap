import { OPERATIONS } from '../config/operations.js';
import { createClassicProblem } from './classic-helpers.js';
import { RACE_TARGET } from '../config/constants.js';

const race10Mode = {
  id: 'race10',
  getLevels(state) {
    return OPERATIONS[state.operation].levels;
  },
  getRecordScope(state, level) {
    return {
      mode: state.gameMode,
      operation: state.operation,
      max: level.max,
      trackCorrect: false,
      trackTime: true,
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
    state.progressSolved += 1;
    return { incrementCorrect: false, incrementProgress: true, shouldEnd: state.progressSolved >= RACE_TARGET };
  },
  applyWrongAnswer() {
    return { shouldEnd: false };
  },
  getHudVariant(state) {
    return {
      timeKind: 'elapsed',
      tertiary: {
        icon: 'target',
        id: 'progress',
        value: `${state.progressSolved}/${RACE_TARGET}`,
        tone: 'ht-progress',
        title: 'Progress',
      },
      extraPanel: null,
    };
  },
  getEndStats() {
    return { usesTimeRecord: true, showsCorrectRecord: false };
  },
};

export default race10Mode;
