import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SearchBar from "./SearchBar";
const { height, width } = Dimensions.get("window");
export default function Header() {
  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/images/linear.png")}
        style={styles.linear}
      />
      <View style={styles.info}>
        <View style={styles.lefttext}>
          <Text style={{ fontSize: 14, color: "white" }}> Xin chào</Text>
          <Text style={{ fontSize: 24, color: "white" }}>Ngô Tiến Lộc</Text>
          <Text style={{ fontSize: 14, color: "white" }}>
            Công ty cổ phần ABC
          </Text>
        </View>
        <View style={styles.righttext}>
          <View style={styles.notification}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="bell-outline"
                size={25}
                color="white"
              />
              <View style={styles.badge}></View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={25}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
      <SearchBar style={styles.search} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#409CF0",
    height: height < 1000 ? height * 0.23 : height * 0.2,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "flex-start",
    zIndex: 1,
  },
  linear: {
    position: "absolute",
    left: width < 700 ? width * -0.2 : width * -0.1,
    top: height < 1000 ? height * -0.125 : height * -0.06,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: height < 1000 ? height * 0.07 : height * 0.1,
  },
  lefttext: {
    rowGap: 10,
    justifyContent: "center",
  },
  righttext: {
    flexDirection: "row",
  },
  notification: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  search: {
    position: "absolute",
    bottom: 0,
    left: width * 0.1, // 10% từ bên trái màn hình
    right: width * 0.1, // 10% từ bên phải màn hình
    top: height < 1000 ? height * 0.11 : height * 0.18,
    height: 50,
  },
});
