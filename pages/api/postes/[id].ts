import type { NextApiRequest, NextApiResponse } from "next";
import { postes } from "../../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const index = postes.findIndex((p: { id: string }) => p.id === id);

  if (req.method === "PUT") {
    if (index === -1) return res.status(404).json({ message: "Poste introuvable." });
    postes[index] = { ...postes[index], ...req.body, id: postes[index].id };
    return res.status(200).json({ poste: postes[index] });
  }

  if (req.method === "DELETE") {
    if (index === -1) return res.status(404).json({ message: "Poste introuvable." });
    postes.splice(index, 1);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ message: "Méthode non autorisée." });
}
