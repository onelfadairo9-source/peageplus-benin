import type { NextApiRequest, NextApiResponse } from "next";
import { tarifs } from "../../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const index = tarifs.findIndex((t: { id: string }) => t.id === id);

  if (req.method === "PUT") {
    if (index === -1) return res.status(404).json({ message: "Tarif introuvable." });
    tarifs[index] = { ...tarifs[index], ...req.body, id: tarifs[index].id };
    return res.status(200).json({ tarif: tarifs[index] });
  }

  if (req.method === "DELETE") {
    if (index === -1) return res.status(404).json({ message: "Tarif introuvable." });
    tarifs.splice(index, 1);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ message: "Méthode non autorisée." });
}
