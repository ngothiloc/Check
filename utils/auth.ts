import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkLoginStatus = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const userData = await AsyncStorage.getItem("userData");
    
    if (token && userData) {
      return {
        isLoggedIn: true,
        userData: JSON.parse(userData)
      };
    }
    return {
      isLoggedIn: false,
      userData: null
    };
  } catch (error) {
    console.error("Error checking login status:", error);
    return {
      isLoggedIn: false,
      userData: null
    };
  }
};

export const getStoredUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting stored user data:", error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("Error clearing auth data:", error);
    throw error;
  }
}; 