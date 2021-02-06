// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import getBinancePrice from "../../lib/coinbase-calculations";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const market = await getBinancePrice({
    bitcoinAmount: Number(req.query.amount),
  });
  res.status(200);
  res.json(market);
  res.end();
};
