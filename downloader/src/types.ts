// CoinGecko Object
interface CoinGeckoObject {
  data: {
    prices: Array<Array<number>>
  }
}

// Prices Object
interface PricesObject {
  [index: string]: any,
  BTC: {
    name: string,
    ticker: string,
    prices?: Array<Array<number>>
  },
  ETH: {
    name: string,
    ticker: string,
    prices?: Array<Array<number>>
  },
  LTC: {
    name: string,
    ticker: string,
    prices?: Array<Array<number>>
  },
  XRP: {
    name: string,
    ticker: string,
    prices?: Array<Array<number>>
  }
}

// Twitter Object
interface TwitterObject {
  statuses?: Array<object>
}

// Tweet Object
interface TweetObject {
  text: string,
  created_at?: string,
  timestamp?: number
}

// Tweets Object
interface TweetsObject {
  [index: string]: any,
  BTC: {
    name: string,
    ticker: string,
    tweets?: Array<TweetObject>
  },
  ETH: {
    name: string,
    ticker: string,
    tweets?: Array<TweetObject>
  },
  LTC: {
    name: string,
    ticker: string,
    tweets?: Array<TweetObject>
  },
  XRP: {
    name: string,
    ticker: string,
    tweets?: Array<TweetObject>
  }
}

// Store Object
interface StoreObject {
  id: string,
  currency?: string,
  price?: Array<number>
}
