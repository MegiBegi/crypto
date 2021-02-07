import { SingleMarketData } from "./types";

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

function thousandSeparate(number: number) {
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function prettifyNumber(number: number, toFixed?: number) {
  return thousandSeparate(Number(number?.toFixed(toFixed || 2))).replace(
    ".",
    ","
  );
}

export const getErrors = ({
  marketList,
}: {
  marketList: SingleMarketData[];
}): string[] => {
  const errors = [];
  const marketAsksWithOutOffers = marketList.filter(
    (market) => market.btcAsksSum !== market.btcAmount
  );

  const marketBidsWithOutOffers = marketList.filter(
    (market) => market.btcBidsSum !== market.btcAmount
  );

  marketAsksWithOutOffers.forEach((market) => {
    errors.push(
      `Sorry, sell offers at ${
        market.marketName
      } are limited to ₿${prettifyNumber(
        market.btcBidsSum
      )} sold for $${prettifyNumber(market.USDBidsAmount)}`
    );
  });

  marketBidsWithOutOffers.forEach((market) => {
    errors.push(
      `Sorry, buy offers at ${
        market.marketName
      } are limited to ₿${prettifyNumber(
        market.btcAsksSum
      )} sold for $${prettifyNumber(market.USDAsksAmount)}`
    );
  });

  return errors;
};
