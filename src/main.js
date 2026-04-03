import './style.css';

// ============================================
// Constants & Configuration
// ============================================
const OPERATIONS = {
  addition: {
    label: 'Addition',
    symbol: '+',
    icon: '➕',
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
    icon: '➖',
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
    icon: '✖️',
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
    icon: '➗',
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
  timeLeft: GAME_DURATION,
  currentAnswer: 0,
  currentProblem: '',
  timerInterval: null,
  inputValue: '',
  useKeypad: false,
};

const app = document.querySelector('#app');

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
function setHighScore(op, max, val) {
  localStorage.setItem(`mathSnap_${op}_${max}_HS`, val);
}
function setHighCorrect(op, max, val) {
  localStorage.setItem(`mathSnap_${op}_${max}_HC`, val);
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
        <div class="subtitle">⚡ Speed Math Challenge</div>
      </div>

      <div class="menu-screen glass-panel">
        <h2>Choose Operation</h2>
        <div class="operation-grid">
          <div class="op-card addition" data-op="addition" id="op-addition">
            <div class="op-icon">➕</div>
            <div class="op-label">Addition</div>
            <div class="op-desc">Add numbers fast</div>
          </div>
          <div class="op-card subtraction" data-op="subtraction" id="op-subtraction">
            <div class="op-icon">➖</div>
            <div class="op-label">Subtraction</div>
            <div class="op-desc">Subtract with speed</div>
          </div>
          <div class="op-card multiplication" data-op="multiplication" id="op-multiplication">
            <div class="op-icon">✖️</div>
            <div class="op-label">Multiply</div>
            <div class="op-desc">Times table mastery</div>
          </div>
          <div class="op-card division" data-op="division" id="op-division">
            <div class="op-icon">➗</div>
            <div class="op-label">Division</div>
            <div class="op-desc">Decimal division drill</div>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="rules-box">
          <div class="rule-item"><span class="rule-icon">⏱️</span> <span><strong>60 seconds</strong> to solve as many as you can</span></div>
          <div class="rule-item"><span class="rule-icon">✅</span> <span>Correct: <strong class="text-green">+${CORRECT_SCORE} score</strong></span></div>
          <div class="rule-item"><span class="rule-icon">❌</span> <span>Wrong: <strong class="text-red">−${WRONG_PENALTY} score</strong></span></div>
        </div>

        <div class="menu-actions">
          <button class="danger-link" id="reset-progress-menu">Reset All Progress</button>
        </div>
      </div>
    </div>
  `;

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

  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <h1>Math Snap</h1>
      </div>

      <div class="diff-screen glass-panel">
        <div class="op-badge">${op.icon} <span>${op.label}</span></div>
        <h2>Select Difficulty</h2>
        
        <div class="diff-grid">
          ${op.levels.map((lvl, i) => `
            <div class="diff-card" data-idx="${i}" id="diff-${i}">
              <div class="diff-main">
                <div class="diff-label">${lvl.label}</div>
                <div class="diff-meta">
                  <span class="diff-stat">🏆 Best: ${hs(lvl)}</span>
                  <span class="diff-stat">🎯 Most: ${hc(lvl)}</span>
                </div>
              </div>
              <div class="diff-side">
                <div class="diff-stars">${lvl.stars}</div>
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
  const hsVal = getHighScore(state.operation, state.level.max);
  const hcVal = getHighCorrect(state.operation, state.level.max);
  const timeWarn = state.timeLeft <= 10 ? 'time-warn' : '';

  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <h1>Math Snap</h1>
        <div class="high-scores">
          <div class="hs-item"><span class="hs-icon">🏆</span> Best: <span id="hs">${hsVal}</span></div>
          <div class="hs-item"><span class="hs-icon">🎯</span> Most: <span id="hc">${hcVal}</span></div>
        </div>
      </div>

      <div class="game-screen glass-panel">
        <div class="game-top-bar">
          <div class="game-mode-label">${op.icon} ${state.level.label}</div>
          <button class="pause-btn" id="pause-btn" title="Pause">⏸</button>
        </div>

        <div class="stats-bar">
          <div class="stat-pill time-pill"><span class="stat-label">Time</span><span class="stat-val ${timeWarn}" id="time">${state.timeLeft}s</span></div>
          <div class="stat-pill score-pill"><span class="stat-label">Score</span><span class="stat-val" id="score">${state.score}</span></div>
          <div class="stat-pill correct-pill"><span class="stat-label">Correct</span><span class="stat-val" id="correct">${state.correct}</span></div>
          <div class="stat-pill wrong-pill"><span class="stat-label">Wrong</span><span class="stat-val" id="wrong">${state.wrong}</span></div>
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
        <button class="key-btn key-delete" data-key="del">⌫</button>
        <button class="key-btn" data-key="4">4</button>
        <button class="key-btn" data-key="5">5</button>
        <button class="key-btn" data-key="6">6</button>
        <button class="key-btn key-clear" data-key="clear">CLR</button>
        <button class="key-btn" data-key="1">1</button>
        <button class="key-btn" data-key="2">2</button>
        <button class="key-btn" data-key="3">3</button>
        <button class="key-btn key-action" data-key="neg">±</button>
        <button class="key-btn" data-key="0">0</button>
        ${decimalKey}
        <button class="key-btn key-submit" data-key="submit" style="grid-column: span 2;">SUBMIT ↵</button>
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
  state.timeLeft = GAME_DURATION;
  state.inputValue = '';
  state.useKeypad = isTouchDevice();

  generateProblem();
  render();
  animateProblem();

  state.timerInterval = setInterval(() => {
    if (state.screen !== 'playing') return;
    state.timeLeft--;
    const timeEl = document.getElementById('time');
    if (timeEl) {
      timeEl.textContent = `${state.timeLeft}s`;
      if (state.timeLeft <= 10) {
        timeEl.classList.add('time-warn');
      }
    }
    if (state.timeLeft <= 0) {
      endGame();
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
    state.score += CORRECT_SCORE;
    state.correct += 1;
    showFeedback('✓ Correct!', 'success');
  } else {
    state.score -= WRONG_PENALTY;
    state.wrong += 1;
    showFeedback('✗ Wrong!', 'error');
  }

  // Update UI
  const scoreEl = document.getElementById('score');
  const correctEl = document.getElementById('correct');
  const wrongEl = document.getElementById('wrong');
  if (scoreEl) scoreEl.textContent = state.score;
  if (correctEl) correctEl.textContent = state.correct;
  if (wrongEl) wrongEl.textContent = state.wrong;

  generateProblem();
  animateProblem();
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
      <div class="pause-icon">⚠️</div>
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
  document.removeEventListener('keydown', handlePhysicalKeyboard);

  const overlay = document.createElement('div');
  overlay.className = 'pause-overlay';
  overlay.id = 'pause-overlay';
  overlay.innerHTML = `
    <div class="pause-menu">
      <div class="pause-icon">⏸</div>
      <h2>Game Paused</h2>
      <div class="pause-btn-group">
        <button class="pause-action-btn resume-btn" id="resume-btn">▶ Resume</button>
        <button class="pause-action-btn restart-btn" id="restart-btn">🔄 Restart</button>
        <button class="pause-action-btn menu-btn" id="menu-btn">🏠 Main Menu</button>
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
      if (state.timeLeft <= 10) {
        timeEl.classList.add('time-warn');
      }
    }
    if (state.timeLeft <= 0) {
      endGame();
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
  startGame();
}

function backToMenu() {
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.remove();
  clearInterval(state.timerInterval);
  document.removeEventListener('keydown', handlePhysicalKeyboard);
  state.screen = 'menu';
  render();
}

// ============================================
// End Game
// ============================================
function endGame() {
  clearInterval(state.timerInterval);
  document.removeEventListener('keydown', handlePhysicalKeyboard);
  state.screen = 'end';

  // Update high scores
  const prevHS = getHighScore(state.operation, state.level.max);
  const prevHC = getHighCorrect(state.operation, state.level.max);
  let newRecord = false;

  if (state.score > prevHS) {
    setHighScore(state.operation, state.level.max, state.score);
    newRecord = true;
  }
  if (state.correct > prevHC) {
    setHighCorrect(state.operation, state.level.max, state.correct);
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
        <h2>⏱️ Time's Up!</h2>
        <div class="game-mode-label" style="margin:-0.5rem 0">${op.icon} ${state.level.label}</div>
        
        <div class="final-stats">
          <div class="stat-box">
            <div class="stat-label">Final Score</div>
            <div class="stat-value text-primary">${state.score}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Correct</div>
            <div class="stat-value text-green">${state.correct}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Wrong</div>
            <div class="stat-value text-red">${state.wrong}</div>
          </div>
        </div>

        ${newRecord ? '<div class="new-record">🎉 New Record! 🎉</div>' : ''}

        <div class="end-buttons">
          <button class="primary-btn" id="retry-btn">🔄 Play Again</button>
          <button class="secondary-btn" id="diff-btn">📊 Change Difficulty</button>
          <button class="secondary-btn" id="home-btn">🏠 Main Menu</button>
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
