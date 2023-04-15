import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(400).json({ ok: false });

  const { token } = req.body;

  const findToken = await db.token.findUnique({
    where: { token: +token },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!findToken) {
    return res.status(400).json({ ok: false, error: "not match token" });
  }

  req.session.user = { id: findToken?.user.id };
  await req.session.save();
  await db.token.deleteMany({
    where: { userId: findToken.userId },
  });

  return res.status(200).json({ ok: true });
}

export default withIronSessionApiRoute(handler, {
  cookieName: "funCookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
  password: "1234123412341234123412341234123412341234123412341234123412341234",
});
