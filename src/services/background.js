import { MATH_SYMBOLS } from '../config/constants.js';

export function createMathBackground() {
  const existing = document.querySelector('.math-bg');
  if (existing) return;

  const bg = document.createElement('div');
  bg.className = 'math-bg';

  for (let index = 0; index < 25; index += 1) {
    const span = document.createElement('span');
    span.className = 'math-symbol';
    span.textContent = MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)];
    span.style.left = `${Math.random() * 100}%`;
    span.style.fontSize = `${1 + Math.random() * 2.5}rem`;
    span.style.animationDuration = `${15 + Math.random() * 25}s`;
    span.style.animationDelay = `${-Math.random() * 30}s`;
    bg.appendChild(span);
  }

  document.body.prepend(bg);
}
