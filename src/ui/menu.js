import { GAME_MODES } from '../config/modes.js';
import { OVERDRIVE_MULTIPLIERS } from '../config/constants.js';
import { getBestTime, getHighCombo, getHighCorrect, getHighScore } from '../services/storage.js';
import {
  getActiveDifficultyLevels,
  getDifficultyTone,
  getModeMenuPanel,
  getRecordOperation,
} from '../modes/index.js';
import { formatElapsedMs } from '../engine/timer.js';
import { renderGuideModal, bindGuideModal } from './guide-modal.js';
import {
  renderIcon,
  renderLabelIcon,
  renderModeIcon,
  renderOperationIcon,
} from './icons.js';

function getMenuModeTabsMarkup(state) {
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

function getMenuOperationCardsMarkup(state, operations) {
  return Object.entries(operations).map(([key, op]) => `
    <button class="op-chip ${key} ${state.operation === key ? 'is-active' : ''}" data-op="${key}" type="button" id="op-${key}">
      <span class="op-chip-icon">${renderOperationIcon(key, 'op-chip-svg')}</span>
      <span class="op-chip-label">${op.label}</span>
    </button>
  `).join('');
}

function getModeInfoPanelMarkup(panel) {
  return `
    <div class="mode-info-panel">
      ${panel.items.map((item) => `
        <div class="mode-info-card">
          <span class="mode-info-icon">${renderIcon(item.icon, 'mini-icon')}</span>
          <div class="mode-info-copy">
            <span class="mode-info-label">${item.label}</span>
            <span class="mode-info-value">${item.value}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function getMenuModeSpecificMarkup(state, operations) {
  const panel = getModeMenuPanel(state);
  if (panel.type === 'info') {
    return getModeInfoPanelMarkup(panel);
  }
  return `<div class="op-grid-4">${getMenuOperationCardsMarkup(state, operations)}</div>`;
}

function getMenuDifficultyCardsMarkup(state) {
  const levels = getActiveDifficultyLevels(state.gameMode, state.operation);
  const recordOp = getRecordOperation(state, levels[Math.min(state.selectedLevelIdx, levels.length - 1)] || levels[0]);

  return levels.map((level, index) => {
    const diffLabel = state.gameMode === 'overdrive'
      ? `Multiplier: ${OVERDRIVE_MULTIPLIERS[getDifficultyTone(level)]}x`
      : level.label;

    return `
      <div class="diff-card diff-tone-${getDifficultyTone(level)} ${state.selectedLevelIdx === index ? 'is-selected' : ''}" data-idx="${index}" id="diff-${index}">
        <div class="diff-main">
          <div class="diff-head">
            <div class="diff-label">${level.difficultyName}</div>
            <div class="diff-side">${diffLabel}</div>
          </div>
          <div class="diff-meta">
            <span class="diff-stat score-record">${renderIcon('trophy', 'mini-icon')} ${getHighScore(state.gameMode, recordOp, level.max)}</span>
            ${state.gameMode === 'race10'
              ? `<span class="diff-stat time-record">${renderIcon('time', 'mini-icon')} ${formatElapsedMs(getBestTime(state.gameMode, recordOp, level.max))}</span>`
              : `<span class="diff-stat correct-record">${renderIcon('target', 'mini-icon')} ${getHighCorrect(state.gameMode, recordOp, level.max)}</span>`}
            <span class="diff-stat combo-record">${renderIcon('bolt', 'mini-icon')} ${getHighCombo(state.gameMode, recordOp, level.max)}x</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getPanelModeBadgeMarkup(state) {
  const activeMode = GAME_MODES[state.gameMode];
  return `${renderModeIcon(state.gameMode, 'badge-icon')}<span>${activeMode.label}</span>`;
}

export function updateMenuSelectionUI(state, operations, { rebuildDiffGrid = false } = {}) {
  if (state.screen !== 'menu') return;

  const modeSwitch = document.querySelector('.mode-switch');
  const modeSpecificPanel = document.querySelector('.mode-specific-panel');
  const diffGrid = document.querySelector('.diff-grid');
  const panelModeBadge = document.querySelector('.panel-mode-badge');

  modeSwitch?.querySelectorAll('.mode-tab').forEach((button) => {
    const isActive = button.dataset.mode === state.gameMode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (panelModeBadge) {
    panelModeBadge.innerHTML = getPanelModeBadgeMarkup(state);
  }

  if (rebuildDiffGrid && modeSpecificPanel) {
    modeSpecificPanel.innerHTML = getMenuModeSpecificMarkup(state, operations);
  }

  modeSpecificPanel?.querySelectorAll('.op-chip').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.op === state.operation);
  });

  if (diffGrid) {
    if (rebuildDiffGrid) {
      diffGrid.innerHTML = getMenuDifficultyCardsMarkup(state);
    } else {
      diffGrid.querySelectorAll('.diff-card').forEach((card, index) => {
        card.classList.toggle('is-selected', index === state.selectedLevelIdx);
      });
    }
  }
}

export function renderMenu(app, state, operations, actions) {
  app.innerHTML = `
    <div class="game-container menu-container">
      <div class="menu-layout">
        <div class="menu-panel-left">
          <div class="menu-left-top">
            <div class="header">
              <div class="title-deco-line"></div>
              <h1>Math Snap</h1>
              <div class="subtitle">${renderLabelIcon('bolt', 'Speed Math Challenge')}</div>
              <div class="title-formula">∑ · π · √ · ∞ · Δ · θ · λ · φ</div>
            </div>
          </div>
          <div class="menu-left-center">
            <div class="mode-switch" role="tablist" aria-label="Game mode">
              ${getMenuModeTabsMarkup(state)}
            </div>
          </div>
          <div class="menu-left-bottom">
            <button class="utility-link" id="open-guide">${renderIcon('guide', 'button-icon')}Panduan Permainan</button>
            <button class="danger-link" id="reset-progress-menu">Reset All Progress</button>
          </div>
        </div>

        <div class="menu-panel-right glass-panel">
          <div class="panel-right-header">
            <div class="panel-mode-badge">${getPanelModeBadgeMarkup(state)}</div>
          </div>

          <div class="panel-right-body">
            <div class="mode-specific-panel">${getMenuModeSpecificMarkup(state, operations)}</div>
            <div class="diff-section">
              <div class="diff-grid">${getMenuDifficultyCardsMarkup(state)}</div>
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

  bindGuideModal();

  document.querySelector('.mode-switch')?.addEventListener('click', (event) => {
    const button = event.target.closest('.mode-tab');
    if (!button || state.gameMode === button.dataset.mode) return;
    state.gameMode = button.dataset.mode;
    state.selectedLevelIdx = 0;
    updateMenuSelectionUI(state, operations, { rebuildDiffGrid: true });
  });

  document.querySelector('.panel-right-body')?.addEventListener('click', (event) => {
    const chip = event.target.closest('.op-chip');
    if (chip) {
      if (state.operation === chip.dataset.op) return;
      state.operation = chip.dataset.op;
      state.selectedLevelIdx = 0;
      updateMenuSelectionUI(state, operations, { rebuildDiffGrid: true });
      return;
    }

    const card = event.target.closest('.diff-card');
    if (!card) return;
    const nextIdx = Number.parseInt(card.dataset.idx, 10);
    if (state.selectedLevelIdx === nextIdx) return;
    state.selectedLevelIdx = nextIdx;
    updateMenuSelectionUI(state, operations);
  });

  document.getElementById('start-game-btn')?.addEventListener('click', actions.startGame);
  document.getElementById('reset-progress-menu')?.addEventListener('click', actions.confirmResetProgress);
  document.getElementById('reset-progress-mobile')?.addEventListener('click', actions.confirmResetProgress);
}
