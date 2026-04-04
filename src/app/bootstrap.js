import { createMathBackground } from '../services/background.js';
import { actions, setRuntimeHooks } from './actions.js';
import { renderApp } from './router.js';
import { state } from './state.js';

export function bootstrapApp() {
  setRuntimeHooks({ render: renderApp });
  createMathBackground();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (state.screen === 'playing') {
        actions.pauseGame();
      } else if (state.screen === 'paused') {
        actions.resumeGame();
      }
    }
  });

  renderApp();
}
