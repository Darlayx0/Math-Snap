import { GAME_MODES } from '../config/modes.js';

export function renderIcon(name, className = '') {
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

export function renderOperationIcon(name, className = '') {
  const iconMap = {
    addition: 'plus',
    subtraction: 'minus',
    multiplication: 'multiply',
    division: 'divide',
  };
  return renderIcon(iconMap[name], className);
}

export function renderModeIcon(name, className = '') {
  return renderIcon(GAME_MODES[name]?.icon || 'spark', className);
}

export function renderLabelIcon(name, text) {
  return `<span class="label-with-icon">${renderIcon(name, 'inline-icon')}<span>${text}</span></span>`;
}

export function renderHudStat(icon, id, value, tone, title) {
  return `<div class="hud-cell ${tone}" title="${title}"><span class="hud-icon">${renderIcon(icon, 'hud-svg')}</span><span class="hud-val" id="${id}">${value}</span></div>`;
}
