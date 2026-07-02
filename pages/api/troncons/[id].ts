import type { NextApiRequest, NextApiResponse } from "next";
import { troncons } from "../../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const index = troncons.findIndex((t: { id: string }) => t.id === id);

  if (req.method === "PUT") {
    if (index === -1) return res.status(404).json({ message: "Tronçon introuvable." });
    troncons[index] = { ...troncons[index], ...req.body, id: troncons[index].id };
    return res.status(200).json({ troncon: troncons[index] });
  }

  if (req.method === "DELETE") {
    if (index === -1) return res.status(404).json({ message: "Tronçon introuvable." });
    troncons.splice(index, 1);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ message: "Méthode non autorisée." });
}
