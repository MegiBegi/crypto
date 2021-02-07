import { getOrderBookValues, prettifyNumber } from "./helpers";
import { MarketName } from "./types";

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

type Result = {
  marketName: MarketName;
  btcAmount: number;
  USDAmount?: number;
  error?: string;
};
const getCoinbasePrice = async ({
  btcAmount,
}: {
  btcAmount: number;
  retry?: number;
}): Promise<any> => {
  const url = new URL("https://api.pro.coinbase.com/products/BTC-USD/book");
  url.searchParams.set("level", String(btcAmount < 2 ? 2 : 3));

  const response = await fetch(String(url));
  const { asks: askList } = await response.json();
  const result: Result = { marketName: MarketName.Coinbase, btcAmount };

  if (askList?.length === 0) {
    result.error = "Sorry, there is no data available for Binance atm.";
    return result;
  }

  const [totalPrice, amount] = getOrderBookValues({ askList, btcAmount });

  if (amount === btcAmount) {
    result.USDAmount = totalPrice;
    return result;
  }

  if (amount < btcAmount) {
    result.USDAmount = totalPrice;
    result.btcAmount = amount;
    result.error = `Sorry, offers at Coinbase are limited to ₿${prettifyNumber(
      amount
    )} sold for $${prettifyNumber(totalPrice)}`;
    return result;
  }
};

export default getCoinbasePrice;
