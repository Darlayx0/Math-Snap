import { getModeContract } from '../modes/index.js';

export function generateProblemForState(state) {
  const contract = getModeContract(state.gameMode);
  return contract.createProblem(state, state.level);
}
