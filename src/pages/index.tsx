import React, { FC, useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";

import getBinancePrice from "../lib/binance-calculations";
import getCoinbasePrice from "../lib/coinbase-calculations";

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
      <h1>Hooray!</h1>
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

  const data =
    binanceData.USDAmount > coinbaseData.USDAmount ? coinbaseData : binanceData;

  return {
    props: { data },
  };
};

export default Binance;
