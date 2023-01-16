import { observer } from "@legendapp/state/react";
import { ListItem, Switch, Text } from "@rneui/themed";
import { View } from "react-native";
import { GameSettings } from "../state";
import { useStyles } from "../styles";

export const SettingsScreen = observer(() => {
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
    </View>
  );
});
