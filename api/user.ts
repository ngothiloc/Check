import type { AccountInfo } from "../types/accountInfo";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export const fetchAccountInfoById = async (accountId: string) => {
  try {
    const url =
      "https://manlab.etv.org.vn/DataTable/DatajqGrid?tbName=tbAccountInfo&(ID%20<>%200)&moreExp=&morefilter=&colType_filter=-1&colName_filter=&TenHT_filter=&NhanSu_filter=-1&ManLabDonVi_filter=-1&_search=false&nd=" +
      Date.now() +
      "&rows=999&page=1&sidx=&sord=asc&_=" +
      Date.now();

    const response = await fetch(url);
    if (!response.ok) throw new Error("Không thể lấy dữ liệu tài khoản");

    const data = await response.json();

    // Xác định danh sách tài khoản
    let list: any[] = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (data.rows) {
      list = data.rows;
    } else if (data.data) {
      list = data.data;
    } else {
      const arr = Object.values(data).find((v) => Array.isArray(v));
      if (arr) list = arr as any[];
    }

    // Tìm tài khoản có ID trùng với accountId
    const found = list.find((item: any) => String(item.ID) === String(accountId));
    if (!found) {
      console.error("Không tìm thấy thông tin tài khoản với ID:", accountId);
      throw new Error("Không tìm thấy thông tin tài khoản với ID: " + accountId);
    }

    // // Hiển thị toàn bộ dữ liệu của ID này ra console
    // console.log("Dữ liệu tài khoản với ID", accountId, ":", found);

    // Khi lấy được dữ liệu:
    const info: AccountInfo = found;

    console.log("===== Toàn bộ dữ liệu tài khoản =====");
    Object.entries(info).forEach(([key, value]) => {
      if (value && typeof value === "object" && "r" in value) {
        console.log(`${key}:`, stripHtml(value.r || ""));
      } else {
        console.log(`${key}:`, value);
      }
    });
    console.log("===== Hết dữ liệu tài khoản =====");

    return found;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tài khoản:", error);
    throw error;
  }
};

export function getAccountAvatarUri(colPic: any): string {
  // Nếu không có dữ liệu thì trả về ảnh mặc định
  if (!colPic || !colPic.v) return "https://via.placeholder.com/200";
  // Nếu đã là base64
  if (colPic.v.startsWith("data:image")) return colPic.v;
  // Nếu là đường dẫn tương đối
  const cleanPath = colPic.v.startsWith("/") ? colPic.v : `/${colPic.v}`;
  return `https://manlab.etv.org.vn${cleanPath}`;
}