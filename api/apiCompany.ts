import { Company } from "../types/company";

const BASE_URL = "https://checkpro.manlab.vn/auth.php";

export const getCompanyByUserId = async (userId: string): Promise<Company | null> => {
  try {
    const response = await fetch(`${BASE_URL}?route=company&user_id=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching company:", error);
    return null;
  }
};

export const createCompany = async (companyData: Partial<Company>): Promise<Company | null> => {
  try {
    const response = await fetch(`${BASE_URL}?route=company&user_id=${companyData.user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: companyData.name || "",
        email: companyData.email || "",
        phone: companyData.phone || "",
        province: companyData.province || "",
        district: companyData.district || "",
        ward: companyData.ward || "",
        street: companyData.street || "",
        img: companyData.img || "",
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Create company response:', data);
    return data;
  } catch (error) {
    console.error("Error creating company:", error);
    return null;
  }
};

export const updateCompany = async (companyData: Partial<Company>): Promise<Company | null> => {
  try {
    const response = await fetch(`${BASE_URL}?route=company&user_id=${companyData.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: companyData.id,
        name: companyData.name || "",
        email: companyData.email || "",
        phone: companyData.phone || "",
        province: companyData.province || "",
        district: companyData.district || "",
        ward: companyData.ward || "",
        street: companyData.street || "",
        img: companyData.img || "",
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Update company response:', data);
    return data;
  } catch (error) {
    console.error("Error updating company:", error);
    return null;
  }
};
