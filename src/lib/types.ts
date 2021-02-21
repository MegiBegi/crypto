export enum MarketName {
  Binance = "Binance",
  Coinbase = "Coinbase",
  Bitbay = "Bitbay",
}

export type SingleMarketData = {
  marketName: MarketName;
  error?: string;
  data: {
    btcAmount: number;
    errors?: string[];
    USDBidsAmount: number;
    USDAsksAmount: number;
    btcAsksSum: number;
    btcBidsSum: number;
  } | null;
};

export enum BestMarketResultsVariants {
  Sell = "sell",
  Buy = "buy",
}
