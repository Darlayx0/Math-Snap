import { renderIcon } from './icons.js';

export function renderConfirmResetOverlay({ onConfirm, onCancel }) {
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

  document.getElementById('confirm-reset-btn')?.addEventListener('click', onConfirm);
  document.getElementById('cancel-reset-btn')?.addEventListener('click', onCancel);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      onCancel();
    }
  });
}

export function removeConfirmResetOverlay() {
  document.getElementById('confirm-overlay')?.remove();
}

export function renderPauseOverlay(actions) {
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

  document.getElementById('resume-btn')?.addEventListener('click', actions.resumeGame);
  document.getElementById('restart-btn')?.addEventListener('click', actions.restartGame);
  document.getElementById('menu-btn')?.addEventListener('click', actions.backToMenu);
}

export function removePauseOverlay() {
  document.getElementById('pause-overlay')?.remove();
}
