import React, { FC, useState } from "react";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";
import { gql, useQuery } from "@apollo/client";

import { getMarketData, fetchMarkets } from "../lib/marketData";
import { Results } from "../lib/types";
import BestMarketContent from "../lib/components/BestMarketContent";

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { useConstant } from "../lib/hooks";

type SSG = { marketData: Results };

const btcMarketDataQuery = gql`
  query($btcAmount: Float!) {
    bestMarket(btcAmount: $btcAmount) {
      btcAmount
      errors
      bidsBestMarketName
      asksBestMarketName
      bidsBestUSDAmount
      asksBestUSDAmount
      date
    }
  }
`;

const BestMarket: FC<SSG> = (props) => {
  const [btcAmount, setBTCAmount] = useState<number>(
    props.marketData.btcAmount
  );

  const { loading, error, data = { bestMarket: props.marketData } } = useQuery(
    btcMarketDataQuery,
    {
      variables: { btcAmount },
      pollInterval: btcAmount > 5 ? 3000 : 1000,
    }
  );

  const debouncedBTCAmount = useConstant(() =>
    debounce((val: number) => {
      setBTCAmount(val);
    }, 250)
  );

  if (error) return <h1>{`An error has occurred: ${error}`}</h1>;

  return (
    <BestMarketContent isLoading={loading} marketData={data?.bestMarket}>
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
            debouncedBTCAmount(Number(value));
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
    </BestMarketContent>
  );
};

export const getStaticProps: GetStaticProps<SSG> = async (context) => {
  const btcAmount = 2;
  const marketList = await fetchMarkets(btcAmount);
  const marketData = getMarketData({ btcAmount, marketList });

  if (!marketData) throw new Error("No data available atm");

  return {
    props: { marketData },
    revalidate: 5,
  };
};

export default BestMarket;
