export interface PTDItem {
  image: string;
  deviceName: string;
  status: string;
  companyName: string;
  model: string;
  serial: string;
  staffImages: { uri: string }[];
  date: string;
  requirement: string;
  receiveStatus: string;
  returnStatus: string;
  bbdStatus: string;
  certificateNumber: string;
  sealNumber: string;
} 