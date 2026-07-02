import type { NextApiRequest, NextApiResponse } from "next";
import { postes } from "../../lib/db";
import { Poste, TypePoste } from "../../lib/models";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ postes });
  }

  if (req.method === "POST") {
    const { nom, communeId, type, coordonnees, actif } = req.body;
    if (!nom || !communeId || !type) {
      return res.status(400).json({ message: "Nom, commune et type requis." });
    }
    const nouveau: Poste = {
      id: Date.now().toString(),
      nom,
      communeId,
      type: type as TypePoste,
      coordonnees: coordonnees ?? { lat: 0, lng: 0 },
      actif: actif ?? true,
    };
    postes.push(nouveau);
    return res.status(201).json({ poste: nouveau });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Méthode non autorisée." });
}
