import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { name, price, description },
    query: { page },
  } = req;

  if (req.method === "GET") {
    const streamCount = await client.stream.count();
    const pages = Math.round(streamCount / 10);
    const streams = await client.stream.findMany({
      take: 10,
      skip: 10 * (+page - 1),
    });

    res.json({
      ok: true,
      streams,
      pages,
    });
  }
  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      stream,
    });
  }
}

export default withApiSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
  })
);
