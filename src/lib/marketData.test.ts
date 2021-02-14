import { getMarketData } from "./marketData";
import { MarketName, SingleMarketData, Results } from "./types";

describe("getMarketData", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2021-02-14T09:10:31.914Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it.only("tests result for all data available for BTC2", () => {
    const marketListMock: SingleMarketData[] = [
      {
        marketName: MarketName.Coinbase,
        data: {
          btcAmount: 2,
          USDBidsAmount: 100,
          USDAsksAmount: 100.5,
          btcAsksSum: 2,
          btcBidsSum: 2,
        },
      },
      {
        marketName: MarketName.Bitbay,
        data: {
          btcAmount: 2,
          USDBidsAmount: 100.33,
          USDAsksAmount: 100.9,
          btcAsksSum: 2,
          btcBidsSum: 2,
        },
      },
      {
        marketName: MarketName.Binance,
        data: {
          btcAmount: 2,
          USDBidsAmount: 100.43,
          USDAsksAmount: 101,
          btcAsksSum: 2,
          btcBidsSum: 2,
        },
      },
    ];

    const marketDataMock: Results = {
      btcAmount: 2,
      errors: [],
      bidsBestMarketName: MarketName.Binance,
      asksBestMarketName: MarketName.Coinbase,
      bidsBestUSDAmount: 100.43,
      asksBestUSDAmount: 100.5,
      date: "10:10:31",
    };

    const marketData = getMarketData({
      btcAmount: 2,
      marketList: marketListMock,
    });

    expect(marketData).toEqual(marketDataMock);
  });
});
