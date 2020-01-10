import axios from 'axios';

/**
 * @name APIDownloader
 * @description Class for downloading data from an API.
 */
class APIDownloader {
  api: string;
  params: object;

  constructor(api: string, params: object) {
    this.api = api;
    this.params = params;
  }

  async getData(): Promise<Response> {
    try {
      return await axios.get(this.api, { ...this.params });
    }
    catch (error) {
      console.log(`Could not get data from the following web service: ${this.api}`);
      console.log(`Reason: ${error.message}`);

      return Promise.reject(new Error(error));
    }
  }
}

export default APIDownloader;
