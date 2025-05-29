import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://checkpro.manlab.vn";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;   
  };
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export const registerUser = async (email: string, password: string, name: string, phone: string): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth.php?route=register`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        phone
      })
    });

    const data = await response.json();
    console.log('Register response:', data);

    if (!data.token || !data.user) {
      throw new Error("Invalid response format");
    }

    // Store user data and token
    await AsyncStorage.setItem("userToken", data.token);
    await AsyncStorage.setItem("userData", JSON.stringify(data.user));

    return {
      token: data.token,
      user: data.user
    };
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

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