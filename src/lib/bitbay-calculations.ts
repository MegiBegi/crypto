import { getOrderBookValues, prettifyNumber } from "./helpers";
import { MarketName } from "./types";

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

type Result = {
  marketName: string;
  btcAmount: number;
  USDAmount?: number;
  error?: string;
};

const getBitbayPrice = async ({
  btcAmount,
  retry = 0,
}: {
  btcAmount: number;
  retry?: number;
}): Promise<any> => {
  const url = new URL("https://api.bitbay.net/rest/trading/orderbook/BTC-USD");

  const response = await fetch(String(url));
  const { sell: askList } = await response.json();
  const result: Result = { marketName: MarketName.Bitbay, btcAmount };

  if (askList?.length === 0) {
    result.error = "Sorry, there is no data available for Binance atm.";
    return result;
  }

  const askListNormalized = askList.map(({ ra, ca }) => [ra, ca]);

  const [totalPrice, amount] = getOrderBookValues({
    askList: askListNormalized,
    btcAmount,
  });

  if (amount === btcAmount) {
    result.USDAmount = totalPrice;
    return result;
  }

  if (amount < btcAmount) {
    result.USDAmount = totalPrice;
    result.btcAmount = amount;
    result.error = `Sorry, offers at Bitbay are limited to ₿${prettifyNumber(
      amount
    )} sold for $${prettifyNumber(totalPrice)}`;
    return result;
  }
};

export default getBitbayPrice;
