import type { NextApiRequest, NextApiResponse } from "next";
import { communes } from "../../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const index = communes.findIndex((c: { id: string }) => c.id === id);

  if (req.method === "PUT") {
    if (index === -1) return res.status(404).json({ message: "Commune introuvable." });
    communes[index] = { ...communes[index], ...req.body, id: communes[index].id };
    return res.status(200).json({ commune: communes[index] });
  }

  if (req.method === "DELETE") {
    if (index === -1) return res.status(404).json({ message: "Commune introuvable." });
    communes.splice(index, 1);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ message: "Méthode non autorisée." });
}
