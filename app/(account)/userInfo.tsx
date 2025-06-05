import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FullUserData } from "../../types/user";

export default function UserInfo() {
  const router = useRouter();
  const [userData, setUserData] = useState<FullUserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem("userData");
        if (userDataStr) {
          setUserData(JSON.parse(userDataStr));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#409CF0" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="account-cancel"
          size={60}
          color="#666"
          style={{ marginBottom: 10 }}
        />
        <Text style={styles.errorText}>Không có thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Thông tin cá nhân</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/editUserInfo")}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: userData.img }}
              style={styles.userImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Họ và tên:</Text>
              <Text style={styles.value}>{userData.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{userData.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <Text style={styles.value}>{userData.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giới tính:</Text>
              <Text style={styles.value}>{userData.sex}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin công ty</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên công ty:</Text>
              <Text style={styles.value}>
                {userData.company?.name || "Chưa có"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vai trò</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Vai trò:</Text>
              <View style={styles.roleContainer}>
                <Text style={styles.roleText}>
                  {userData.role || "Người dùng"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
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
  editButton: {
    marginBottom: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userImage: {
    width: "100%",
    height: "100%",
  },
  roleContainer: {
    backgroundColor: "#409CF0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});
