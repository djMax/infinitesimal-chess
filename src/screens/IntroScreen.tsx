import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from '@rneui/themed';
import * as React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from './RootStackParamList';
import { getRemoteConfiguration } from '../adapters/firebase-common';
import { resetGame } from '../state/actions';
import { useStyles } from '../styles';

const localStyles = StyleSheet.create({
  text: {
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 4,
    marginBottom: 15,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export function IntroScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Intro'>) {
  const styles = useStyles();
  const window = useWindowDimensions();

  const buttonWidth = Math.min(800, window.width - 40);

  return (
    <SafeAreaView style={{ flex: 1, alignContent: 'space-between', paddingHorizontal: 20 }}>
      <>
        <ScrollView contentInset={{ top: 20 }}>
          <View style={styles.wideLimit}>
            <Text h1 style={{ textAlign: 'center', marginBottom: 20 }}>
              ε Chess
            </Text>
            <Text style={localStyles.text}>
              Welcome to ε Chess! ε Chess resembles regular chess, but with one key change - pieces
              can move to any point along the line of their normal move.
            </Text>
            <Text style={localStyles.text}>
              For example, your first pawn move can end anywhere between the starting point and 2
              squares ahead. You can move 0.001 squares, 1.999 squares, or anything in between.
            </Text>
            <Text style={localStyles.text}>
              Your pieces have a size (currently 70% of a square). If your piece overlaps an
              opponent's piece at all - even by a tiny fraction - you capture it. This means that it
              is possible to capture more than one piece with a single move.
            </Text>
            <Text style={localStyles.text}>
              Move mechanics are a work in progress - especially for the knight. Generally, tap on a
              piece to select it and then tap on the board where you want to go. You can fine tune
              this with the directional arrows and the slider.
            </Text>
            <Text style={localStyles.text}>
              For the knight, there will be three sets of arrows, one for each step of the move.
              Select each one in succession, and then set the amount of the move with the slider or
              by pressing the board.
            </Text>

            {Platform.OS === 'web' && (
              <View
                style={{
                  marginVertical: 30,
                  alignItems: 'center',
                }}>
                <View>
                  <Pressable
                    style={{ marginBottom: 20 }}
                    accessibilityRole="link"
                    href="https://apps.apple.com/us/app/%CE%B5-chess/id1668163621">
                    <Image
                      style={{ width: 300, height: 89 }}
                      source={require('../../assets/apple_store.png')}
                    />
                  </Pressable>
                </View>
                <View>
                  <Pressable
                    accessibilityRole="link"
                    href="https://play.google.com/store/apps/details?id=com.pyralis.infinitesimalchess">
                    <Image
                      style={{ width: 300, height: 89 }}
                      source={require('../../assets/play_store.png')}
                    />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={{ width: buttonWidth, alignSelf: 'center' }}>
          {getRemoteConfiguration<boolean>('allow_multiplayer', 'boolean') && (
            <Button
              containerStyle={styles.button}
              titleStyle={styles.buttonText}
              title="Invite an Opponent"
              onPress={() => {
                navigation.navigate('MultiplayerSetup', {});
              }}
            />
          )}

          <Button
            containerStyle={styles.button}
            titleStyle={styles.buttonText}
            title="Play an AI"
            onPress={() => {
              navigation.navigate('AiSetup');
            }}
          />

          <Button
            title="Local Multiplayer"
            containerStyle={styles.button}
            titleStyle={styles.buttonText}
            onPress={() => {
              resetGame();
              navigation.replace('Game');
            }}
          />
        </View>
      </>
    </SafeAreaView>
  );
}
