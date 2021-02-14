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

export type Results = {
  btcAmount: number;
  errors?: string[];
  bidsBestMarketName: string;
  asksBestMarketName: string;
  bidsBestUSDAmount: number | string;
  asksBestUSDAmount: number | string;
  date: string;
};

export enum BestMarketResultsVariants {
  Sell = "sell",
  Buy = "buy",
}
