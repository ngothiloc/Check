import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";

const { height, width } = Dimensions.get("window");

// Thêm interface cho props
interface FilterProps {
  onPress?: () => void; // Thêm optional onPress prop
}

// Sử dụng React.FC và nhận props
const Filter: React.FC<FilterProps> = ({ onPress }) => {
  return (
    // Sử dụng onPress prop
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <MaterialCommunityIcons name="filter-outline" color="#8F9098" />
      <Text style={styles.text}>Lọc</Text>
      <MaterialCommunityIcons name="chevron-down" color="#8F9098" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    height: height < 1000 ? 45 : 50,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#C5C6CC",
    justifyContent: "space-between",
    width: 80,
  },
  text: {
    fontSize: 12,
    color: "#1F2024",
    marginHorizontal: 5,
  },
});

export default Filter;
