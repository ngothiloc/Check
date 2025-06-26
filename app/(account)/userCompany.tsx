import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createCompany, updateCompany } from "../../api/apiCompany";
import { FullUserData } from "../../types/user";

export default function UserCompany() {
  const router = useRouter();
  const [userData, setUserData] = useState<FullUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const showLoginAlert = () => {
    Alert.alert("Thông báo", "Bạn cần đăng nhập để xem thông tin công ty", [
      {
        text: "Huỷ",
        style: "cancel",
        onPress: () => {
          router.back();
        },
      },
      {
        text: "Đăng nhập",
        onPress: () => {
          router.replace("/login");
        },
      },
    ]);
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userDataStr = await AsyncStorage.getItem("userData");
      if (userDataStr) {
        const data = JSON.parse(userDataStr);
        if (!data || !data.id) {
          showLoginAlert();
          return;
        }
        setUserData(data);
        setEditedCompany(data.company || {});
      } else {
        showLoginAlert();
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      showLoginAlert();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    // Yêu cầu quyền truy cập thư viện ảnh khi component mount
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Thông báo",
            "Cần quyền truy cập thư viện ảnh để thực hiện chức năng này"
          );
        }
      }
    })();
  }, []);

  const handleEdit = () => {
    if (userData?.company) {
      setEditedCompany({
        ...userData.company,
        img: userData.company.img, // Đảm bảo copy đường dẫn ảnh
      });
      console.log("Edit mode - Current company data:", userData.company);
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!userData || !userData.id) {
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
        return;
      }
      setSaving(true);
      console.log("Bắt đầu cập nhật dữ liệu công ty...");

      // Kiểm tra dữ liệu trước khi gửi
      if (!editedCompany) {
        console.error("Không có dữ liệu để cập nhật");
        Alert.alert("Lỗi", "Không có dữ liệu để cập nhật");
        return;
      }

      const companyData = {
        ...editedCompany,
        user_id: userData.id,
      };

      console.log("Dữ liệu chuẩn bị gửi:", companyData);

      let updatedCompany;
      if (userData.company?.id) {
        // Update existing company
        updatedCompany = await updateCompany({
          ...companyData,
          id: userData.company.id,
        });
      } else {
        // Create new company
        updatedCompany = await createCompany(companyData);
      }

      console.log("Dữ liệu nhận được từ server:", updatedCompany);

      if (updatedCompany) {
        // Cập nhật state với dữ liệu mới từ API
        const updatedUserData = {
          ...userData,
          company: {
            ...updatedCompany,
            // Đảm bảo các trường không bị undefined
            name: updatedCompany.name || "Chưa có",
            email: updatedCompany.email || "Chưa có",
            phone: updatedCompany.phone || "Chưa có",
            province: updatedCompany.province || "Chưa có",
            district: updatedCompany.district || "Chưa có",
            ward: updatedCompany.ward || "Chưa có",
            street: updatedCompany.street || "Chưa có",
            img: updatedCompany.img || "https://via.placeholder.com/200",
          },
        };

        // Cập nhật AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

        // Cập nhật state
        setUserData(updatedUserData as FullUserData);
        setEditedCompany(null);
        setIsEditing(false);

        Alert.alert("Thành công", "Thông tin công ty đã được cập nhật");
        router.back();
      } else {
        throw new Error("Không nhận được dữ liệu từ server");
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật:", error);
      Alert.alert(
        "Lỗi",
        error.message ||
          "Không thể cập nhật thông tin công ty. Vui lòng thử lại sau."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedCompany(userData?.company || {});
    setIsEditing(false);
  };

  const pickImage = async () => {
    try {
      console.log("Starting image picker...");

      // Kiểm tra quyền truy cập
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== "granted") {
          Alert.alert(
            "Thông báo",
            "Cần quyền truy cập thư viện ảnh để thực hiện chức năng này"
          );
          return;
        }
      }

      console.log("Opening image picker...");
      // Mở thư viện ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        console.log("Selected image:", selectedImage);

        // Kiểm tra và xử lý base64
        if (selectedImage.base64) {
          // Tạo base64 string cho ảnh
          const base64Image = `data:image/jpeg;base64,${selectedImage.base64}`;
          console.log("Base64 image length:", base64Image.length);

          // Cập nhật state với ảnh mới
          setEditedCompany({
            ...editedCompany,
            img: base64Image,
          });
        } else {
          Alert.alert("Lỗi", "Không thể đọc dữ liệu ảnh. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  // Hàm để tạo URL đầy đủ cho ảnh
  const getImageUrl = (path: string | undefined) => {
    if (!path) return "https://via.placeholder.com/200";
    if (path.startsWith("data:image")) return path;

    // Kiểm tra và xử lý đường dẫn
    try {
      // Nếu path đã là URL đầy đủ
      if (path.startsWith("http")) {
        return path;
      }

      // Nếu path là đường dẫn tương đối
      const cleanPath = path.startsWith("/") ? path.substring(1) : path;
      return `http://checkpro.manlab.vn/${cleanPath}`;
    } catch (error) {
      console.error("Error processing image path:", error);
      return "https://via.placeholder.com/200";
    }
  };

  // Hàm xử lý lỗi load ảnh
  const handleImageError = (e: any, isEditing: boolean) => {
    // Chỉ log lỗi khi không ở chế độ edit
    if (!isEditing) {
      console.error("Image loading error:", e.nativeEvent.error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#409CF0" />
      </View>
    );
  }

  if (!userData || !userData.id) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="account-cancel"
          size={60}
          color="#666"
          style={{ marginBottom: 10 }}
        />
        <Text style={styles.errorText}>
          Vui lòng đăng nhập để xem thông tin
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={showLoginAlert}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderEditableField = (
    label: string,
    value: string,
    key: string,
    keyboardType: "default" | "email-address" | "phone-pad" = "default"
  ) => (
    <View style={styles.editableField}>
      <Text style={styles.editableLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) =>
            setEditedCompany({ ...editedCompany, [key]: text })
          }
          keyboardType={keyboardType}
          placeholder={`Nhập ${label.toLowerCase()}`}
          placeholderTextColor="#B1B2B2"
        />
      </View>
    </View>
  );

  const renderReadOnlyField = (label: string, value: string) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

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
          <Text style={styles.title}>Thông tin công ty</Text>
        </View>
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleCancel}
              disabled={saving}
            >
              <MaterialCommunityIcons name="close" size={24} color="#EE6363" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#409CF0" />
              ) : (
                <MaterialCommunityIcons
                  name="check"
                  size={24}
                  color="#409CF0"
                />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <MaterialCommunityIcons name="pencil" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={isEditing ? pickImage : undefined}
            activeOpacity={isEditing ? 0.7 : 1}
          >
            <Image
              source={{
                uri: isEditing
                  ? editedCompany?.img
                    ? getImageUrl(editedCompany.img)
                    : getImageUrl(userData?.company?.img)
                  : getImageUrl(userData?.company?.img),
              }}
              style={styles.companyImage}
              resizeMode="cover"
              onError={(e) => handleImageError(e, isEditing)}
              progressiveRenderingEnabled={true}
              fadeDuration={0}
            />
            {isEditing && (
              <View style={styles.imageOverlay}>
                <MaterialCommunityIcons name="camera" size={24} color="white" />
                <Text style={styles.imageOverlayText}>Chọn ảnh</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            {isEditing ? (
              <>
                {renderEditableField(
                  "Tên công ty",
                  editedCompany?.name || "",
                  "name"
                )}
                {renderEditableField(
                  "Email",
                  editedCompany?.email || "",
                  "email",
                  "email-address"
                )}
                {renderEditableField(
                  "Số điện thoại",
                  editedCompany?.phone || "",
                  "phone",
                  "phone-pad"
                )}
              </>
            ) : (
              <>
                {renderReadOnlyField(
                  "Tên công ty",
                  userData?.company?.name || "Chưa có"
                )}
                {renderReadOnlyField(
                  "Email",
                  userData?.company?.email || "Chưa có"
                )}
                {renderReadOnlyField(
                  "Số điện thoại",
                  userData?.company?.phone || "Chưa có"
                )}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Địa chỉ</Text>
            {isEditing ? (
              <>
                {renderEditableField(
                  "Tỉnh/Thành phố",
                  editedCompany?.province || "",
                  "province"
                )}
                {renderEditableField(
                  "Quận/Huyện",
                  editedCompany?.district || "",
                  "district"
                )}
                {renderEditableField(
                  "Phường/Xã",
                  editedCompany?.ward || "",
                  "ward"
                )}
                {renderEditableField(
                  "Đường/Số nhà",
                  editedCompany?.street || "",
                  "street"
                )}
              </>
            ) : (
              <>
                {renderReadOnlyField(
                  "Tỉnh/Thành phố",
                  userData?.company?.province || "Chưa có"
                )}
                {renderReadOnlyField(
                  "Quận/Huyện",
                  userData?.company?.district || "Chưa có"
                )}
                {renderReadOnlyField(
                  "Phường/Xã",
                  userData?.company?.ward || "Chưa có"
                )}
                {renderReadOnlyField(
                  "Đường/Số nhà",
                  userData?.company?.street || "Chưa có"
                )}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mã số</Text>
            {renderReadOnlyField(
              "Mã công ty",
              userData?.company?.id || "Chưa có"
            )}
            {renderReadOnlyField(
              "Mã người dùng",
              userData?.company?.user_id || "Chưa có"
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollViewContent: {
    flexGrow: 1,
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
  editButton: {
    marginBottom: 3,
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
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
  companyImage: {
    width: "100%",
    height: "100%",
  },
  editableField: {
    marginBottom: 16,
  },
  editableLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
  },
  input: {
    padding: 12,
    fontSize: 14,
    color: "#333",
  },
  loginButton: {
    // backgroundColor: "#409CF0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#409CF0",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  imageOverlayText: {
    color: "white",
    marginTop: 8,
    fontSize: 14,
  },
});
