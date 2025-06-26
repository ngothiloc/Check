import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SettingNext from "../../components/SettingNext";
import SettingSwitch from "../../components/SettingSwitch";

const TOGGLE_KEYS = {
  authenticate: "setting_toggle_authenticate",
};

const SecurityScreen: React.FC = () => {
  const [toggles, setToggles] = useState({
    authenticate: false,
  });

  // Load trạng thái từ AsyncStorage khi mở trang
  useEffect(() => {
    (async () => {
      try {
        const [authenticate] = await Promise.all([
          AsyncStorage.getItem(TOGGLE_KEYS.authenticate),
        ]);
        setToggles({
          authenticate: authenticate === "true",
        });
      } catch (e) {
        // Nếu lỗi thì giữ mặc định
      }
    })();
  }, []);

  // Hàm xử lý khi đổi trạng thái toggle
  const handleToggle = async (key: keyof typeof toggles, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
    await AsyncStorage.setItem(TOGGLE_KEYS[key], value.toString());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Bảo mật tài khoản</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingGroup}>
          <SettingNext
            text="Đổi mật khẩu"
            leftIconName="lock-reset"
            onPress={() => router.push("/ressetPassword")}
          />
          <SettingSwitch
            text="Xác thực 2 yếu tố"
            leftIconName="shield-check-outline"
            value={toggles.authenticate}
            onValueChange={(val) => handleToggle("authenticate", val)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    height: 130,
    textAlign: "center",
    alignItems: "flex-end",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  backButton: {
    marginBottom: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  settingGroup: {
    gap: 5,
  },
});

export default SecurityScreen;
