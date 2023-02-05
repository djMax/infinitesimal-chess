import { useActionSheet } from '@expo/react-native-action-sheet';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { observer } from '@legendapp/state/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListItem, Switch, Text } from '@rneui/themed';
import { AiLevel } from 'js-chess-engine';
import * as React from 'react';
import { View } from 'react-native';

import { RootStackParamList } from './RootStackParamList';
import { PieceSets } from '../components/PieceImage';
import { DemoBoards } from '../models';
import { initializeAi } from '../models/ai/aiManager';
import { getFen } from '../models/ai/fen';
import { GameSettings, GameState } from '../state';
import { resetGame } from '../state/actions';
import { useStyles } from '../styles';

export const SettingsScreen = observer(
  ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Settings'>) => {
    const { showActionSheetWithOptions } = useActionSheet();

    const styles = useStyles();
    const demos = Object.keys(DemoBoards) as (keyof typeof DemoBoards)[];

    const pieceSelect = React.useCallback(
      () =>
        showActionSheetWithOptions(
          {
            options: PieceSets,
            title: 'Select a Set of Pieces',
          },
          (selectedIndex) => {
            if (selectedIndex !== undefined) {
              GameSettings.pieceSet.set(PieceSets[selectedIndex]);
            }
          },
        ),
      [showActionSheetWithOptions],
    );

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
        <ListItem bottomDivider onPress={pieceSelect}>
          <ListItem.Content>
            <ListItem.Title>Piece Set</ListItem.Title>
          </ListItem.Content>
          <Text style={styles.rightText}>{GameSettings.pieceSet.get()}</Text>
          <FontAwesome5 name="chevron-right" size={20} style={styles.chevron} />
        </ListItem>

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
              const level = ai?.level! as AiLevel;
              const isWhite = ai?.isWhite;
              resetGame(DemoBoards[key as keyof typeof DemoBoards](), true, true);
              if (isAi) {
                GameState.ai.assign({ level, isWhite });
                initializeAi(level, getFen(GameState.peek()));
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
