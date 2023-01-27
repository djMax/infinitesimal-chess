import { observer } from '@legendapp/state/react';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Board } from '../components/Board';
import { useStyles } from '../styles';

export const GameScreen = observer(() => {
  const styles = useStyles();
  const w = useWindowDimensions();
  const baseScale = Math.min(w.width, w.height - 300);
  const size = Math.floor((baseScale - 10) / 8);
  const top = 40;
  const left = Math.floor((w.width - 4 - size * 8) / 2);

  return (
    <SafeAreaView style={styles.boardContainer}>
      <Board size={size} top={top} left={left} />
    </SafeAreaView>
  );
});
