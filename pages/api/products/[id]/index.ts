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

  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
    // include: {
    //   user: {
    //     select: {
    //       id: true,
    //       name: true,
    //       avatar: true,
    //     },
    //   },
    // },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#filter-conditions-and-operators
  // Filter conditions and operators
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: +id.toString(),
        },
      },
    },
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: +id.toString(),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  res.json({
    ok: true,
    isLiked,
    relatedProducts,
  });
}

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
  })
);
