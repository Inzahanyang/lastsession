import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { withIronSessionApiRoute } from "iron-session/next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(400).json({ ok: false });

  if (!req.session.user) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }
  const user = await db.user.findUnique({
    where: { id: req.session.user?.id },
  });

  if (!user) {
    return res.status(401).json({
      ok: true,
      message: "u a not logged in",
      data: null,
    });
  }

  return res.status(200).json({ ok: true, user });
}

export default withIronSessionApiRoute(handler, {
  cookieName: "funCookie",
  password: "1234123412341234123412341234123412341234123412341234123412341234",
});
