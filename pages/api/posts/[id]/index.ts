import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const post = await client.post.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      Answer: {
        select: {
          answer: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          Answer: true,
          Wondering: true,
        },
      },
    },
  });
  const isWonderd = Boolean(
    await client.wondering.findFirst({
      where: {
        postId: post?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  res.json({
    ok: true,
    post,
    isWonderd,
  });
}

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
  })
);
