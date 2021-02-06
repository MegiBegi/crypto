export const getOrderBookValues = ({ askList, bitcoinAmount }) => {
  let itemIndex = 0;
  let totalPrice = 0;
  let amount = 0;

  while (askList[itemIndex] && amount < bitcoinAmount) {
    const [askListItemPrice, askListItemAmount] = askList[itemIndex];
    const askPrice = Number(askListItemPrice);
    const askAmount = Number(askListItemAmount);
    const shouldBuyWholeAskedAmount = amount + askAmount <= bitcoinAmount;

    if (shouldBuyWholeAskedAmount) {
      amount += askAmount;
      totalPrice += askAmount * askPrice;
    } else {
      const missingAmount = bitcoinAmount - amount;
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
