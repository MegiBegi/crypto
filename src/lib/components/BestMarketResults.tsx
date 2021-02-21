import { FC } from "react";
import {
  Stat,
  StatNumber,
  StatLabel,
  StatHelpText,
  StatArrow,
  Spinner,
  Heading,
} from "@chakra-ui/react";

import { BestMarketResultsVariants } from "../types";
import { BestMarket } from "../../generated/graphql";

const BestMarketResults: FC<{
  variant: BestMarketResultsVariants;
  isLoading: boolean;
  marketData: BestMarket;
  askPriceDelta: string | null;
  bidPriceDelta: string | null;
}> = ({ variant, isLoading, marketData, askPriceDelta, bidPriceDelta }) => {
  const isSell = variant === BestMarketResultsVariants.Sell;
  const marketName = isSell
    ? marketData?.bidsBestMarketName
    : marketData?.asksBestMarketName;
  const bestUSDAmount = isSell
    ? marketData?.bidsBestUSDAmount
    : marketData?.asksBestUSDAmount;
  const priceDelta = isSell ? bidPriceDelta : askPriceDelta;

  return (
    <>
      <Heading as="h2" size="l" mt="4">
        The best market to{" "}
        {isSell
          ? BestMarketResultsVariants.Sell
          : BestMarketResultsVariants.Buy}{" "}
        is atm
      </Heading>
      <Heading as="h2" size="xl" mb="4">
        {isLoading ? <Spinner size="xs" /> : marketName}
      </Heading>
      <Stat>
        <StatLabel>USD</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size="xs" />
          ) : !bestUSDAmount ? (
            "No results"
          ) : (
            `$ ${bestUSDAmount?.toLocaleString()}`
          )}
        </StatNumber>
        {priceDelta && Number(priceDelta) !== 0 && (
          <StatHelpText>
            <StatArrow
              type={Number(priceDelta) > 0 ? "increase" : "decrease"}
            />
            {priceDelta?.toLocaleString()}%
          </StatHelpText>
        )}
      </Stat>
    </>
  );
};

export default BestMarketResults;
