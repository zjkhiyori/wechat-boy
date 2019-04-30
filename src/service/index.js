import axios from 'axios';
import {
  TIANQI_URL,
  TIANQI_CITY,
  TIANQI_LOCATION,
  TULING_API,
  TULING_API_KEY,
  TULING_ERROR_MESSAGE,
} from '../config';

export default class Service {
  static async get(url, params) {
    let response;
    try {
      response = await axios.get(url, params);
      console.log('------------success-----------');
      console.log(`${response.status}\n${response.statusText}\n${JSON.stringify(response.data, null, 2)}\n`)
    } catch (e) {
      console.log('------------error-------------');
      console.error(e);
      throw e
    }
    return response.data;

  }

  static async getWeather() {
    let response;
    try {
      response = await this.get(TIANQI_URL + TIANQI_CITY + '/' + TIANQI_LOCATION)

    } catch (e) {
      throw e
    }
    return response;
  }

  static async reply(content) {
    let response;
    try {
      const data = await this.get(TULING_API, {
        params: {
          key: TULING_API_KEY,
          info: content,
        }
      });
      if (data.code === 100000) {
        response = data.text;
      } else {
        throw new Error(TULING_ERROR_MESSAGE);
      }
    } catch (e) {
      response = e.message;
    }
    return response;
  }
}
