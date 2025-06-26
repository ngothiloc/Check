import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface FillInforProps extends TextInputProps {
  text: string;
  leftIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  leftIconColor?: string;
  rightIconColor?: string;
  onChangeText?: (text: string) => void;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "visible-password";
  isError?: boolean;
  containerStyle?: ViewStyle; // Style cho View bên ngoài
}

const FillInfor: React.FC<FillInforProps> = ({
  text,
  leftIconName,
  rightIconName,
  leftIconColor = "#B1B2B2",
  rightIconColor = "#B1B2B2",
  onChangeText,
  keyboardType = "default",
  isError = false,
  multiline = false, // Bật nhiều dòng
  containerStyle, // Tùy chỉnh style container
  ...rest // Các thuộc tính khác cho TextInput
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleChangeText = (text: string) => {
    setInputValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          borderColor: isError ? "#EE6363" : "#a6acad",
          shadowColor: isError ? "red" : "#000",
        },
      ]}
    >
      {leftIconName && (
        <MaterialCommunityIcons
          name={leftIconName}
          size={20}
          color={isError ? "#EE6363" : leftIconColor}
        />
      )}
      <TextInput
        placeholder={text}
        placeholderTextColor={isError ? "#EE6363" : "#B1B2B2"}
        style={[styles.input, multiline && { textAlignVertical: "top" }]} // Tự căn chỉnh cho nhiều dòng
        value={inputValue}
        onChangeText={handleChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        {...rest} // Gán thêm các thuộc tính tùy chỉnh
      />
      {rightIconName && (
        <MaterialCommunityIcons
          name={rightIconName}
          size={16}
          color={rightIconColor}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#a6acad",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    gap: 10,
    height: 50, // Chiều cao mặc định
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
});

export default FillInfor;
