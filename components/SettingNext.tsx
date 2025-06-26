import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SettingNextProps {
  text: string;
  leftIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  leftIconColor?: string;
  rightIconColor?: string;
  onPress?: () => void;
}

const SettingNext: React.FC<SettingNextProps> = ({
  text,
  leftIconName,
  rightIconName = "keyboard-backspace",
  leftIconColor = "#5D5D5D",
  rightIconColor = "#5D5D5D",
  onPress,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => {}}
      style={styles.container}
    >
      <View style={styles.leftContent}>
        {leftIconName && (
          <MaterialCommunityIcons
            name={leftIconName}
            size={25}
            color={leftIconColor}
          />
        )}
        <Text style={styles.input}>{text}</Text>
      </View>
      <View>
        <MaterialCommunityIcons
          name={rightIconName}
          size={25}
          color={rightIconColor}
          style={{ transform: [{ scaleX: -1 }] }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderColor: "#EDF1F3",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    //shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftContent: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  input: {
    fontSize: 15,
    color: "#5D5D5D",
    fontWeight: "400",
  },
});

export default SettingNext;
