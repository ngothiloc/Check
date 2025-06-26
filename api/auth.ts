import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://checkpro.manlab.vn";

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

export const loginUser = async (username: string, password: string): Promise<any> => {
  try {
    // --- Đăng nhập theo kiểu mới giống PHP ---
    const loginUrlGet = "https://manlab.etv.org.vn/Account/Login?returnurl=%2F";
    const loginUrlPost = "https://manlab.etv.org.vn/Account/Login?returnurl=%2F";

    // 1. Lấy token và cookie
    const getRes = await fetch(loginUrlGet, {
      method: "GET",
      credentials: "include",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });
    const html = await getRes.text();
    const cookie = getRes.headers.get("set-cookie");

    // Parse token từ HTML
    const tokenMatch = html.match(/__RequestVerificationToken.+?value="([^"]+)"/);
    const token = tokenMatch?.[1];
    if (!token) throw new Error("Không tìm thấy token xác thực.");

    // 2. POST login
    const formBody = new URLSearchParams({
      __RequestVerificationToken: token,
      UserName: username,
      Password: password,
      returnUrl: "/",
    }).toString();

    const postRes = await fetch(loginUrlPost, {
      method: "POST",
      credentials: "include", // vẫn giữ lại
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
      },
      body: formBody,
    });
    const responseHtml = await postRes.text();

    // 3. Parse kết quả
    if (postRes.status === 200 && responseHtml.includes("Account_ID")) {
      const idMatch = responseHtml.match(/<div id="Account_ID"[^>]*>([^<]+)<\/div>/);
      const groupMatch = responseHtml.match(/<div id="Account_Group"[^>]*>([^<]+)<\/div>/);
      const accountId = idMatch?.[1] || "Không tìm thấy";
      const accountGroup = groupMatch?.[1] || "Không tìm thấy";

      // Lưu vào AsyncStorage để Header nhận biết đã đăng nhập
      await AsyncStorage.setItem("userToken", accountId); // hoặc lưu token nếu có
      await AsyncStorage.setItem("userData", JSON.stringify({ accountId, accountGroup }));
      console.log("🔍 Kiểm tra dữ liệu đã lưu:");

      console.log("Account_ID:", accountId);
      console.log("Account_Group:", accountGroup);
      return { accountId, accountGroup };
    } else {
      throw new Error("Đăng nhập thất bại hoặc sai tài khoản.");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};


export const logout = async () => {
  try {
    await AsyncStorage.clear(); // Xóa toàn bộ dữ liệu trong AsyncStorage
    await fetch("https://manlab.etv.org.vn/Account/Login?ReturnUrl=%2FAccount%2FLogout", {
    method: "GET",
    credentials: "include"
});
    
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};