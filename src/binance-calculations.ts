const MAX_LIMIT = "500";

const getLimit = ({
  bitcoinAmount,
  retry,
}: {
  bitcoinAmount: number;
  retry?: number;
}): string => {
  const levels = ["10", "20", "50", "100", "500"];
  const basicLevel = 0 + retry;

  let limit = MAX_LIMIT;

  if (bitcoinAmount < 1) limit = levels[basicLevel];
  if (bitcoinAmount >= 1 && bitcoinAmount <= 5) limit = levels[basicLevel + 1];
  if (bitcoinAmount > 5 && bitcoinAmount <= 10) limit = levels[basicLevel + 2];
  if (bitcoinAmount > 10 && bitcoinAmount <= 20) limit = levels[basicLevel + 3];
  if (bitcoinAmount > 20 && bitcoinAmount <= 50) limit = levels[basicLevel + 4];

  return limit;
};

type Result = {
  marketName: string;
  bitcoinAmount: number;
  USDAmount?: number;
  error?: string;
};
const getBinancePrice = async ({
  bitcoinAmount,
  retry = 0,
}: {
  bitcoinAmount: number;
  retry?: number;
}): Promise<Result> => {
  const limit = getLimit({ bitcoinAmount, retry });
  let itemIndex = 0;
  let totalPrice = 0;
  let amount = 0;

  const url = new URL("https://api.binance.com/api/v3/depth?symbol=BTCUSDT");
  url.searchParams.set("limit", limit);

  const response = await fetch(String(url));
  const { asks: askList } = await response.json();

  const result: Result = { marketName: "Binance", bitcoinAmount };

  if (askList?.length === 0) {
    result.error = "Sorry, there is no data available for Binance atm.";
    return result;
  }

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

  if (amount === bitcoinAmount) {
    result.USDAmount = totalPrice;
    return result;
  }

  if (limit === MAX_LIMIT) {
    result.USDAmount = totalPrice;
    result.error = `Sorry, offers at Binance are limited to BTC ${amount} currently being sold at the price of USD ${totalPrice}`;
    return result;
  }

  return getBinancePrice({ bitcoinAmount, retry: retry + 1 });
};

export default getBinancePrice;
