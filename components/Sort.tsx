import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";

const { height } = Dimensions.get("window");

const Sort = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <MaterialCommunityIcons name="sort" color="#8F9098" />
      <Text style={styles.text}>Sắp xếp</Text>
      <MaterialCommunityIcons name="chevron-down" color="#8F9098" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: 110,
    height: height < 1000 ? 45 : 50,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#C5C6CC",
  },
  text: {
    fontSize: 12,
    color: "#1F2024",
  },
});

export default Sort;
