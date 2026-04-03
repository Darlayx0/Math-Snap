import './style.css';

// ============================================
// Constants & Configuration
// ============================================
const OPERATIONS = {
  addition: {
    label: 'Addition',
    symbol: '+',
    icon: 'plus',
    desc: 'Test your adding speed',
    levels: [
      { max: 100, label: '1–100 + 1–100', stars: '★' },
      { max: 1000, label: '1–1K + 1–1K', stars: '★★' },
      { max: 10000, label: '1–10K + 1–10K', stars: '★★★' },
      { max: 100000, label: '1–100K + 1–100K', stars: '★★★★' },
      { max: 1000000, label: '1–1M + 1–1M', stars: '★★★★★' },
    ],
  },
  subtraction: {
    label: 'Subtraction',
    symbol: '-',
    icon: 'minus',
    desc: 'Sharpen your subtraction speed',
    levels: [
      { max: 100, label: '1–100 - 1–100', stars: '★' },
      { max: 1000, label: '1–1K - 1–1K', stars: '★★' },
      { max: 10000, label: '1–10K - 1–10K', stars: '★★★' },
      { max: 100000, label: '1–100K - 1–100K', stars: '★★★★' },
      { max: 1000000, label: '1–1M - 1–1M', stars: '★★★★★' },
    ],
  },
  multiplication: {
    label: 'Multiplication',
    symbol: '×',
    icon: 'multiply',
    desc: 'Master your times tables',
    levels: [
      { max: 10, label: '1–10 × 1–10', stars: '★' },
      { max: 30, label: '1–30 × 1–30', stars: '★★' },
      { max: 100, label: '1–100 × 1–100', stars: '★★★' },
      { max: 1000, label: '1–1K × 1–1K', stars: '★★★★' },
      { max: 10000, label: '1–10K × 1–10K', stars: '★★★★★' },
    ],
  },
  division: {
    label: 'Division',
    symbol: '÷',
    icon: 'divide',
    desc: 'Practice fast decimal division',
    levels: [
      { max: 10, label: '1–10 ÷ 1–10', stars: '★' },
      { max: 30, label: '1–30 ÷ 1–30', stars: '★★' },
      { max: 100, label: '1–100 ÷ 1–100', stars: '★★★' },
      { max: 1000, label: '1–1K ÷ 1–1K', stars: '★★★★' },
      { max: 10000, label: '1–10K ÷ 1–10K', stars: '★★★★★' },
    ],
  },
};

const MATH_SYMBOLS = ['Σ', 'π', '√', '∫', '∞', 'Δ', '÷', '±', '≈', '≠', '%', '∂', 'θ', 'λ', 'φ', 'α', 'β', 'γ', '+', '×', '−', '='];
const GAME_DURATION = 60;
const CORRECT_SCORE = 20;
const WRONG_PENALTY = 100;
const COMBO_RING_RADIUS = 16;
const COMBO_RING_CIRCUMFERENCE = 2 * Math.PI * COMBO_RING_RADIUS;

// ============================================
// Game State
// ============================================
let state = {
  screen: 'menu', // menu | difficulty | playing | paused | end
  operation: null,  // 'addition' | 'subtraction' | 'multiplication' | 'division'
  level: null,      // level object
  score: 0,
  correct: 0,
  wrong: 0,
  combo: 0,
  maxCombo: 0,
  comboTimer: 10,
  timeLeft: GAME_DURATION,
  currentAnswer: 0,
  currentProblem: '',
  timerInterval: null,
  comboInterval: null,
  inputValue: '',
  useKeypad: false,
};

const app = document.querySelector('#app');

function renderIcon(name, className = '') {
  const classes = ['ui-icon', className].filter(Boolean).join(' ');
  const icons = {
    bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-linejoin="round" />',
    time: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" stroke-linecap="round" stroke-linejoin="round" />',
    check: '<path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />',
    close: '<path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M12 17v5M9 22h6M8 4h8v5a4 4 0 0 1-8 0V4z" stroke-linecap="round" stroke-linejoin="round" />',
    target: '<circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M22 12h-2M4 12H2" stroke-linecap="round" />',
    pause: '<rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />',
    play: '<path d="M8 5v14l11-7z" stroke-linejoin="round" />',
    warning: '<path d="M12 9v2M12 15h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z" stroke-linecap="round" stroke-linejoin="round" />',
    refresh: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke-linecap="round" stroke-linejoin="round" /><path d="M3 3v5h5" stroke-linecap="round" stroke-linejoin="round" />',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-linecap="round" stroke-linejoin="round" /><path d="M9 22V12h6v10" stroke-linecap="round" stroke-linejoin="round" />',
    chart: '<path d="M18 20V10M12 20V4M6 20v-6" stroke-linecap="round" stroke-linejoin="round" />',
    guide: '<path d="M6 5.5A2.5 2.5 0 0 1 8.5 3H20v15H8.5A2.5 2.5 0 0 0 6 20.5m0-15v15m0-15H4v15h2" stroke-linecap="round" stroke-linejoin="round" />',
    spark: '<path d="M12 2.5l2.1 5.4 5.4 2.1-5.4 2.1L12 17.5l-2.1-5.4-5.4-2.1 5.4-2.1L12 2.5z" stroke-linejoin="round" />',
    plus: '<path d="M12 5v14M5 12h14" stroke-linecap="round" />',
    minus: '<path d="M5 12h14" stroke-linecap="round" />',
    multiply: '<path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />',
    divide: '<path d="M5 12h14M12 6h.01M12 18h.01" stroke-linecap="round" stroke-linejoin="round" />',
    answer: '<path d="M4 7h16v10H4z" stroke-linejoin="round" /><path d="M9 12h6" stroke-linecap="round" />',
    delete: '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke-linecap="round" stroke-linejoin="round" /><path d="M18 9l-6 6M12 9l6 6" stroke-linecap="round" stroke-linejoin="round" />',
  };

  return `
    <svg class="${classes}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      ${icons[name] || ''}
    </svg>
  `;
}

function renderOperationIcon(name, className = '') {
  const iconMap = {
    addition: 'plus',
    subtraction: 'minus',
    multiplication: 'multiply',
    division: 'divide',
  };
  return renderIcon(iconMap[name], className);
}

function renderRankDots(rank) {
  return `<div class="diff-rank" aria-label="Difficulty ${rank}">${Array.from({ length: 5 }, (_, index) => `
    <span class="rank-dot ${index < rank ? 'active' : ''}"></span>
  `).join('')}</div>`;
}

function renderLabelIcon(name, text) {
  return `<span class="label-with-icon">${renderIcon(name, 'inline-icon')}<span>${text}</span></span>`;
}

function renderInlineStat({ tone, icon, label, value, id, valueClass = '', title = '' }) {
  return `
    <div class="inline-stat ${tone}" title="${title}">
      <span class="inline-stat-badge">
        <span class="stat-icon">${renderIcon(icon, 'stats-icon')}</span>
      </span>
      <span class="stat-copy">
        <span class="stat-label">${label}</span>
        <span class="stat-val ${valueClass}" id="${id}">${value}</span>
      </span>
    </div>
  `;
}

function renderComboStat() {
  return `
    <div class="inline-stat combo" title="Combo multiplier" id="combo-stat" style="display:none">
      <span class="combo-ring-shell">
        <svg class="combo-ring" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
          <circle class="combo-ring-track" cx="20" cy="20" r="${COMBO_RING_RADIUS}"></circle>
          <circle
            class="combo-ring-progress"
            id="combo-ring-progress"
            cx="20"
            cy="20"
            r="${COMBO_RING_RADIUS}"
            style="stroke-dasharray:${COMBO_RING_CIRCUMFERENCE};stroke-dashoffset:${COMBO_RING_CIRCUMFERENCE};"
          ></circle>
        </svg>
        <span class="stat-icon combo-icon">${renderIcon('bolt', 'stats-icon')}</span>
      </span>
      <span class="stat-copy">
        <span class="stat-label">Combo</span>
        <span class="stat-val" id="combo">0x</span>
      </span>
    </div>
  `;
}

function renderGuideModal() {
  return `
    <div class="guide-modal" id="guide-modal" aria-hidden="true">
      <div class="guide-modal-panel glass-panel">
        <h2 class="guide-title">Panduan Permainan</h2>
        <div class="guide-rules">
          <div class="guide-rule">
            <span class="rule-icon">${renderIcon('time', 'rule-svg')}</span>
            <span class="guide-rule-text"><strong>60 detik</strong> untuk skor setinggi mungkin</span>
          </div>
          <div class="guide-rule">
            <span class="rule-icon glow-green">${renderIcon('check', 'rule-svg')}</span>
            <span class="guide-rule-text">Benar: <strong class="text-green">+${CORRECT_SCORE} Base Score</strong> dan combo bertambah.</span>
          </div>
          <div class="guide-rule">
            <span class="rule-icon glow-magenta">${renderIcon('bolt', 'rule-svg')}</span>
            <span class="guide-rule-text">Combo multiplier memberi bonus dan turun otomatis tiap 10 detik.</span>
          </div>
          <div class="guide-rule">
            <span class="rule-icon glow-red">${renderIcon('close', 'rule-svg')}</span>
            <span class="guide-rule-text">Salah membuat combo hangus, skor tetap, dan soal tidak berganti.</span>
          </div>
        </div>
        <button class="secondary-btn guide-close-btn" id="close-guide">Tutup</button>
      </div>
    </div>
  `;
}



// ============================================
// Detect touch device
// ============================================
function isTouchDevice() {
  return ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (window.matchMedia('(pointer: coarse)').matches);
}

// ============================================
// Local Storage Helpers
// ============================================
function getHighScore(op, max) {
  return parseInt(localStorage.getItem(`mathSnap_${op}_${max}_HS`)) || 0;
}
function getHighCorrect(op, max) {
  return parseInt(localStorage.getItem(`mathSnap_${op}_${max}_HC`)) || 0;
}
function getHighCombo(op, max) {
  return parseInt(localStorage.getItem(`mathSnap_${op}_${max}_HCO`)) || 0;
}
function setHighScore(op, max, val) {
  localStorage.setItem(`mathSnap_${op}_${max}_HS`, val);
}
function setHighCorrect(op, max, val) {
  localStorage.setItem(`mathSnap_${op}_${max}_HC`, val);
}
function setHighCombo(op, max, val) {
  localStorage.setItem(`mathSnap_${op}_${max}_HCO`, val);
}

function clearAllProgress() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('mathSnap_'))
    .forEach((key) => localStorage.removeItem(key));
}

// ============================================
// Background Math Symbols
// ============================================
function createMathBackground() {
  let existing = document.querySelector('.math-bg');
  if (existing) return;
  const bg = document.createElement('div');
  bg.className = 'math-bg';
  for (let i = 0; i < 25; i++) {
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

// ============================================
// Render Router
// ============================================
function render() {
  switch (state.screen) {
    case 'menu': renderMenu(); break;
    case 'difficulty': renderDifficulty(); break;
    case 'playing': renderGame(); break;
    case 'end': renderEnd(); break;
  }
}

// ============================================
// Menu Screen
// ============================================
function renderMenu() {
  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <h1>Math Snap</h1>
        <div class="subtitle">${renderLabelIcon('bolt', 'Speed Math Challenge')}</div>
      </div>

      <div class="menu-screen glass-panel">
        <h2>Choose Operation</h2>
        <div class="operation-grid">
          <div class="op-card addition" data-op="addition" id="op-addition">
            <div class="op-icon">${renderOperationIcon('addition', 'operation-icon')}</div>
            <div class="op-label">Addition</div>
            <div class="op-desc">Add numbers fast</div>
          </div>
          <div class="op-card subtraction" data-op="subtraction" id="op-subtraction">
            <div class="op-icon">${renderOperationIcon('subtraction', 'operation-icon')}</div>
            <div class="op-label">Subtraction</div>
            <div class="op-desc">Subtract with speed</div>
          </div>
          <div class="op-card multiplication" data-op="multiplication" id="op-multiplication">
            <div class="op-icon">${renderOperationIcon('multiplication', 'operation-icon')}</div>
            <div class="op-label">Multiply</div>
            <div class="op-desc">Times table mastery</div>
          </div>
          <div class="op-card division" data-op="division" id="op-division">
            <div class="op-icon">${renderOperationIcon('division', 'operation-icon')}</div>
            <div class="op-label">Division</div>
            <div class="op-desc">Decimal division drill</div>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="menu-actions">
          <button class="utility-link" id="open-guide">${renderIcon('guide', 'button-icon')}Panduan Permainan</button>
          <button class="danger-link" id="reset-progress-menu">Reset All Progress</button>
        </div>
      </div>
    </div>
    ${renderGuideModal()}
  `;

  const guideModal = document.getElementById('guide-modal');
  document.getElementById('open-guide')?.addEventListener('click', () => {
    guideModal?.classList.add('is-open');
    guideModal?.setAttribute('aria-hidden', 'false');
  });
  document.getElementById('close-guide')?.addEventListener('click', () => {
    guideModal?.classList.remove('is-open');
    guideModal?.setAttribute('aria-hidden', 'true');
  });
  guideModal?.addEventListener('click', (e) => {
    if (e.target === guideModal) {
      guideModal.classList.remove('is-open');
      guideModal.setAttribute('aria-hidden', 'true');
    }
  });

  document.querySelectorAll('.op-card').forEach(card => {
    card.addEventListener('click', () => {
      state.operation = card.dataset.op;
      state.screen = 'difficulty';
      render();
    });
  });

  document.getElementById('reset-progress-menu').addEventListener('click', confirmResetProgress);
}

// ============================================
// Difficulty Select Screen
// ============================================
function renderDifficulty() {
  const op = OPERATIONS[state.operation];
  const hs = (lvl) => getHighScore(state.operation, lvl.max);
  const hc = (lvl) => getHighCorrect(state.operation, lvl.max);

  const hco = (lvl) => getHighCombo(state.operation, lvl.max);

  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <h1>Math Snap</h1>
      </div>

      <div class="diff-screen glass-panel">
        <div class="op-badge">${renderOperationIcon(state.operation, 'badge-icon')} <span>${op.label}</span></div>
        <h2>Select Difficulty</h2>
        
        <div class="diff-grid">
          ${op.levels.map((lvl, i) => `
            <div class="diff-card" data-idx="${i}" id="diff-${i}">
              <div class="diff-main">
                <div class="diff-label">${lvl.label}</div>
                <div class="diff-meta">
                  <span class="diff-stat score-record">${renderIcon('trophy', 'mini-icon')} Best: ${hs(lvl)}</span>
                  <span class="diff-stat correct-record">${renderIcon('target', 'mini-icon')} Most: ${hc(lvl)}</span>
                  <span class="diff-stat combo-record">${renderIcon('bolt', 'mini-icon')} Combo: ${hco(lvl)}x</span>
                </div>
              </div>
              <div class="diff-side">
                ${renderRankDots(lvl.stars.length)}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="screen-actions">
          <button class="back-link" id="back-menu">← Back to Menu</button>
          <button class="danger-link" id="reset-progress-diff">Reset All Progress</button>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.diff-card').forEach(card => {
    card.addEventListener('click', () => {
      state.level = op.levels[parseInt(card.dataset.idx)];
      startGame();
    });
  });

  document.getElementById('back-menu').addEventListener('click', () => {
    state.screen = 'menu';
    render();
  });

  document.getElementById('reset-progress-diff').addEventListener('click', confirmResetProgress);
}

// ============================================
// Game Screen
// ============================================
function renderGame() {
  const op = OPERATIONS[state.operation];
  const timeWarn = state.timeLeft <= 10 ? 'time-warn' : '';

  app.innerHTML = `
    <div class="game-container">
      <div class="header game-header-hidden">
        <h1>Math Snap</h1>
        <div class="subtitle">${op.label} • ${state.level.label}</div>
      </div>

      <div class="game-screen glass-panel">
        <div class="game-top-bar">
          <div class="inline-stats">
            ${renderComboStat()}
            ${renderInlineStat({ tone: 'time', icon: 'time', label: 'Time', value: `${state.timeLeft}s`, id: 'time', valueClass: timeWarn, title: `Time: ${state.timeLeft}s` })}
            ${renderInlineStat({ tone: 'score', icon: 'spark', label: 'Score', value: state.score, id: 'score', title: `Score: ${state.score}` })}
            ${renderInlineStat({ tone: 'correct', icon: 'check', label: 'Correct', value: state.correct, id: 'correct', title: `Correct: ${state.correct}` })}
            ${renderInlineStat({ tone: 'wrong', icon: 'close', label: 'Wrong', value: state.wrong, id: 'wrong', title: `Wrong: ${state.wrong}` })}
          </div>

          <button class="pause-btn" id="pause-btn" title="Pause">${renderIcon('pause', 'control-icon')}</button>
        </div>

        <div class="problem-container">
          <div id="problem" class="problem-text">${state.currentProblem}</div>
        </div>

        <div class="input-container" id="input-area">
          ${state.useKeypad ? `
            <div class="answer-display focus" id="answer-display">${state.inputValue}<span class="cursor-blink"></span></div>
          ` : `
            <input type="number" id="answer-input" placeholder="Your answer..." autocomplete="off" inputmode="decimal" step="any" />
          `}
        </div>

        ${state.useKeypad ? renderKeypad() : ''}
      </div>
    </div>
  `;

  // Event bindings
  document.getElementById('pause-btn').addEventListener('click', pauseGame);

  if (state.useKeypad) {
    bindKeypad();
  } else {
    const input = document.getElementById('answer-input');
    if (input) {
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkAnswer(parseFloat(input.value));
          input.value = '';
        }
      });
    }
  }

  // Also allow physical keyboard when keypad is shown
  if (state.useKeypad) {
    document.addEventListener('keydown', handlePhysicalKeyboard);
  }
}

function handlePhysicalKeyboard(e) {
  if (state.screen !== 'playing') {
    document.removeEventListener('keydown', handlePhysicalKeyboard);
    return;
  }
  if (e.key >= '0' && e.key <= '9') {
    state.inputValue += e.key;
    updateAnswerDisplay();
  } else if ((e.key === '.' || e.key === ',') && state.operation === 'division') {
    appendDecimalPoint();
    updateAnswerDisplay();
  } else if (e.key === 'Backspace') {
    state.inputValue = state.inputValue.slice(0, -1);
    updateAnswerDisplay();
  } else if (e.key === 'Enter') {
    submitKeypadAnswer();
  } else if (e.key === '-') {
    toggleNegative();
    updateAnswerDisplay();
  }
}

function renderKeypad() {
  const decimalKey = state.operation === 'division'
    ? '<button class="key-btn key-action" data-key="decimal">.</button>'
    : '<button class="key-btn key-action" data-key="00">00</button>';

  return `
    <div class="keypad-container">
      <div class="keypad">
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
        <button class="key-btn key-action" data-key="neg">+/-</button>
        <button class="key-btn" data-key="0">0</button>
        ${decimalKey}
        <button class="key-btn key-submit" data-key="submit" style="grid-column: span 2;">Submit</button>
      </div>
    </div>
  `;
}

function bindKeypad() {
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.dataset.key;

      if (key >= '0' && key <= '9') {
        state.inputValue += key;
      } else if (key === '00') {
        state.inputValue += '00';
      } else if (key === 'decimal') {
        appendDecimalPoint();
      } else if (key === 'del') {
        state.inputValue = state.inputValue.slice(0, -1);
      } else if (key === 'clear') {
        state.inputValue = '';
      } else if (key === 'neg') {
        toggleNegative();
      } else if (key === 'submit') {
        submitKeypadAnswer();
        return;
      }

      updateAnswerDisplay();
    });
  });
}

function toggleNegative() {
  if (state.inputValue.startsWith('-')) {
    state.inputValue = state.inputValue.substring(1);
  } else if (state.inputValue.length > 0) {
    state.inputValue = '-' + state.inputValue;
  } else {
    state.inputValue = '-';
  }
}

function appendDecimalPoint() {
  if (state.operation !== 'division' || state.inputValue.includes('.')) return;
  if (state.inputValue === '' || state.inputValue === '-') {
    state.inputValue += '0.';
    return;
  }
  state.inputValue += '.';
}

function updateAnswerDisplay() {
  const display = document.getElementById('answer-display');
  if (display) {
    display.innerHTML = `${state.inputValue}<span class="cursor-blink"></span>`;
  }
}

function submitKeypadAnswer() {
  const val = parseFloat(state.inputValue);
  if (!isNaN(val)) {
    checkAnswer(val);
  }
  state.inputValue = '';
  updateAnswerDisplay();
}

// ============================================
// Game Logic
// ============================================
function startGame() {
  state.screen = 'playing';
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.comboTimer = 10;
  state.timeLeft = GAME_DURATION;
  state.inputValue = '';
  state.useKeypad = isTouchDevice();

  generateProblem();
  render();
  animateProblem();
  updateComboUI();

  state.timerInterval = setInterval(() => {
    if (state.screen !== 'playing') return;
    state.timeLeft--;
    const timeEl = document.getElementById('time');
    if (timeEl) {
      timeEl.textContent = `${state.timeLeft}s`;
      timeEl.closest('.inline-stat')?.setAttribute('title', `Time: ${state.timeLeft}s`);
      if (state.timeLeft <= 10) {
        timeEl.classList.add('time-warn');
      }
    }
    if (state.timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  state.comboInterval = setInterval(() => {
    if (state.screen !== 'playing') return;
    if (state.combo > 0) {
      state.comboTimer--;
      if (state.comboTimer <= 0) {
        state.combo = Math.max(0, state.combo - 1);
        state.comboTimer = 10;
      }
      updateComboUI();
    }
  }, 1000);
}

function generateProblem() {
  const max = state.level.max;
  const num1 = Math.floor(Math.random() * max) + 1;
  const num2 = Math.floor(Math.random() * max) + 1;
  const formattedNum1 = num1.toLocaleString();
  const formattedNum2 = num2.toLocaleString();

  switch (state.operation) {
    case 'addition':
      state.currentAnswer = num1 + num2;
      state.currentProblem = `${formattedNum1} + ${formattedNum2}`;
      break;
    case 'subtraction':
      state.currentAnswer = num1 - num2;
      state.currentProblem = `${formattedNum1} - ${formattedNum2}`;
      break;
    case 'multiplication':
      state.currentAnswer = num1 * num2;
      state.currentProblem = `${formattedNum1} × ${formattedNum2}`;
      break;
    case 'division':
      state.currentAnswer = roundToTwo(num1 / num2);
      state.currentProblem = `${formattedNum1} ÷ ${formattedNum2}`;
      break;
    default:
      state.currentAnswer = 0;
      state.currentProblem = '';
  }
}

function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function animateProblem() {
  const el = document.getElementById('problem');
  if (el) {
    el.textContent = state.currentProblem;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }
}

function checkAnswer(userAnswer) {
  if (isNaN(userAnswer)) return;

  const normalizedAnswer = state.operation === 'division'
    ? roundToTwo(userAnswer)
    : userAnswer;

  if (normalizedAnswer === state.currentAnswer) {
    const elapsed = 10 - state.comboTimer;
    const bonus = Math.max(0, (state.combo * 10) - elapsed);
    const totalAward = CORRECT_SCORE + bonus;
    
    state.score += totalAward;
    state.correct += 1;
    
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.comboTimer = 10;
    
    showFeedback('+'+totalAward, 'success');
    
    generateProblem();
    animateProblem();
  } else {
    state.wrong += 1;
    state.combo = 0;
    state.comboTimer = 10;
    showFeedback('Wrong', 'error');
  }

  updateStatsUI();
  updateComboUI();
}

function updateStatsUI() {
  const scoreEl = document.getElementById('score');
  const correctEl = document.getElementById('correct');
  const wrongEl = document.getElementById('wrong');
  if (scoreEl) scoreEl.textContent = state.score;
  if (scoreEl) scoreEl.closest('.inline-stat')?.setAttribute('title', `Score: ${state.score}`);
  if (correctEl) correctEl.textContent = state.correct;
  if (correctEl) correctEl.closest('.inline-stat')?.setAttribute('title', `Correct: ${state.correct}`);
  if (wrongEl) wrongEl.textContent = state.wrong;
  if (wrongEl) wrongEl.closest('.inline-stat')?.setAttribute('title', `Wrong: ${state.wrong}`);
}

function updateComboUI() {
  const comboStat = document.getElementById('combo-stat');
  const comboVal = document.getElementById('combo');
  const comboRingProgress = document.getElementById('combo-ring-progress');

  if (state.combo > 0) {
    if (comboStat) {
      comboStat.style.display = 'grid';
      comboStat.title = `Combo: ${state.combo}x • ${state.comboTimer}s left`;
      comboStat.classList.toggle('danger', state.comboTimer <= 3);
    }
    if (comboVal) {
      comboVal.textContent = state.combo + 'x';
    }
    if (comboRingProgress) {
      const progress = Math.max(0, Math.min(1, state.comboTimer / 10));
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

function showFeedback(text, type) {
  const container = document.getElementById('input-area');
  if (!container) return;
  const fb = document.createElement('div');
  fb.className = `floating-feedback ${type}`;
  fb.textContent = text;
  container.appendChild(fb);
  setTimeout(() => fb.remove(), 900);
}

function confirmResetProgress() {
  if (document.getElementById('confirm-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'pause-overlay';
  overlay.id = 'confirm-overlay';
  overlay.innerHTML = `
    <div class="pause-menu confirm-menu">
      <div class="pause-icon">${renderIcon('warning', 'overlay-icon')}</div>
      <h2>Delete All Progress?</h2>
      <p class="confirm-text">This will permanently remove every high score and best correct-answer record for all game modes and difficulty levels.</p>
      <div class="pause-btn-group">
        <button class="pause-action-btn danger-btn" id="confirm-reset-btn">Yes, Delete Everything</button>
        <button class="pause-action-btn restart-btn" id="cancel-reset-btn">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('confirm-reset-btn').addEventListener('click', () => {
    clearAllProgress();
    overlay.remove();
    render();
  });

  document.getElementById('cancel-reset-btn').addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

// ============================================
// Pause / Resume
// ============================================
function pauseGame() {
  if (state.screen !== 'playing') return;
  state.screen = 'paused';
  clearInterval(state.timerInterval);
  clearInterval(state.comboInterval);
  document.removeEventListener('keydown', handlePhysicalKeyboard);

  const overlay = document.createElement('div');
  overlay.className = 'pause-overlay';
  overlay.id = 'pause-overlay';
  overlay.innerHTML = `
    <div class="pause-menu">
      <div class="pause-icon">${renderIcon('pause', 'overlay-icon')}</div>
      <h2>Game Paused</h2>
      <div class="pause-btn-group">
        <button class="pause-action-btn resume-btn" id="resume-btn">${renderIcon('play', 'button-icon')} Resume</button>
        <button class="pause-action-btn restart-btn" id="restart-btn">${renderIcon('refresh', 'button-icon')} Restart</button>
        <button class="pause-action-btn menu-btn" id="menu-btn">${renderIcon('home', 'button-icon')} Main Menu</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('resume-btn').addEventListener('click', resumeGame);
  document.getElementById('restart-btn').addEventListener('click', restartGame);
  document.getElementById('menu-btn').addEventListener('click', backToMenu);
}

function resumeGame() {
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.remove();

  state.screen = 'playing';
  state.timerInterval = setInterval(() => {
    if (state.screen !== 'playing') return;
    state.timeLeft--;
    const timeEl = document.getElementById('time');
    if (timeEl) {
      timeEl.textContent = `${state.timeLeft}s`;
      timeEl.closest('.inline-stat')?.setAttribute('title', `Time: ${state.timeLeft}s`);
      if (state.timeLeft <= 10) {
        timeEl.classList.add('time-warn');
      }
    }
    if (state.timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  state.comboInterval = setInterval(() => {
    if (state.screen !== 'playing') return;
    if (state.combo > 0) {
      state.comboTimer--;
      if (state.comboTimer <= 0) {
        state.combo = Math.max(0, state.combo - 1);
        state.comboTimer = 10;
      }
      updateComboUI();
    }
  }, 1000);

  // Re-bind input
  if (state.useKeypad) {
    document.addEventListener('keydown', handlePhysicalKeyboard);
  } else {
    const input = document.getElementById('answer-input');
    if (input) input.focus();
  }
}

function restartGame() {
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.remove();
  clearInterval(state.timerInterval);
  clearInterval(state.comboInterval);
  startGame();
}

function backToMenu() {
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.remove();
  clearInterval(state.timerInterval);
  clearInterval(state.comboInterval);
  document.removeEventListener('keydown', handlePhysicalKeyboard);
  state.screen = 'menu';
  render();
}

// ============================================
// End Game
// ============================================
function endGame() {
  clearInterval(state.timerInterval);
  clearInterval(state.comboInterval);
  document.removeEventListener('keydown', handlePhysicalKeyboard);
  state.screen = 'end';

  // Update high scores
  const prevHS = getHighScore(state.operation, state.level.max);
  const prevHC = getHighCorrect(state.operation, state.level.max);
  const prevHCO = getHighCombo(state.operation, state.level.max);
  
  let newRecord = false;

  if (state.score > prevHS) {
    setHighScore(state.operation, state.level.max, state.score);
    newRecord = true;
  }
  if (state.correct > prevHC) {
    setHighCorrect(state.operation, state.level.max, state.correct);
    newRecord = true;
  }
  if (state.maxCombo > prevHCO) {
    setHighCombo(state.operation, state.level.max, state.maxCombo);
    newRecord = true;
  }

  renderEnd(newRecord);
}

function renderEnd(newRecord = false) {
  const op = OPERATIONS[state.operation];

  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <h1>Math Snap</h1>
      </div>

      <div class="end-screen glass-panel">
        <h2>${renderIcon('time', 'headline-icon')} Time's Up!</h2>
        <div class="game-mode-label" style="margin:-0.5rem 0">${renderOperationIcon(state.operation, 'inline-icon')} ${state.level.label}</div>
        
        <div class="final-stats">
          <div class="stat-box">
            <div class="stat-label">Final Score</div>
            <div class="stat-value text-primary">${state.score}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Max Combo</div>
            <div class="stat-value glow-magenta" style="color:var(--neon-magenta)">${state.maxCombo}x</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Correct</div>
            <div class="stat-value text-green">${state.correct}</div>
          </div>
          <div class="stat-box" style="display:none">
            <div class="stat-label">Wrong</div>
            <div class="stat-value text-red">${state.wrong}</div>
          </div>
        </div>

        ${newRecord ? `<div class="new-record">${renderIcon('spark', 'inline-icon')} New Record!</div>` : ''}

        <div class="end-buttons">
          <button class="primary-btn" id="retry-btn">${renderIcon('refresh', 'button-icon')} Play Again</button>
          <button class="secondary-btn" id="diff-btn">${renderIcon('chart', 'button-icon')} Change Difficulty</button>
          <button class="secondary-btn" id="home-btn">${renderIcon('home', 'button-icon')} Main Menu</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('retry-btn').addEventListener('click', () => startGame());
  document.getElementById('diff-btn').addEventListener('click', () => {
    state.screen = 'difficulty';
    render();
  });
  document.getElementById('home-btn').addEventListener('click', () => {
    state.screen = 'menu';
    render();
  });
}

// ============================================
// Keyboard shortcut: Escape to pause
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.screen === 'playing') {
      pauseGame();
    } else if (state.screen === 'paused') {
      resumeGame();
    }
  }
});

// ============================================
// Init
// ============================================
createMathBackground();
render();
