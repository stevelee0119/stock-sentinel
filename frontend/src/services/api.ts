import axios from 'axios';

// Use environment variable for production, fallback to dynamic local IP for development
const getApiBaseUrl = () => {
  // VITE_API_URL will be set in Vercel/Netlify environment settings
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
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
  marketState?: string;
  history: StockHistory[];
}

export const fetchStocks = async (): Promise<StockData[]> => {
  const response = await axios.get(`${API_BASE_URL}/stocks`);
  return response.data;
};
