import {
  PATTERN_FAMILY_PRECEDENCE,
  PATTERN_RUSH_DISPLAY_LENGTH_CAP,
} from '../../config/pattern-rush.js';

function matchesArithmetic(sequence) {
  if (sequence.length < 3) return false;
  const diff = sequence[1] - sequence[0];
  if (diff === 0) return false;
  return sequence.every((value, index) => index === 0 || value - sequence[index - 1] === diff);
}

function matchesGeometric(sequence) {
  if (sequence.length < 3 || sequence[0] <= 0) return false;
  if (sequence[1] % sequence[0] !== 0) return false;
  const ratio = sequence[1] / sequence[0];
  if (!Number.isInteger(ratio) || ratio <= 1) return false;
  return sequence.every((value, index) => {
    if (index === 0) return true;
    return sequence[index - 1] > 0
      && value % sequence[index - 1] === 0
      && (value / sequence[index - 1]) === ratio;
  });
}

function matchesAlternating(sequence) {
  if (sequence.length < 5) return false;

  const addThenMultiply = (() => {
    const add = sequence[1] - sequence[0];
    if (add <= 0) return false;
    if (sequence[1] <= 0 || sequence[2] % sequence[1] !== 0) return false;
    const multiply = sequence[2] / sequence[1];
    if (!Number.isInteger(multiply) || multiply <= 1) return false;
    for (let index = 1; index < sequence.length; index += 1) {
      const previous = sequence[index - 1];
      const expected = (index % 2 === 1) ? previous + add : previous * multiply;
      if (sequence[index] !== expected) return false;
    }
    return true;
  })();

  if (addThenMultiply) return true;

  const multiplyThenAdd = (() => {
    if (sequence[0] <= 0 || sequence[1] % sequence[0] !== 0) return false;
    const multiply = sequence[1] / sequence[0];
    if (!Number.isInteger(multiply) || multiply <= 1) return false;
    const add = sequence[2] - sequence[1];
    if (add <= 0) return false;
    for (let index = 1; index < sequence.length; index += 1) {
      const previous = sequence[index - 1];
      const expected = (index % 2 === 1) ? previous * multiply : previous + add;
      if (sequence[index] !== expected) return false;
    }
    return true;
  })();

  return multiplyThenAdd;
}

function matchesSecondDifference(sequence) {
  if (sequence.length < 5) return false;
  const diffs = [];
  for (let index = 1; index < sequence.length; index += 1) {
    diffs.push(sequence[index] - sequence[index - 1]);
  }
  const delta = diffs[1] - diffs[0];
  if (delta === 0) return false;
  for (let index = 1; index < diffs.length; index += 1) {
    if ((diffs[index] - diffs[index - 1]) !== delta) {
      return false;
    }
  }
  return true;
}

function matchesPositionBased(sequence) {
  if (sequence.length < 6) return false;
  const oddSequence = sequence.filter((_, index) => index % 2 === 0);
  const evenSequence = sequence.filter((_, index) => index % 2 === 1);
  const oddValid = matchesArithmetic(oddSequence) || matchesGeometric(oddSequence);
  const evenValid = matchesArithmetic(evenSequence) || matchesGeometric(evenSequence);
  return oddValid && evenValid;
}

function matchesRecursiveLight(sequence) {
  if (sequence.length < 5) return false;
  for (let index = 2; index < sequence.length; index += 1) {
    if (sequence[index] !== sequence[index - 1] + sequence[index - 2]) {
      return false;
    }
  }
  return true;
}

const PATTERN_MATCHERS = {
  arithmetic: matchesArithmetic,
  geometric: matchesGeometric,
  alternating: matchesAlternating,
  'second-difference': matchesSecondDifference,
  'position-based': matchesPositionBased,
  'recursive-light': matchesRecursiveLight,
};

export function getMatchingPatternFamilies(sequence) {
  return PATTERN_FAMILY_PRECEDENCE.filter((family) => PATTERN_MATCHERS[family](sequence));
}

export function getPatternDisplayText(sequence) {
  return `${sequence.join(', ')}, ?`;
}

export function computePatternReadability(displayText) {
  return Math.max(0.1, 1 - ((displayText.length - 12) / PATTERN_RUSH_DISPLAY_LENGTH_CAP));
}

export function createPatternCandidate(level, family, fullSequence) {
  const sequence = fullSequence.slice(0, -1);
  const displayText = getPatternDisplayText(sequence);
  return {
    family,
    difficulty: level.difficultyName,
    sequence,
    fullSequence,
    answer: fullSequence[fullSequence.length - 1],
    displayText,
    readabilityScore: computePatternReadability(displayText),
    uniquenessScore: 1,
  };
}

export function isPatternDisplayReadable(candidate, level) {
  if (candidate.displayText.length > PATTERN_RUSH_DISPLAY_LENGTH_CAP) return false;
  if (candidate.readabilityScore < 0.22) return false;
  if (candidate.sequence.length < 4) return false;
  return candidate.fullSequence.every((value) => value <= level.max && value >= 0);
}

export function validatePatternCandidate(candidate, level) {
  if (!candidate) return false;
  if (!candidate.fullSequence.every((value) => Number.isInteger(value) && value >= 0)) return false;
  if (!isPatternDisplayReadable(candidate, level)) return false;

  const matches = getMatchingPatternFamilies(candidate.fullSequence);
  const currentIndex = PATTERN_FAMILY_PRECEDENCE.indexOf(candidate.family);
  if (currentIndex === -1 || !matches.includes(candidate.family)) return false;

  const simplerMatches = matches.filter((family) => PATTERN_FAMILY_PRECEDENCE.indexOf(family) < currentIndex);
  if (simplerMatches.length > 0) return false;

  candidate.uniquenessScore = matches.length === 1 ? 1 : Math.max(0.35, 1 - (matches.length - 1) * 0.35);
  return candidate.uniquenessScore >= 0.65;
}
