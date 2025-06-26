export interface StaffImage {
  uri: string;
}

export interface PTDItem {
  id: string;
  user_id: string;
  deviceName: string;
  status: string;
  companyName: string;
  model: string;
  serial: string;
  date: string; // Consider using Date type if you parse it
  requirement: string;
  receiveStatus: string;
  returnStatus: string;
  bbdStatus: string;
  certificateNumber: string;
  sealNumber: string;
  image: string; // URL string
  staffName: string;
} 