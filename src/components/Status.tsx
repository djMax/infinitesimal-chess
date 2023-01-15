import { observer } from "@legendapp/state/react";
import { Text } from "@rneui/themed";
import { View } from "react-native";
import { GameState } from "../state";

export const Status = observer(({ black }: { black: boolean }) => {
  const whiteToMove = GameState.whiteToMove.get();
  const isMyMove = whiteToMove !== black;

  return (
    <View>
      {isMyMove && (
        <Text>{black ? 'Black to move' : 'White to move'}</Text>
      )}
    </View>
  )
});
