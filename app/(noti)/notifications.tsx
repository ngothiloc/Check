import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  NotificationItem,
  fetchNotifications,
  markNotificationAsRead,
} from "../../api/apiNotification";

interface GroupedNotifications {
  title: string;
  data: NotificationItem[];
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const fetchedNotifications = await fetchNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notification: NotificationItem) => {
    if (notification.is_read === "1") return;

    const success = await markNotificationAsRead(notification.id);
    if (success) {
      const updatedNotifications = notifications.map((item) =>
        item.id === notification.id ? { ...item, is_read: "1" } : item
      );
      setNotifications(updatedNotifications);
    }
  };

  const handleMarkAllAsRead = async () => {
    Alert.alert(
      "Đánh dấu tất cả đã đọc",
      "Bạn có chắc chắn muốn đánh dấu tất cả thông báo đã đọc?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            const unreadNotifications = notifications.filter(
              (item) => item.is_read === "0"
            );

            for (const notification of unreadNotifications) {
              await markNotificationAsRead(notification.id);
            }

            const updatedNotifications = notifications.map((item) => ({
              ...item,
              is_read: "1",
            }));
            setNotifications(updatedNotifications);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationContainer}>
      <TouchableOpacity
        style={[
          styles.notificationItem,
          item.is_read === "0" ? styles.unreadItem : styles.readItem,
        ]}
        onPress={() => handleMarkAsRead(item)}
      >
        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.notificationTimestamp}>
            {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
        <View style={styles.notificationStatus}>
          {item.is_read === "0" ? (
            <MaterialCommunityIcons name="circle" size={12} color="#FF4444" />
          ) : (
            <MaterialCommunityIcons
              name="check-circle"
              size={12}
              color="#81c784"
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  const groupNotificationsByDate = (
    items: NotificationItem[]
  ): GroupedNotifications[] => {
    const groups: { [key: string]: NotificationItem[] } = {};

    items.forEach((item) => {
      const date = new Date(item.created_at);
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

  const renderSectionHeader = ({
    section,
  }: {
    section: GroupedNotifications;
  }) => (
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

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông báo</Text>
        {notifications.some((item) => item.is_read === "0") && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyMessage}>Không có thông báo nào.</Text>
          </View>
        ) : (
          <SectionList
            sections={groupNotificationsByDate(notifications)}
            keyExtractor={(item) => `${item.id}-${item.created_at}`}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            style={styles.container}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flex: 1,
    marginTop: 120,
  },
  sectionHeader: {
    backgroundColor: "#F8F9FA",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C757D",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFCFC",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyMessage: {
    marginTop: 16,
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  notificationContainer: {
    marginTop: 12,
  },
  notificationItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationStatus: {
    marginLeft: 12,
    width: 24,
    alignItems: "center",
  },
  notificationMessage: {
    fontSize: 15,
    lineHeight: 20,
    color: "#212529",
    marginBottom: 8,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: "#6C757D",
  },
  unreadItem: {
    borderLeftWidth: 3,
    borderLeftColor: "#FF4444",
  },
  readItem: {
    borderLeftWidth: 3,
    borderLeftColor: "#81c784",
  },
  markAllButton: {
    position: "absolute",
    right: 16,
    top: 70,
    backgroundColor: "#409CF0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  markAllText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default NotificationsScreen;
