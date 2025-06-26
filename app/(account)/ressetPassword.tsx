import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputPass from "../../components/ui/InputPass";

const RessetPassword = () => {
  const [passWord, setPassWord] = useState("");
  const [passVerify, setPassVerify] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [checkPass, setCheckPass] = useState(false);
  const [checkPassVerify, setCheckPassVerify] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setIsSubmitted(true);

    // Regex: ít nhất 6 ký tự, 1 chữ, 1 số, không dấu
    let regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{6,}$/;
    const isValidPass = regexPass.test(passWord);
    setCheckPass(!isValidPass);

    const isValidPassVerify =
      passVerify === passWord &&
      passVerify.trim() !== "" &&
      passWord.trim() !== "";
    setCheckPassVerify(!isValidPassVerify);

    if (!isValidPass) {
      Alert.alert("Lỗi", "Mật khẩu không hợp lệ!");
      return;
    }
    if (!isValidPassVerify) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("colPass", passWord);
      formData.append("rePass", passVerify);

      const response = await fetch(
        "https://manlab.etv.org.vn/DataUpdate/Edit?9cyuYZ/B8$$$juE6VYPUMsvqYm1zVYnxTjHBXSoZFO6xlZXNejCmn5Pw1zoiwFZ08lUhQKhsKN$$$ZBRKtymgGD4tQ==",
        {
          method: "POST",
          body: formData,
          headers: {
            // Không cần set Content-Type, fetch sẽ tự động với FormData
          },
        }
      );
      const data = await response.text();
      // Xử lý giống script: data.split("&")
      const res = data.split("&");
      if (res[0] === "1") {
        Alert.alert("Thành công", "Đổi mật khẩu thành công!", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          "Có lỗi trong khi cập nhật dữ liệu. " + (res[2] || "")
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.title}>Đổi mật khẩu</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.describe}>
          Mật khẩu yêu cầu có 6 ký tự trở lên, có ít nhất một chữ và một số.
          Không nhập tiếng Việt có dấu.
        </Text>
        <View style={styles.gap} />
        <InputPass
          text="Mật khẩu hiện tại"
          leftIconName="shield-key-outline"
          keyboardType="visible-password"
          onChangeText={setCurrentPass}
        />
        <View style={styles.gap} />
        <InputPass
          text="Tạo mật khẩu mới"
          leftIconName="key-chain-variant"
          keyboardType="visible-password"
          onChangeText={setPassWord}
          isError={isSubmitted && checkPass}
        />
        <View style={styles.gap} />
        <InputPass
          text="Nhập lại mật khẩu"
          leftIconName="key-chain-variant"
          keyboardType="visible-password"
          onChangeText={setPassVerify}
          isError={isSubmitted && checkPassVerify}
        />
        <View style={styles.gap} />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handlePress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Xác nhận</Text>
          )}
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 24,
  },
  describe: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    color: "#666",
  },
  gap: {
    marginBottom: 14,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "#409CF0",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RessetPassword;
