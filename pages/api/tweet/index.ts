import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { withIronSessionApiRoute } from "iron-session/next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }
  if (req.method === "GET") {
    const tweets = await db.tweet.findMany({
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      include: {
        user: {
          select: {
            id: true,
            email: true,
            updatedAt: true,
            phone: true,
            name: true,
          },
        },
        likes: true,
        _count: {
          select: {
            replise: true,
          },
        },
      },
    });

    return res.status(200).json({ ok: true, tweets });
  } else if (req.method === "POST") {
    const {
      body: { tweet },
      session: {
        user: { id },
      },
    } = req;
    if (!tweet) res.status(400).json({ ok: false });

    await db.tweet.create({
      data: {
        userId: id,
        tweet,
      },
    });

    return res.json({ ok: true });
  } else {
    return res.status(400).json({ ok: false });
  }
}

export default withIronSessionApiRoute(handler, {
  cookieName: "funCookie",
  password: "1234123412341234123412341234123412341234123412341234123412341234",
});
