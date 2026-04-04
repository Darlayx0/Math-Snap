import { GAME_MODES } from '../config/modes.js';
import { formatElapsedMs } from '../engine/timer.js';
import { getEndStatsVariant } from '../modes/index.js';
import { renderSessionMeta } from './game-screen.js';
import { renderIcon } from './icons.js';

export function renderEnd(app, state, actions) {
  const mode = GAME_MODES[state.gameMode];
  const endVariant = getEndStatsVariant(state);
  const endData = state.lastEndData || {
    records: {},
    previous: { bestScore: 0, bestCorrect: 0, bestCombo: 0, bestTime: null },
  };

  const newBadge = '<span class="stat-new">NEW</span>';
  const hasAnyRecord = Object.values(endData.records).some(Boolean);

  app.innerHTML = `
    <div class="game-container">
      <div class="header page-header">
        <h1>${mode.resultTitle}</h1>
      </div>

      <div class="end-screen glass-panel">
        ${renderSessionMeta(state, state.level, 'session-meta-end')}

        ${hasAnyRecord ? `<div class="new-record">${renderIcon('spark', 'inline-icon')} New Record!</div>` : ''}

        <div class="final-stats">
          <div class="stat-row ${endData.records.score ? 'is-record' : ''}">
            <div class="stat-row-label">${renderIcon('spark', 'stats-icon')} Score ${endData.records.score ? newBadge : ''}</div>
            <div class="stat-row-values">
              <span class="stat-session text-primary">${state.score}</span>
              <span class="stat-best">${renderIcon('trophy', 'mini-icon')} ${endData.previous.bestScore}</span>
            </div>
          </div>

          ${endVariant.usesTimeRecord ? `
            <div class="stat-row ${endData.records.time ? 'is-record' : ''}">
              <div class="stat-row-label">${renderIcon('time', 'stats-icon')} Clear Time ${endData.records.time ? newBadge : ''}</div>
              <div class="stat-row-values">
                <span class="stat-session text-time">${formatElapsedMs(state.elapsedMs)}</span>
                <span class="stat-best">${renderIcon('trophy', 'mini-icon')} ${formatElapsedMs(endData.previous.bestTime)}</span>
              </div>
            </div>
          ` : `
            <div class="stat-row ${endData.records.correct ? 'is-record' : ''}">
              <div class="stat-row-label">${renderIcon('check', 'stats-icon')} Correct ${endData.records.correct ? newBadge : ''}</div>
              <div class="stat-row-values">
                <span class="stat-session text-green">${state.correct}</span>
                <span class="stat-best">${renderIcon('trophy', 'mini-icon')} ${endData.previous.bestCorrect}</span>
              </div>
            </div>
          `}

          <div class="stat-row ${endData.records.combo ? 'is-record' : ''}">
            <div class="stat-row-label">${renderIcon('bolt', 'stats-icon')} Max Combo ${endData.records.combo ? newBadge : ''}</div>
            <div class="stat-row-values">
              <span class="stat-session glow-magenta">${state.maxCombo}x</span>
              <span class="stat-best">${renderIcon('trophy', 'mini-icon')} ${endData.previous.bestCombo}x</span>
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

  document.getElementById('retry-btn')?.addEventListener('click', actions.startGame);
  document.getElementById('home-btn')?.addEventListener('click', actions.backToMenu);
}
