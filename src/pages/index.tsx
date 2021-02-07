import React, { FC, useState } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";
import { TimeIcon } from "@chakra-ui/icons";

import getBinancePrice from "../lib/binance-calculations";
import getCoinbasePrice from "../lib/coinbase-calculations";
import getBitbayPrice from "../lib/bitbay-calculations";
import { prettifyNumber, getErrors } from "../lib/helpers";
import { Results } from "../lib/types";
import PrettyError from "../lib/PrettyError";
import {
  NumberInput,
  NumberInputField,
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
 * btcAmount: 4
 * marketName: "Binance"
 */

type SSG = { data: Results };

const fetchMarket = debounce(({ btcAmount, setMarket, setIsLoading }) => {
  setIsLoading(true);
  fetch(`/api/best-market?amount=${btcAmount || "0"}`)
    .then((res) => res.json())
    .then(setMarket)
    .then(() => setIsLoading(false));
}, 250);

const Binance: FC<SSG> = ({ data }) => {
  const [market, setMarket] = useState<typeof data | null>(data);
  const [btcAmount, setBitcoinAmount] = useState<string>("2");
  const [isLoading, setIsLoading] = useState(false);

  const format = (val) => `₿` + val;
  const parse = (val) => val.replace(/^\$/, "");

  console.log(market?.date);

  return (
    <Box maxW="32rem" mt="32" mb="32">
      <Head>Crypto Kingdom!</Head>

      <Heading as="h2" size="2xl" mb="4">
        Compare buying offers from Binance, Coinbase and Bitbay!
      </Heading>

      <Stat>
        <StatLabel>BTC</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : (
            `₿ ${prettifyNumber(market?.btcAmount)}`
          )}
        </StatNumber>
        <StatHelpText>Feb 12 - Feb 28</StatHelpText>
      </Stat>

      <Heading as="h2" size="l" mt="4">
        The best market to buy is atm
      </Heading>
      <Heading as="h2" size="xl" mb="4">
        {isLoading ? <Spinner size="xs" /> : market?.asksBestMarketName}
      </Heading>
      <Stat>
        <StatLabel>USD</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : typeof market?.asksBestUSDAmount === "string" ? (
            market?.asksBestUSDAmount
          ) : (
            `$ ${prettifyNumber(market?.asksBestUSDAmount)}`
          )}
        </StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>

      <Heading as="h2" size="l" mt="4">
        The best market to sell is atm
      </Heading>
      <Heading as="h2" size="xl" mb="4">
        {isLoading ? <Spinner size="xs" /> : market?.bidsBestMarketName}
      </Heading>
      <Stat>
        <StatLabel>USD</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : typeof market?.bidsBestUSDAmount === "string" ? (
            market?.bidsBestUSDAmount
          ) : (
            `$ ${prettifyNumber(market?.bidsBestUSDAmount)}`
          )}
        </StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>

      <h4>
        {isLoading ? (
          <Spinner size="xs" />
        ) : (
          market?.errors?.map((error) => (
            <div>
              <PrettyError>{error}</PrettyError>
            </div>
          ))
        )}
      </h4>

      <Heading as="h2" size="l" mt="4">
        Last updated at
      </Heading>
      <Stat>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : (
            <>
              <TimeIcon w={6} h={6} mr="2" />
              {market?.date}
            </>
          )}
        </StatNumber>
      </Stat>

      <NumberInput
        mt="4"
        display="block"
        defaultValue={2}
        placeholder="Enter amount"
        w={250}
        value={format(btcAmount)}
        onChange={(value) => {
          const parsedValue = parse(value);

          setBitcoinAmount(parsedValue);
          fetchMarket({
            btcAmount: parsedValue,
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
    </Box>
  );
};

export const getStaticProps: GetStaticProps<SSG> = async (context) => {
  const date = new Date().toLocaleTimeString();
  const btcAmount = 2;
  const marketList = await Promise.all([
    getBinancePrice({
      btcAmount,
    }),
    getCoinbasePrice({
      btcAmount,
    }),
    getBitbayPrice({
      btcAmount,
    }),
  ]);

  const bidsOffers = marketList.filter(
    ({ btcBidsSum }) => btcBidsSum === btcAmount
  );
  const asksOffers = marketList.filter(
    ({ btcAsksSum }) => btcAsksSum === btcAmount
  );

  const sortedBidsListByUSDAmount = bidsOffers.sort(
    (a, b) => a.USDBidsAmount - b.USDBidsAmount
  );
  const sortedAsksListByUSDAmount = asksOffers.sort(
    (a, b) => a.USDAsksAmount - b.USDAsksAmount
  );

  const errors = getErrors({ marketList });

  const marketData: Results = {
    btcAmount,
    errors,
    bidsBestMarketName:
      sortedBidsListByUSDAmount[0]?.marketName || "No results",
    asksBestMarketName:
      sortedAsksListByUSDAmount[0]?.marketName || "No results",
    bidsBestUSDAmount:
      sortedBidsListByUSDAmount[0]?.USDBidsAmount || "No results",
    asksBestUSDAmount:
      sortedAsksListByUSDAmount[0]?.USDAsksAmount || "No results",
    date,
  };
  return {
    props: { data: marketData },
  };
};

export default Binance;
