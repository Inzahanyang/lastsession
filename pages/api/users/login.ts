import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { withIronSessionApiRoute } from "iron-session/next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(400).json({ ok: false });
  const { email, phone } = req.body;

  if (email) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ ok: false, error: "not found email" });
    const token = Math.floor(Math.random() * 333);

    await db.token.create({
      data: {
        token,
        user: {
          connect: {
            email,
          },
        },
      },
    });
    return res.status(200).json({ ok: true, token });
  }
  if (phone) {
    const user = await db.user.findUnique({ where: { phone } });
    if (!user)
      return res.status(400).json({ ok: false, error: "not found phone" });

    const token = Math.floor(Math.random() * 333);

    await db.token.create({
      data: {
        token,
        user: {
          connect: {
            phone,
          },
        },
      },
    });
    return res.status(200).json({ ok: true, token });
  }
}

export default withIronSessionApiRoute(handler, {
  cookieName: "funCookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
  password: "1234123412341234123412341234123412341234123412341234123412341234",
});
