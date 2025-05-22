import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HISTORY_STORAGE_KEY = "@qr_scan_history";

interface HistoryItem {
  url: string;
  timestamp: number;
}

interface GroupedHistory {
  title: string;
  data: HistoryItem[];
}

const ScanHistoryScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        const loadedHistory: HistoryItem[] = historyJson
          ? JSON.parse(historyJson)
          : [];
        // Sort history by timestamp, newest first
        loadedHistory.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(loadedHistory);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Hàm nhóm dữ liệu theo ngày
  const groupHistoryByDate = (items: HistoryItem[]): GroupedHistory[] => {
    const groups: { [key: string]: HistoryItem[] } = {};

    items.forEach((item) => {
      const date = new Date(item.timestamp);
      const dateStr = date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(item);
    });

    return Object.entries(groups).map(([title, data]) => ({
      title,
      data,
    }));
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyUrl} numberOfLines={1}>
        {item.url}
      </Text>
      <Text style={styles.historyTimestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: GroupedHistory }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#409CF0" />
      </View>
    );
  }

  const groupedHistory = groupHistoryByDate(history);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử quét mã QR</Text>
      </View>
      <View style={styles.content}>
        {history.length === 0 ? (
          <Text style={styles.emptyMessage}>Chưa có lịch sử quét nào.</Text>
        ) : (
          <SectionList
            sections={groupedHistory}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.timestamp.toString()}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: "row",
    gap: 15,
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    height: 130,
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    marginTop: 130,
  },
  sectionHeader: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  backButton: {
    marginBottom: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyUrl: {
    fontSize: 16,
    color: "#007AFF", // Bluish color for links
    textDecorationLine: "underline",
  },
  historyTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});

export default ScanHistoryScreen;
