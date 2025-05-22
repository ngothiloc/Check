import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

interface SortProps {
  onSortChange: (option: "newest" | "oldest" | null) => void;
}

const Sort: React.FC<SortProps> = ({ onSortChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    "newest" | "oldest" | null
  >(null);

  const options = [
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
  ];

  const handleOptionPress = (value: "newest" | "oldest") => {
    if (selectedOption === value) {
      // Deselect if already selected
      setSelectedOption(null);
      onSortChange(null);
    } else {
      // Select new option
      setSelectedOption(value);
      onSortChange(value);
    }
    setModalVisible(false);
  };

  // Calculate dropdown position based on button height
  const dropdownTop = height < 1000 ? 190 : 200;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="sort" color="#8F9098" />
        <Text style={styles.text}>Sắp xếp</Text>
        <MaterialCommunityIcons name="chevron-down" color="#8F9098" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop, left: 30 }]}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  selectedOption === option.value && styles.selectedOption,
                ]}
                onPress={() =>
                  handleOptionPress(option.value as "newest" | "oldest")
                }
              >
                <Text style={styles.optionText}>{option.label}</Text>
                {selectedOption === option.value && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="#1F2024"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  container: {
    borderWidth: 1,
    width: 110,
    height: height < 1000 ? 45 : 50,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#C5C6CC",
  },
  text: {
    fontSize: 12,
    color: "#1F2024",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionItem: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    color: "#1F2024",
  },
  selectedOption: {
    backgroundColor: "#E0E0E0",
  },
});

export default Sort;
