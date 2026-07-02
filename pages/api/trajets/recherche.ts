import type { NextApiRequest, NextApiResponse } from "next";
import { trajets, postes, troncons, communes } from "../../../lib/db";

function normaliserTel(tel: string) {
  return tel.replace(/[\s.\-()]/g, "");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Méthode non autorisée." });
  }
  const { telephone } = req.query;
  if (!telephone || typeof telephone !== "string" || normaliserTel(telephone).length < 6) {
    return res.status(400).json({ message: "Numéro de téléphone requis (au moins 6 chiffres)." });
  }

  const cible = normaliserTel(telephone);
  const resultats = trajets
    .filter((t) => normaliserTel(t.telephone).includes(cible))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((t) => {
      let posteNom: string | undefined;
      let departNom: string | undefined;
      let arriveeNom: string | undefined;
      if (t.posteId) {
        posteNom = postes.find((p) => p.id === t.posteId)?.nom;
      }
      if (t.tronconId) {
        const troncon = troncons.find((tr) => tr.id === t.tronconId);
        if (troncon) {
          departNom = communes.find((c) => c.id === troncon.departCommuneId)?.nom;
          arriveeNom = communes.find((c) => c.id === troncon.arriveeCommuneId)?.nom;
        }
      }
      return { ...t, posteNom, departNom, arriveeNom };
    });

  if (resultats.length === 0) {
    return res.status(404).json({ message: "Aucun trajet trouvé pour ce numéro." });
  }

  return res.status(200).json({ trajets: resultats });
}
