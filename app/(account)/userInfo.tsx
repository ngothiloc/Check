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
import { updateUser } from "../../api/apiUser";
import { fetchAccountInfoById, getAccountAvatarUri } from "../../api/user";
import { FullUserData } from "../../types/user";

export default function UserInfo() {
  const router = useRouter();
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [userData, setUserData] = useState<FullUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userDataStr = await AsyncStorage.getItem("userData");
      if (userDataStr) {
        const data = JSON.parse(userDataStr);
        setUserData(data);
        setEditedUser(data);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAccountInfo = async () => {
      setLoading(true);
      try {
        const userDataStr = await AsyncStorage.getItem("userData");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const accountId = userData.accountId || userData.ID || userData.id;
          if (accountId) {
            const info = await fetchAccountInfoById(accountId);
            setAccountInfo(info);
          }
        }
      } catch (error) {
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    };
    loadAccountInfo();
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
    // Đảm bảo copy đầy đủ dữ liệu từ userData sang editedUser
    if (userData) {
      setEditedUser({
        ...userData,
        img: userData.img, // Đảm bảo copy đường dẫn ảnh
      });
      console.log("Edit mode - Current image path:", userData.img);
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("Bắt đầu cập nhật dữ liệu...");

      // Kiểm tra dữ liệu trước khi gửi
      if (!editedUser) {
        console.error("Không có dữ liệu để cập nhật");
        Alert.alert("Lỗi", "Không có dữ liệu để cập nhật");
        return;
      }

      // Chuẩn bị dữ liệu để gửi
      const dataToSend = {
        ...editedUser,
        // Đảm bảo giữ lại các trường quan trọng từ userData
        role: userData?.role,
        company: userData?.company,
        ptd: userData?.ptd,
        notifications: userData?.notifications,
        // Đảm bảo có id
        id: userData?.id,
      };

      console.log("Dữ liệu chuẩn bị gửi:", dataToSend);

      // Gọi API cập nhật
      const updatedUser = await updateUser(dataToSend);
      console.log("Dữ liệu nhận được từ server:", updatedUser);

      if (updatedUser) {
        // Cập nhật AsyncStorage với dữ liệu mới
        const updatedUserData = {
          ...userData,
          ...updatedUser,
        };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

        // Cập nhật state
        setUserData(updatedUserData);
        setEditedUser(null);
        setIsEditing(false);

        Alert.alert("Thành công", "Thông tin đã được cập nhật");
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật:", error);
      // Hiển thị thông báo lỗi chi tiết hơn
      Alert.alert(
        "Lỗi",
        error.message ||
          "Không thể cập nhật thông tin cá nhân. Vui lòng thử lại sau."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(userData);
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
          setEditedUser({
            ...editedUser,
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
          onChangeText={(text) => setEditedUser({ ...editedUser, [key]: text })}
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

  const renderGenderSelector = () => (
    <View style={styles.editableField}>
      <Text style={styles.editableLabel}>Giới tính</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowGenderModal(true)}
      >
        <Text style={styles.input}>
          {editedUser?.sex === "0"
            ? "Nam"
            : editedUser?.sex === "1"
            ? "Nữ"
            : "Khác"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderGenderModal = () => {
    if (!showGenderModal) return null;

    const genderOptions = [
      { label: "Nam", value: "0" },
      { label: "Nữ", value: "1" },
      { label: "Khác", value: "2" },
    ];

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn giới tính</Text>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.modalOption}
              onPress={() => {
                setEditedUser({ ...editedUser, sex: option.value });
                setShowGenderModal(false);
              }}
            >
              <Text style={styles.modalOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => setShowGenderModal(false)}
          >
            <Text style={styles.modalCancelText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Hàm lấy giá trị .r hoặc .v hoặc "Chưa có"
  function getValue(field: any) {
    if (!field) return "Chưa có";
    if (typeof field === "object") {
      return field.r?.trim() || field.v?.trim() || "Chưa có";
    }
    return field || "Chưa có";
  }

  function stripHtml(html: string): string {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#409CF0" />
      </View>
    );
  }

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
          <Text style={styles.title}>Thông tin cá nhân</Text>
        </View>
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.editButton} onPress={handleCancel}>
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
                  ? editedUser?.img
                    ? getImageUrl(editedUser.img)
                    : accountInfo
                    ? getAccountAvatarUri(accountInfo.colPic)
                    : getImageUrl(userData?.img)
                  : accountInfo
                  ? getAccountAvatarUri(accountInfo.colPic)
                  : getImageUrl(userData?.img),
              }}
              style={styles.userImage}
              resizeMode="cover"
              onError={(e) => handleImageError(e, isEditing)}
              // Tối ưu việc load ảnh
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
                  "Họ và tên",
                  editedUser?.name || "",
                  "name"
                )}
                {renderEditableField(
                  "Số điện thoại",
                  editedUser?.phone || "",
                  "phone",
                  "phone-pad"
                )}
                {renderGenderSelector()}
                {renderReadOnlyField("Email", userData?.email || "Chưa có")}
              </>
            ) : (
              <>
                {renderReadOnlyField(
                  "Họ và tên",
                  stripHtml(getValue(accountInfo?.TenHT))
                )}
                {renderReadOnlyField(
                  "Số điện thoại",
                  getValue(accountInfo?.SoDT)
                )}
                {renderReadOnlyField("Nhân sự", getValue(accountInfo?.NhanSu))}
                {renderReadOnlyField(
                  "Chức danh",
                  getValue(accountInfo?.ChucDanh)
                )}
                {/* {renderReadOnlyField("Email", userData?.Email?.r || "Chưa có")} */}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin công ty</Text>
            {renderReadOnlyField(
              "Tên công ty",
              getValue(accountInfo?.KhachHang)
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vai trò</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Vai trò:</Text>
              <View style={styles.roleContainer}>
                <Text style={styles.roleText}>
                  {getValue(accountInfo?.colType)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {renderGenderModal()}
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
  editButton: {
    marginBottom: 3,
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
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
    width: "40%",
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: "center",
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  modalCancel: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
