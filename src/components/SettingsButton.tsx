import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { Pressable } from "react-native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../screens/RootStackParamList";

export function SettingsButton() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Pressable onPress={() => nav.navigate("Settings")}>
      <Icon name="settings" type="feather" />
    </Pressable>
  );
}
