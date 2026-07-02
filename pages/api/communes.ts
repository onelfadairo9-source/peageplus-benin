import type { NextApiRequest, NextApiResponse } from "next";
import { communes } from "../../lib/db";
import { Commune } from "../../lib/models";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ communes });
  }

  if (req.method === "POST") {
    const { nom, departement, coordonnees } = req.body;
    if (!nom || !departement) {
      return res.status(400).json({ message: "Nom et département requis." });
    }
    const nouvelle: Commune = {
      id: Date.now().toString(),
      nom,
      departement,
      coordonnees: coordonnees ?? undefined,
    };
    communes.push(nouvelle);
    return res.status(201).json({ commune: nouvelle });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Méthode non autorisée." });
}
