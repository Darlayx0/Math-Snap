import './style.css';

// ============================================
// Constants & Configuration
// ============================================
const DIFFICULTY_NAMES = ['Easy', 'Normal', 'Hard', 'Expert', 'Master'];
const DIFFICULTY_TONES = {
  Easy: 'easy',
  Normal: 'normal',
  Hard: 'hard',
  Expert: 'expert',
  Master: 'master',
};

const OPERATIONS = {
  addition: {
    label: 'Addition',
    symbol: '+',
    icon: 'plus',
    desc: 'Test your adding speed',
    levels: [
      { max: 100, label: '1–100 + 1–100', difficultyName: DIFFICULTY_NAMES[0] },
      { max: 1000, label: '1–1K + 1–1K', difficultyName: DIFFICULTY_NAMES[1] },
      { max: 10000, label: '1–10K + 1–10K', difficultyName: DIFFICULTY_NAMES[2] },
      { max: 100000, label: '1–100K + 1–100K', difficultyName: DIFFICULTY_NAMES[3] },
      { max: 1000000, label: '1–1M + 1–1M', difficultyName: DIFFICULTY_NAMES[4] },
    ],
  },
  subtraction: {
    label: 'Subtraction',
    symbol: '-',
    icon: 'minus',
    desc: 'Sharpen your subtraction speed',
    levels: [
      { max: 100, label: '1–100 - 1–100', difficultyName: DIFFICULTY_NAMES[0] },
      { max: 1000, label: '1–1K - 1–1K', difficultyName: DIFFICULTY_NAMES[1] },
      { max: 10000, label: '1–10K - 1–10K', difficultyName: DIFFICULTY_NAMES[2] },
      { max: 100000, label: '1–100K - 1–100K', difficultyName: DIFFICULTY_NAMES[3] },
      { max: 1000000, label: '1–1M - 1–1M', difficultyName: DIFFICULTY_NAMES[4] },
    ],
  },
  multiplication: {
    label: 'Multiplication',
    symbol: '×',
    icon: 'multiply',
    desc: 'Master your times tables',
    levels: [
      { max: 10, label: '1–10 × 1–10', difficultyName: DIFFICULTY_NAMES[0] },
      { max: 30, label: '1–30 × 1–30', difficultyName: DIFFICULTY_NAMES[1] },
      { max: 100, label: '1–100 × 1–100', difficultyName: DIFFICULTY_NAMES[2] },
      { max: 300, label: '1–300 × 1–300', difficultyName: DIFFICULTY_NAMES[3] },
      { max: 1000, label: '1–1K × 1–1K', difficultyName: DIFFICULTY_NAMES[4] },
    ],
  },
  division: {
    label: 'Division',
    symbol: '÷',
    icon: 'divide',
    desc: 'Practice fast decimal division',
    levels: [
      { max: 10, label: '1–10 ÷ 1–10', difficultyName: DIFFICULTY_NAMES[0] },
      { max: 30, label: '1–30 ÷ 1–30', difficultyName: DIFFICULTY_NAMES[1] },
      { max: 100, label: '1–100 ÷ 1–100', difficultyName: DIFFICULTY_NAMES[2] },
      { max: 300, label: '1–300 ÷ 1–300', difficultyName: DIFFICULTY_NAMES[3] },
      { max: 1000, label: '1–1K ÷ 1–1K', difficultyName: DIFFICULTY_NAMES[4] },
    ],
  },
};

const GAME_MODES = {
  sprint: {
    label: 'Sprint 60s',
    icon: 'time',
    menuDesc: 'Kumpulkan skor setinggi mungkin dalam countdown 60 detik.',
    resultTitle: "Time's Up!",
  },
  race10: {
    label: 'Race 10',
    icon: 'target',
    menuDesc: 'Selesaikan 10 soal benar secepat mungkin sambil menjaga combo.',
    resultTitle: 'Race Complete!',
  },
};

const MATH_SYMBOLS = ['Σ', 'π', '√', '∫', '∞', 'Δ', '÷', '±', '≈', '≠', '%', '∂', 'θ', 'λ', 'φ', 'α', 'β', 'γ', '+', '×', '−', '='];
const GAME_DURATION = 60;
const CORRECT_SCORE = 100;
const WRONG_PENALTY = 100;
const RACE_TARGET = 10;
const COMBO_RING_RADIUS = 16;
const COMBO_RING_CIRCUMFERENCE = 2 * Math.PI * COMBO_RING_RADIUS;

// ============================================
// Game State
// ============================================
let state = {
  screen: 'menu', // menu | playing | paused | end
  gameMode: 'sprint',
  operation: 'addition',
  selectedLevelIdx: 0,
  level: null,
  score: 0,
  correct: 0,
  wrong: 0,
  progressSolved: 0,
  combo: 0,
  maxCombo: 0,
  comboTimer: 10,
  timeLeft: GAME_DURATION,
  elapsedMs: 0,
  timerStartedAt: 0,
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

function renderModeIcon(name, className = '') {
  return renderIcon(GAME_MODES[name]?.icon || 'spark', className);
}

function renderLabelIcon(name, text) {
  return `<span class="label-with-icon">${renderIcon(name, 'inline-icon')}<span>${text}</span></span>`;
}

function getDifficultyTone(level = state.level) {
  if (!level) return 'easy';
  return DIFFICULTY_TONES[level.difficultyName] || 'easy';
}

function renderSessionMeta(level = state.level, gameMode = state.gameMode, operation = state.operation, extraClass = '') {
  const mode = GAME_MODES[gameMode];
  const activeLevel = level || OPERATIONS[operation].levels[state.selectedLevelIdx];
  const tierTone = getDifficultyTone(activeLevel);

  const items = [
    { tone: 'meta-mode', icon: renderModeIcon(gameMode, 'session-meta-icon'), text: mode.label },
    { tone: `meta-tier difficulty-tier-${tierTone}`, icon: renderIcon('spark', 'session-meta-icon'), text: activeLevel.difficultyName },
    { tone: 'meta-operation', icon: renderOperationIcon(operation, 'session-meta-icon'), text: activeLevel.label },
  ];

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

function renderHudStat(icon, id, value, tone, title) {
  return `<div class="hud-cell ${tone}" title="${title}"><span class="hud-icon">${renderIcon(icon, 'hud-svg')}</span><span class="hud-val" id="${id}">${value}</span></div>`;
}

function isRaceMode(mode = state.gameMode) {
  return mode === 'race10';
}

function formatElapsedMs(ms) {
  if (!Number.isFinite(ms) || ms < 0) {
    return '--:--.--';
  }
  const totalMs = Math.max(0, ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

function getProgressLabel() {
  return `${state.progressSolved}/${RACE_TARGET}`;
}

const GUIDE_SECTIONS = [
  {
    id: 'overview',
    icon: 'spark',
    label: 'Overview',
    title: 'Cara kerja Math Snap',
    lead: 'Panduan ringkas untuk memahami flow permainan dalam beberapa detik.',
    highlights: [
      [GAME_MODES.sprint.label, 'Mode arcade klasik dengan target skor tertinggi dalam countdown 60 detik.'],
      [GAME_MODES.race10.label, `Mode clear challenge untuk menuntaskan ${RACE_TARGET} soal benar secepat mungkin.`],
      ['Pilih operasi dan difficulty', 'Semua 4 operasi dan seluruh level difficulty tersedia di kedua mode.'],
    ],
    tips: [
      'Mulai dari difficulty yang nyaman lalu naik bertahap.',
      'Gunakan Sprint untuk mengejar skor, lalu Race 10 untuk melatih akurasi dan kecepatan clear.',
    ],
  },
  {
    id: 'scoring',
    icon: 'trophy',
    label: 'Scoring',
    title: 'Sistem skor dan bonus',
    lead: 'Skor bukan hanya soal benar atau salah, tetapi juga soal kecepatan menjaga momentum.',
    highlights: [
      [`Base score +${CORRECT_SCORE}`, 'Setiap jawaban benar selalu memberi skor dasar yang sama besar.'],
      ['Bonus dari combo', 'Semakin cepat menjawab saat combo aktif, bonus tambahannya semakin tinggi.'],
      ['Race 10 tetap pakai skor', 'Walau mode ini mengejar waktu terbaik, skor dan combo tetap dihitung penuh.'],
    ],
    tips: [
      'Jawaban cepat saat combo tinggi paling efektif untuk mengejar skor.',
      'Kalau ragu terlalu lama, ritme bisa lebih penting daripada memaksa satu soal.',
    ],
  },
  {
    id: 'combo',
    icon: 'bolt',
    label: 'Combo',
    title: 'Combo, timer, dan penalti',
    lead: 'Combo adalah inti permainan cepat ini. Ia memberi tekanan sekaligus peluang bonus besar.',
    highlights: [
      ['Combo naik saat benar', 'Setiap jawaban benar menaikkan multiplier dan me-reset timer combo.'],
      ['Ring combo adalah indikator waktu', 'Saat ring menipis, berarti waktu menjaga combo hampir habis.'],
      ['Salah menghapus momentum', 'Jawaban salah membuat combo kembali ke nol dan skor tidak bertambah.'],
    ],
    tips: [
      'Perhatikan ring combo, bukan hanya angka skor.',
      'Kecepatan stabil lebih kuat daripada buru-buru lalu sering salah.',
    ],
  },
  {
    id: 'controls',
    icon: 'guide',
    label: 'Controls',
    title: 'Kontrol di desktop dan mobile',
    lead: 'Kontrol dibuat cepat dan sederhana agar fokus tetap di perhitungan.',
    highlights: [
      ['Desktop', 'Gunakan keyboard lalu tekan Enter untuk submit jawaban.'],
      ['Mobile', 'Gunakan keypad bawaan game yang sudah disesuaikan untuk angka, negatif, dan desimal saat division.'],
      ['Pause', 'Tombol pause dapat dipakai untuk jeda, restart, atau kembali ke menu.'],
    ],
    tips: [
      'Mode division menerima jawaban desimal.',
      'Jika bermain di layar kecil, fokuskan pandangan ke soal dan HUD atas.',
    ],
  },
  {
    id: 'records',
    icon: 'target',
    label: 'Records',
    title: 'Record dan progres bermain',
    lead: 'Setiap pilihan difficulty menyimpan progresnya sendiri sehingga perkembangan Anda mudah dipantau.',
    highlights: [
      ['Sprint records', 'Menyimpan Best Score, Most Correct, dan High Combo untuk tiap operation + difficulty.'],
      ['Race 10 records', 'Menyimpan Best Score, Best Time, dan High Combo secara terpisah dari mode Sprint.'],
      ['Best Time', 'Waktu clear tercepat di Race 10; semakin kecil angkanya, semakin baik record Anda.'],
    ],
    tips: [
      'Gunakan reset progress hanya jika benar-benar ingin menghapus semua catatan Sprint dan Race 10.',
      'Bandingkan record per difficulty untuk melihat peningkatan kemampuan Anda.',
    ],
  },
];

function renderGuideModal() {
  const guideSummary = [
    ['2 Game Modes', 'Sprint + Race'],
    ['4 Operations', 'Semua level aktif'],
  ].map(([label, value]) => `
    <div class="guide-summary-chip">
      <span class="guide-summary-value">${label}</span>
      <span class="guide-summary-label">${value}</span>
    </div>
  `).join('');

  const nav = GUIDE_SECTIONS.map((section, index) => `
    <button class="guide-nav-btn ${index === 0 ? 'is-active' : ''}" data-guide-tab="${section.id}" type="button">
      <span class="guide-nav-icon">${renderIcon(section.icon, 'guide-nav-svg')}</span>
      <span class="guide-nav-copy">
        <span class="guide-nav-label">${section.label}</span>
        <span class="guide-nav-sub">${section.title}</span>
      </span>
    </button>
  `).join('');

  const panels = GUIDE_SECTIONS.map((section, index) => `
    <section class="guide-panel ${index === 0 ? 'is-active' : ''}" data-guide-panel="${section.id}">
      <div class="guide-panel-hero">
        <div class="guide-panel-badge">
          <span class="guide-panel-icon">${renderIcon(section.icon, 'guide-panel-svg')}</span>
          <span>${section.label}</span>
        </div>
        <h3>${section.title}</h3>
        <p>${section.lead}</p>
      </div>
      <div class="guide-highlight-grid">
        ${section.highlights.map(([label, body]) => `
          <article class="guide-highlight-card">
            <div class="guide-highlight-title">${label}</div>
            <div class="guide-highlight-body">${body}</div>
          </article>
        `).join('')}
      </div>
      <div class="guide-tip-box">
        <div class="guide-tip-title">${renderIcon('spark', 'mini-icon')}Quick Tips</div>
        <ul class="guide-tip-list">
          ${section.tips.map((tip) => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    </section>
  `).join('');

  return `
    <div class="guide-modal" id="guide-modal" aria-hidden="true">
      <div class="guide-modal-panel glass-panel">
        <div class="guide-shell">
          <div class="guide-header-hero">
            <div class="guide-header-row">
              <div class="guide-header-meta">
                <div class="guide-eyebrow">${renderIcon('guide', 'mini-icon')}Math Snap Guide</div>
                <div class="guide-header-copy">
                  <h2 class="guide-title">Panduan Permainan</h2>
                  <p class="guide-intro">Pelajari mode, skor, combo, kontrol, dan record dengan tampilan yang lebih ringkas dan mudah dipindai.</p>
                </div>
              </div>
              <div class="guide-header-actions">
                <button class="secondary-btn guide-close-btn guide-close-top" id="close-guide" type="button">Tutup</button>
              </div>
            </div>
            <div class="guide-header-summary">
              ${guideSummary}
            </div>
          </div>
          <div class="guide-layout">
            <nav class="guide-nav" aria-label="Navigasi panduan">
              ${nav}
            </nav>
            <div class="guide-content" id="guide-content">
              ${panels}
            </div>
          </div>
        </div>
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
function getModeRecordKey(mode, op, max, suffix) {
  return `mathSnap_${mode}_${op}_${max}_${suffix}`;
}

function getLegacyRecordKey(op, max, suffix) {
  return `mathSnap_${op}_${max}_${suffix}`;
}

function getStoredNumber(key) {
  const value = localStorage.getItem(key);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getHighScore(mode, op, max) {
  const value = getStoredNumber(getModeRecordKey(mode, op, max, 'HS'));
  if (value !== null) return value;
  if (mode === 'sprint') {
    return getStoredNumber(getLegacyRecordKey(op, max, 'HS')) || 0;
  }
  return 0;
}

function getHighCorrect(mode, op, max) {
  if (mode !== 'sprint') return 0;
  const value = getStoredNumber(getModeRecordKey(mode, op, max, 'HC'));
  if (value !== null) return value;
  return getStoredNumber(getLegacyRecordKey(op, max, 'HC')) || 0;
}

function getHighCombo(mode, op, max) {
  const value = getStoredNumber(getModeRecordKey(mode, op, max, 'HCO'));
  if (value !== null) return value;
  if (mode === 'sprint') {
    return getStoredNumber(getLegacyRecordKey(op, max, 'HCO')) || 0;
  }
  return 0;
}

function getBestTime(mode, op, max) {
  if (mode !== 'race10') return null;
  return getStoredNumber(getModeRecordKey(mode, op, max, 'BT'));
}

function setHighScore(mode, op, max, val) {
  localStorage.setItem(getModeRecordKey(mode, op, max, 'HS'), String(val));
}

function setHighCorrect(mode, op, max, val) {
  if (mode !== 'sprint') return;
  localStorage.setItem(getModeRecordKey(mode, op, max, 'HC'), String(val));
}

function setHighCombo(mode, op, max, val) {
  localStorage.setItem(getModeRecordKey(mode, op, max, 'HCO'), String(val));
}

function setBestTime(mode, op, max, val) {
  if (mode !== 'race10') return;
  localStorage.setItem(getModeRecordKey(mode, op, max, 'BT'), String(val));
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
    case 'playing': renderGame(); break;
    case 'end': renderEnd(); break;
  }
}

function getMenuModeTabsMarkup() {
  return Object.entries(GAME_MODES).map(([key, mode]) => `
    <button class="mode-tab ${state.gameMode === key ? 'is-active' : ''}" data-mode="${key}" type="button" aria-pressed="${state.gameMode === key}">
      <span class="mode-tab-icon">${renderModeIcon(key, 'button-icon')}</span>
      <span class="mode-tab-copy">
        <span class="mode-tab-label">${mode.label}</span>
        <span class="mode-tab-desc">${mode.menuDesc}</span>
      </span>
    </button>
  `).join('');
}

function getMenuOperationCardsMarkup() {
  return Object.entries(OPERATIONS).map(([key, op]) => `
    <button class="op-chip ${key} ${state.operation === key ? 'is-active' : ''}" data-op="${key}" type="button" id="op-${key}">
      <span class="op-chip-icon">${renderOperationIcon(key, 'op-chip-svg')}</span>
      <span class="op-chip-label">${op.label}</span>
    </button>
  `).join('');
}

function getMenuDifficultyCardsMarkup() {
  const op = OPERATIONS[state.operation];
  const hs = (lvl) => getHighScore(state.gameMode, state.operation, lvl.max);
  const hc = (lvl) => getHighCorrect(state.gameMode, state.operation, lvl.max);
  const hco = (lvl) => getHighCombo(state.gameMode, state.operation, lvl.max);
  const hbt = (lvl) => getBestTime(state.gameMode, state.operation, lvl.max);

  return op.levels.map((lvl, i) => `
    <div class="diff-card diff-tone-${getDifficultyTone(lvl)} ${state.selectedLevelIdx === i ? 'is-selected' : ''}" data-idx="${i}" id="diff-${i}">
      <div class="diff-main">
        <div class="diff-head">
          <div class="diff-label">${lvl.difficultyName}</div>
          <div class="diff-side">${lvl.label}</div>
        </div>
        <div class="diff-meta">
          <span class="diff-stat score-record">${renderIcon('trophy', 'mini-icon')} ${hs(lvl)}</span>
          ${state.gameMode === 'race10'
            ? `<span class="diff-stat time-record">${renderIcon('time', 'mini-icon')} ${formatElapsedMs(hbt(lvl))}</span>`
            : `<span class="diff-stat correct-record">${renderIcon('target', 'mini-icon')} ${hc(lvl)}</span>`}
          <span class="diff-stat combo-record">${renderIcon('bolt', 'mini-icon')} ${hco(lvl)}x</span>
        </div>
      </div>
    </div>
  `).join('');
}

function getPanelModeBadgeMarkup() {
  const activeMode = GAME_MODES[state.gameMode];
  return `${renderModeIcon(state.gameMode, 'badge-icon')}<span>${activeMode.label}</span>`;
}

function updateMenuSelectionUI({ rebuildDiffGrid = false } = {}) {
  if (state.screen !== 'menu') return;

  const modeSwitch = document.querySelector('.mode-switch');
  const opGrid = document.querySelector('.op-grid-4');
  const diffGrid = document.querySelector('.diff-grid');
  const panelModeBadge = document.querySelector('.panel-mode-badge');

  modeSwitch?.querySelectorAll('.mode-tab').forEach((button) => {
    const isActive = button.dataset.mode === state.gameMode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  opGrid?.querySelectorAll('.op-chip').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.op === state.operation);
  });

  if (panelModeBadge) {
    panelModeBadge.innerHTML = getPanelModeBadgeMarkup();
  }

  if (diffGrid) {
    if (rebuildDiffGrid) {
      diffGrid.innerHTML = getMenuDifficultyCardsMarkup();
    } else {
      diffGrid.querySelectorAll('.diff-card').forEach((card, index) => {
        card.classList.toggle('is-selected', index === state.selectedLevelIdx);
      });
    }
  }
}

// ============================================
// Menu Screen
// ============================================
function renderMenu() {
  app.innerHTML = `
    <div class="game-container menu-container">
      <div class="menu-layout">
        <!-- LEFT PANEL (desktop) / TOP SECTION (mobile) -->
        <div class="menu-panel-left">
          <div class="menu-left-top">
            <div class="header">
              <h1>Math Snap</h1>
              <div class="subtitle">${renderLabelIcon('bolt', 'Speed Math Challenge')}</div>
            </div>
          </div>
          <div class="menu-left-center">
            <div class="mode-switch" role="tablist" aria-label="Game mode">
              ${getMenuModeTabsMarkup()}
            </div>
          </div>
          <div class="menu-left-bottom">
            <button class="utility-link" id="open-guide">${renderIcon('guide', 'button-icon')}Panduan Permainan</button>
            <button class="danger-link" id="reset-progress-menu">Reset All Progress</button>
          </div>
        </div>

        <!-- RIGHT PANEL (desktop) / BOTTOM SECTION (mobile) -->
        <div class="menu-panel-right glass-panel">
          <div class="panel-right-header">
            <div class="panel-mode-badge">${getPanelModeBadgeMarkup()}</div>
          </div>

          <div class="panel-right-body">
            <div class="op-grid-4">${getMenuOperationCardsMarkup()}</div>
            <div class="diff-section">
              <div class="diff-grid">${getMenuDifficultyCardsMarkup()}</div>
            </div>
            <button class="primary-btn start-btn" id="start-game-btn">${renderIcon('play', 'button-icon')} Mulai</button>
            <div class="mobile-actions">
              <button class="utility-link" id="open-guide-mobile">${renderIcon('guide', 'button-icon')}Panduan Permainan</button>
              <button class="danger-link" id="reset-progress-mobile">Reset All Progress</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${renderGuideModal()}
  `;

  // --- Event bindings ---
  const guideModal = document.getElementById('guide-modal');
  const setGuideTab = (targetId) => {
    guideModal?.querySelectorAll('[data-guide-tab]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.guideTab === targetId);
    });
    guideModal?.querySelectorAll('[data-guide-panel]').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.guidePanel === targetId);
    });
    document.getElementById('guide-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  document.getElementById('open-guide')?.addEventListener('click', () => {
    guideModal?.classList.add('is-open');
    guideModal?.setAttribute('aria-hidden', 'false');
    setGuideTab(GUIDE_SECTIONS[0].id);
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
  guideModal?.querySelectorAll('[data-guide-tab]').forEach((button) => {
    button.addEventListener('click', () => setGuideTab(button.dataset.guideTab));
  });

  document.querySelector('.mode-switch')?.addEventListener('click', (event) => {
    const button = event.target.closest('.mode-tab');
    if (!button || state.gameMode === button.dataset.mode) return;
    state.gameMode = button.dataset.mode;
    state.selectedLevelIdx = 0;
    updateMenuSelectionUI({ rebuildDiffGrid: true });
  });

  document.querySelector('.op-grid-4')?.addEventListener('click', (event) => {
    const chip = event.target.closest('.op-chip');
    if (!chip || state.operation === chip.dataset.op) return;
    state.operation = chip.dataset.op;
    state.selectedLevelIdx = 0;
    updateMenuSelectionUI({ rebuildDiffGrid: true });
  });

  document.querySelector('.diff-grid')?.addEventListener('click', (event) => {
    const card = event.target.closest('.diff-card');
    if (!card) return;
    const nextIdx = parseInt(card.dataset.idx, 10);
    if (state.selectedLevelIdx === nextIdx) return;
    state.selectedLevelIdx = nextIdx;
    updateMenuSelectionUI();
  });

  document.getElementById('start-game-btn')?.addEventListener('click', () => {
    state.level = OPERATIONS[state.operation].levels[state.selectedLevelIdx];
    startGame();
  });

  document.getElementById('reset-progress-menu').addEventListener('click', confirmResetProgress);
  document.getElementById('reset-progress-mobile')?.addEventListener('click', confirmResetProgress);
  document.getElementById('open-guide-mobile')?.addEventListener('click', () => {
    guideModal?.classList.add('is-open');
    guideModal?.setAttribute('aria-hidden', 'false');
    setGuideTab(GUIDE_SECTIONS[0].id);
  });
}




// ============================================
// Game Screen
// ============================================
function renderGame() {
  const op = OPERATIONS[state.operation];
  const isRace = isRaceMode();
  const timeTone = isRace ? 'ht-time' : 'ht-time' + (state.timeLeft <= 10 ? ' time-warn' : '');
  const timeValue = isRace ? formatElapsedMs(state.elapsedMs) : `${state.timeLeft}s`;
  const tertiaryStat = isRace
    ? renderHudStat('target', 'progress', getProgressLabel(), 'ht-progress', 'Progress')
    : renderHudStat('check', 'correct', state.correct, 'ht-correct', 'Correct');

  app.innerHTML = `
    <div class="game-container game-active">
      <div class="header page-header game-header-top">
        ${renderSessionMeta(state.level, state.gameMode, state.operation, 'session-meta-header')}
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
            ${renderHudStat('time', 'time', timeValue, timeTone, isRace ? 'Elapsed Time' : 'Time')}
            ${renderHudStat('spark', 'score', state.score, 'ht-score', 'Score')}
            ${tertiaryStat}
          </div>
          <button class="pause-btn" id="pause-btn" title="Pause">${renderIcon('pause', 'control-icon')}</button>
        </div>

        <div class="problem-stage">
          <div class="problem-label">${op.label}</div>
          <div id="problem" class="problem-text">${state.currentProblem}</div>
          <div class="problem-eq-line"></div>
        </div>

        <div class="input-container" id="input-area">
          ${state.useKeypad ? `
            <div class="answer-display focus" id="answer-display">${state.inputValue}<span class="cursor-blink"></span></div>
          ` : `
            <input type="text" id="answer-input" value="${state.inputValue}" autocomplete="off" inputmode="decimal" spellcheck="false" />
          `}
        </div>

        ${state.useKeypad ? renderKeypad() : ''}
      </div>
    </div>
  `;

  scrollViewportToTop();

  // Event bindings
  document.getElementById('pause-btn').addEventListener('click', pauseGame);

  if (state.useKeypad) {
    bindKeypad();
  } else {
    const input = document.getElementById('answer-input');
    if (input) {
      updateAnswerInput();
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      input.addEventListener('keydown', (e) => {
        const handled = handleSharedInputKey(e.key);
        if (handled) {
          e.preventDefault();
          return;
        }
      });
      input.addEventListener('input', () => {
        state.inputValue = sanitizeInputValue(input.value);
        updateAnswerInput();
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
  if (handleSharedInputKey(e.key)) {
    e.preventDefault();
  }
}

function renderKeypad() {
  const decimalKey = state.operation === 'division'
    ? '<button class="key-btn key-action" data-key="decimal">,</button>'
    : '<button class="key-btn key-action key-disabled" data-key="decimal" disabled>,</button>';

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
        ${decimalKey}
        <button class="key-btn key-action" data-key="neg">+/-</button>
        <button class="key-btn" data-key="0">0</button>
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
        appendInputDigit(key);
      } else if (key === 'decimal') {
        appendDecimalPoint();
      } else if (key === 'del') {
        deleteInputChar();
      } else if (key === 'clear') {
        resetInputValue();
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

function scrollViewportToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function normalizeForParse(value) {
  return String(value ?? '').replace(/,/g, '.');
}

function sanitizeInputValue(value) {
  const raw = String(value ?? '').trim().replace(/\./g, ',');
  let negative = false;
  let decimalUsed = false;
  let result = '';

  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      result += char;
    } else if (char === '-' && !negative && result.length === 0) {
      negative = true;
    } else if (char === ',' && state.operation === 'division' && !decimalUsed) {
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

function appendInputDigit(digit) {
  if (digit < '0' || digit > '9') return;
  if (state.inputValue === '0') {
    if (digit === '0') return;
    state.inputValue = digit;
    return;
  }
  if (state.inputValue === '-0') {
    if (digit === '0') return;
    state.inputValue = `-${digit}`;
    return;
  }
  state.inputValue += digit;
}

function deleteInputChar() {
  if (state.inputValue === '0' || state.inputValue === '-0') {
    state.inputValue = '0';
    return;
  }
  state.inputValue = state.inputValue.slice(0, -1);
  if (state.inputValue === '' || state.inputValue === '-') {
    state.inputValue = '0';
  }
}

function resetInputValue() {
  state.inputValue = '0';
  updateAnswerDisplay();
  updateAnswerInput();
}

function toggleNegative() {
  if (state.inputValue.startsWith('-')) {
    state.inputValue = state.inputValue.substring(1);
  } else {
    state.inputValue = `-${state.inputValue}`;
  }
}

function appendDecimalPoint() {
  if (state.operation !== 'division' || state.inputValue.includes(',')) return;
  if (state.inputValue === '0' || state.inputValue === '-0') {
    state.inputValue += ',';
    return;
  }
  state.inputValue += ',';
}

function updateAnswerDisplay() {
  const display = document.getElementById('answer-display');
  if (display) {
    display.innerHTML = `${state.inputValue}<span class="cursor-blink"></span>`;
  }
}

function updateAnswerInput() {
  const input = document.getElementById('answer-input');
  if (input) {
    input.value = state.inputValue;
    if (document.activeElement === input) {
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
}

function handleSharedInputKey(key) {
  if (key >= '0' && key <= '9') {
    appendInputDigit(key);
  } else if (key === '.' || key === ',') {
    appendDecimalPoint();
  } else if (key === 'Backspace') {
    deleteInputChar();
  } else if (key === 'Delete') {
    resetInputValue();
  } else if (key === 'Enter') {
    submitKeypadAnswer();
    return true;
  } else if (key === '-') {
    toggleNegative();
  } else {
    return false;
  }

  updateAnswerDisplay();
  updateAnswerInput();
  return true;
}

function submitKeypadAnswer() {
  const val = parseFloat(normalizeForParse(state.inputValue));
  if (!isNaN(val)) {
    checkAnswer(val);
  }
  resetInputValue();
}

// ============================================
// Game Logic
// ============================================
function startGame() {
  state.screen = 'playing';
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  state.progressSolved = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.comboTimer = 10;
  state.timeLeft = GAME_DURATION;
  state.elapsedMs = 0;
  state.timerStartedAt = 0;
  state.inputValue = '0';
  state.useKeypad = isTouchDevice();

  generateProblem();
  scrollViewportToTop();
  render();
  animateProblem();
  updateStatsUI();
  updateTimeUI();
  updateComboUI();
  startTimerLoop();
  startComboLoop();
}

function syncElapsedMs() {
  if (!isRaceMode() || !state.timerStartedAt) return;
  state.elapsedMs = Math.max(0, Date.now() - state.timerStartedAt);
}

function updateTimeUI() {
  const timeEl = document.getElementById('time');
  if (!timeEl) return;

  if (isRaceMode()) {
    timeEl.textContent = formatElapsedMs(state.elapsedMs);
    timeEl.classList.remove('time-warn');
    return;
  }

  timeEl.textContent = `${Math.max(0, state.timeLeft)}s`;
  timeEl.classList.toggle('time-warn', state.timeLeft <= 10);
}

function startTimerLoop() {
  clearInterval(state.timerInterval);

  if (isRaceMode()) {
    state.timerStartedAt = Date.now() - state.elapsedMs;
    state.timerInterval = setInterval(() => {
      if (state.screen !== 'playing') return;
      syncElapsedMs();
      updateTimeUI();
    }, 100);
    return;
  }

  state.timerInterval = setInterval(() => {
    if (state.screen !== 'playing') return;
    state.timeLeft = Math.max(0, state.timeLeft - 1);
    updateTimeUI();
    if (state.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function startComboLoop() {
  clearInterval(state.comboInterval);
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
    el.style.fontSize = '';
    el.classList.remove('pop');
    void el.offsetWidth;
    fitProblemText(el);
    el.classList.add('pop');
  }
}

function fitProblemText(el) {
  const container = el.parentElement;
  if (!container) return;
  const maxW = container.clientWidth - 8;
  const baseSizes = [3.75, 3.3, 2.9, 2.4, 1.95, 1.45];
  for (const size of baseSizes) {
    el.style.fontSize = size + 'rem';
    if (el.scrollWidth <= maxW) return;
  }
  el.style.fontSize = '1.45rem';
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
    
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.comboTimer = 10;

    if (isRaceMode()) {
      state.progressSolved += 1;
      syncElapsedMs();
    } else {
      state.correct += 1;
    }
    
    showFeedback('+'+totalAward, 'success');
  } else {
    state.wrong += 1;
    state.combo = 0;
    state.comboTimer = 10;
    showFeedback('Wrong', 'error');
  }

  updateStatsUI();
  updateComboUI();

  if (normalizedAnswer === state.currentAnswer) {
    if (isRaceMode() && state.progressSolved >= RACE_TARGET) {
      endGame();
      return;
    }
    generateProblem();
    animateProblem();
  }
}

function updateStatsUI() {
  const scoreEl = document.getElementById('score');
  const correctEl = document.getElementById('correct');
  const progressEl = document.getElementById('progress');
  if (scoreEl) scoreEl.textContent = state.score;
  if (correctEl) correctEl.textContent = state.correct;
  if (progressEl) progressEl.textContent = getProgressLabel();
}

function updateComboUI() {
  const comboStat = document.getElementById('combo-stat');
  const comboVal = document.getElementById('combo');
  const comboRingProgress = document.getElementById('combo-ring-progress');

  if (state.combo > 0) {
    if (comboStat) {
      comboStat.style.display = 'flex';
      comboStat.classList.toggle('danger', state.comboTimer <= 3);
    }
    if (comboVal) comboVal.textContent = state.combo + 'x';
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
      <p class="confirm-text">This will permanently remove every saved score, best time, most-correct, and combo record across all game modes and difficulty levels.</p>
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
  if (isRaceMode()) {
    syncElapsedMs();
  }
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
  scrollViewportToTop();
  startTimerLoop();
  startComboLoop();
  updateTimeUI();

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

  if (isRaceMode()) {
    syncElapsedMs();
  }

  state.screen = 'end';

  const prevHS = getHighScore(state.gameMode, state.operation, state.level.max);
  const prevHC = getHighCorrect(state.gameMode, state.operation, state.level.max);
  const prevHCO = getHighCombo(state.gameMode, state.operation, state.level.max);
  const prevBT = getBestTime(state.gameMode, state.operation, state.level.max);

  const records = { score: false, correct: false, time: false, combo: false };

  if (state.score > prevHS) {
    setHighScore(state.gameMode, state.operation, state.level.max, state.score);
    records.score = true;
  }
  if (!isRaceMode() && state.correct > prevHC) {
    setHighCorrect(state.gameMode, state.operation, state.level.max, state.correct);
    records.correct = true;
  }
  if (isRaceMode() && (prevBT === null || state.elapsedMs < prevBT)) {
    setBestTime(state.gameMode, state.operation, state.level.max, state.elapsedMs);
    records.time = true;
  }
  if (state.maxCombo > prevHCO) {
    setHighCombo(state.gameMode, state.operation, state.level.max, state.maxCombo);
    records.combo = true;
  }

  renderEnd(records);
}

function renderEnd(records = {}) {
  const mode = GAME_MODES[state.gameMode];
  const isRace = isRaceMode();

  const bestScore = getHighScore(state.gameMode, state.operation, state.level.max);
  const bestCombo = getHighCombo(state.gameMode, state.operation, state.level.max);
  const bestCorrect = getHighCorrect(state.gameMode, state.operation, state.level.max);
  const bestTime = getBestTime(state.gameMode, state.operation, state.level.max);

  const newBadge = `<span class="stat-new">NEW</span>`;

  const hasAnyRecord = Object.values(records).some(v => v);

  app.innerHTML = `
    <div class="game-container">
      <div class="header page-header">
        <h1>${mode.resultTitle}</h1>
      </div>

      <div class="end-screen glass-panel">
        ${renderSessionMeta(state.level, state.gameMode, state.operation, 'session-meta-end')}

        ${hasAnyRecord ? `<div class="new-record">${renderIcon('spark', 'inline-icon')} New Record!</div>` : ''}

        <div class="final-stats">
          <div class="stat-row ${records.score ? 'is-record' : ''}">
            <div class="stat-row-label">${renderIcon('spark', 'stats-icon')} Score ${records.score ? newBadge : ''}</div>
            <div class="stat-row-values">
              <span class="stat-session text-primary">${state.score}</span>
              <span class="stat-best">${renderIcon('trophy', 'mini-icon')} ${bestScore}</span>
            </div>
          </div>

          ${isRace ? `
            <div class="stat-row ${records.time ? 'is-record' : ''}">
              <div class="stat-row-label">${renderIcon('time', 'stats-icon')} Clear Time ${records.time ? newBadge : ''}</div>
              <div class="stat-row-values">
                <span class="stat-session text-time">${formatElapsedMs(state.elapsedMs)}</span>
                <span class="stat-best">${renderIcon('trophy', 'mini-icon')} ${formatElapsedMs(bestTime)}</span>
              </div>
            </div>
          ` : `
            <div class="stat-row ${records.correct ? 'is-record' : ''}">
              <div class="stat-row-label">${renderIcon('check', 'stats-icon')} Correct ${records.correct ? newBadge : ''}</div>
              <div class="stat-row-values">
                <span class="stat-session text-green">${state.correct}</span>
                <span class="stat-best">${renderIcon('trophy', 'mini-icon')} ${bestCorrect}</span>
              </div>
            </div>
          `}

          <div class="stat-row ${records.combo ? 'is-record' : ''}">
            <div class="stat-row-label">${renderIcon('bolt', 'stats-icon')} Max Combo ${records.combo ? newBadge : ''}</div>
            <div class="stat-row-values">
              <span class="stat-session glow-magenta">${state.maxCombo}x</span>
              <span class="stat-best">${renderIcon('trophy', 'mini-icon')} ${bestCombo}x</span>
            </div>
          </div>

          <div class="stat-row stat-row-info">
            <div class="stat-row-label">${renderIcon('close', 'stats-icon')} Wrong</div>
            <div class="stat-row-values">
              <span class="stat-session text-red">${state.wrong}</span>
            </div>
          </div>
        </div>

        <div class="end-buttons">
          <button class="primary-btn" id="retry-btn">${renderIcon('refresh', 'button-icon')} Play Again</button>
          <button class="secondary-btn" id="home-btn">${renderIcon('home', 'button-icon')} Main Menu</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('retry-btn').addEventListener('click', () => startGame());
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
