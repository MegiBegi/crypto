// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import getBinancePrice from "../../lib/binance-calculations";
import getCoinbasePrice from "../../lib/coinbase-calculations";
import getBitbayPrice from "../../lib/bitbay-calculations";
import { getMarketWithBestOffer } from "../../lib/helpers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const binanceData = await getBinancePrice({
    bitcoinAmount: Number(req.query.amount),
  });

  const coinbaseData = await getCoinbasePrice({
    bitcoinAmount: Number(req.query.amount),
  });

  const bitbayData = await getBitbayPrice({
    bitcoinAmount: Number(req.query.amount),
  });

  const market = getMarketWithBestOffer({
    marketList: [binanceData, coinbaseData, bitbayData],
  });

  res.status(200);
  res.json(market);
  res.end();
};
