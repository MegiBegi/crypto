import React, { FC, useState, useEffect, ReactNode } from "react"
import Head from "next/head"
import { TimeIcon } from "@chakra-ui/icons"
import {
  Stat,
  StatNumber,
  StatLabel,
  Heading,
  Box,
  Spinner,
} from "@chakra-ui/react"

import { getPriceDeltas } from "../helpers"
import { BestMarketResultsVariants } from "../types"
import PrettyError from "../components/PrettyError"
import { usePrevious } from "../hooks"
import BestMarketResults from "../components/BestMarketResults"
import { BestMarket } from "src/generated/graphql"

const BestMarketContent: FC<{
  marketData: BestMarket
  children: ReactNode
  isLoading?: boolean
}> = ({ marketData, children, isLoading }) => {
  const [{ askPriceDelta, bidPriceDelta }, setPriceDelta] = useState<{
    askPriceDelta: string | null
    bidPriceDelta: string | null
  }>({
    askPriceDelta: null,
    bidPriceDelta: null,
  })

  const marketDataPrev = usePrevious(marketData)

  useEffect(() => {
    setPriceDelta(getPriceDeltas({ marketDataPrev, data: marketData }))
  }, [marketData])

  return (
    <Box maxW={["90%", "32rem"]} mt="32" mb="32">
      <Head>Crypto Kingdom!</Head>

      <Heading as="h2" size="2xl" mb="4">
        Compare market offers from Binance, Coinbase and Bitbay!
      </Heading>

      <Stat>
        <StatLabel>BTC</StatLabel>
        <StatNumber></StatNumber>
      </Stat>

      <BestMarketResults
        variant={BestMarketResultsVariants.Buy}
        marketData={marketData}
        askPriceDelta={askPriceDelta}
        bidPriceDelta={bidPriceDelta}
      />
      <BestMarketResults
        variant={BestMarketResultsVariants.Sell}
        marketData={marketData}
        askPriceDelta={askPriceDelta}
        bidPriceDelta={bidPriceDelta}
      />

      <h4>
        {marketData.errors?.map((error, index) => (
          <div key={index}>
            <PrettyError>{error}</PrettyError>
          </div>
        ))}
      </h4>

      <Heading as="h2" size="l" mt="4">
        Last updated at
      </Heading>
      <Stat>
        <StatNumber>
          <TimeIcon w={6} h={6} mr="2" />
          {marketData.date}
          {isLoading && <Spinner size="xs" ml={1} />}
        </StatNumber>
      </Stat>

      {children}
    </Box>
  )
}

export default BestMarketContent
