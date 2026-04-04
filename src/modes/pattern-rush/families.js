function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(values) {
  return values[Math.floor(Math.random() * values.length)];
}

export function chooseWeightedFamily(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const [family, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      return family;
    }
  }
  return entries[entries.length - 1]?.[0] || 'arithmetic';
}

function generateArithmeticPattern(level, totalLength) {
  const [minStep, maxStep] = level.arithmeticStepRange;
  const descending = Math.random() < 0.35;
  const stepValue = randomInt(minStep, maxStep);
  const step = descending ? -stepValue : stepValue;
  const minStart = descending ? stepValue * (totalLength - 1) : 1;
  const maxStart = descending ? level.max : level.max - (stepValue * (totalLength - 1));
  if (maxStart < minStart) return null;
  const start = randomInt(minStart, maxStart);
  return Array.from({ length: totalLength }, (_, index) => start + (step * index));
}

function generateGeometricPattern(level, totalLength) {
  const [minRatio, maxRatio] = level.geometricRatioRange;
  const ratio = randomInt(minRatio, maxRatio);
  const maxStart = Math.floor(level.max / (ratio ** (totalLength - 1)));
  if (maxStart < 1) return null;
  const start = randomInt(1, Math.max(1, maxStart));
  return Array.from({ length: totalLength }, (_, index) => start * (ratio ** index));
}

function generateAlternatingPattern(level, totalLength) {
  const [minRatio, maxRatio] = level.geometricRatioRange;
  const ratio = randomInt(minRatio, maxRatio);
  const addMin = Math.max(2, Math.floor(level.arithmeticStepRange[0] / 2));
  const addMax = Math.max(addMin, Math.floor(level.arithmeticStepRange[1] / 2));
  const add = randomInt(addMin, addMax);
  const order = Math.random() < 0.5 ? 'add-then-multiply' : 'multiply-then-add';

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const maxStart = Math.max(1, Math.floor(level.max / (ratio ** Math.ceil((totalLength - 1) / 2))));
    const start = randomInt(1, maxStart);
    const sequence = [start];
    let valid = true;

    while (sequence.length < totalLength) {
      const previous = sequence[sequence.length - 1];
      const stepIndex = sequence.length - 1;
      const useAddFirst = order === 'add-then-multiply';
      const next = ((stepIndex % 2 === 0) === useAddFirst)
        ? previous + add
        : previous * ratio;
      if (!Number.isInteger(next) || next < 0 || next > level.max) {
        valid = false;
        break;
      }
      sequence.push(next);
    }

    if (valid) {
      return sequence;
    }
  }

  return null;
}

function generateSecondDifferencePattern(level, totalLength) {
  const firstDiff = randomInt(
    Math.max(2, Math.floor(level.arithmeticStepRange[0] / 2)),
    Math.max(4, Math.floor(level.arithmeticStepRange[1] / 2)),
  );
  const delta = randomInt(2, Math.max(3, Math.floor(level.arithmeticStepRange[1] / 3)));
  let totalIncrease = 0;
  for (let index = 0; index < totalLength - 1; index += 1) {
    totalIncrease += firstDiff + (delta * index);
  }

  const maxStart = level.max - totalIncrease;
  if (maxStart < 1) return null;

  const start = randomInt(1, maxStart);
  const sequence = [start];
  let diff = firstDiff;
  while (sequence.length < totalLength) {
    sequence.push(sequence[sequence.length - 1] + diff);
    diff += delta;
  }
  return sequence;
}

function generateBasicPatternSubsequence(type, count, cap, level) {
  if (type === 'geometric') {
    const maxRatio = Math.min(level.geometricRatioRange?.[1] || 3, 3);
    const ratio = randomInt(2, Math.max(2, maxRatio));
    const maxStart = Math.floor(cap / (ratio ** (count - 1)));
    if (maxStart < 1) return null;
    const start = randomInt(1, Math.max(1, maxStart));
    return Array.from({ length: count }, (_, index) => start * (ratio ** index));
  }

  const maxStep = Math.max(2, Math.floor(level.arithmeticStepRange[1] / 2));
  const step = randomInt(Math.max(2, Math.floor(level.arithmeticStepRange[0] / 2)), maxStep);
  const maxStart = cap - (step * (count - 1));
  if (maxStart < 1) return null;
  const start = randomInt(1, maxStart);
  return Array.from({ length: count }, (_, index) => start + (step * index));
}

function generatePositionBasedPattern(level, totalLength) {
  const oddCount = Math.ceil(totalLength / 2);
  const evenCount = Math.floor(totalLength / 2);
  const combinations = [
    ['arithmetic', 'arithmetic'],
    ['arithmetic', 'geometric'],
    ['geometric', 'arithmetic'],
  ];

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const [oddType, evenType] = pickRandom(combinations);
    const oddSequence = generateBasicPatternSubsequence(oddType, oddCount, level.max, level);
    const evenSequence = generateBasicPatternSubsequence(evenType, evenCount, level.max, level);
    if (!oddSequence || !evenSequence) continue;

    const sequence = [];
    for (let index = 0; index < totalLength; index += 1) {
      sequence.push(index % 2 === 0 ? oddSequence[Math.floor(index / 2)] : evenSequence[Math.floor(index / 2)]);
    }
    if (sequence.every((value) => value <= level.max)) {
      return sequence;
    }
  }

  return null;
}

function generateRecursiveLightPattern(level, totalLength) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const first = randomInt(1, Math.max(2, Math.floor(level.max / 40)));
    const second = randomInt(first + 1, Math.max(first + 1, Math.floor(level.max / 20)));
    const sequence = [first, second];
    let valid = true;

    while (sequence.length < totalLength) {
      const next = sequence[sequence.length - 1] + sequence[sequence.length - 2];
      if (next > level.max) {
        valid = false;
        break;
      }
      sequence.push(next);
    }

    if (valid) {
      return sequence;
    }
  }

  return null;
}

export function generatePatternSequenceForFamily(level, family, totalLength) {
  switch (family) {
    case 'arithmetic':
      return generateArithmeticPattern(level, totalLength);
    case 'geometric':
      return generateGeometricPattern(level, totalLength);
    case 'alternating':
      return generateAlternatingPattern(level, totalLength);
    case 'second-difference':
      return generateSecondDifferencePattern(level, totalLength);
    case 'position-based':
      return generatePositionBasedPattern(level, totalLength);
    case 'recursive-light':
      return generateRecursiveLightPattern(level, totalLength);
    default:
      return null;
  }
}

export function pickSequenceLength(level) {
  return pickRandom(level.sequenceLengths) + 1;
}

export function createEmergencySequence(level) {
  const fallbackLength = pickSequenceLength(level);
  const maxAllowedStep = Math.max(2, Math.floor((level.max - 1) / Math.max(1, fallbackLength - 1)));
  const step = Math.max(2, Math.min(level.arithmeticStepRange?.[0] || 2, maxAllowedStep));
  return Array.from({ length: fallbackLength }, (_, index) => 1 + (step * index));
}
