import { getOrderBookValues } from "./helpers";
import { MarketName, Result } from "./types";

/* SAMPLES
{
  "status": "Ok",
  "sell": [
    {
      "ra": "25285.31",
      "ca": "0.02839638",
      "sa": "0.02839638",
      "pa": "0.02839638",
      "co": 1
    }
  ],
  "buy": [
    {
      "ra": "25280",
      "ca": "0.82618498",
      "sa": "3.59999",
      "pa": "0.82618498",
      "co": 1
    }
  ],
  "timestamp": "1529512856512",
  "seqNo": "139098"
}
*/

const getBitbayPrice = async ({
  btcAmount,
}: {
  btcAmount: number;
}): Promise<Result> => {
  const url = new URL("https://api.bitbay.net/rest/trading/orderbook/BTC-USD");

  const response = await fetch(String(url));
  const { sell: askList } = await response.json();

  const askListNormalized = askList.map(({ ra, ca }) => [ra, ca]);

  const [totalPrice, amount] = getOrderBookValues({
    askList: askListNormalized,
    btcAmount,
  });

  return {
    marketName: MarketName.Bitbay,
    btcAmount,
    USDAmount: totalPrice,
    btcAsksSum: amount,
  };
};

export default getBitbayPrice;
