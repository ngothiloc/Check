import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Định nghĩa kiểu trạng thái
type StatusProps = {
  status:
    | "hết hiệu lực"
    | "huỷ bỏ"
    | "chờ cấp mới"
    | "hiệu lực"
    | "sắp hết hiệu lực";
};

const Status = ({ status }: StatusProps) => {
  // Đặt màu sắc và nội dung theo trạng thái
  let backgroundColor: string;
  let text: string;

  switch (status) {
    case "hết hiệu lực":
      backgroundColor = "#C50101";
      text = "Hết hiệu lực";
      break;
    case "huỷ bỏ":
      backgroundColor = "#7F7F7F";
      text = "Huỷ bỏ";
      break;
    case "chờ cấp mới":
      backgroundColor = "#308BFF";
      text = "Chờ cấp mới";
      break;
    case "hiệu lực":
      backgroundColor = "#12C205";
      text = "Hiệu lực";
      break;
    case "sắp hết hiệu lực":
      backgroundColor = "#FFCA0A";
      text = "Sắp hết hiệu lực";
      break;
    default:
      backgroundColor = "#7F7F7F"; // Màu mặc định
      text = "Không xác định"; // Nếu không xác định, trả về "Không xác định"
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  text: {
    color: "#ffffff",
  },
});

export default Status;
