import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // const { name, price, description } = req.body;
  // const { user } = req.session;
  if (req.method === "GET") {
    const products = await client.product.findMany({
      orderBy: {
        id: "desc",
      },

      include: {
        _count: {
          select: {
            Fav: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      products,
    });
  }

  if (req.method === "POST") {
    const {
      body: { name, price, description, productImage },
      session: { user },
    } = req;
    console.log(productImage);
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: productImage,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
  })
);
