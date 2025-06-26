import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Switch as PaperSwitch, StyleSheet, Text, View } from "react-native";

interface SettingSwitchProps {
  text: string;
  leftIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  leftIconColor?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}
const SettingSwitch: React.FC<SettingSwitchProps> = ({
  text,
  leftIconName,
  leftIconColor = "#5D5D5D",
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons
          name={leftIconName}
          size={25}
          color={leftIconColor}
        />
        <Text style={styles.input}>{text}</Text>
      </View>
      <View style={styles.switchContainer}>
        <PaperSwitch value={value} onValueChange={onValueChange} />
      </View>
    </View>
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
  switchContainer: {},
});

export default SettingSwitch;
