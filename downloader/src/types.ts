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
    prices?: Array<Array<number>>
  },
  ETH: {
    prices?: Array<Array<number>>
  },
  LTC: {
    prices?: Array<Array<number>>
  },
  XRP: {
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
    tweets?: Array<TweetObject>
  },
  ETH: {
    tweets?: Array<TweetObject>
  },
  LTC: {
    tweets?: Array<TweetObject>
  },
  XRP: {
    tweets?: Array<TweetObject>
  }
}

// Store Object
interface StoreObject {
  id: string,
  currency?: string,
  price?: Array<number>
}
