import { observer } from "@legendapp/state/react";
import { Button, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Board } from "../components/Board";
import { Position } from "../models/Position";
import { getOverlappingPiece } from "../models/topology";
import { GameState } from "../state";
import { useStyles } from "../styles";

export const GameScreen = observer(() => {
  const styles = useStyles();
  const w = useWindowDimensions();
  const size = Math.floor((Math.min(w.width, w.height) - 10) / 8);
  const top = Math.floor((w.height - 4 - size * 8) / 2) - 60;
  const left = Math.floor((w.width - 4 - size * 8) / 2);

  return (
    <SafeAreaView style={styles.boardContainer}>
      <Board size={size} top={top} left={left} />
      <Button title="FOOBAR" onPress={() => {
        const p = GameState.board.white[0].position.get();
        GameState.board.white[0].position.y.set(4.5);
        const o = getOverlappingPiece(GameState.board.white[0].get(), new Position(p.x, 0), GameState.board.black.get());
        console.log(o?.toString());
      }}/>
    </SafeAreaView>
  );
});
