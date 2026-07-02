import type { NextApiRequest, NextApiResponse } from "next";
import { trajets } from "../../lib/db";

/**
 * Vérifie si une plaque a un trajet payé et valide pour passer un poste donné.
 * Utilisé par les barrières automatiques : GET /api/check-passage?plaque=AB-1234-CD&posteId=1
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Méthode non autorisée." });
  }

  const { plaque, posteId } = req.query;
  if (!plaque || typeof plaque !== "string") {
    return res.status(400).json({ message: "Plaque requise." });
  }

  const plaqueNormalisee = plaque.toUpperCase();

  const trajet = trajets.find(
    (t) =>
      t.plaque === plaqueNormalisee &&
      t.statut === "paye" &&
      (posteId ? t.posteId === posteId : true)
  );

  return res.status(200).json({
    autorise: !!trajet,
    reference: trajet?.reference ?? null,
    mode: trajet?.mode ?? null,
  });
}
