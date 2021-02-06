import { getOrderBookValues } from "./helpers";

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
  bitcoinAmount: number;
  USDAmount?: number;
  error?: string;
};

const getBitbayPrice = async ({
  bitcoinAmount,
  retry = 0,
}: {
  bitcoinAmount: number;
  retry?: number;
}): Promise<any> => {
  const url = new URL("https://api.bitbay.net/rest/trading/orderbook/BTC-USD");

  const response = await fetch(String(url));
  const { sell: askList } = await response.json();
  const result: Result = { marketName: "Bitbay", bitcoinAmount };

  if (askList?.length === 0) {
    result.error = "Sorry, there is no data available for Binance atm.";
    return result;
  }

  const askListNormalized = askList.map(({ ra, ca }) => [ra, ca]);

  const [totalPrice, amount] = getOrderBookValues({
    askList: askListNormalized,
    bitcoinAmount,
  });

  if (amount === bitcoinAmount) {
    result.USDAmount = totalPrice;
    return result;
  }

  if (amount < bitcoinAmount) {
    result.USDAmount = totalPrice;
    result.bitcoinAmount = amount;
    result.error = `Sorry, offers at Bitbay are limited to BTC ${amount} currently being sold at the price of USD ${totalPrice}`;
    return result;
  }
};

export default getBitbayPrice;
