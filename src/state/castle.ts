import { RawGameState } from './types';

export function canCastle(state: RawGameState, black: boolean, kingSide: boolean) {
  const king = state.pieces.find((p) => p.type === 'King' && p.black === black);
  if (!king) {
    return false;
  }
  if (king.history.length) {
    return false;
  }
  // king side is Rook8, queen side is Rook1.
  // Assuming id structure is gross, I know. Let tests sort it out.
  const targetRookId = `${black ? 'B' : 'W'}Rook${kingSide ? 8 : 1}`;
  const rook = state.pieces.find((p) => p.id === targetRookId);
  if (!rook) {
    return false;
  }
  return !rook.history.length;
}
