import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://checkpro.manlab.vn";

export interface NotificationItem {
  id: string;
  user_id: string;
  message: string;
  is_read: string;
  created_at: string;
}

export const fetchNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No token found");
    }

    const userData = await AsyncStorage.getItem("userData");
    const userId = userData ? JSON.parse(userData).id : null;
    
    if (!userId) {
      throw new Error("No user ID found");
    }

    const response = await fetch(
      `${API_URL}/notification.php?route=notifications&id=${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status}`);
    }

    const data = await response.json();
    
    // Chuyển đổi dữ liệu để phù hợp với interface NotificationItem
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.id?.toString() || '',
        user_id: item.user_id?.toString() || '',
        message: item.message || '',
        is_read: item.is_read?.toString() || '0',
        created_at: item.created_at || new Date().toISOString()
      }));
    } else if (data.notifications && Array.isArray(data.notifications)) {
      return data.notifications.map((item: { id: { toString: () => any; }; user_id: { toString: () => any; }; message: any; is_read: { toString: () => any; }; created_at: any; }) => ({
        id: item.id?.toString() || '',
        user_id: item.user_id?.toString() || '',
        message: item.message || '',
        is_read: item.is_read?.toString() || '0',
        created_at: item.created_at || new Date().toISOString()
      }));
    }
    
    return [];

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(
      `${API_URL}/notification.php?route=markAsRead`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.status}`);
    }

    return true;

  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};