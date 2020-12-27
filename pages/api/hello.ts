// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Method } from "../../types";

export default (
  req: NextApiRequest,
  res: NextApiResponse<Record<string, string>[]>
) => {
  const { method } = req;

  switch (method) {
    case Method.Get: {
      res.statusCode = 200;
      res.json([
        { name: "Catherine Doe", method },
        { name: "John Doe", method },
      ]);
      break;
    }
    case Method.Post: {
      res.statusCode = 200;
      res.json([
        { name: "Catherine Doe", method },
        { name: "John Doe", method },
      ]);
    }
  }
};
