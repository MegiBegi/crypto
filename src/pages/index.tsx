import React, { FC, useState } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";
import { TimeIcon } from "@chakra-ui/icons";
import { useQuery } from "react-query";

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
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { useConstant } from "../lib/hooks";
/**
 * SAMPLES
 * USDAmount: 149433.50352462003
 * btcAmount: 4
 * marketName: "Binance"
 */

type SSG = { marketData: Results };

const Binance: FC<SSG> = (props) => {
  const [btcAmount, setBTCAmount] = useState<string>("2");
  const { isLoading, error, data, isFetching } = useQuery<Results>(
    ["bestMarket", btcAmount],
    () =>
      fetch(`/api/best-market?amount=${btcAmount}`).then((res) => res.json()),
    {
      refetchInterval: Number(btcAmount) > 5 ? 3000 : 1000,
    }
  );

  const marketData = data || props.marketData;

  const debouncedBTCAmount = useConstant(() =>
    debounce((val: string) => {
      setBTCAmount(val);
    }, 250)
  );

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
            `₿ ${marketData.btcAmount.toLocaleString()}`
          )}
        </StatNumber>
        <StatHelpText>Feb 12 - Feb 28</StatHelpText>
      </Stat>

      <Heading as="h2" size="l" mt="4">
        The best market to buy is atm
      </Heading>
      <Heading as="h2" size="xl" mb="4">
        {isLoading ? <Spinner size="xs" /> : marketData.asksBestMarketName}
      </Heading>
      <Stat>
        <StatLabel>USD</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : typeof marketData.asksBestUSDAmount === "string" ? (
            marketData.asksBestUSDAmount
          ) : (
            `$ ${marketData.asksBestUSDAmount.toLocaleString()}`
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
        {isLoading ? <Spinner size="xs" /> : marketData.bidsBestMarketName}
      </Heading>
      <Stat>
        <StatLabel>USD</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : typeof marketData.bidsBestUSDAmount === "string" ? (
            marketData.bidsBestUSDAmount
          ) : (
            `$ ${marketData.bidsBestUSDAmount.toLocaleString()}`
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
          marketData.errors?.map((error) => (
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
              {marketData.date}
            </>
          )}
        </StatNumber>
      </Stat>

      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="black.500"
          fontSize="1.2em"
          children="₿"
          top="16px"
          left="-10px"
        />
        <NumberInput
          mt="4"
          display="block"
          defaultValue={2}
          min={0}
          placeholder="Enter amount"
          w={250}
          onChange={(value) => {
            debouncedBTCAmount(value);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
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
    props: { marketData },
    revalidate: 5,
  };
};

export default Binance;
