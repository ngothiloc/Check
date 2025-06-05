import { PTDItem } from "./ptd";

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: string;
  created_at: string;
}

export interface BasicUserData {
  id: string;
  name: string;
  email: string;
}

export interface CompanyData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  img: string;
}

export interface FullUserData extends BasicUserData {
  phone: string;
  sex: string;
  img: string;
  role?: string;
  company: CompanyData;
  ptd: PTDItem[];
  notifications?: Notification[];
} 