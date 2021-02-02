import Head from "next/head";
import React, { useEffect, useState } from "react";
import getBinancePrice from "../binance-calculations";

const Binance = () => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    getBinancePrice({ bitcoinAmount: 1 }).then((price) => setPrice(price));
  }, []);

  return (
    <div>
      <Head>Binance!</Head>
      <h1>Hooray!</h1>
      <h3>{JSON.stringify(price)}</h3>
    </div>
  );
};

export default Binance;
