import React, { FC, useState } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";

import getBinancePrice from "../lib/binance-calculations";
import getCoinbasePrice from "../lib/coinbase-calculations";
import getBitbayPrice from "../lib/bitbay-calculations";
import { getMarketWithBestOffer, prettifyNumber } from "../lib/helpers";
import PrettyError from "../lib/PrettyError";
import {
  NumberInput,
  NumberInputField,
  Badge,
  Stat,
  StatNumber,
  StatLabel,
  StatHelpText,
  StatArrow,
  Spinner,
  Heading,
  Box,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

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

  const format = (val) => `₿` + val;
  const parse = (val) => val.replace(/^\$/, "");

  return (
    <Box maxW="32rem" mt="48">
      <Head>Crypto Kingdom!</Head>

      <Heading as="h2" size="2xl" mb="4">
        Compare buying offers from Binance, Coinbase and Bitbay!
      </Heading>

      <Heading as="h2" size="l">
        How many BTC do you wanna buy?
      </Heading>
      <NumberInput
        defaultValue={2}
        placeholder="Enter amount"
        w={250}
        value={format(bitcoinAmount)}
        onChange={(value) => {
          const parsedValue = parse(value);

          setBitcoinAmount(parsedValue);
          fetchMarket({
            bitcoinAmount: parsedValue,
            setMarket,
            setIsLoading,
          });
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Heading as="h2" size="l" mt="4">
        You should definitely go with
      </Heading>
      <Heading as="h2" size="xl" mb="4">
        {isLoading ? <Spinner size="xs" /> : market?.marketName}
      </Heading>
      <Stat>
        <StatLabel>USD</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : (
            `$ ${prettifyNumber(market?.USDAmount)}`
          )}
        </StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>BTC</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : (
            `₿ ${prettifyNumber(market?.bitcoinAmount)}`
          )}
        </StatNumber>
        <StatHelpText>Feb 12 - Feb 28</StatHelpText>
      </Stat>

      <h4>
        {isLoading ? (
          <Spinner size="xs" />
        ) : (
          market?.marketsWithErrors?.map((market) => (
            <div>
              <PrettyError>{market.error}</PrettyError>
            </div>
          ))
        )}
      </h4>
    </Box>
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
