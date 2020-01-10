// API Response Object
interface Response {
  [key: string]: any
}

// CoinCap Object
interface CoinCapObject {
  id: string;
  symbol: string;
  priceUsd: string;
}

// Twitter Object
interface TwitterObject {
  statuses?: Array<object>
}

// Tweet Object
interface TweetObject {
  id: number,
  text: string
}

// Cryptocurrency Price Object
interface CryptocurrencyPriceObject {
  BTC: number,
  ETH: number,
  LTC: number,
  XRP: number
}
