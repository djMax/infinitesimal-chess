import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Board } from './src/components/Board';

export default function App() {
  const w = useWindowDimensions();
  const size = Math.floor((Math.min(w.width, w.height) - 10) / 8);
  const top = Math.floor((w.height - 4 - size * 8) / 2);
  const left = Math.floor((w.width - 4 - size * 8) / 2);

  return (
    <View style={styles.container}>
      <Board size={size} top={top} left={left} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
