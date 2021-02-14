import { getOrderBookValues } from "../helpers";
import { MarketName, SingleMarketData } from "../types";

/* SAMPLES
{
    "sequence": "3",
    "bids": [
        [ price, size, num-orders ],
        [ "295.96", "4.39088265", 2 ],
        ...
    ],
    "asks": [
        [ price, size, num-orders ],
        [ "295.97", "25.23542881", 12 ],
        ...
    ]
}
*/

const getCoinbasePrice = async ({
  btcAmount,
}: {
  btcAmount: number;
}): Promise<SingleMarketData> => {
  const url = new URL("https://api.pro.coinbase.com/products/BTC-USD/book");
  url.searchParams.set("level", String(btcAmount < 2 ? 2 : 3));

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

    return {
      marketName: MarketName.Coinbase,
      data: { btcAmount, USDBidsAmount, USDAsksAmount, btcAsksSum, btcBidsSum },
    };
  } catch ({ message }) {
    return {
      marketName: MarketName.Coinbase,
      data: {
        btcAmount,
        USDBidsAmount: 0,
        USDAsksAmount: 0,
        btcAsksSum: 0,
        btcBidsSum: 0,
      },
      error: message,
    };
  }
};

export default getCoinbasePrice;
