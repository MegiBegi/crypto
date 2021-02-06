import React, { FC, useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";

import getBinancePrice from "../lib/binance-calculations";
import { useConstant } from "../lib/hooks";

/**
 * SAMPLES
 * USDAmount: 149433.50352462003
 * bitcoinAmount: 4
 * marketName: "Binance"
 */

type SSG = { data };

const Binance: FC<SSG> = ({ data }) => {
  const [market, setMarket] = useState<typeof data | null>(data);
  const [bitcoinAmount, setBitcoinAmount] = useState<string>("2");

  const fetchMarket = useConstant(() =>
    debounce(({ bitcoinAmount }) => {
      fetch(`/api/binance-price?amount=${bitcoinAmount || "0"}`)
        .then((res) => res.json())
        .then(setMarket);
    }, 250)
  );

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
          let convertedValues = value;

          setBitcoinAmount(convertedValues);
          fetchMarket({ bitcoinAmount: convertedValues });
        }}
      />
      <div>
        <h4>Market: {market?.marketName}</h4>
        <h4>USD amount: {market?.USDAmount}</h4>
        <h4>BTC amount: {market?.bitcoinAmount}</h4>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<SSG> = async (context) => {
  const data = await getBinancePrice({ bitcoinAmount: 2 });

  return {
    props: { data },
  };
};

export default Binance;
