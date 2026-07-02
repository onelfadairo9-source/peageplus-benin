import type { NextApiRequest, NextApiResponse } from "next";
import { detruireSessionAdmin, tokenDepuisRequete, ADMIN_COOKIE_NAME } from "../../../lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Méthode non autorisée." });
  }
  const token = tokenDepuisRequete(req);
  if (token) detruireSessionAdmin(token);
  res.setHeader("Set-Cookie", `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0`);
  return res.status(200).json({ success: true });
}
