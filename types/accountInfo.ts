// Kiểu cho từng trường dạng object
export interface AccountField {
  v: string; // Giá trị thực
  r?: string; // Có thể là HTML hoặc chuỗi mô tả
  s?: number;
  e?: number;
  n?: number;
  u?: number;
}

// Kiểu cho dữ liệu tài khoản lấy từ API
export interface AccountInfo {
  ID: string;
  AllowLogin: AccountField;
  ChucDanh: AccountField;
  CoverImage: AccountField;
  ID_Project_Active: AccountField;
  ImageSign: AccountField;
  KhachHang: AccountField;
  ManLabDonVi: AccountField;
  NhanSu: AccountField;
  SoDT: AccountField;
  TenHT: AccountField;
  action_data: string;
  allowedit: number;
  colName: AccountField;
  colPic: AccountField;
  colType: AccountField;
  state: number;
  // Có thể còn các trường khác, thêm vào nếu cần
}