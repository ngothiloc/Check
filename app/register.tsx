import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { registerUser } from "../api/auth";
import InputInfor from "../components/ui/InputInfor";
import InputPass from "../components/ui/InputPass";

export default function RegisterScreen() {
  const router = useRouter();
  const [mst, setMst] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [passVerify, setPassVerify] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [checkPass, setCheckPass] = useState(false);
  const [checkFullName, setCheckFullName] = useState(false);
  const [checkPhone, setCheckPhone] = useState(false);
  const [checkPassVerify, setCheckPassVerify] = useState(false);

  const handleRegister = async () => {
    setIsSubmitted(true);

    // Validate full name
    let regexFullName = /^[A-Za-zÀ-ỹà-ỹ]+( [A-Za-zÀ-ỹà-ỹ]+)+$/;
    const isValidFullName = regexFullName.test(fullName);
    setCheckFullName(!isValidFullName);

    // Validate email
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regexEmail.test(email);
    setCheckEmail(!isValidEmail);

    // Validate password
    let regexPass =
      /^(?=.*[A-Z])(?=.{7,40}$)(?=.*[ -\/:-@\[-\`{-~])(?=.*[0-9])/;
    const isValidPass = regexPass.test(password);
    setCheckPass(!isValidPass);

    // Validate phone
    let regexPhone = /^(\+84|0)(3|5|7|8|9)\d{8}$/;
    const isValidPhone = regexPhone.test(phone);
    setCheckPhone(!isValidPhone);

    // Validate password verification
    const isValidPassVerify =
      passVerify === password &&
      passVerify.trim() !== "" &&
      password.trim() !== "";
    setCheckPassVerify(!isValidPassVerify);

    if (
      !isValidFullName ||
      !isValidEmail ||
      !isValidPass ||
      !isValidPhone ||
      !isValidPassVerify
    ) {
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, fullName, phone);
      router.replace("/(tab)");
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Đăng ký thất bại. Vui lòng thử lại sau."
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <SafeAreaView>
              <View style={{ paddingHorizontal: 25, marginTop: 100 }}>
                <View style={styles.head}>
                  <View>
                    <Image source={require("../assets/images/icon.png")} />
                  </View>
                  <View>
                    <Text style={styles.title}>Đăng ký</Text>
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
                    text="Họ và tên"
                    leftIconName="account-edit-outline"
                    onChangeText={(value: string) => setFullName(value)}
                    isError={isSubmitted && checkFullName}
                  />
                  <InputInfor
                    text="Email"
                    leftIconName="email-outline"
                    keyboardType="email-address"
                    onChangeText={(value: string) => setEmail(value)}
                    isError={isSubmitted && checkEmail}
                  />
                  <InputInfor
                    text="Số điện thoại"
                    leftIconName="format-list-numbered"
                    keyboardType="phone-pad"
                    onChangeText={(value: string) => setPhone(value)}
                    isError={isSubmitted && checkPhone}
                  />
                  <InputPass
                    text="Nhập mật khẩu"
                    leftIconName="key-variant"
                    keyboardType="visible-password"
                    onChangeText={(value: string) => setPassword(value)}
                    isError={isSubmitted && checkPass}
                  />
                  <InputPass
                    text="Nhập lại mật khẩu"
                    leftIconName="key-variant"
                    keyboardType="visible-password"
                    onChangeText={(value: string) => setPassVerify(value)}
                    isError={isSubmitted && checkPassVerify}
                  />
                </View>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.registerButtonText}>Đăng ký</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Bạn đã có tài khoản ?</Text>
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.loginLink}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
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
  registerButton: {
    marginTop: 20,
    backgroundColor: "#409CF0",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#6C7278",
    fontSize: 13,
    fontWeight: "600",
  },
  loginLink: {
    color: "#4D81E7",
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 10,
    marginVertical: 20,
  },
});
