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
      // Download data from APIs
      const [
        coinMarketCapData,
        coinlayerData,
        coinCapData,
        cryptoCompareData
      ] = await Promise.all(downloaders.map((downloader) => {
        return downloader.getData();
      }));

      // Get quotes from data
      const coinMarketCapQuotes = coinMarketCapData.data.data;
      const coinlayerQuotes = coinlayerData.data.rates;
      const coinCapQuotes = coinCapData.data.data;
      const cryptoCompareQuotes = cryptoCompareData.data;

      const quotes = [
        coinMarketCapQuotes,
        coinlayerQuotes,
        coinCapQuotes,
        cryptoCompareQuotes
      ];

      // Get averages
      const averageBTC = this.getAverageQuote(quotes, 'BTC');
      const averageETH = this.getAverageQuote(quotes, 'ETH');
      const averageLTC = this.getAverageQuote(quotes, 'LTC');
      const averageXRP = this.getAverageQuote(quotes, 'XRP');
    }
    catch (err) {
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

    const coinCapDownloader = new Downloader('https://api.coincap.io/v2/assets', {
      params: {
        ids: 'bitcoin,ethereum,litecoin,ripple'
      }
    });

    const cryptoCompareDownloader = new Downloader('https://min-api.cryptocompare.com/data/pricemulti', {
      params: {
        api_key: process.env.cryptoCompareKey,
        fsyms: 'BTC,ETH,LTC,XRP',
        tsyms: 'USD'
      }
    });

    return [
      coinMarketCapDownloader,
      coinlayerDownloader,
      coinCapDownloader,
      cryptoCompareDownloader
    ];
  }

  getAverageQuote(quotes: Array<any>, symbol: string): number {
    let sum: number = 0;

    sum += parseFloat(quotes[0][symbol].quote.USD.price.toString());
    sum += parseFloat(quotes[1][symbol].toString());
    sum += parseFloat(quotes[2][
      quotes[2].findIndex((currency: CoinCapObject) => (currency.symbol === symbol))
    ].priceUsd.toString());
    sum += parseFloat(quotes[3][symbol].USD.toString());

    return sum / 4;
  }
}

export default Main;
