import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { createdForId },
    } = req;
    const alreadyExists = await client.review.findFirst({
      where: {
        createdById: user?.id,
      },
    });
    if (alreadyExists) {
    }
    res.json({
      ok: true,
    });
  }
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const reviews = await client.review.findMany({
      where: {
        createdForId: user?.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    return res.json({
      ok: true,
      reviews,
    });
  }
}

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
  })
);
