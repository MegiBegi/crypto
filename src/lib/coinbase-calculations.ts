import { getOrderBookValues } from "./helpers";
import { MarketName, Result } from "./types";

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
}): Promise<any> => {
  const url = new URL("https://api.pro.coinbase.com/products/BTC-USD/book");
  url.searchParams.set("level", String(btcAmount < 2 ? 2 : 3));

  const response = await fetch(String(url));
  const { asks: askList } = await response.json();

  const [totalPrice, amount] = getOrderBookValues({ askList, btcAmount });

  return {
    marketName: MarketName.Coinbase,
    btcAmount,
    USDAmount: totalPrice,
    btcAsksSum: amount,
  };
};

export default getCoinbasePrice;
