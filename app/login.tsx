import Title from "@/components/ui/Title";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { loginUser } from "../api/auth";
import InputInfor from "../components/ui/InputInfor";
import InputPass from "../components/ui/InputPass";
import LoginOrther from "../components/ui/LoginOther";

export default function LoginScreen() {
  const router = useRouter();
  const [mst, setMst] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassWord] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkUsername, setCheckUsername] = useState(false);
  const [checkPass, setCheckPass] = useState(false);

  const validateUsername = (username: string) => username.trim().length > 0;

  const LoginPress = async () => {
    setIsSubmitted(true);
    setCheckUsername(!validateUsername(username));
    setCheckPass(password.length < 6);

    if (!validateUsername(username) || password.length < 6) {
      return;
    }

    setLoading(true);
    try {
      await loginUser(username, password);
      // Sau khi đăng nhập thành công, chuyển sang trang chính
      router.replace("/(tab)");
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={35}
            color="#4f4e4e"
          />
        </TouchableOpacity>
        <Image
          source={require("../assets/images/blur.png")}
          style={{
            position: "absolute",
            top: -225,
            width: "100%",
          }}
        />
        <ScrollView>
          <SafeAreaView>
            <View
              style={{
                paddingHorizontal: 25,
                marginTop: 100,
              }}
            >
              <View style={styles.head}>
                <View>
                  <Image source={require("../assets/images/icon.png")} />
                </View>
                <View>
                  <Text style={styles.title}>Đăng nhập</Text>
                </View>
                <View>
                  <Text style={styles.subtitle}>
                    Chào mừng bạn đến với ManLab-CheckPro
                  </Text>
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <InputInfor
                  text="Mã số thuế"
                  leftIconName="form-select"
                  onChangeText={(value: string) => setMst(value)}
                />
                <InputInfor
                  text="Tên đăng nhập"
                  leftIconName="account"
                  onChangeText={(value: string) => setUsername(value)}
                  isError={isSubmitted && checkUsername}
                />
                <InputPass
                  text="Nhập mật khẩu"
                  leftIconName="key-variant"
                  keyboardType="visible-password"
                  onChangeText={(value: string) => setPassWord(value)}
                  isError={isSubmitted && checkPass}
                />
              </View>

              <View style={styles.forgot}>
                <View style={styles.leftContent}>
                  <Checkbox
                    style={styles.checkbox}
                    value={isCheck}
                    onValueChange={() => setIsCheck(!isCheck)}
                  />
                  <Text style={[styles.text, { color: "#6C7278" }]}>
                    Ghi nhớ
                  </Text>
                </View>
                <Text style={[styles.text, { color: "#4D81E7" }]}>
                  Quên mật khẩu ?
                </Text>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={LoginPress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                )}
              </TouchableOpacity>

              <Title text="Phương thức đăng nhập" />

              <View style={styles.socialLogin}>
                <LoginOrther
                  iconSource={require("../assets/images/google.png")}
                  onPress={() => console.log("Google Login")}
                />
                <LoginOrther
                  iconSource={require("../assets/images/facebook.png")}
                  onPress={() => console.log("Facebook Login")}
                />
                <LoginOrther
                  iconSource={require("../assets/images/apple.png")}
                  onPress={() => console.log("Apple Login")}
                />
              </View>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Bạn chưa có tài khoản ?</Text>
                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text style={styles.registerLink}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  head: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 8,
    zIndex: 10,
    backgroundColor: "transparent",
    padding: 20,
  },
  title: {
    fontWeight: "700",
    fontSize: 32,
    color: "#1A1C1E",
  },
  subtitle: {
    fontWeight: "500",
    fontSize: 12,
    color: "#6C7278",
  },
  forgot: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  leftContent: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  checkbox: {
    padding: 8,
    borderRadius: 4,
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
  socialLogin: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#6C7278",
    fontSize: 13,
    fontWeight: "600",
  },
  registerLink: {
    color: "#4D81E7",
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 10,
    marginVertical: 20,
  },
});
