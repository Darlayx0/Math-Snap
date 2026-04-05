import { GAME_MODES } from '../config/modes.js';
import { COMBO_RING_CIRCUMFERENCE, COMBO_RING_RADIUS } from '../config/constants.js';
import { PATTERN_RUSH_MODE } from '../config/pattern-rush.js';
import { formatElapsedMs, getProgressLabel, isRaceMode } from '../engine/timer.js';
import { getComboDuration } from '../engine/combo.js';
import {
  getDifficultyTone,
  getHudVariant,
  getOperationConfig,
  getSessionMetaData,
  isPatternRushMode,
} from '../modes/index.js';
import {
  renderHudStat,
  renderIcon,
  renderModeIcon,
  renderOperationIcon,
} from './icons.js';

const MOBILE_BREAKPOINT = '(max-width: 768px)';

export function renderSessionMeta(state, level = state.level, extraClass = '') {
  const mode = GAME_MODES[state.gameMode];
  const meta = getSessionMetaData(state, level);
  const tierTone = getDifficultyTone(level);

  const items = [
    { tone: 'meta-mode', icon: renderModeIcon(state.gameMode, 'session-meta-icon'), text: mode.label },
    { tone: `meta-tier difficulty-tier-${tierTone}`, icon: renderIcon('spark', 'session-meta-icon'), text: meta.difficultyName },
  ];

  if (meta.tertiary.kind === 'operation') {
    items.push({
      tone: 'meta-operation',
      icon: renderOperationIcon(state.operation, 'session-meta-icon'),
      text: meta.tertiary.value,
    });
  } else {
    items.push({
      tone: 'meta-operation',
      icon: renderIcon(meta.tertiary.icon, 'session-meta-icon'),
      text: meta.tertiary.value,
    });
  }

  return `
    <div class="session-meta ${extraClass}">
      ${items.map((item) => `
        <span class="session-meta-chip ${item.tone}">
          ${item.icon}
          <span class="session-meta-text">${item.text}</span>
        </span>
      `).join('')}
    </div>
  `;
}

function renderSharedKeypad(options = {}) {
  const {
    showDecimal = false,
    decimalDisabled = false,
    showNegative = false,
  } = options;

  const decimalMarkup = showDecimal
    ? `<button class="key-btn key-action ${decimalDisabled ? 'key-disabled' : ''}" data-key="decimal" ${decimalDisabled ? 'disabled' : ''}>,</button>`
    : '';

  const bottomRowClass = showNegative ? '' : ' keypad-bottom-simple';
  const bottomRowMarkup = showNegative
    ? `
      <button class="key-btn key-action" data-key="neg">+/-</button>
      <button class="key-btn" data-key="0">0</button>
      <button class="key-btn key-submit" data-key="submit" style="grid-column: span 2;">Submit</button>
    `
    : `
      <button class="key-btn keypad-zero-wide" data-key="0">0</button>
      <button class="key-btn key-submit keypad-submit-wide" data-key="submit">Submit</button>
    `;

  return `
    <div class="keypad-container">
      <div class="keypad${bottomRowClass}">
        <button class="key-btn" data-key="7">7</button>
        <button class="key-btn" data-key="8">8</button>
        <button class="key-btn" data-key="9">9</button>
        <button class="key-btn key-delete" data-key="del">${renderIcon('delete', 'key-icon')}</button>
        <button class="key-btn" data-key="4">4</button>
        <button class="key-btn" data-key="5">5</button>
        <button class="key-btn" data-key="6">6</button>
        <button class="key-btn key-clear" data-key="clear">CLR</button>
        <button class="key-btn" data-key="1">1</button>
        <button class="key-btn" data-key="2">2</button>
        <button class="key-btn" data-key="3">3</button>
        ${decimalMarkup}
        ${bottomRowMarkup}
      </div>
    </div>
  `;
}

function renderKeypad(state) {
  if (state.gameMode === PATTERN_RUSH_MODE) {
    return renderSharedKeypad();
  }

  return renderSharedKeypad({
    showDecimal: true,
    decimalDisabled: state.operation !== 'division',
    showNegative: true,
  });
}

export function renderGame(app, state, actions) {
  const isPattern = isPatternRushMode(state.gameMode);
  const operation = isPattern ? null : getOperationConfig(state.operation);
  const hudVariant = getHudVariant(state);
  const timeValue = hudVariant.timeKind === 'elapsed' ? formatElapsedMs(state.elapsedMs) : `${state.timeLeft}s`;
  const timeTone = hudVariant.timeKind === 'elapsed'
    ? 'ht-time'
    : `ht-time${state.timeLeft <= 10 ? ' time-warn' : ''}`;

  app.innerHTML = `
    <div class="game-container game-active">
      <div class="header page-header game-header-top">
        ${renderSessionMeta(state, state.level, 'session-meta-header')}
        ${hudVariant.extraPanel ? `
          <div class="overdrive-hud">
            ${hudVariant.extraPanel.map((item) => `
              <div class="overdrive-hud-item">
                <span class="overdrive-hud-label">${renderIcon(item.labelIcon, 'mini-icon')}${item.label}</span>
                <span class="overdrive-hud-val ${item.tone}" id="${item.valueId}">${item.value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="game-screen glass-panel">
        <div class="game-hud">
          <div class="hud-left">
            <div class="hud-combo-wrap" id="combo-stat" style="display:none">
              <svg class="combo-arc" viewBox="0 0 36 36" id="combo-arc">
                <circle class="combo-arc-track" cx="18" cy="18" r="${COMBO_RING_RADIUS}" />
                <circle class="combo-arc-fill" id="combo-ring-progress" cx="18" cy="18" r="${COMBO_RING_RADIUS}"
                  style="stroke-dasharray:${COMBO_RING_CIRCUMFERENCE};stroke-dashoffset:${COMBO_RING_CIRCUMFERENCE};" />
              </svg>
              <span class="combo-val" id="combo">0x</span>
            </div>
          </div>
          <div class="hud-stats">
            ${renderHudStat('time', 'time', timeValue, timeTone, hudVariant.timeKind === 'elapsed' ? 'Elapsed Time' : 'Time')}
            ${renderHudStat('spark', 'score', state.score, 'ht-score', 'Score')}
            ${renderHudStat(
              hudVariant.tertiary.icon,
              hudVariant.tertiary.id,
              hudVariant.tertiary.value,
              hudVariant.tertiary.tone,
              hudVariant.tertiary.title,
            )}
          </div>
          <button class="pause-btn" id="pause-btn" title="Pause">${renderIcon('pause', 'control-icon')}</button>
        </div>

        <div class="problem-stage">
          <div class="problem-label">${isPattern ? 'Next Number' : operation.label}</div>
          <div id="problem" class="problem-text">${state.currentProblem}</div>
          <div class="problem-eq-line"></div>
        </div>

        <div class="input-container" id="input-area">
          ${state.useKeypad ? `
            <div class="answer-display focus" id="answer-display">${state.inputValue}<span class="cursor-blink"></span></div>
          ` : `
            <input type="text" id="answer-input" value="${state.inputValue}" autocomplete="off" inputmode="${isPattern ? 'numeric' : 'decimal'}" spellcheck="false" />
          `}
        </div>
      </div>

      ${state.useKeypad ? `
        <div class="game-footer-dock">
          <div class="keypad-footer-shell">
            ${renderKeypad(state)}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('pause-btn')?.addEventListener('click', actions.pauseGame);
  document.removeEventListener('keydown', actions.handlePhysicalKeyboard);
  document.addEventListener('keydown', actions.handlePhysicalKeyboard);

  if (state.useKeypad) {
    document.querySelectorAll('.key-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        actions.handleKeypadPress(button.dataset.key);
      });
    });
  } else {
    const input = document.getElementById('answer-input');
    if (input) {
      updateAnswerInput(state.inputValue);
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      input.addEventListener('input', () => {
        actions.handleDesktopInputChange(input.value);
      });
    }
  }
}

export function updateAnswerDisplay(value) {
  const display = document.getElementById('answer-display');
  if (display) {
    display.innerHTML = `${value}<span class="cursor-blink"></span>`;
  }
}

export function updateAnswerInput(value) {
  const input = document.getElementById('answer-input');
  if (input) {
    input.value = value;
    if (document.activeElement === input) {
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
}

export function updateTimeUI(state) {
  const timeEl = document.getElementById('time');
  if (!timeEl) return;

  if (isRaceMode(state.gameMode)) {
    timeEl.textContent = formatElapsedMs(state.elapsedMs);
    timeEl.classList.remove('time-warn');
    return;
  }

  timeEl.textContent = `${Math.max(0, state.timeLeft)}s`;
  timeEl.classList.toggle('time-warn', state.timeLeft <= 10);
}

export function updateStatsUI(state) {
  const scoreEl = document.getElementById('score');
  const correctEl = document.getElementById('correct');
  const progressEl = document.getElementById('progress');
  if (scoreEl) scoreEl.textContent = state.score;
  if (correctEl) correctEl.textContent = state.correct;
  if (progressEl) progressEl.textContent = getProgressLabel(state.progressSolved);

  if (state.gameMode === 'overdrive') {
    const overNextEl = document.getElementById('over-next');
    const overRangeEl = document.getElementById('over-range');
    const overLvlEl = document.getElementById('over-lvl');
    if (overNextEl) overNextEl.textContent = `${state.score} / ${state.overdriveTarget}`;
    if (overRangeEl) overRangeEl.textContent = state.overdriveLabel;
    if (overLvlEl) overLvlEl.textContent = `Lvl ${state.overdriveLevel}`;
  }
}

export function updateComboUI(state) {
  const comboStat = document.getElementById('combo-stat');
  const comboVal = document.getElementById('combo');
  const comboRingProgress = document.getElementById('combo-ring-progress');
  const comboDuration = getComboDuration(state.gameMode);

  if (state.combo > 0) {
    if (comboStat) {
      comboStat.style.display = 'flex';
      comboStat.classList.toggle('danger', state.comboTimer <= 3);
    }
    if (comboVal) comboVal.textContent = `${state.combo}x`;
    if (comboRingProgress) {
      const progress = Math.max(0, Math.min(1, state.comboTimer / comboDuration));
      comboRingProgress.style.strokeDashoffset = `${COMBO_RING_CIRCUMFERENCE * (1 - progress)}`;
    }
  } else {
    if (comboStat) {
      comboStat.style.display = 'none';
      comboStat.classList.remove('danger');
    }
    if (comboRingProgress) {
      comboRingProgress.style.strokeDashoffset = `${COMBO_RING_CIRCUMFERENCE}`;
    }
  }
}

export function fitProblemText(element, isPatternMode) {
  const container = element.parentElement;
  if (!container) return;
  const isCompactViewport = window.matchMedia(MOBILE_BREAKPOINT).matches;
  const textLength = (element.textContent || '').trim().length;

  const getBaseSizes = () => {
    if (isPatternMode) {
      if (textLength <= 18) return isCompactViewport ? [3.7, 3.35, 3, 2.7, 2.4, 2.1] : [4.15, 3.8, 3.45, 3.1, 2.75, 2.4];
      if (textLength <= 32) return isCompactViewport ? [3.35, 3.05, 2.75, 2.45, 2.15, 1.9] : [3.8, 3.45, 3.1, 2.8, 2.45, 2.15];
      if (textLength <= 48) return isCompactViewport ? [3.05, 2.75, 2.45, 2.15, 1.92, 1.75] : [3.4, 3.05, 2.75, 2.45, 2.15, 1.9];
      return isCompactViewport ? [2.7, 2.45, 2.2, 1.95, 1.76, 1.6] : [3.05, 2.8, 2.5, 2.2, 1.95, 1.72];
    }

    if (textLength <= 14) return isCompactViewport ? [4.35, 4, 3.6, 3.2, 2.8, 2.45] : [4.85, 4.4, 3.95, 3.5, 3.1, 2.7];
    if (textLength <= 26) return isCompactViewport ? [4.05, 3.65, 3.25, 2.9, 2.55, 2.2] : [4.5, 4.05, 3.6, 3.2, 2.8, 2.45];
    if (textLength <= 40) return isCompactViewport ? [3.7, 3.3, 2.95, 2.6, 2.28, 2] : [4.15, 3.7, 3.3, 2.95, 2.6, 2.25];
    return isCompactViewport ? [3.25, 2.9, 2.6, 2.3, 2.02, 1.82] : [3.75, 3.35, 3, 2.65, 2.32, 2.05];
  };

  const baseSizes = getBaseSizes();
  const maxLines = isCompactViewport ? 4.7 : 3.7;
  const maxHeight = Math.max(120, container.clientHeight * (isCompactViewport ? 0.95 : 0.84));

  for (const size of baseSizes) {
    element.style.fontSize = `${size}rem`;
    const computed = window.getComputedStyle(element);
    const lineHeight = Number.parseFloat(computed.lineHeight) || (size * 16 * 1.14);
    const lineCount = element.scrollHeight / lineHeight;
    if (lineCount <= maxLines && element.scrollHeight <= maxHeight) return;
  }
  element.style.fontSize = isCompactViewport ? '1.58rem' : '1.7rem';
}

export function animateProblem(state) {
  const element = document.getElementById('problem');
  if (element) {
    element.textContent = state.currentProblem;
    element.style.fontSize = '';
    element.classList.remove('pop');
    void element.offsetWidth;
    fitProblemText(element, state.gameMode === PATTERN_RUSH_MODE);
    element.classList.add('pop');
  }
}

export function showFeedback(text, type) {
  const container = document.getElementById('input-area');
  if (!container) return;
  const feedback = document.createElement('div');
  feedback.className = `floating-feedback ${type}`;
  feedback.textContent = text;
  container.appendChild(feedback);
  setTimeout(() => feedback.remove(), 900);
}
