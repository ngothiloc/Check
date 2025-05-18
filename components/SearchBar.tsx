import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// Define search suggestions data
const searchSuggestions = [
  { id: "1", title: "Thiết bị PTĐ", screen: "ptd" },
  { id: "2", title: "Phản hồi", screen: "feedback" },
  // { id: "3", title: "Thông báo", screen: "NotificationScreen" },
  // { id: "4", title: "Cài đặt", screen: "SettingScreen" },
  // { id: "5", title: "Hồ sơ", screen: "ProfileScreen" },
];

// Khai báo kiểu cho props
interface SearchBarProps {
  style?: ViewStyle;
}

// Nếu bạn có khai báo type cho Stack Navigator, hãy thay 'any' bằng type đó
const SearchBar: React.FC<SearchBarProps> = ({ style }) => {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState(searchSuggestions);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const searchInputRef = useRef<TextInput>(null);
  const containerRef = useRef<View>(null);

  useEffect(() => {
    if (searchText) {
      const filtered = searchSuggestions.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchText]);

  const handleSuggestionPress = (screen: string) => {
    setShowSuggestions(false);
    setSearchText("");
    navigation.navigate(screen as never);
  };

  const handleOutsidePress = () => {
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  const handleMicrophonePress = () => {
    // Thêm logic thu âm tại đây
    console.log("Microphone pressed");
  };

  const renderSuggestionItem = ({
    item,
  }: {
    item: (typeof searchSuggestions)[0];
  }) => (
    <Pressable
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item.screen)}
    >
      <MaterialCommunityIcons name="magnify" size={20} color="#B0B1B3" />
      <Text style={styles.suggestionText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.wrapper}>
      <View ref={containerRef} style={[styles.container, style]}>
        <View style={[styles.leftSearch]}>
          <MaterialCommunityIcons name="magnify" size={20} color="#B0B1B3" />
          <TextInput
            ref={searchInputRef}
            style={styles.input}
            placeholder="Tìm kiếm"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
          />
        </View>
        <TouchableOpacity onPress={handleMicrophonePress}>
          <MaterialCommunityIcons name="microphone" size={20} color="#B0B1B3" />
        </TouchableOpacity>

        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={filteredSuggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
      {showSuggestions && (
        <Pressable style={styles.overlay} onPress={handleOutsidePress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 1000,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 25,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    gap: 10,
    height: 50,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  leftSearch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 999,
  },
});

export default SearchBar;
