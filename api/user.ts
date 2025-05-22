import AsyncStorage from "@react-native-async-storage/async-storage";
import { FullUserData } from "../types/user";

const API_URL = "https://manlab.sachhaymoingay.info.vn";

export const fetchFullUserData = async (email: string): Promise<FullUserData> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_URL}/auth.php?route=user&email=${email}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const result = await response.json();
    console.log('Full user data response:', result);

    // Relaxed validation: Only check if result and result.user exist
    if (!result || !result.user) {
         throw new Error("Invalid full user data format: Missing result or result.user");
    }

    // Cast result.user to FullUserData. Components using this data should handle optional fields.
    const fullUserData = result.user as FullUserData;
    
    // Save the full user data to AsyncStorage
    await AsyncStorage.setItem("userData", JSON.stringify(fullUserData));

    return fullUserData;

  } catch (error) {
    console.error("Error fetching full user data:", error);
    throw error;
  }
}; 