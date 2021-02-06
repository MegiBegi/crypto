import React, { FC, useState } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";

import getBinancePrice from "../lib/binance-calculations";
import getCoinbasePrice from "../lib/coinbase-calculations";
import getBitbayPrice from "../lib/bitbay-calculations";
import { getMarketWithBestOffer } from "../lib/helpers";

/**
 * SAMPLES
 * USDAmount: 149433.50352462003
 * bitcoinAmount: 4
 * marketName: "Binance"
 */

type SSG = { data };

const fetchMarket = debounce(({ bitcoinAmount, setMarket, setIsLoading }) => {
  setIsLoading(true);
  fetch(`/api/best-market?amount=${bitcoinAmount || "0"}`)
    .then((res) => res.json())
    .then(setMarket)
    .then(() => setIsLoading(false));
}, 250);

const Binance: FC<SSG> = ({ data }) => {
  const [market, setMarket] = useState<typeof data | null>(data);
  const [bitcoinAmount, setBitcoinAmount] = useState<string>("2");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Head>Binance!</Head>
      <h1>Compare buying offers from Binance, Coinbase and Bitbay!</h1>
      <label htmlFor="amount">How many BTC do you wanna buy?</label>
      <input
        id="amount"
        type="number"
        value={bitcoinAmount}
        onChange={(event) => {
          const { value } = event.target;

          setBitcoinAmount(value);
          fetchMarket({ bitcoinAmount: value, setMarket, setIsLoading });
        }}
      />
      <div>
        <h4>Market: {isLoading ? "Loading..." : market?.marketName}</h4>
        <h4>USD amount: {isLoading ? "Loading..." : market?.USDAmount}</h4>
        <h4>BTC amount: {isLoading ? "Loading..." : market?.bitcoinAmount}</h4>
        <h4>
          {isLoading
            ? "Loading..."
            : market?.marketsWithErrors?.map((market) => (
                <div>{market.error}</div>
              ))}
        </h4>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<SSG> = async (context) => {
  const binanceData = await getBinancePrice({
    bitcoinAmount: 2,
  });

  const coinbaseData = await getCoinbasePrice({
    bitcoinAmount: 2,
  });

  const bitbayData = await getBitbayPrice({
    bitcoinAmount: 2,
  });

  const market = getMarketWithBestOffer({
    marketList: [binanceData, coinbaseData, bitbayData],
  });

  return {
    props: { data: market },
  };
};

export default Binance;
