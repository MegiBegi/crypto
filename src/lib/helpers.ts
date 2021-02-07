import { Result } from "./types";

export const getOrderBookValues = ({
  askList,
  btcAmount,
}: {
  askList: [string, string][];
  btcAmount: number;
}): [number, number] => {
  let itemIndex = 0;
  let totalPrice = 0;
  let amount = 0;

  while (askList[itemIndex] && amount < btcAmount) {
    const [askListItemPrice, askListItemAmount] = askList[itemIndex];
    const askPrice = Number(askListItemPrice);
    const askAmount = Number(askListItemAmount);
    const shouldBuyWholeAskedAmount = amount + askAmount <= btcAmount;

    if (shouldBuyWholeAskedAmount) {
      amount += askAmount;
      totalPrice += askAmount * askPrice;
    } else {
      const missingAmount = btcAmount - amount;
      amount += missingAmount;
      totalPrice += missingAmount * askPrice;
    }

    itemIndex++;
  }

  return [totalPrice, amount];
};

export const getMarketWithBestOffer = ({
  marketList,
}: {
  marketList: Result[];
}) => {
  const marketWithOffers = marketList.filter(
    (market) => market.btcAsksSum === market.btcAmount
  );

  const sortedListByUSDAmount = marketWithOffers.sort(
    (a, b) => a.USDAmount - b.USDAmount
  );

  return { ...sortedListByUSDAmount[0] };
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
  marketList: Result[];
}): string[] => {
  const errors = [];
  const marketWithOutOffers = marketList.filter(
    (market) => market.btcAsksSum !== market.btcAmount
  );

  marketWithOutOffers.forEach((market) => {
    errors.push(
      `Sorry, offers at ${market.marketName} are limited to ₿${prettifyNumber(
        market.btcAsksSum
      )} sold for $${prettifyNumber(market.USDAmount)}`
    );
  });

  return errors;
};
