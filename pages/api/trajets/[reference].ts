import type { NextApiRequest, NextApiResponse } from "next";
import { trouverTrajetParReference } from "../../../lib/services";
import { postes, troncons, communes } from "../../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Méthode non autorisée." });
  }
  const { reference } = req.query;
  if (!reference || typeof reference !== "string") {
    return res.status(400).json({ message: "Référence requise." });
  }
  const trajet = trouverTrajetParReference(reference);
  if (!trajet) {
    return res.status(404).json({ message: "Référence introuvable." });
  }

  // Enrichissement avec les libellés lisibles pour l'affichage / le reçu.
  let posteNom: string | undefined;
  let tronconNom: string | undefined;
  let departNom: string | undefined;
  let arriveeNom: string | undefined;

  if (trajet.posteId) {
    posteNom = postes.find((p) => p.id === trajet.posteId)?.nom;
  }
  if (trajet.tronconId) {
    const troncon = troncons.find((t) => t.id === trajet.tronconId);
    if (troncon) {
      tronconNom = troncon.nom;
      departNom = communes.find((c) => c.id === troncon.departCommuneId)?.nom;
      arriveeNom = communes.find((c) => c.id === troncon.arriveeCommuneId)?.nom;
    }
  }

  return res.status(200).json({
    trajet: { ...trajet, posteNom, tronconNom, departNom, arriveeNom },
  });
}
