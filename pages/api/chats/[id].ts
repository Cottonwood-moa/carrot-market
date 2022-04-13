import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;

    const chatMessages = await client.chat.findFirst({
      where: {
        id: +id.toString(),
      },
      include: {
        ChatMessage: true,
        product: {
          select: {
            name: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.json({
      ok: true,
      chatMessages,
    });
  }
  if (req.method === "POST") {
    const {
      body: { message },
      query: { id },
      session: { user },
    } = req;
    const createdMessage = await client.chatMessage.create({
      data: {
        message,
        chat: {
          connect: {
            id: +id.toString(),
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    if (createdMessage) return res.json({ ok: false });
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
  })
);
