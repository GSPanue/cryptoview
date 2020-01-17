import axios from 'axios';

/**
 * @name NomicsDownloader
 * @description Class for downloading data from Nomics' API.
 */
class NomicsDownloader {
  api: string;
  params: object;

  constructor(api: string, params: object) {
    this.api = api;
    this.params = params;
  }

  async getData(ticker: String) {
    try {
      const response = await axios.get(this.api, {
        params: {
          ...this.params,
          currency: ticker
        }
      });

      return response;
    }
    catch (error) {
      console.log(`Could not get data from the following web service: ${this.api}`);
      console.log(`Reason: ${error.message}`);

      return Promise.reject(new Error(error));
    }
  }
}

export default NomicsDownloader;
