import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(217, 221, 223, 1)",
  },
  text: {
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    color: "#6C7278",
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: -0.12,
  },
});

export default Title;
