import { Results, SingleMarketData } from "./types";

import getBinancePrice from "./calculations/binance-calculations";
import getCoinbasePrice from "./calculations/coinbase-calculations";
import getBitbayPrice from "./calculations/bitbay-calculations";

const getErrors = ({
  marketList,
}: {
  marketList: SingleMarketData[];
}): string[] => {
  const errors = [];
  const marketAsksWithOutOffers = marketList.filter(
    (market) => !market || market.btcAsksSum !== market.btcAmount
  );

  const marketBidsWithOutOffers = marketList.filter(
    (market) => !market || market.btcBidsSum !== market.btcAmount
  );

  marketBidsWithOutOffers.forEach((market) => {
    if (market.error) {
      errors.push(
        `Sorry, sell offers at ${market.marketName} are currently unavailable`
      );
      return;
    }

    errors.push(
      `Sorry, sell offers at ${
        market.marketName
      } are limited to ₿${market.btcBidsSum.toLocaleString()} sold for $${market.USDBidsAmount.toLocaleString()}`
    );
  });

  marketAsksWithOutOffers.forEach((market) => {
    if (market.error) {
      errors.push(
        `Sorry, buy offers at ${market.marketName} are currently unavailable`
      );
      return;
    }

    errors.push(
      `Sorry, buy offers at ${
        market.marketName
      } are limited to ₿${market.btcAsksSum.toLocaleString()} sold for $${market.USDAsksAmount.toLocaleString()}`
    );
  });

  return errors;
};

export const fetchMarkets = async (btcAmount: number) => {
  return await Promise.all([
    getBinancePrice({
      btcAmount,
    }),
    getCoinbasePrice({
      btcAmount,
    }),
    getBitbayPrice({
      btcAmount,
    }),
  ]);
};

export const getMarketData = ({
  btcAmount,
  marketList,
}: {
  btcAmount: number;
  marketList: SingleMarketData[];
}): Results => {
  const date = new Date().toLocaleTimeString();

  const marketListFiltered = marketList.filter((market) => !market.error);

  const bidsOffers = marketListFiltered.filter(
    ({ btcBidsSum }) => btcBidsSum === btcAmount
  );

  const asksOffers = marketListFiltered.filter(
    ({ btcAsksSum }) => btcAsksSum === btcAmount
  );

  const sortedBidsListByUSDAmount = bidsOffers.sort(
    (a, b) => b.USDBidsAmount - a.USDBidsAmount
  );

  const sortedAsksListByUSDAmount = asksOffers.sort(
    (a, b) => a.USDAsksAmount - b.USDAsksAmount
  );

  const errors = getErrors({ marketList });

  const marketData = {
    btcAmount,
    errors,
    bidsBestMarketName:
      sortedBidsListByUSDAmount[0]?.marketName || "No results",
    asksBestMarketName:
      sortedAsksListByUSDAmount[0]?.marketName || "No results",
    bidsBestUSDAmount:
      sortedBidsListByUSDAmount[0]?.USDBidsAmount || "No results",
    asksBestUSDAmount:
      sortedAsksListByUSDAmount[0]?.USDAsksAmount || "No results",
    date,
  };

  return marketData;
};
