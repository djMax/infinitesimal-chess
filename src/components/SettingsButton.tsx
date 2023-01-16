import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { Pressable } from "react-native";

export function SettingsButton() {
  const nav = useNavigation();
  return (
    <Pressable onPress={() => console.log('Click')}>
      <Icon name="settings" type="feather" />
    </Pressable>
  );
}
