import { app, state } from './state.js';
import { OPERATIONS } from '../config/operations.js';
import { actions } from './actions.js';
import { renderMenu } from '../ui/menu.js';
import { renderGame } from '../ui/game-screen.js';
import { renderEnd } from '../ui/end-screen.js';

export function renderApp() {
  switch (state.screen) {
    case 'menu':
      renderMenu(app, state, OPERATIONS, actions);
      break;
    case 'playing':
      renderGame(app, state, actions);
      break;
    case 'end':
      renderEnd(app, state, actions);
      break;
    default:
      renderMenu(app, state, OPERATIONS, actions);
      break;
  }
}
