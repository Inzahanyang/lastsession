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
  if (req.method === "GET") {
    const {
      session: {
        user: { id: userId },
      },
      query: { id: tweetId },
    } = req;

    const tweet = await db.tweet.findUnique({
      where: {
        id: +tweetId,
      },
      include: {
        replise: {
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            reply: true,
            id: true,
            updatedAt: true,
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            replise: true,
          },
        },
      },
    });

    const isLiked = Boolean(
      await db.like.findFirst({
        where: {
          tweetId: +tweetId,
          userId: userId,
        },
      })
    );

    res.status(200).json({ ok: true, tweet, isLiked });
  } else if (req.method === "POST") {
  } else {
    return res.status(400).json({ ok: false });
  }
}

export default withIronSessionApiRoute(handler, {
  cookieName: "funCookie",
  password: "1234123412341234123412341234123412341234123412341234123412341234",
});
