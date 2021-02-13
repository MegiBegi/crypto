import { getOrderBookValues } from "../helpers";
import { MarketName, SingleMarketData } from "../types";

/* SAMPLES
bids = [[31412.26, 0.40318347]];
asks = [[32851.15, 0.01332502]];
*/

const getBitbayPrice = async ({
  btcAmount,
}: {
  btcAmount: number;
}): Promise<SingleMarketData> => {
  try {
    const response = await fetch(
      "https://bitbay.net/API/Public/BTC/orderbook.json"
    );

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
