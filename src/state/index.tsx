import { observable } from "@legendapp/state"
import { defaultBoard } from "../models";
import { Piece } from "../models/Piece";

export const GameState = observable({
  board: defaultBoard(),
  dead: [] as Piece[],
});
