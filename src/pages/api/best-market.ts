// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { fetchMarkets, getMarketData } from "../../lib/marketData";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const btcAmount = Number(req.query.amount) || 0;
  const marketList = await fetchMarkets(btcAmount);
  const marketData = getMarketData({ btcAmount, marketList });

  if (!marketData) {
    res.status(500);
    res.end();

    throw new Error();
  }

  res.status(200);
  res.json(marketData);
  res.end();
};
