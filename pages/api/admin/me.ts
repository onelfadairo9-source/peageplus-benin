import type { NextApiRequest, NextApiResponse } from "next";
import { estAdminValide, tokenDepuisRequete } from "../../../lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ok = estAdminValide(tokenDepuisRequete(req));
  if (!ok) return res.status(401).json({ success: false });
  return res.status(200).json({ success: true });
}
