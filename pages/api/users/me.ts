import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // localhost:3000/api/users/me에 접근 시 req session에는 userId에 대한 정보가 있기 때문에
  // 저장된 userId를 바탕으로 user db에서 해당 user를 찾을 수 있음.

  const profile = await client.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });
  return res.json({
    ok: true,
    profile,
  });
}

// export default withIronSessionApiRoute(withHandler("GET", handler), {
//   cookieName: "carrotsession",
//   password:
//     "fhwioqhgfiorqhoiior26h1t56e4h8bt91b56e4b8tw1b9t48werb1t5er4b85tr1eb1t",
// });

export default withApiSession(
  withHandler({
    method: ["GET"],
    handler,
  })
);
