import { FullUserData } from "../types/user";

const BASE_URL = "https://checkpro.manlab.vn/auth.php";

export const getUserById = async (userId: string): Promise<FullUserData | null> => {
  try {
    const response = await fetch(`${BASE_URL}?route=user&user_id=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUser = async (userData: Partial<FullUserData>): Promise<FullUserData | null> => {
  try {
    const response = await fetch(`${BASE_URL}?route=user&user_id=${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userData.id,
        name: userData.name || "",
        phone: userData.phone || "",
        img: userData.img || "",
        sex: userData.sex || "",
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Update user response:', data);
    
    if (data && data.message === "User updated successfully") {
      return userData as FullUserData;
    }
    return null;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};
