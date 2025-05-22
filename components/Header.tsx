import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logout } from "../api/auth";
import { fetchFullUserData } from "../api/user";
import { BasicUserData, FullUserData } from "../types/user";
import SearchBar from "./SearchBar";

const { height, width } = Dimensions.get("window");

interface UserData extends FullUserData {}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<FullUserData | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const userToken = await AsyncStorage.getItem("userToken");
          const userDataStr = await AsyncStorage.getItem("userData");

          if (userToken && userDataStr) {
            const basicUserData: BasicUserData = JSON.parse(userDataStr);
            setIsLoggedIn(true);

            const fullData = await fetchFullUserData(basicUserData.email);
            setUserData(fullData);
          } else {
            setIsLoggedIn(false);
            setUserData(null);
          }
        } catch (error) {
          console.error("Error loading user data in Header on focus:", error);
          setIsLoggedIn(false);
          setUserData(null);
        }
      };

      loadUserData();

      return () => {
        // Any cleanup needed when the screen loses focus
      };
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            setIsLoggedIn(false);
            setUserData(null);
            router.replace("/(tab)");
          } catch (error) {
            Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  const renderUserInfo = () => {
    if (isLoggedIn && userData) {
      return (
        <View style={styles.lefttext}>
          <Text style={{ fontSize: 14, color: "white" }}>Xin chào</Text>
          <Text style={{ fontSize: 24, color: "white" }}>{userData.name}</Text>
          {userData.company && (
            <Text style={{ fontSize: 14, color: "white" }}>
              {userData.company.name}
            </Text>
          )}
        </View>
      );
    }

    return (
      <View style={styles.lefttext}>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.authLink}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.authLink}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/images/linear.png")}
        style={styles.linear}
      />
      <View style={styles.info}>
        {renderUserInfo()}
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

            <TouchableOpacity onPress={() => router.push("/scanqr")}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={25}
                color="white"
              />
            </TouchableOpacity>
            {isLoggedIn && (
              <TouchableOpacity onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={25} color="white" />
              </TouchableOpacity>
            )}
          </View>
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
    height: 80,
    top: height < 1000 ? height * 0.07 : height * 0.1,
  },
  lefttext: {
    rowGap: 10,
    justifyContent: "center",
  },
  righttext: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  notification: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
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
    left: width * 0.1,
    right: width * 0.1,
    top: height < 1000 ? height * 0.11 : height * 0.18,
    height: 50,
  },
  authLink: {
    fontSize: 18,
    color: "white",
    marginVertical: 5,
  },
});
