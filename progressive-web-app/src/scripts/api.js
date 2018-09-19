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
      return response.data;
    } catch (error) {
      if (typeof error.response !== 'undefined') {
        // Auto logout if 401 response returned from api
        if (error.response.status === 401) {
          await Guard.delete();
          window.location.reload(true);
        }
      }
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

  async handleYql(fetchFn) {
    try {
      let response = await fetchFn();
      if (response.data.error) {
        throw new Error(response.error.description);
      }
      return response.data.query.results;
    } catch (error) {
      throw error;
    }
  }

  async getCity(name = null, limit = 5) {
    let statement = `select woeid, name, country.content from geo.places(${limit}) where text="${name}"`;
    let url = `https://query.yahooapis.com/v1/public/yql?format=json&q=${statement}`;
    const fetchFn = () => axios.get(url);
    return this.handleYql(fetchFn);
  }

  async getForecast(woeid) {
    let statement = `select * from weather.forecast where woeid=${woeid}`;
    let url = `https://query.yahooapis.com/v1/public/yql?format=json&q=${statement}`;
    const fetchFn = () => axios.get(url);
    return this.handleYql(fetchFn);
  }
}
