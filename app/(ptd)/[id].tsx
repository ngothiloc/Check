import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PTDItem } from "../../types/ptd";

export default function PTDDetail() {
  const { deviceData } = useLocalSearchParams();
  const router = useRouter();
  const data: PTDItem = JSON.parse(deviceData as string);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>{data.deviceName}</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: data.image }}
              style={styles.deviceImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin thiết bị</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Trạng thái:</Text>
              <View
                style={[
                  styles.status,
                  {
                    backgroundColor:
                      data.status === "Hiệu lực"
                        ? "#4CAF50"
                        : data.status === "Hết hiệu lực"
                        ? "#F44336"
                        : data.status === "Sắp hết hiệu lực"
                        ? "#FFC107"
                        : data.status === "Huỷ bỏ"
                        ? "#9E9E9E"
                        : data.status === "Chờ cấp mới"
                        ? "#2196F3"
                        : "#757575",
                  },
                ]}
              >
                <Text style={styles.statusText}>{data.status}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cơ sở sản xuất:</Text>
              <Text style={styles.value}>{data.companyName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Model:</Text>
              <Text style={styles.value}>{data.model}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Serial:</Text>
              <Text style={styles.value}>{data.serial}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin kiểm định</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Yêu cầu:</Text>
              <Text style={styles.value}>{data.requirement}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Trạng thái nhận:</Text>
              <Text style={styles.value}>{data.receiveStatus}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Trạng thái trả:</Text>
              <Text style={styles.value}>{data.returnStatus}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Trạng thái BBD:</Text>
              <Text style={styles.value}>{data.bbdStatus}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chứng nhận</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số chứng nhận:</Text>
              <Text style={styles.value}>{data.certificateNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số tem:</Text>
              <Text style={styles.value}>{data.sealNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngày cấp:</Text>
              <Text style={styles.value}>{data.date}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nhân viên phụ trách</Text>
            <View style={styles.staffContainer}>
              <Text style={styles.label}>Tên nhân viên:</Text>
              <Text style={styles.value}>{data.staffName}</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    height: 130,
    textAlign: "center",
    alignItems: "flex-end",
  },
  backButton: {
    marginBottom: 3,
  },
  title: {
    fontSize: 15,
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
  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  staffContainer: {
    flexDirection: "row",
    gap: 10,
  },
  staffImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  deviceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    aspectRatio: 1,
  },
});
