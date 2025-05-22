import AsyncStorage from '@react-native-async-storage/async-storage';
import { PTDItem } from '../types/ptd';
import { FullUserData } from '../types/user';

export const fetchPTDData = async (): Promise<PTDItem[]> => {
  try {
    // Lấy thông tin user đầy đủ từ AsyncStorage (đã được lưu bởi fetchFullUserData)
    const userDataStr = await AsyncStorage.getItem('userData');
    if (!userDataStr) {
      console.log("No user data found in AsyncStorage.");
      return [];
    }
    
    const userData: FullUserData = JSON.parse(userDataStr);
    
    // Trả về danh sách PTD từ đối tượng user đầy đủ nếu có
    if (userData && userData.ptd) {
        console.log("PTD data found in user object.", userData.ptd);
      return userData.ptd;
    }
    
    console.log("No PTD data found in user object.");
    return [];
  } catch (error) {
    console.error('Error fetching PTD data from user object:', error);
    return [];
  }
};