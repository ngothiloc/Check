import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface InputPassProps {
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
}

const InputPass: React.FC<InputPassProps> = ({
  text,
  leftIconName, // Icon mặc định
  // rightIconName = "eye-outline",
  leftIconColor = "#B1B2B2", // Màu mặc định
  rightIconColor = "#B1B2B2",
  onChangeText,
  keyboardType = "visible-password",
  isError = false,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); //show and off pass

  const handleChangeText = (text: string) => {
    setInputValue(text); // Cập nhật giá trị trong state
    if (onChangeText) {
      onChangeText(text); // Gọi hàm onChangeText từ prop nếu có
    }
  };

  //Show off pass
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isError ? "#EE6363" : "#a6acad", // Đổi màu viền
          shadowColor: isError ? "red" : "#000", // Đổi màu shadow
        },
      ]}
    >
      <MaterialCommunityIcons
        name={leftIconName}
        size={20}
        color={isError ? "#EE6363" : leftIconColor}
      />
      <TextInput
        placeholder={text}
        placeholderTextColor={isError ? "#EE6363" : "#B1B2B2"}
        style={styles.input}
        secureTextEntry={!isPasswordVisible} //show and off pass
        value={inputValue} // Gán giá trị state vào TextInput
        onChangeText={handleChangeText} // Gọi handleChangeText khi giá trị thay đổi
        keyboardType={keyboardType}
      />
      <TouchableOpacity onPress={togglePasswordVisibility}>
        <MaterialCommunityIcons
          style={{ margin: 10 }}
          name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
          size={18}
          color={rightIconColor}
        />
      </TouchableOpacity>
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
    height: 50,
    justifyContent: "space-between",
    //shadow
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

export default InputPass;
