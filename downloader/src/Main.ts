import { v4 } from 'uuid';
import { Database, CoinGeckoDownloader, TwitterDownloader } from './utils';

/**
 * @name Main
 * @description Main class.
 */
class Main {
  private database: Database;

  constructor() {
    this.database = new Database();
  }

  public async start() {
    const coinGeckoDownloader: CoinGeckoDownloader = this.createCoinGeckoDownloader();
    const twitterDownloader: TwitterDownloader = this.createTwitterDownloader();

    let prices: PricesObject;
    let tweets: TweetsObject;

    try {
      prices = await this.getPrices(coinGeckoDownloader);
      tweets = await this.getTweets(twitterDownloader);

      await Promise.all([
        this.storePriceData(prices),
        this.storeTweetData(tweets)
      ]);

      console.log('Successfully stored prices and tweets.');
    }
    catch(error) {
      console.log(error);
      console.log('Program terminating...');
      return;
    }
  }

  private createCoinGeckoDownloader(): CoinGeckoDownloader {
    return new CoinGeckoDownloader(
      'https://api.coingecko.com/api/v3/coins/:id/market_chart'
    );
  }

  private createTwitterDownloader(): TwitterDownloader {
    return new TwitterDownloader(
      process.env.twitterConsumerKey,
      process.env.twitterConsumerSecret,
      process.env.twitterAccessTokenKey,
      process.env.twitterAccessTokenSecret
    );
  }

  private async getPrices(coinGeckoDownloader: CoinGeckoDownloader): Promise<PricesObject> {
    // Create promises
    const cryptocurrencyPromises = [
      coinGeckoDownloader.getData('bitcoin'),
      coinGeckoDownloader.getData('ethereum'),
      coinGeckoDownloader.getData('litecoin'),
      coinGeckoDownloader.getData('ripple')
    ];

    // Download data from CoinGecko API
    const [
      coinGeckoBitcoinData,
      coinGeckoEthereumData,
      coinGeckoLitecoinData,
      coinGeckoRippleData
    ] = await Promise.all(cryptocurrencyPromises);

    // Remove redundant data
    const bitcoinPrices = this.processCoinGeckoData(coinGeckoBitcoinData);
    const ethereumPrices = this.processCoinGeckoData(coinGeckoEthereumData);
    const litecoinPrices = this.processCoinGeckoData(coinGeckoLitecoinData);
    const ripplePrices = this.processCoinGeckoData(coinGeckoRippleData);

    return {
      BTC: {
        name: 'Bitcoin',
        ticker: 'BTC',
        prices: bitcoinPrices
      },
      ETH: {
        name: 'Ethereum',
        ticker: 'ETH',
        prices: ethereumPrices
      },
      LTC: {
        name: 'Litecoin',
        ticker: 'LTC',
        prices: litecoinPrices
      },
      XRP: {
        name: 'Ripple',
        ticker: 'XRP',
        prices: ripplePrices
      }
    };
  }

  private async getTweets(twitterDownloader: TwitterDownloader): Promise<TweetsObject> {
    // Create promises
    const tweetPromises = [
      twitterDownloader.searchTweets('Bitcoin $BTC'),
      twitterDownloader.searchTweets('Ethereum $ETH'),
      twitterDownloader.searchTweets('Litecoin $LTC'),
      twitterDownloader.searchTweets('Ripple $XRP')
    ];

    // Download data from Twitter API
    const [
      twitterBitcoinData,
      twitterEthereumData,
      twitterLitecoinData,
      twitterRippleData
    ] = await Promise.all(tweetPromises);

    // Remove redundant data
    const bitcoinTweets = this.processTwitterData(twitterBitcoinData);
    const ethereumTweets = this.processTwitterData(twitterEthereumData);
    const litecoinTweets = this.processTwitterData(twitterLitecoinData);
    const rippleTweets = this.processTwitterData(twitterRippleData);

    return {
      BTC: {
        name: 'Bitcoin',
        ticker: 'BTC',
        ...bitcoinTweets,
      },
      ETH: {
        name: 'Ethereum',
        ticker: 'ETH',
        ...ethereumTweets,
      },
      LTC: {
        name: 'Litecoin',
        ticker: 'LTC',
        ...litecoinTweets,
      },
      XRP: {
        name: 'Ripple',
        ticker: 'XRP',
        ...rippleTweets
      }
    };
  }

  private processCoinGeckoData(coinGeckoData: CoinGeckoObject): Array<Array<number>> {
    return coinGeckoData.data.prices;
  }

  private processTwitterData(twitterData: TwitterObject): object {
    const tweets: Array<TweetObject> = twitterData.statuses.map((tweet: TweetObject) => ({
      text: tweet.text,
      timestamp: Date.parse(tweet.created_at)
    }));

    return {
      tweets
    };
  }

  private storePriceData(prices: PricesObject) {
    // Merge and flatten price data
    const mergedData = [].concat.apply([], Object.keys(prices).map((ticker) => {
      const list = prices[ticker];

      return list.prices.map((price: Array<number>) => {
        return {
          id: v4(),
          name: list.name,
          ticker,
          data: {
            timestamp: price[0],
            price: price[1]
          }
        }
      });
    }));

    return Promise.all(mergedData.map((data: StoreObject) => {
      return this.database.store(data, 'prices');
    }));
  }

  private storeTweetData(tweets: TweetsObject) {
    const mergedData = [].concat.apply([], Object.keys(tweets).map((ticker) => {
      const list = tweets[ticker];

      return list.tweets.map((tweet: TweetObject) => {
        return {
          id: v4(),
          name: list.name,
          ticker,
          ...tweet
        };
      });
    }));

    return Promise.all(mergedData.map((data: StoreObject) => {
      return this.database.store(data, 'tweets');
    }));
  }
}

export default Main;
