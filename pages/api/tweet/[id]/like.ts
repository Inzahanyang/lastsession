import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";
import { withIronSessionApiRoute } from "iron-session/next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }
  if (req.method === "POST") {
    const {
      query: { id: tweetId },
      session: {
        user: { id: userId },
      },
    } = req;

    if (tweetId && userId) {
      const like = await db.like.findFirst({
        where: {
          userId,
          tweetId: +tweetId.toString(),
        },
      });

      if (like) {
        await db.like.delete({
          where: {
            id: like.id,
          },
        });
      } else {
        await db.like.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            tweet: {
              connect: {
                id: +tweetId.toString(),
              },
            },
          },
        });
      }
    }

    res.status(200).json({ ok: true });
  } else {
    return res.status(400).json({ ok: false });
  }
}

export default withIronSessionApiRoute(handler, {
  cookieName: "funCookie",
  password: "1234123412341234123412341234123412341234123412341234123412341234",
});
