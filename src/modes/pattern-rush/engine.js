import {
  PATTERN_FAMILY_PRECEDENCE,
  PATTERN_RUSH_MAX_ATTEMPTS,
} from '../../config/pattern-rush.js';
import {
  chooseWeightedFamily,
  createEmergencySequence,
  generatePatternSequenceForFamily,
  pickSequenceLength,
} from './families.js';
import {
  createPatternCandidate,
  validatePatternCandidate,
} from './validator.js';

export function getAllowedPatternFamilies(level) {
  return PATTERN_FAMILY_PRECEDENCE.filter((family) => level.familyWeights[family]);
}

export function generatePatternCandidateForFamily(level, family) {
  const totalLength = pickSequenceLength(level);
  const fullSequence = generatePatternSequenceForFamily(level, family, totalLength);
  if (!fullSequence) return null;
  return createPatternCandidate(level, family, fullSequence);
}

export function generatePatternRushPuzzle(level) {
  for (let attempt = 0; attempt < PATTERN_RUSH_MAX_ATTEMPTS; attempt += 1) {
    const family = chooseWeightedFamily(level.familyWeights);
    const candidate = generatePatternCandidateForFamily(level, family);
    if (validatePatternCandidate(candidate, level)) {
      return candidate;
    }
  }

  for (const family of getAllowedPatternFamilies(level)) {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const candidate = generatePatternCandidateForFamily(level, family);
      if (validatePatternCandidate(candidate, level)) {
        return candidate;
      }
    }
  }

  const emergencySequence = createEmergencySequence(level);
  return createPatternCandidate(level, 'arithmetic', emergencySequence);
}
