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
  // 프로덕트 id와 로그인한 유저 id와 일치하는 fav이 있다면
  const alreadyExists = await client.fav.findFirst({
    where: {
      productId: +id.toString(),
      userId: user?.id,
    },
  });
  // 그놈을 지움
  if (alreadyExists) {
    await client.fav.delete({
      where: {
        id: alreadyExists.id,
      },
    });
    // 없다면 만듬
  } else {
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    method: ["POST"],
    handler,
  })
);
