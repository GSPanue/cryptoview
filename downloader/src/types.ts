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

// Tweet Object
interface TweetObject {
  id: number,
  text: string
}
