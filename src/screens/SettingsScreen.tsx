import { observer } from '@legendapp/state/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListItem, Switch, Text } from '@rneui/themed';
import { View } from 'react-native';

import { RootStackParamList } from './RootStackParamList';
import { pawnDevelopment } from '../models';
import { GameSettings, resetGame } from '../state';
import { useStyles } from '../styles';

export const SettingsScreen = observer(
  ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Settings'>) => {
    const styles = useStyles();

    return (
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <ListItem>
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
        <ListItem
          onPress={() => {
            resetGame(pawnDevelopment(), false);
            navigation.goBack();
          }}>
          <ListItem.Content>
            <ListItem.Title>Simple Pawn Development</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  },
);
