import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// You might need other components for dropdowns/selects for enums

// Placeholder data for dropdowns
const statusOptions = [
  "Hiệu lực",
  "Hết hiệu lực",
  "Sắp hết hiệu lực",
  "Huỷ bỏ",
  "Chờ cấp mới",
];
const requirementOptions = ["Hiệu chuẩn", "Sửa chữa"];
const receiveStatusOptions = ["Bình thường", "Không bình thường"];
const returnStatusOptions = ["Chưa trả", "Đã trả"];
const bbdStatusOptions = ["Đã trả", "Chưa trả"];
// ... other options

type FilterDateKey = "dateFrom" | "dateTo";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (criteria: any) => void;
  initialCriteria: any; // Type this more strictly if possible
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialCriteria,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDatePicker, setCurrentDatePicker] =
    useState<FilterDateKey | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const datePickerRef = useRef<View>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    deviceName: "",
    status: null as string | null, // Use null for no selection
    companyName: "" as string | null, // Assuming these can be empty or selected from a list
    model: "" as string | null,
    serial: "" as string | null,
    dateFrom: null as Date | null, // Date objects, can be null
    dateTo: null as Date | null,
    requirement: null as string | null,
    receiveStatus: null as string | null,
    returnStatus: null as string | null,
    bbdStatus: null as string | null,
    certificateNumber: "" as string | null,
    sealNumber: "" as string | null,
  });

  // Initialize state with initialCriteria when modal becomes visible
  useEffect(() => {
    if (visible) {
      setFilterCriteria(initialCriteria);
    }
  }, [visible, initialCriteria]);

  const handleInputChange = (field: string, value: string) => {
    setFilterCriteria({
      ...filterCriteria,
      [field as keyof typeof filterCriteria]: value,
    });
  };

  const handleDropdownSelect = (
    field: FilterDateKey | Exclude<keyof typeof filterCriteria, FilterDateKey>,
    value: string | null
  ) => {
    setFilterCriteria({ ...filterCriteria, [field]: value });
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (event.type === "set" && selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirmDate = () => {
    if (tempDate && currentDatePicker) {
      setFilterCriteria({
        ...filterCriteria,
        [currentDatePicker]: tempDate,
      });
    }
    setShowDatePicker(false);
    setCurrentDatePicker(null);
    setTempDate(null);
  };

  const showDatepicker = (field: FilterDateKey) => {
    setShowDatePicker(true);
    setCurrentDatePicker(field);
    setTempDate(filterCriteria[field]);
    // Scroll to date picker after a short delay to ensure it's rendered
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 300, // Fixed position for date picker
        animated: true,
      });
    }, 100);
  };

  const handleReset = () => {
    setFilterCriteria({
      deviceName: "",
      status: null,
      companyName: null,
      model: null,
      serial: null,
      dateFrom: null,
      dateTo: null,
      requirement: null,
      receiveStatus: null,
      returnStatus: null,
      bbdStatus: null,
      certificateNumber: null,
      sealNumber: null,
    });
    onApplyFilters({
      deviceName: "",
      status: null,
      companyName: null,
      model: null,
      serial: null,
      dateFrom: null,
      dateTo: null,
      requirement: null,
      receiveStatus: null,
      returnStatus: null,
      bbdStatus: null,
      certificateNumber: null,
      sealNumber: null,
    }); // Apply empty filter on reset
  };

  const handleApplyFilters = () => {
    onApplyFilters(filterCriteria); // Pass criteria back to parent
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Lọc dữ liệu</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#1F2024"
                />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.filterBody}
                contentContainerStyle={styles.filterBodyContent}
                bounces={true}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                alwaysBounceVertical={true}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.filterLabel}>Tên thiết bị</Text>
                <TextInput
                  style={styles.input}
                  value={filterCriteria.deviceName || ""}
                  onChangeText={(text) => handleInputChange("deviceName", text)}
                  placeholder="Nhập tên thiết bị"
                />

                <Text style={styles.filterLabel}>Trạng thái</Text>
                <View style={styles.dropdownContainer}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.tag,
                        filterCriteria.status === option && styles.selectedTag,
                      ]}
                      onPress={() =>
                        handleDropdownSelect(
                          "status",
                          filterCriteria.status === option ? null : option
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.tagText,
                          filterCriteria.status === option &&
                            styles.selectedTagText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.filterLabel}>Cơ sở sản xuất</Text>
                <TextInput
                  style={styles.input}
                  value={filterCriteria.companyName || ""}
                  onChangeText={(text) =>
                    handleInputChange("companyName", text)
                  }
                  placeholder="Nhập tên cơ sở sản xuất"
                />

                <Text style={styles.filterLabel}>Model</Text>
                <TextInput
                  style={styles.input}
                  value={filterCriteria.model || ""}
                  onChangeText={(text) => handleInputChange("model", text)}
                  placeholder="Nhập model"
                />

                <Text style={styles.filterLabel}>Serial</Text>
                <TextInput
                  style={styles.input}
                  value={filterCriteria.serial || ""}
                  onChangeText={(text) => handleInputChange("serial", text)}
                  placeholder="Nhập serial"
                />

                <Text style={styles.filterLabel}>Khoảng thời gian</Text>
                <View style={styles.dateRangeContainer}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => showDatepicker("dateFrom")}
                  >
                    <Text>
                      {filterCriteria.dateFrom
                        ? filterCriteria.dateFrom.toLocaleDateString()
                        : "Từ ngày"}
                    </Text>
                  </TouchableOpacity>
                  <Text> - </Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => showDatepicker("dateTo")}
                  >
                    <Text>
                      {filterCriteria.dateTo
                        ? filterCriteria.dateTo.toLocaleDateString()
                        : "Đến ngày"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      value={tempDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleDateChange}
                    />
                    <View style={styles.datePickerButtons}>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => {
                          setShowDatePicker(false);
                          setCurrentDatePicker(null);
                          setTempDate(null);
                        }}
                      >
                        <Text style={styles.datePickerButtonText}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.datePickerButton,
                          styles.datePickerButtonConfirm,
                        ]}
                        onPress={handleConfirmDate}
                      >
                        <Text
                          style={[
                            styles.datePickerButtonText,
                            styles.datePickerButtonTextConfirm,
                          ]}
                        >
                          Xong
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <Text style={styles.filterLabel}>Yêu cầu</Text>
                <View style={styles.dropdownContainer}>
                  {requirementOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.tag,
                        filterCriteria.requirement === option &&
                          styles.selectedTag,
                      ]}
                      onPress={() =>
                        handleDropdownSelect(
                          "requirement",
                          filterCriteria.requirement === option ? null : option
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.tagText,
                          filterCriteria.requirement === option &&
                            styles.selectedTagText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.filterLabel}>Trạng thái nhận</Text>
                <View style={styles.dropdownContainer}>
                  {receiveStatusOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.tag,
                        filterCriteria.receiveStatus === option &&
                          styles.selectedTag,
                      ]}
                      onPress={() =>
                        handleDropdownSelect(
                          "receiveStatus",
                          filterCriteria.receiveStatus === option
                            ? null
                            : option
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.tagText,
                          filterCriteria.receiveStatus === option &&
                            styles.selectedTagText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.filterLabel}>Trạng thái trả</Text>
                <View style={styles.dropdownContainer}>
                  {returnStatusOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.tag,
                        filterCriteria.returnStatus === option &&
                          styles.selectedTag,
                      ]}
                      onPress={() =>
                        handleDropdownSelect(
                          "returnStatus",
                          filterCriteria.returnStatus === option ? null : option
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.tagText,
                          filterCriteria.returnStatus === option &&
                            styles.selectedTagText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.filterLabel}>Trạng thái BBD</Text>
                <View style={styles.dropdownContainer}>
                  {bbdStatusOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.tag,
                        filterCriteria.bbdStatus === option &&
                          styles.selectedTag,
                      ]}
                      onPress={() =>
                        handleDropdownSelect(
                          "bbdStatus",
                          filterCriteria.bbdStatus === option ? null : option
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.tagText,
                          filterCriteria.bbdStatus === option &&
                            styles.selectedTagText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.filterLabel}>Số chứng nhận</Text>
                <TextInput
                  style={styles.input}
                  value={filterCriteria.certificateNumber || ""}
                  onChangeText={(text) =>
                    handleInputChange("certificateNumber", text)
                  }
                  placeholder="Nhập số chứng nhận"
                />

                <Text style={styles.filterLabel}>Số tem</Text>
                <TextInput
                  style={styles.input}
                  value={filterCriteria.sealNumber || ""}
                  onChangeText={(text) => handleInputChange("sealNumber", text)}
                  placeholder="Nhập số tem"
                />
              </ScrollView>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Xoá</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2024",
  },
  filterBody: {
    flex: 1,
  },
  filterBodyContent: {
    paddingVertical: 10,
    paddingBottom: 50,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2024",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C5C6CC",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#1F2024",
  },
  dropdownContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#C5C6CC",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  selectedTag: {
    backgroundColor: "#409CF0",
    borderColor: "#409CF0",
  },
  tagText: {
    fontSize: 14,
    color: "#1F2024",
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C5C6CC",
    borderRadius: 8,
    padding: 10,
    justifyContent: "space-around",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  resetButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C5C6CC",
    width: "45%",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#1F2024",
  },
  applyButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#409CF0",
    width: "45%",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  selectedTagText: {
    color: "white",
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  datePickerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 8,
  },
  datePickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C5C6CC",
  },
  datePickerButtonConfirm: {
    backgroundColor: "#409CF0",
    borderColor: "#409CF0",
  },
  datePickerButtonText: {
    fontSize: 14,
    color: "#1F2024",
  },
  datePickerButtonTextConfirm: {
    color: "white",
  },
});

export default FilterModal;
