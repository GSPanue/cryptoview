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

    try {
      console.log('Checking if price and tweet data exist...');

      // Check if price and tweet data exist
      const hasNoPrices = await this.database.isEmpty('prices');
      const hasNoTweets = await this.database.isEmpty('tweets');

      console.log('Check complete.\n');

      // Download missing data
      if (hasNoPrices || hasNoTweets) {
        const shouldDownloadAll: boolean = hasNoPrices && hasNoTweets;
        const logString: string = ((shouldDownloadAll) ? 'price and tweet' : ((hasNoPrices) ? 'price' : 'tweet'));

        console.log(`Downloading initial ${logString} data...`);

        // Get price data from 1 year ago
        const priceFrom: number = this.getTimestampInSeconds(this.subtractDaysFromDate(new Date(), 365));
        const priceTo: number = this.getTimestampInSeconds(new Date());

        const prices: PricesObject = await this.getPrices(coinGeckoDownloader, priceFrom, priceTo);
        const tweets: TweetsObject = await this.getTweets(twitterDownloader);

        console.log(`Downloaded initial ${logString} data.\n`);
        console.log(`Storing initial ${logString} data...`);

        await Promise.all([
          (hasNoPrices) && this.storePriceData(prices),
          (hasNoTweets) && this.storeTweetData(tweets)
        ]);

        console.log(`Stored initial ${logString} data.\n`);
      }

      console.log('Started loop with 10s delay.\n');

      // Download new data every 10 seconds
      setInterval(async () => {
        console.log('Obtaining most recent price timestamp...');

        const nextTimestamp: number = await this.getNextTimestamp(['BTC', 'ETH', 'LTC', 'XRP']);

        console.log('Obtained most recent price timestamp.\n');
        console.log('Downloading new price and tweet data...');

        // Get price data from the last timestamp
        const priceFrom: number = this.getTimestampInSeconds(new Date(nextTimestamp));
        const priceTo: number = this.getTimestampInSeconds(new Date());

        const prices: PricesObject = await this.getPrices(coinGeckoDownloader, priceFrom, priceTo);
        const tweets: TweetsObject = await this.getTweets(twitterDownloader);

        console.log('Downloaded new price and tweet data.\n');
        console.log('Storing new price and tweet data...');

        const [newPriceData, newTweetData] = await Promise.all([
          this.storePriceData(prices),
          this.storeTweetData(tweets)
        ]);

        const hasNewPriceAndTweetData: boolean = (newPriceData.length > 0 && newTweetData.length > 0);
        const hasNewData: boolean = (newPriceData.length > 0 || newTweetData.length > 0);
        const hasNewPriceData: boolean = newPriceData.length > 0;

        if (hasNewPriceAndTweetData) {
          console.log('Stored new price and tweet data.\n');
        }
        else {
          console.log(
            (hasNewData) ? `Stored new ${(hasNewPriceData) ? 'price' : 'tweet'} data.\n` :
            'No new data was stored.\n'
          );
        }
      }, 10000);
    }
    catch(error) {
      console.log(error);
      console.log('Program terminating...');
      return;
    }
  }

  private createCoinGeckoDownloader(): CoinGeckoDownloader {
    return new CoinGeckoDownloader(
      'https://api.coingecko.com/api/v3/coins/:id/market_chart/range'
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

  private async getPrices(coinGeckoDownloader: CoinGeckoDownloader, from: number, to: number): Promise<PricesObject> {
    // Create promises
    const cryptocurrencyPromises = [
      coinGeckoDownloader.getData('bitcoin', from, to),
      coinGeckoDownloader.getData('ethereum', from, to),
      coinGeckoDownloader.getData('litecoin', from, to),
      coinGeckoDownloader.getData('ripple', from, to)
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

  private async storePriceData(prices: PricesObject) {
    // Merge and flatten price data
    let mergedData = [].concat.apply([], Object.keys(prices).map((ticker) => {
      const list = prices[ticker];

      return list.prices.map((price: Array<number>) => {
        return {
          id: v4(),
          timestamp: price[0],
          name: list.name,
          ticker,
          data: {
            timestamp: price[0],
            price: price[1]
          }
        }
      });
    }));

    const uniqueData = (await Promise.all(mergedData.map(async (data: StoreObject) => {
      const exists: boolean = await this.database.priceExists(data);

      return (!exists) && data;
    }))).filter(Boolean);

    return Promise.all(uniqueData.map((data: StoreObject) => {
      return this.database.store(data, 'prices');
    }));
  }

  private async storeTweetData(tweets: TweetsObject) {
    let mergedData = [].concat.apply([], Object.keys(tweets).map((ticker) => {
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

    const uniqueData = (await Promise.all(mergedData.map(async (data: StoreObject) => {
      const exists: boolean = await this.database.tweetExists(data);

      return (!exists) && data;
    }))).filter(Boolean);

    return Promise.all(uniqueData.map((data: StoreObject) => {
      return this.database.store(data, 'tweets');
    }));
  }

  private async getNextTimestamp(tickers: Array<string>) {
    return this.findMode(await Promise.all(tickers.map((ticker: string) => (
      this.database.findLatestTimestamp(ticker)
    ))));
  }

  private subtractDaysFromDate(date: Date, days: number): Date {
    date.setDate(date.getDate() - days);

    return date;
  }

  private getTimestampInSeconds(date: Date): number {
    return Math.floor(+date / 1000);
  }

  private findMode(numbers: Array<number>): number {
    let counted: any = numbers.reduce((acc: any, curr) => {
        if (curr in acc) {
            acc[curr]++;
        } else {
            acc[curr] = 1;
        }

        return acc;
    }, {});

    let mode: string = Object.keys(counted).reduce((a, b) => counted[a] > counted[b] ? a : b);

    return Number(mode);
  }
}

export default Main;
