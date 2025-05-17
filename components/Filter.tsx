import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";

const { height, width } = Dimensions.get("window");

const Filter = () => {
  return (
    <TouchableOpacity style={styles.container}>
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
    justifyContent: "space-between", // Đảm bảo các phần tử căn giữa
    width: 80, // Đặt chiều rộng tối thiểu nếu cần
  },
  text: {
    fontSize: 12,
    color: "#1F2024",
    marginHorizontal: 5, // Thêm khoảng cách giữa các phần tử
  },
});

export default Filter;
