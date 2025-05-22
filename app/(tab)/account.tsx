import Header from "@/components/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface UserData {
  name: string;
  email: string;
  company: string;
}

export default function account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userDataStr = await AsyncStorage.getItem("userData");
      if (userToken && userDataStr) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(userDataStr));
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const handleExit = () => {
    Alert.alert("Thoát ứng dụng", "Bạn có chắc chắn muốn thoát ứng dụng?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Thoát",
        style: "destructive",
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
        <Header />
        <View style={styles.content}>
          {/* Thông tin tổ chức */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/EditCompanyScreen")}
          >
            <MaterialCommunityIcons
              name="account-group"
              size={20}
              color="#5D5D5D"
            />
            <Text style={styles.text}>Thông tin tổ chức</Text>
          </TouchableOpacity>

          {/* Thông tin cá nhân */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/EditPersonalScreen")}
          >
            <MaterialCommunityIcons name="account" size={20} color="#5D5D5D" />
            <Text style={styles.text}>Thông tin cá nhân</Text>
          </TouchableOpacity>

          {/* Bảo mật tài khoản */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("../(account)/security")}
          >
            <MaterialCommunityIcons
              name="shield-half-full"
              size={20}
              color="#5D5D5D"
            />
            <Text style={styles.text}>Bảo mật tài khoản</Text>
          </TouchableOpacity>

          {/* Lịch sử thực hiện */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/ExecutionHistory")}
          >
            <MaterialCommunityIcons name="history" size={20} color="#5D5D5D" />
            <Text style={styles.text}>Lịch sử thực hiện</Text>
          </TouchableOpacity>

          {/* Cài đặt */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("../(account)/setting")}
          >
            <MaterialCommunityIcons name="cogs" size={20} color="#5D5D5D" />
            <Text style={styles.text}>Cài đặt</Text>
          </TouchableOpacity>

          {/* Ngôn ngữ */}
          <TouchableOpacity style={styles.button}>
            <MaterialCommunityIcons name="web" size={20} color="#5D5D5D" />
            <Text style={styles.text}>Ngôn ngữ</Text>
          </TouchableOpacity>

          {/* Thoát ứng dụng */}
          <TouchableOpacity style={styles.button} onPress={handleExit}>
            <MaterialCommunityIcons
              name="exit-to-app"
              size={20}
              color="#5D5D5D"
            />
            <Text style={styles.text}>Thoát ứng dụng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  content: {
    backgroundColor: "white",
    gap: 35,
    borderWidth: 1,
    borderColor: "#409CF0",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 25,
    //shadow
    shadowColor: "#409CF0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    //resize
    position: "absolute",
    left: width * 0.05,
    right: width * 0.05,
    top: height < 1000 ? height * 0.3 : height * 0.26,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 10,
    fontSize: 14,
    color: "#5D5D5D",
  },
});
