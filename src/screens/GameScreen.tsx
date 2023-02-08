import { observer } from '@legendapp/state/react';
import { Platform, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Board } from '../components/Board';
import { SettingsButton } from '../components/SettingsButton';
import { MultiplayerWaitBanner } from '../components/ads';
import { GameState } from '../state';
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
      <View style={{ width: '100%', paddingRight: 20, paddingBottom: 15 }}>
        <View style={styles.topX}>
          <SettingsButton />
        </View>
      </View>
      <ScrollView>
        <Board size={size} top={top} left={left} />
      </ScrollView>

      {Boolean(GameState.multiplayer.gameId.get() || Platform.OS === 'web') && (
        <MultiplayerWaitBanner />
      )}
    </SafeAreaView>
  );
});
