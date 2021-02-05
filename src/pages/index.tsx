import Head from "next/head";
import React, { FC, useEffect, useState } from "react";
import getBinancePrice from "../lib/binance-calculations";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";

/**
 * SAMPLES
 * USDAmount: 149433.50352462003
 * bitcoinAmount: 4
 * marketName: "Binance"
 */

const fetchMarket = debounce(({ bitcoinAmount, setMarket }) => {
  fetch(`/api/binance-price?amount=${bitcoinAmount}`)
    .then((res) => res.json())
    .then((market) => setMarket(market));
}, 250);

type SSG = { data };
const Binance: FC<SSG> = ({ data }) => {
  const [market, setMarket] = useState(data);
  const [bitcoinAmount, setBitcoinAmount] = useState<string>("2");

  return (
    <div>
      <Head>Binance!</Head>
      <h1>Hooray!</h1>
      <label htmlFor="amount">How many BTC do you wanna buy?</label>
      <input
        id="amount"
        value={bitcoinAmount}
        onChange={(event) => {
          const { value } = event.target;
          setBitcoinAmount(value);

          if (!value) {
            setMarket(null);
          }

          fetchMarket({ bitcoinAmount, setMarket });
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
