const MAX_LIMIT = "5000";

/* SAMPLES
binanceBids = [['33610.34000000', '0.20000000']]
binanceAsks = [['33610.35000000', '0.00000600']]
*/

const getLimit = ({
  bitcoinAmount,
  retry,
}: {
  bitcoinAmount: number;
  retry?: number;
}): string => {
  const levels = ["50", "100", "500", "1000", "5000"];
  let limitIndex = 0;

  if (bitcoinAmount > 50) limitIndex = 4;
  if (bitcoinAmount > 25) limitIndex = 3;
  if (bitcoinAmount > 5) limitIndex = 2;
  if (bitcoinAmount > 2) limitIndex = 1;

  return levels[limitIndex + retry];
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

  const url = new URL("https://api.binance.com/api/v3/depth");
  url.searchParams.set("limit", limit);
  url.searchParams.set("symbol", "BTCUSDT");

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
