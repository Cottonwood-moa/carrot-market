import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // user가 input에 입력한 토큰 값
  const { token } = req.body;
  // 발급한 token과 user가 입력한 token이 같으면 foundToken에 토큰정보(userId 포함)가 들어감.
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    // include: {
    //   user: true,
    // },
  });
  // 맞지않으면 404
  if (!foundToken) return res.status(404).end();

  // user라는 session db에 id 값으로 해당 foundToken.userId 값을 넣음.
  req.session.user = {
    id: foundToken.userId,
  };

  // 세션을 쿠키에 저장
  await req.session.save();

  // 발급된 토큰은 할일 다했으니 없앤다.
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });
  return res.json({
    ok: true,
  });
}
// https://nomadcoders.co/carrot-market/lectures/3513 -> iron session

export default withApiSession(
  withHandler({
    method: ["POST"],
    handler,
    isPrivate: false,
  })
);
