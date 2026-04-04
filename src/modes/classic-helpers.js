import { OPERATIONS } from '../config/operations.js';

function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function createClassicProblem(operation, max) {
  const num1 = Math.floor(Math.random() * max) + 1;
  const num2 = Math.floor(Math.random() * max) + 1;
  const formattedNum1 = num1.toLocaleString();
  const formattedNum2 = num2.toLocaleString();

  switch (operation) {
    case 'addition':
      return {
        currentAnswer: num1 + num2,
        currentProblem: `${formattedNum1} + ${formattedNum2}`,
        currentPuzzleData: null,
      };
    case 'subtraction':
      return {
        currentAnswer: num1 - num2,
        currentProblem: `${formattedNum1} - ${formattedNum2}`,
        currentPuzzleData: null,
      };
    case 'multiplication':
      return {
        currentAnswer: num1 * num2,
        currentProblem: `${formattedNum1} × ${formattedNum2}`,
        currentPuzzleData: null,
      };
    case 'division':
      return {
        currentAnswer: roundToTwo(num1 / num2),
        currentProblem: `${formattedNum1} ÷ ${formattedNum2}`,
        currentPuzzleData: null,
      };
    default:
      return {
        currentAnswer: 0,
        currentProblem: '',
        currentPuzzleData: null,
      };
  }
}

export function buildOverdriveLabel(operation, max) {
  const fmt = max >= 1000000
    ? `${max / 1000000}M`
    : (max >= 1000 ? `${max / 1000}K` : `${max}`);
  const symbol = OPERATIONS[operation].symbol;
  return `1–${fmt} ${symbol} 1–${fmt}`;
}
