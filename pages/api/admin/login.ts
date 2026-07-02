import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminCredentials, creerSessionAdmin, ADMIN_COOKIE_NAME } from "../../../lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Méthode non autorisée." });
  }

  const { username, password } = req.body;
  const creds = getAdminCredentials();

  if (username !== creds.username || password !== creds.password) {
    return res.status(401).json({ success: false, message: "Identifiants incorrects." });
  }

  const token = creerSessionAdmin();
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 12}`
  );
  return res.status(200).json({ success: true });
}
