import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(400).json({ ok: false });
  const { name, email, phone, avatar } = req.body;
  const user = await db.user.create({
    data: {
      name,
      email,
      phone,
      avatar,
    },
  });

  return res.status(200).json({ ok: true });
}

export default handler;
