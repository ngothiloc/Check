import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface LoginOrtherProps {
  iconSource: ImageSourcePropType;
  onPress: () => void;
}

const LoginOrther: React.FC<LoginOrtherProps> = ({ iconSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Image source={iconSource} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#EFF0F6",
    // paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "23%",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default LoginOrther;
