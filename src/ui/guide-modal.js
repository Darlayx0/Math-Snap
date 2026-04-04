import { getGuideSections } from '../content/guide-sections.js';
import { renderIcon } from './icons.js';

export function renderGuideModal() {
  const guideSections = getGuideSections();
  const guideSummary = [
    ['4 Game Modes', 'Sprint, Race, Overdrive, Pattern'],
    ['Pattern Engine', 'Procedural + validated'],
  ].map(([label, value]) => `
    <div class="guide-summary-chip">
      <span class="guide-summary-value">${label}</span>
      <span class="guide-summary-label">${value}</span>
    </div>
  `).join('');

  const nav = guideSections.map((section, index) => `
    <button class="guide-nav-btn ${index === 0 ? 'is-active' : ''}" data-guide-tab="${section.id}" type="button">
      <span class="guide-nav-icon">${renderIcon(section.icon, 'guide-nav-svg')}</span>
      <span class="guide-nav-copy">
        <span class="guide-nav-label">${section.label}</span>
        <span class="guide-nav-sub">${section.title}</span>
      </span>
    </button>
  `).join('');

  const panels = guideSections.map((section, index) => `
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

export function bindGuideModal() {
  const guideSections = getGuideSections();
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

  const openGuide = () => {
    guideModal?.classList.add('is-open');
    guideModal?.setAttribute('aria-hidden', 'false');
    setGuideTab(guideSections[0].id);
  };

  const closeGuide = () => {
    guideModal?.classList.remove('is-open');
    guideModal?.setAttribute('aria-hidden', 'true');
  };

  document.getElementById('open-guide')?.addEventListener('click', openGuide);
  document.getElementById('open-guide-mobile')?.addEventListener('click', openGuide);
  document.getElementById('close-guide')?.addEventListener('click', closeGuide);
  guideModal?.addEventListener('click', (event) => {
    if (event.target === guideModal) {
      closeGuide();
    }
  });
  guideModal?.querySelectorAll('[data-guide-tab]').forEach((button) => {
    button.addEventListener('click', () => setGuideTab(button.dataset.guideTab));
  });
}
