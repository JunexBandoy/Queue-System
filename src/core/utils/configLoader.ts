import axios from 'axios';
import { Config } from "../../models/Config";

export const loadConfig = async (): Promise<Config> => {
  const response = await axios.get('/config.json');
  return response.data;
};
