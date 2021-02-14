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
    (market) => !market || market.data.btcAsksSum !== market.data.btcAmount
  );

  const marketBidsWithOutOffers = marketList.filter(
    (market) => !market || market.data.btcBidsSum !== market.data.btcAmount
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
      } are limited to ₿${market.data.btcBidsSum.toLocaleString()} sold for $${market.data.USDBidsAmount.toLocaleString()}`
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
      } are limited to ₿${market.data.btcAsksSum.toLocaleString()} sold for $${market.data.USDAsksAmount.toLocaleString()}`
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
}): Results | null => {
  const date = new Date().toLocaleTimeString();
  const marketListFiltered = marketList.filter((market) => market.data);

  if (!marketListFiltered.length) return null;

  const bidsOffers = marketListFiltered.filter(
    ({ data: { btcBidsSum } }) => btcBidsSum === btcAmount
  );

  const asksOffers = marketListFiltered.filter(
    ({ data: { btcAsksSum } }) => btcAsksSum === btcAmount
  );

  const sortedBidsListByUSDAmount = bidsOffers.sort(
    (a, b) => b.data.USDBidsAmount - a.data.USDBidsAmount
  );

  const sortedAsksListByUSDAmount = asksOffers.sort(
    (a, b) => a.data.USDAsksAmount - b.data.USDAsksAmount
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
      sortedBidsListByUSDAmount[0]?.data.USDBidsAmount || "No results",
    asksBestUSDAmount:
      sortedAsksListByUSDAmount[0]?.data.USDAsksAmount || "No results",
    date,
  };

  return marketData;
};
