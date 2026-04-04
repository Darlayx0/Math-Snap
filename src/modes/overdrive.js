import { OPERATIONS } from '../config/operations.js';
import { OVERDRIVE_MULTIPLIERS } from '../config/constants.js';
import { createClassicProblem, buildOverdriveLabel } from './classic-helpers.js';
import { getDifficultyTone } from './index-helpers.js';

const overdriveMode = {
  id: 'overdrive',
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
    const tone = getDifficultyTone(level);
    return {
      difficultyName: level.difficultyName,
      tertiary: {
        kind: 'custom',
        icon: 'bolt',
        value: `Mult ${OVERDRIVE_MULTIPLIERS[tone] || 2}x`,
      },
    };
  },
  createProblem(state) {
    return createClassicProblem(state.operation, state.overdriveMax || 0);
  },
  getInitialRunState(state) {
    const baseLevel = OPERATIONS[state.operation].levels[0];
    return {
      overdriveMax: baseLevel.max,
      overdriveLevel: 0,
      overdriveTarget: 1000,
      overdriveLabel: buildOverdriveLabel(state.operation, baseLevel.max),
    };
  },
  applyCorrectAnswer(state, level) {
    state.correct += 1;
    state.timeLeft = Math.min(180, state.timeLeft + 5);

    const newLevel = Math.floor(state.score / 1000);
    if (newLevel > state.overdriveLevel) {
      state.overdriveLevel = newLevel;
      state.overdriveTarget = (newLevel + 1) * 1000;

      const diffTone = getDifficultyTone(level);
      const multiplier = OVERDRIVE_MULTIPLIERS[diffTone] || 2;
      const baseMax = OPERATIONS[state.operation].levels[0].max;

      let currentMax = baseMax;
      for (let index = 0; index < newLevel; index += 1) {
        currentMax = Math.round(currentMax * multiplier);
      }
      state.overdriveMax = currentMax;
      state.overdriveLabel = buildOverdriveLabel(state.operation, currentMax);
    }

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
      extraPanel: [
        { labelIcon: 'target', label: 'Range', valueId: 'over-range', value: state.overdriveLabel, tone: '' },
        { labelIcon: 'spark', label: 'Level', valueId: 'over-lvl', value: `Lvl ${state.overdriveLevel}`, tone: 'glow-magenta' },
        { labelIcon: 'guide', label: 'Next', valueId: 'over-next', value: `${state.score} / ${state.overdriveTarget}`, tone: 'text-primary' },
      ],
    };
  },
  getEndStats() {
    return { usesTimeRecord: false, showsCorrectRecord: true };
  },
};

export default overdriveMode;
