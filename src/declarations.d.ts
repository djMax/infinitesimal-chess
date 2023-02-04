declare module 'js-chess-engine' {
  interface BoardConfiguration {}

  type AiLevel = 0 | 1 | 2 | 3;

  declare class Game {
    constructor(board?: BoardConfiguration);
    printToConsole: () => void;
    aiMove: (level: AiLevel) => Record<string, string>;
    move: (from: string, to: string) => Record<string, string>;
    removePiece: (at: string) => void;
  }

  const status = (fen: string) => BoardConfiguration;
}
