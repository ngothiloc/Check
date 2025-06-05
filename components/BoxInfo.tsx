import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// type RootStackParamList = {
//   ptd: undefined;
// };

export default function BoxInfo() {
  const router = useRouter();

  return (
    <Pressable style={styles.container}>
      <LinearGradient
        colors={[
          "rgba(64, 156, 240, 1)",
          "rgba(84, 156, 240, 1)",
          "rgba(164, 207, 240, 1)",
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        <Text style={styles.h1}>
          Cập nhật liên tục tiến trình dịch vụ của bạn
        </Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View>
            <View style={styles.text}>
              <Text style={styles.h2}>
                Lịch hẹn của tôi đã được xác nhận chưa?
              </Text>
              <Text style={styles.h2}>
                Ai là người đang đến lấy mẫu cho tôi?{"\n"}Dự kiến tới thời gian
                nào tới?
              </Text>
              <Text style={styles.h2}>
                Xét nghiệm của tôi đã có kết quả chưa?
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/booking")}
            >
              <Text style={{ fontSize: 12, color: "#000", fontWeight: "bold" }}>
                Đặt lịch ngay!
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={require("../assets/images/man_catton.png")}
              style={{ width: 160, height: 190 }} // Tăng kích thước ảnh
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 16,
  },
  h1: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    width: 200,
  },
  h2: {
    fontSize: 12,
    color: "white",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#FFCA0A",
    padding: 8,
    width: 150,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});
