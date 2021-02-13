import { SingleMarketData, Results } from "./types";
import getBinancePrice from "./calculations/binance-calculations";
import getCoinbasePrice from "./calculations/coinbase-calculations";
import getBitbayPrice from "./calculations/bitbay-calculations";

export const getOrderBookValues = ({
  recordList,
  btcAmount,
}: {
  recordList: [string, string][];
  btcAmount: number;
}): [number, number] => {
  let itemIndex = 0;
  let USDAmount = 0;
  let btcSum = 0;

  while (recordList[itemIndex] && btcSum < btcAmount) {
    const [itemPrice, itemAmount] = recordList[itemIndex];
    const askPrice = Number(itemPrice);
    const askAmount = Number(itemAmount);
    const shouldBuyWholeAskedAmount = btcSum + askAmount <= btcAmount;

    if (shouldBuyWholeAskedAmount) {
      btcSum += askAmount;
      USDAmount += askAmount * askPrice;
    } else {
      const missingAmount = btcAmount - btcSum;
      btcSum += missingAmount;
      USDAmount += missingAmount * askPrice;
    }

    itemIndex++;
  }

  return [USDAmount, btcSum];
};

export const getErrors = ({
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

export const getPriceDeltas = ({
  marketDataPrev,
  data,
}: {
  marketDataPrev: Results | undefined;
  data: Results;
}): { askPriceDelta: string | null; bidPriceDelta: string | null } => {
  let askPriceDelta = null;
  let bidPriceDelta = null;

  if (!marketDataPrev || !data) return { askPriceDelta, bidPriceDelta };

  if (
    typeof marketDataPrev.asksBestUSDAmount === "number" ||
    typeof data.asksBestUSDAmount === "number"
  ) {
    const askPriceDifference =
      (data.asksBestUSDAmount as number) -
      (marketDataPrev.asksBestUSDAmount as number);
    askPriceDelta =
      (askPriceDifference * 100) / (data.asksBestUSDAmount as number);
  }

  if (
    typeof marketDataPrev.bidsBestUSDAmount === "number" ||
    typeof data.bidsBestUSDAmount === "number"
  ) {
    const bidPriceDifference =
      (data.bidsBestUSDAmount as number) -
      (marketDataPrev.bidsBestUSDAmount as number);
    bidPriceDelta =
      (bidPriceDifference * 100) / (data.bidsBestUSDAmount as number);
  }

  return {
    askPriceDelta: askPriceDelta?.toFixed(3),
    bidPriceDelta: bidPriceDelta?.toFixed(3),
  };
};

export const getMarketData = async ({
  btcAmount,
}: {
  btcAmount: number;
}): Promise<Results> => {
  const date = new Date().toLocaleTimeString();

  const marketList = await Promise.all([
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

  const marketListFiltered = marketList.filter((market) => !market.error);

  const bidsOffers = marketListFiltered.filter(
    ({ btcBidsSum }) => btcBidsSum === btcAmount
  );

  const asksOffers = marketListFiltered.filter(
    ({ btcAsksSum }) => btcAsksSum === btcAmount
  );

  const sortedBidsListByUSDAmount = bidsOffers.sort(
    (a, b) => a.USDBidsAmount - b.USDBidsAmount
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
