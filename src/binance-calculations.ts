const getLimit = ({
  bitcoinAmount,
  retry,
}: {
  bitcoinAmount: number;
  retry?: number;
}): string => {
  const levels = ["10", "20", "50", "100", "500"];
  const basicLevel = 0 + retry;

  let limit = "500";

  if (bitcoinAmount < 1) limit = levels[basicLevel];
  if (bitcoinAmount >= 1 && bitcoinAmount <= 5) limit = levels[basicLevel + 1];
  if (bitcoinAmount > 5 && bitcoinAmount <= 10) limit = levels[basicLevel + 2];
  if (bitcoinAmount > 10 && bitcoinAmount <= 20) limit = levels[basicLevel + 3];
  if (bitcoinAmount > 20 && bitcoinAmount <= 50) limit = levels[basicLevel + 4];

  return limit;
};

const getBinancePrice = async ({
  bitcoinAmount,
  retry = 0,
}: {
  bitcoinAmount: number;
  retry?: number;
}): Promise<{
  marketName: string;
  bitcoinAmount: number;
  USDAmount: number;
}> => {
  let totalPrice = 0;
  let amount = 0;

  const url = new URL("https://api.binance.com/api/v3/depth?symbol=BTCUSDT");
  url.searchParams.set("limit", getLimit({ bitcoinAmount, retry }));

  const response = await fetch(String(url));
  const { asks: askList } = await response.json();

  askList.forEach(([askListItemPrice, askListItemAmount]: [string, string]) => {
    const askPrice = Number(askListItemPrice);
    const askAmount = Number(askListItemAmount);

    const shouldContinue = amount < bitcoinAmount;
    const shouldBuyWholeAskedAmount = amount + askAmount <= bitcoinAmount;
    const missingAmount = bitcoinAmount - amount;

    if (!shouldContinue) {
      return;
    }

    if (shouldBuyWholeAskedAmount) {
      amount += askAmount;
      totalPrice += askAmount * askPrice;
      return;
    }

    amount += missingAmount;
    totalPrice += missingAmount * askPrice;
  });

  if ((amount = bitcoinAmount)) {
    return { marketName: "binance", bitcoinAmount, USDAmount: totalPrice };
  }

  return getBinancePrice({ bitcoinAmount, retry: retry + 1 });
};

export default getBinancePrice;
