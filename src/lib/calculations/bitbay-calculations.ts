import { getOrderBookValues } from "../helpers";
import { MarketName, SingleMarketData } from "../types";

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
}): Promise<SingleMarketData> => {
  const url = new URL("https://api.bitbay.net/rest/trading/orderook/BTC-USD");

  try {
    const response = await fetch(String(url));

    const offersList = await response.json();
    const { sell: askList } = offersList;
    const { buy: bidsList } = offersList;

    const askListNormalized = askList.map(({ ra, ca }) => [ra, ca]);
    const bidListNormalized = bidsList.map(({ ra, ca }) => [ra, ca]);

    const [USDAsksAmount, btcAsksSum] = getOrderBookValues({
      recordList: askListNormalized,
      btcAmount,
    });

    const [USDBidsAmount, btcBidsSum] = getOrderBookValues({
      recordList: bidListNormalized,
      btcAmount,
    });

    return {
      marketName: MarketName.Bitbay,
      btcAmount,
      USDBidsAmount,
      USDAsksAmount,
      btcAsksSum,
      btcBidsSum,
    };
  } catch ({ message }) {
    return {
      marketName: MarketName.Bitbay,
      btcAmount,
      USDBidsAmount: 0,
      USDAsksAmount: 0,
      btcAsksSum: 0,
      btcBidsSum: 0,
      error: message,
    };
  }
};

export default getBitbayPrice;
