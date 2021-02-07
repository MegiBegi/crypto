import { getOrderBookValues } from "./helpers";
import { MarketName, Result } from "./types";

const MAX_LIMIT = "5000";

/* SAMPLES
binanceBids = [['33610.34000000', '0.20000000']]
binanceAsks = [['33610.35000000', '0.00000600']]
*/

const getLimit = ({
  btcAmount,
  retry,
}: {
  btcAmount: number;
  retry?: number;
}): string => {
  const levels = ["50", "100", "500", "1000", "5000"];
  let limitIndex = 0;

  if (btcAmount > 50) limitIndex = 4;
  if (btcAmount > 25) limitIndex = 3;
  if (btcAmount > 5) limitIndex = 2;
  if (btcAmount > 2) limitIndex = 1;

  return levels[limitIndex + retry];
};

const getBinancePrice = async ({
  btcAmount,
  retry = 0,
}: {
  btcAmount: number;
  retry?: number;
}): Promise<Result> => {
  const limit = getLimit({ btcAmount, retry });
  const url = new URL("https://api.binance.com/api/v3/depth");
  url.searchParams.set("limit", limit);
  url.searchParams.set("symbol", "BTCUSDT");

  const response = await fetch(String(url));
  const { asks: askList } = await response.json();

  const [totalPrice, amount] = getOrderBookValues({ askList, btcAmount });

  const result: Result = {
    marketName: MarketName.Binance,
    btcAmount,
    USDAmount: totalPrice,
    btcAsksSum: amount,
  };

  if (askList.length === 0 || amount === btcAmount || limit === MAX_LIMIT) {
    result.USDAmount = totalPrice;
    result.btcAsksSum = amount;
    return result;
  }

  return getBinancePrice({ btcAmount, retry: retry + 1 });
};

export default getBinancePrice;
