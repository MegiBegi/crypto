import { getOrderBookValues } from "../helpers";
import { MarketName, SingleMarketData } from "../types";

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
}): Promise<SingleMarketData> => {
  const limit = getLimit({ btcAmount, retry });
  const url = new URL("https://api.binance.com/api/v3/dpth");
  url.searchParams.set("limit", limit);
  url.searchParams.set("symbol", "BTCUSDT");

  try {
    const response = await fetch(String(url));

    const offersList = await response.json();
    const { asks: askList } = offersList;
    const { bids: bidsList } = offersList;

    const [USDAsksAmount, btcAsksSum] = getOrderBookValues({
      recordList: askList,
      btcAmount,
    });

    const [USDBidsAmount, btcBidsSum] = getOrderBookValues({
      recordList: bidsList,
      btcAmount,
    });

    if (
      askList.length === 0 ||
      (USDAsksAmount && USDBidsAmount) === btcAmount ||
      limit === MAX_LIMIT
    ) {
      return {
        marketName: MarketName.Binance,
        btcAmount,
        USDBidsAmount,
        USDAsksAmount,
        btcAsksSum,
        btcBidsSum,
      };
    }

    return getBinancePrice({ btcAmount, retry: retry + 1 });
  } catch ({ message }) {
    return {
      marketName: MarketName.Binance,
      btcAmount,
      USDBidsAmount: null,
      USDAsksAmount: null,
      btcAsksSum: null,
      btcBidsSum: null,
      error: message,
    };
  }
};

export default getBinancePrice;
