import { DBInterface, Downloader } from './utils';

/**
 * @name Main
 * @description Main class.
 */
class Main {
  dbInterface: DBInterface;
  shouldStoreData: boolean = true;

  constructor() {
    this.dbInterface = new DBInterface(process.env.username, process.env.password);
  }

  async start() {
    const downloaders: Array<Downloader> = this.createDownloaders();

    try {
      const [coinMarketCapData, coinlayerData] = await Promise.all(downloaders.map((downloader) => {
        return downloader.getData();
      }));
    }
    catch {
      console.log('reached!!');
      this.shouldStoreData = false;
    }
  }

  createDownloaders(): Array<Downloader> {
    const coinMarketCapDownloader = new Downloader('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.coinMarketCapKey
      },
      params: {
        symbol: 'BTC,ETH,LTC,XRP'
      }
    });

    const coinlayerDownloader = new Downloader('http://api.coinlayer.com/api/live', {
      params: {
        access_key: process.env.coinlayerKey,
        symbols: 'BTC,ETH,LTC,XRP'
      }
    });

    return [coinMarketCapDownloader, coinlayerDownloader];
  }
}

export default Main;
