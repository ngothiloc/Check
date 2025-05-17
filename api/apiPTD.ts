import { PTDItem } from '../types/ptd';

export const fetchPTDData = async (): Promise<PTDItem[]> => {
  try {
    const response = await fetch('https://manlab.sachhaymoingay.info.vn');
    const data = await response.json();
    return data.ptd;
  } catch (error) {
    console.error('Error fetching PTD data:', error);
    return [];
  }
}; 