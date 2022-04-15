import { Answer } from "@prisma/client";
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
      body: { question, longitude, latitude },
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { longitude, latitude, page },
    } = req;
    const postsCount = await client.post.count();
    const pages = Math.round(postsCount / 10);
    const ParsedLatitude = parseFloat(latitude.toString());
    const ParsedLongitude = parseFloat(longitude.toString());
    const posts = await client.post.findMany({
      take: 10,
      skip: 10 * (+page - 1),

      include: {
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            Answer: true,
            Wondering: true,
          },
        },
      },
      distinct: ["createdAt"],
      orderBy: {
        id: "desc",
      },
      where: {
        latitude: {
          gte: ParsedLatitude - 0.01,
          lte: ParsedLatitude + 0.01,
        },
        longitude: {
          gte: ParsedLongitude - 0.01,
          lte: ParsedLongitude + 0.01,
        },
      },
    });
    res.json({
      ok: true,
      posts,
      pages,
    });
  }
}

export default withApiSession(
  withHandler({
    method: ["POST", "GET"],
    handler,
  })
);
