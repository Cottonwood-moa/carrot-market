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

  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    });
    if (!profile) return res.json({ ok: false });
    return res.json({
      ok: true,
      profile,
    });
  }
  if (req.method === "POST") {
    const {
      session: { user },
      body: { email, phone, name, avatarId },
    } = req;
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });
    if (name && name !== currentUser?.name) {
      if (name) {
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            name,
          },
        });
        return res.json({ ok: true });
      }
    }
    if (email && email !== currentUser?.email) {
      if (email) {
        // 중복확인
        const alreadyExists = Boolean(
          await client.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
            },
          })
        );
        if (alreadyExists) {
          return res.json({
            ok: false,
            error: "Email already taken.",
          });
        }
        // 업데이트
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            email,
          },
        });
        return res.json({ ok: true });
      }
    }
    if (phone && phone !== currentUser?.phone) {
      if (phone) {
        const alreadyExists = Boolean(
          await client.user.findUnique({
            where: {
              phone,
            },
            select: {
              id: true,
            },
          })
        );
        if (alreadyExists) {
          return res.json({
            ok: false,
            error: "Phone number already taken.",
          });
        }
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            phone,
          },
        });
        return res.json({ ok: true });
      }
    }
    if (avatarId) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
        },
      });
    }
    return res.json({
      ok: true,
    });
  }
}

// export default withIronSessionApiRoute(withHandler("GET", handler), {
//   cookieName: "carrotsession",
//   password:
//     "fhwioqhgfiorqhoiior26h1t56e4h8bt91b56e4b8tw1b9t48werb1t5er4b85tr1eb1t",
// });

export default withApiSession(
  withHandler({
    method: ["GET", "POST"],
    handler,
  })
);
