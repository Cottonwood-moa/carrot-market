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
      query: { id },
      session: { user },
    } = req;

    const post = await client.post.findUnique({
      where: {
        id: +id.toString(),
      },
      select: {
        id: true,
      },
    });
    if (!post)
      res.status(404).json({
        ok: false,
        message: "There is no Post",
      });
    const answer = await client.answer.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: post?.id,
          },
        },
        answer: req.body.answer,
      },
    });
    res.json({
      ok: true,
      answer,
    });
  }
  if (req.method === "DELETE") {
    const { body } = req;
    const deleteData = await client.answer.delete({
      where: {
        id: body,
      },
    });
    res.json({
      ok: true,
      deleteData,
    });
  }
}

export default withApiSession(
  withHandler({
    method: ["POST", "DELETE"],
    handler,
  })
);
