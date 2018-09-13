import axios from 'axios';
import configs from 'configs';
import Guard from './guard';

export default class Api {
  constructor() {
    this.apiUrl = configs.apiUrl;
  }

  async getConfig() {
    let user = await Guard.get();
    return {
      headers: { 'Authorization': `Bearer ${user.password}` }
    };
  }

  async handle(fetchFn) {
    try {
      let response = await fetchFn();
      // Auto logout if 401 response returned from api
      if (response.status === 401) {
        await Guard.delete();
        window.location.reload(true);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signIn(payload) {
    const fetchFn = () => axios.post(`${this.apiUrl}/sign-in`, payload);
    return this.handle(fetchFn);
  }

  async signUp(payload) {
    const fetchFn = () => axios.post(`${this.apiUrl}/sign-up`, payload);
    return this.handle(fetchFn);
  }

  async signOut() {
    let config = await this.getConfig();
    const fetchFn = () => axios.get(`${this.apiUrl}/sign-out`, config);
    return this.handle(fetchFn);
  }

  async cryptocurrencies() {
    let config = await this.getConfig();
    const fetchFn = () => axios.get(`${this.apiUrl}/cryptocurrencies`, config);
    return this.handle(fetchFn);
  }

  async cryptocurrenciesShow(symbol) {
    let config = await this.getConfig();
    const fetchFn = () => axios.get(`${this.apiUrl}/cryptocurrencies/${symbol}`, config);
    return this.handle(fetchFn);
  }
}
