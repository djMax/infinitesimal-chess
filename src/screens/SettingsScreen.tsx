import { observer } from '@legendapp/state/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListItem, Switch, Text } from '@rneui/themed';
import { View } from 'react-native';

import { RootStackParamList } from './RootStackParamList';
import { DemoBoards } from '../models';
import { GameSettings, GameState } from '../state';
import { resetGame } from '../state/actions';
import { useStyles } from '../styles';
import { initializeAi } from '../models/ai/aiManager';
import { getFen } from '../models/ai/fen';

export const SettingsScreen = observer(
  ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Settings'>) => {
    const styles = useStyles();
    const demos = Object.keys(DemoBoards) as (keyof typeof DemoBoards)[];

    return (
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <ListItem
          bottomDivider
          onPress={() => {
            navigation.popToTop();
            navigation.replace('Intro');
          }}>
          <ListItem.Content>
            <ListItem.Title>New Game</ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <Text style={styles.sectionTitle}>Appearance</Text>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Show Board Background</ListItem.Title>
          </ListItem.Content>
          <Switch
            value={GameSettings.boardSettings.background.get() === 'default'}
            onValueChange={(v) => {
              GameSettings.boardSettings.background.set(v ? 'default' : 'none');
            }}
          />
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Show Halo Around Pieces</ListItem.Title>
          </ListItem.Content>
          <Switch
            value={GameSettings.boardSettings.halo.get()}
            onValueChange={(v) => {
              GameSettings.boardSettings.halo.set(v);
            }}
          />
        </ListItem>

        <Text style={styles.sectionTitle}>Sample Games</Text>
        {demos.map((key, ix) => (
          <ListItem
            bottomDivider={ix < demos.length - 1}
            key={key}
            onPress={() => {
              const ai = GameState.ai.peek();
              const isAi = !!ai;
              const level = ai?.level;
              const isWhite = ai?.isWhite;
              resetGame(DemoBoards[key as keyof typeof DemoBoards](), true, true);
              if (isAi) {
                GameState.ai.assign({ level, isWhite });
                initializeAi(level!, getFen(GameState.peek()));
              }
              navigation.goBack();
            }}>
            <ListItem.Content>
              <ListItem.Title>{key.replace(/([A-Z])/g, ' $1')}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    );
  },
);
