import axios from 'axios';

// Get current hostname to allow access from other devices in the same network
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:5000/api`;
};

const API_BASE_URL = getApiBaseUrl();

export interface StockHistory {
  date: string;
  close: number;
}

export interface StockData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
  history: StockHistory[];
}

export const fetchStocks = async (): Promise<StockData[]> => {
  const response = await axios.get(`${API_BASE_URL}/stocks`);
  return response.data;
};
