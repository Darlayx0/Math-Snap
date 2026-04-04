import { PATTERN_RUSH_MODE } from '../config/pattern-rush.js';

export function isIntegerOnlyMode(mode) {
  return mode === PATTERN_RUSH_MODE;
}

export function scrollViewportToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function normalizeForParse(value) {
  return String(value ?? '').replace(/,/g, '.');
}

export function sanitizeInputValue(value, mode, operation) {
  if (isIntegerOnlyMode(mode)) {
    const digits = String(value ?? '').replace(/\D/g, '');
    return digits.replace(/^0+(?=\d)/, '') || '0';
  }

  const raw = String(value ?? '').trim().replace(/\./g, ',');
  let negative = false;
  let decimalUsed = false;
  let result = '';

  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      result += char;
    } else if (char === '-' && !negative && result.length === 0) {
      negative = true;
    } else if (char === ',' && operation === 'division' && !decimalUsed) {
      decimalUsed = true;
      result += result.length === 0 ? '0,' : ',';
    }
  }

  if (result === '') {
    return negative ? '-0' : '0';
  }

  if (result.startsWith('0') && !result.startsWith('0,')) {
    result = result.replace(/^0+(?=\d)/, '') || '0';
  }

  return negative ? `-${result}` : result;
}

export function appendInputDigit(currentValue, digit) {
  if (digit < '0' || digit > '9') return currentValue;
  if (currentValue === '0') {
    return digit === '0' ? currentValue : digit;
  }
  if (currentValue === '-0') {
    return digit === '0' ? currentValue : `-${digit}`;
  }
  return currentValue + digit;
}

export function deleteInputChar(currentValue) {
  if (currentValue === '0' || currentValue === '-0') {
    return '0';
  }
  const nextValue = currentValue.slice(0, -1);
  if (nextValue === '' || nextValue === '-') {
    return '0';
  }
  return nextValue;
}

export function resetInputValue() {
  return '0';
}

export function toggleNegative(currentValue, mode) {
  if (isIntegerOnlyMode(mode)) return currentValue;
  if (currentValue.startsWith('-')) {
    return currentValue.substring(1);
  }
  return `-${currentValue}`;
}

export function appendDecimalPoint(currentValue, mode, operation) {
  if (isIntegerOnlyMode(mode) || operation !== 'division' || currentValue.includes(',')) {
    return currentValue;
  }
  return `${currentValue},`;
}

export function parseSubmittedValue(inputValue, mode) {
  const normalizedValue = isIntegerOnlyMode(mode)
    ? Number.parseInt(inputValue, 10)
    : parseFloat(normalizeForParse(inputValue));
  return Number.isNaN(normalizedValue) ? null : normalizedValue;
}
