import type { NextApiRequest, NextApiResponse } from "next";
import { tarifs } from "../../lib/db";
import { Tarif, CategorieVehicule } from "../../lib/models";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ tarifs });
  }

  if (req.method === "POST") {
    const { tronconId, posteId, categorieVehicule, montantFCFA, dateDebut, dateFin } = req.body;
    if (!categorieVehicule || montantFCFA === undefined || !dateDebut) {
      return res.status(400).json({ message: "Catégorie, montant et date de début requis." });
    }
    if (!tronconId && !posteId) {
      return res.status(400).json({ message: "Un tarif doit être lié à un tronçon ou un poste." });
    }
    const nouveau: Tarif = {
      id: Date.now().toString(),
      tronconId: tronconId || undefined,
      posteId: posteId || undefined,
      categorieVehicule: categorieVehicule as CategorieVehicule,
      montantFCFA: Number(montantFCFA),
      dateDebut,
      dateFin: dateFin || undefined,
    };
    tarifs.push(nouveau);
    return res.status(201).json({ tarif: nouveau });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Méthode non autorisée." });
}
