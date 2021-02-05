// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import getBinancePrice from "../../lib/binance-calculations";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("req", req.query.amount);
  const market = await getBinancePrice({
    bitcoinAmount: Number(req.query.amount),
  });
  res.status(200);
  res.json(market);
  res.end();
};
