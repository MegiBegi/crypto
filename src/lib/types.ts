export enum MarketName {
  Binance = "Binance",
  Coinbase = "Coinbase",
  Bitbay = "Bitbay",
}

export type Result = {
  marketName: MarketName;
  btcAmount: number;
  USDAmount?: number;
  btcAsksSum: number;
  errors?: string[];
};
