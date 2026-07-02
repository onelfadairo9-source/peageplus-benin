import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Méthode non autorisée." });
  }
  return res.status(200).json({
    publicKey: process.env.KKIAPAY_PUBLIC_KEY ?? "",
    sandbox: process.env.KKIAPAY_SANDBOX === "true",
  });
}
