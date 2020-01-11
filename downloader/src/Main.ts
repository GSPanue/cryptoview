import { v4 } from 'uuid';
import { DBInterface, APIDownloader, TwitterDownloader } from './utils';

/**
 * @name Main
 * @description Main class.
 */
class Main {
  dbInterface: DBInterface;
  shouldStoreData: boolean = true;

  constructor() {
    this.dbInterface = new DBInterface();
  }

  async start() {
    const APIDownloaders: Array<APIDownloader> = this.createAPIDownloaders();
    const twitterDownloader: TwitterDownloader = this.createTwitterDownloader();

    let tweets: Array<Array<TweetObject>>;
    let cryptocurrencyPrices: CryptocurrencyPriceObject;

    try {
      tweets = await this.getTweets(twitterDownloader);
      cryptocurrencyPrices = await this.getCryptocurrencyPrices(APIDownloaders);
    }
    catch {
      this.shouldStoreData = false;
    }

    if (this.shouldStoreData) {
      const bitcoinTweets = tweets[0];
      const ethereumTweets = tweets[1];
      const litecoinTweets = tweets[2];
      const rippleTweets = tweets[3];

      await Promise.all([
        this.dbInterface.store('TwitterData', bitcoinTweets),
        this.dbInterface.store('TwitterData', ethereumTweets),
        this.dbInterface.store('TwitterData', litecoinTweets),
        this.dbInterface.store('TwitterData', rippleTweets),
        this.dbInterface.store('CryptoPrices', [cryptocurrencyPrices])
      ]);
    }
  }

  createAPIDownloaders(): Array<APIDownloader> {
    const coinMarketCapDownloader = new APIDownloader('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.coinMarketCapKey
      },
      params: {
        symbol: 'BTC,ETH,LTC,XRP'
      }
    });

    const coinlayerDownloader = new APIDownloader('http://api.coinlayer.com/api/live', {
      params: {
        access_key: process.env.coinlayerKey,
        symbols: 'BTC,ETH,LTC,XRP'
      }
    });

    const coinCapDownloader = new APIDownloader('https://api.coincap.io/v2/assets', {
      params: {
        ids: 'bitcoin,ethereum,litecoin,ripple'
      }
    });

    const cryptoCompareDownloader = new APIDownloader('https://min-api.cryptocompare.com/data/pricemulti', {
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

  createTwitterDownloader(): TwitterDownloader {
    return new TwitterDownloader(
      process.env.twitterConsumerKey,
      process.env.twitterConsumerSecret,
      process.env.twitterAccessTokenKey,
      process.env.twitterAccessTokenSecret
    );
  }

  async getTweets(twitterDownloader: TwitterDownloader): Promise<Array<Array<TweetObject>>> {
    // Create promises
    const tweetPromises = [
      twitterDownloader.searchTweets('Bitcoin $BTC'),
      twitterDownloader.searchTweets('Ethereum $ETH'),
      twitterDownloader.searchTweets('Litecoin $LTC'),
      twitterDownloader.searchTweets('Ripple $XRP')
    ];

    // Download data from Twitter
    const [
      bitcoinTwitterData,
      ethereumTwitterData,
      litecoinTwitterData,
      rippleTwitterData
    ] = await Promise.all(tweetPromises);

    // Remove redundant data
    const bitcoinTweets = this.processTwitterData(bitcoinTwitterData, 'BTC');
    const ethereumTweets = this.processTwitterData(ethereumTwitterData, 'ETH');
    const litecoinTweets = this.processTwitterData(litecoinTwitterData, 'LTC');
    const rippleTweets = this.processTwitterData(rippleTwitterData, 'XRP');

    return [
      bitcoinTweets,
      ethereumTweets,
      litecoinTweets,
      rippleTweets
    ];
  }

  processTwitterData(twitterData: TwitterObject, currency: string): Array<TweetObject> {
    return twitterData.statuses.map((tweet: TweetObject) => ({
      id: tweet.id,
      currency,
      text: tweet.text
    }));
  }

  async getCryptocurrencyPrices(apiDownloaders: Array<APIDownloader>): Promise<CryptocurrencyPriceObject> {
    // Download data from APIs
    const [
      coinMarketCapData,
      coinlayerData,
      coinCapData,
      cryptoCompareData
    ] = await Promise.all(apiDownloaders.map((apiDownloader) => {
      return apiDownloader.getData();
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

    return {
      id: v4(),
      BTC: averageBTC,
      ETH: averageETH,
      LTC: averageLTC,
      XRP: averageXRP
    };
  }

  getAverageQuote(quotes: Array<any>, symbol: string): number {
    let sum: number = 0;

    sum += parseFloat(quotes[0][symbol].quote.USD.price.toString());
    sum += parseFloat(quotes[1][symbol].toString());
    sum += parseFloat(quotes[2][
      quotes[2].findIndex((currency: CoinCapObject) => (currency.symbol === symbol))
    ].priceUsd.toString());
    sum += parseFloat(quotes[3][symbol].USD.toString());

    const average: number = sum / 4;

    // Truncate and return average to 2 decimal places without rounding
    return Math.trunc(average * Math.pow(10, 2)) / Math.pow(10, 2);
  }
}

export default Main;
