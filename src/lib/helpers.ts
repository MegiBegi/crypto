export const getOrderBookValues = ({ askList, btcAmount }) => {
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

export const getMarketWithBestOffer = ({ marketList }) => {
  const marketWithOffers = marketList.filter((market) => !market.error);
  const marketsWithErrors = marketList.filter((market) => market.error);

  const sortedListByUSDAmount = marketWithOffers.sort(
    (a, b) => a.USDAmount - b.USDAmount
  );

  return { ...sortedListByUSDAmount[0], marketsWithErrors };
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
