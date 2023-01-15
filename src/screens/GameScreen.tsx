import { observer } from "@legendapp/state/react";
import { makeStyles } from "@rneui/themed";
import { Button, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Board } from "../components/Board";
import { GameState } from "../state";

export const GameScreen = observer(() => {
  const styles = useStyles();
  const w = useWindowDimensions();
  const size = Math.floor((Math.min(w.width, w.height) - 10) / 8);
  const top = Math.floor((w.height - 4 - size * 8) / 2);
  const left = Math.floor((w.width - 4 - size * 8) / 2);

  return (
    <SafeAreaView style={styles.container}>
      <Board size={size} top={top} left={left} />
      <Button title="HELLO" onPress={() => {
        GameState.board.white[0].position.y.set(4.5);
      }}/>
    </SafeAreaView>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}));
