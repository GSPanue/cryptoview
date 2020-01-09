// API Response Object
interface Response {
  [key: string]: any
}

// CoinMarketCap Object
interface coinMarketCapObject {
  [key: string]: {
    quote: {
      USD: {
        price: number
      }
    }
  }
}

// coinlayer Object
interface coinlayerObject {
  rates: {
    BTC: number,
    ETH: number,
    LTC: number,
    XRP: number
  }
}
