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
      body: { productId },
      session: { user },
    } = req;
    const alreadyExists = await client.chat.findFirst({
      where: {
        productId,
        buyerId: user?.id,
      },
    });
    if (alreadyExists) return res.json({ ok: true, chat: alreadyExists });
    const chat = await client.chat.create({
      data: {
        buyer: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });
    if (!chat) return res.json({ ok: false });
    res.json({
      ok: true,
      chat,
    });
  }
}

export default withApiSession(
  withHandler({
    method: ["POST", "GET"],
    handler,
  })
);
