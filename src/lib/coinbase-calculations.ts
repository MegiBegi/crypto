import { getOrderBookValues, prettifyNumber } from "./helpers";

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
  marketName: string;
  bitcoinAmount: number;
  USDAmount?: number;
  error?: string;
};
const getCoinbasePrice = async ({
  bitcoinAmount,
}: {
  bitcoinAmount: number;
  retry?: number;
}): Promise<any> => {
  const url = new URL("https://api.pro.coinbase.com/products/BTC-USD/book");
  url.searchParams.set("level", String(bitcoinAmount < 2 ? 2 : 3));

  const response = await fetch(String(url));
  const { asks: askList } = await response.json();
  const result: Result = { marketName: "Coinbase", bitcoinAmount };

  if (askList?.length === 0) {
    result.error = "Sorry, there is no data available for Binance atm.";
    return result;
  }

  const [totalPrice, amount] = getOrderBookValues({ askList, bitcoinAmount });

  if (amount === bitcoinAmount) {
    result.USDAmount = totalPrice;
    return result;
  }

  if (amount < bitcoinAmount) {
    result.USDAmount = totalPrice;
    result.bitcoinAmount = amount;
    result.error = `Sorry, offers at Coinbase are limited to ₿${prettifyNumber(
      amount
    )} sold for $${prettifyNumber(totalPrice)}`;
    return result;
  }
};

export default getCoinbasePrice;
