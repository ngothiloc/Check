import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FillInfor from "../components/ui/FillInfor";

export default function Booking() {
  const [bookingDate, setBookingDate] = useState<Date | null>(new Date());
  const [bookingTime, setBookingTime] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMode, setCurrentMode] = useState<"date" | "time">("date");

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (event.type === "set" && selectedDate) {
      if (currentMode === "date") {
        setBookingDate(selectedDate);
        setShowDatePicker(false);
      } else {
        setBookingTime(selectedDate);
        setShowTimePicker(false);
      }
    } else {
      // Nếu người dùng hủy
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Chọn ngày";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "Chọn giờ";
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          <Text style={styles.title}>Đặt lịch kiểm định</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text>Đặt lịch kiểm định</Text>
          <FillInfor text="Họ và tên" leftIconName="account" />
          <FillInfor
            text="Số điện thoại"
            leftIconName="phone"
            keyboardType="phone-pad"
          />
          <FillInfor
            text="Email"
            leftIconName="email"
            keyboardType="email-address"
          />
          <FillInfor text="Tên đơn vị (tổ chức)" leftIconName="map-marker" />

          {/* Chọn ngày đặt */}
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.datePickerContent}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color="#B1B2B2"
              />
              <Text style={styles.datePickerText}>
                {formatDate(bookingDate)}
              </Text>
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={bookingDate || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Chọn giờ đặt */}
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => {
              setCurrentMode("time");
              setShowTimePicker(true);
            }}
          >
            <View style={styles.datePickerContent}>
              <MaterialCommunityIcons name="clock" size={20} color="#B1B2B2" />
              <Text style={styles.datePickerText}>
                {formatTime(bookingTime)}
              </Text>
            </View>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={bookingTime || new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}

          <FillInfor
            text="Mô tả chi tiết (nếu có)"
            keyboardType="default"
            multiline={true}
            containerStyle={{
              height: 120,
              alignItems: "baseline",
              paddingVertical: 5,
            }}
          />
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
  },
  content: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#a6acad",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    height: 50,
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  datePickerText: {
    flex: 1,
    color: "#333", // Thay đổi màu từ red sang #333 để phù hợp hơn
  },
  inlinePicker: {
    width: 120, // Điều chỉnh kích thước phù hợp
    height: 40,
  },
});
