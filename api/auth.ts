import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://manlab.sachhaymoingay.info.vn";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;   
  };
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth.php?route=login`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!data.token || !data.user) {
      throw new Error("Invalid response format");
    }

    return {
      token: data.token,
      user: data.user
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_URL}/auth.php?route=usersData`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}; 