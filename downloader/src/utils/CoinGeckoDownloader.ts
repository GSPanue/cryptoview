import axios from 'axios';

/**
 * @name CoinGeckoDownloader
 * @description Class for downloading data from CoinGecko's API.
 */
class CoinGeckoDownloader {
  private api: string;

  constructor(api: string) {
    this.api = api;
  }

  public getApi(): string {
    return this.api;
  }

  public setApi(newApi: string) {
    this.api = newApi;
  }

  public async getData(currency: string) {
    try {
      const response = await axios.get(this.api.replace(':id', currency), {
        params: {
          vs_currency: 'usd',
          days: '365'
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

export default CoinGeckoDownloader;
