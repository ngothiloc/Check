import AsyncStorage from '@react-native-async-storage/async-storage';
import { PTDItem } from '../types/ptd';

// Hàm fetch dữ liệu PTD, truyền thêm params filter (ví dụ: { status: 1 })
export const fetchPTDData = async (filters: any = {}): Promise<PTDItem[]> => {
  try {
    return await fetchPTDDataFromAPI(1, filters);
  } catch (error) {
    console.error('Error fetching PTD data:', error);
    return [];
  }
};

// Hàm fetch dữ liệu PTD từ API, truyền page và params filter
export const fetchPTDDataFromAPI = async (page = 1, filters: any = {}) => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    if (!userDataString) {
      console.error('No user data found in AsyncStorage');
      return [];
    }

    const userData = JSON.parse(userDataString);
    const userIdString = userData.accountId || userData.id || userData.ID;
    if (!userIdString) {
      console.error('No accountId found in user data');
      return [];
    }

    // Xây dựng filterParam cho API
    let filterParam = `(TaiKhoanKH=${userIdString})`;
    if (filters.status) {
      filterParam = `(TrangThai_CBCC=${filters.status} PHEPVA TaiKhoanKH=${userIdString})`;
    }

    const apiUrl = `https://manlab.etv.org.vn/DataTable/DatajqGrid?tbName=vw_vw_qlManLab_ListGCN_GuiMail_TheoPNT_KhachHang&${filterParam}&moreExp=&morefilter=&MaGiayChungNhan_filter=&SoTem_filter=&WorkFlowStatus_filter=-1&IDPhuongTienDo_filter=-1&PhieuNhanTra_Id_filter=-1&CanhBaoNgayHieuChuan_filter=&TrangThai_CBCC_filter=-1&SoSanXuat_filter=&_search=false&nd=${Date.now()}&rows=30&page=${page}&sidx=&sord=asc&_=${Date.now()}`;
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const rows = data.rowsvw_vw_qlManLab_ListGCN_GuiMail_TheoPNT_KhachHang || [];
    if (!Array.isArray(rows)) {
      console.error('Invalid API response format, rows is not an array:', data);
      return [];
    }

    const ptdItems: PTDItem[] = rows.map((item: any, index: number) => {
      const id = `ptd-${index}-${Date.now()}`;
      const phuongTienDo = item.IDPhuongTienDo && item.IDPhuongTienDo.r ? item.IDPhuongTienDo.r : 'Không xác định';
      const donViGuiMau = item.DonViGuiMau && item.DonViGuiMau.r ? item.DonViGuiMau.r : 'Không xác định';

      // Lấy ảnh base64 từ trường BangChung nếu có, nếu không thì fallback về ảnh mặc định
      let imageUri = 'https://via.placeholder.com/300x300?text=No+Image';
      if (item.BangChung && item.BangChung.r) {
        // Tách src từ chuỗi HTML
        const match = item.BangChung.r.match(/src="([^"]+)"/);
        if (match && match[1]) {
          imageUri = match[1];
        }
      }

      return {
        id: id,
        user_id: id,
        deviceName: phuongTienDo,
        status: item.TrangThai_CBCC && item.TrangThai_CBCC.r ?
          (typeof item.TrangThai_CBCC.r === 'string' && item.TrangThai_CBCC.r.includes('<') ?
            item.TrangThai_CBCC.r.replace(/<[^>]*>/g, '').trim() :
            item.TrangThai_CBCC.r) :
          'không xác định',
        companyName: donViGuiMau,
        model: item.Model && item.Model.r ? item.Model.r : 'Không xác định',
        serial: item.SoSanXuat && item.SoSanXuat.r ? item.SoSanXuat.r : 'Không xác định',
        date:
          item.NguoiDuyet_Merge && item.NguoiDuyet_Merge.r
            ? (() => {
                const match = item.NguoiDuyet_Merge.r.match(/(\d{2}\/\d{2}\/\d{4})$/);
                return match ? match[1] : '';
              })()
            : '',
        requirement: 'Kiểm định định kỳ',
        receiveStatus: 'Đã nhận',
        returnStatus: 'Chưa trả',
        bbdStatus: 'Đang xử lý',
        certificateNumber: item.MaGiayChungNhan && item.MaGiayChungNhan.r ? item.MaGiayChungNhan.r : 'N/A',
        sealNumber: item.SoTem && item.SoTem.r ? item.SoTem.r : 'Không xác định',
        image: imageUri,
        staffName:
          item.NguoiSoatXet_Merge && item.NguoiSoatXet_Merge.r
            ? (() => {                
                const match = item.NguoiSoatXet_Merge.r.match(/^(.+?)\s\d{2}:\d{2}\s\d{2}\/\d{2}\/\d{4}$/);
                return match ? match[1] : item.NguoiSoatXet_Merge.r;
              })()
            : 'Không xác định',
      };
    });

    return ptdItems;
  } catch (error) {
    console.error('Error fetching PTD data from API:', error);
    return [];
  }
};