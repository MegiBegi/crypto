import { getMarketData } from "./marketData";
import { MarketName, SingleMarketData } from "./types";
import { BestMarket } from "../generated/types";

describe("getMarketData", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2021-02-14T09:10:31.914Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("tests result for all data available for BTC2", () => {
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

    const marketDataMock: BestMarket = {
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

  it("tests result for sell offers only available at Coinbase BTC200", () => {
    const marketListMock: SingleMarketData[] = [
      {
        marketName: MarketName.Coinbase,
        data: {
          btcAmount: 200,
          USDBidsAmount: 150000,
          USDAsksAmount: 100000,
          btcBidsSum: 200,
          btcAsksSum: 180,
        },
      },
      {
        marketName: MarketName.Bitbay,
        data: {
          btcAmount: 200,
          USDBidsAmount: 40000,
          USDAsksAmount: 60000,
          btcBidsSum: 120,
          btcAsksSum: 100,
        },
      },
      {
        marketName: MarketName.Binance,
        data: {
          btcAmount: 200,
          USDBidsAmount: 170000,
          USDAsksAmount: 149000,
          btcBidsSum: 199,
          btcAsksSum: 176,
        },
      },
    ];

    const marketDataMock: BestMarket = {
      btcAmount: 200,
      errors: [
        "Sorry, sell offers at Bitbay are limited to ₿120 sold for $40,000",
        "Sorry, sell offers at Binance are limited to ₿199 sold for $170,000",
        "Sorry, buy offers at Coinbase are limited to ₿180 sold for $100,000",
        "Sorry, buy offers at Bitbay are limited to ₿100 sold for $60,000",
        "Sorry, buy offers at Binance are limited to ₿176 sold for $149,000",
      ],
      asksBestMarketName: "No results",
      bidsBestMarketName: MarketName.Coinbase,
      bidsBestUSDAmount: 150000,
      asksBestUSDAmount: null,
      date: "10:10:31",
    };

    const marketData = getMarketData({
      btcAmount: 200,
      marketList: marketListMock,
    });

    expect(marketData).toEqual(marketDataMock);
  });
});
