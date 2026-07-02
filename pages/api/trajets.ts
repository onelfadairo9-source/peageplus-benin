import type { NextApiRequest, NextApiResponse } from "next";
import { creerTrajet } from "../../lib/services";
import { trouverTroncon, tarifPourTroncon, tarifPourPoste } from "../../lib/pricing";
import { CategorieVehicule } from "../../lib/models";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Méthode non autorisée." });
  }

  const {
    mode,
    nomComplet,
    telephone,
    plaque,
    categorieVehicule,
    departCommuneId,
    arriveeCommuneId,
    posteId,
  } = req.body;

  if (!nomComplet || !telephone || !plaque || !categorieVehicule) {
    return res.status(400).json({ message: "Informations du conducteur incomplètes." });
  }

  const categorie = categorieVehicule as CategorieVehicule;

  if (mode === "predefini") {
    if (!departCommuneId || !arriveeCommuneId) {
      return res.status(400).json({ message: "Communes de départ et d'arrivée requises." });
    }
    const troncon = trouverTroncon(departCommuneId, arriveeCommuneId);
    if (!troncon) {
      return res.status(404).json({ message: "Aucun tronçon trouvé pour ce trajet." });
    }
    const tarif = tarifPourTroncon(troncon.id, categorie);
    if (!tarif) {
      return res.status(404).json({ message: "Tarif introuvable pour ce trajet et ce véhicule." });
    }
    const trajet = creerTrajet({
      mode: "predefini",
      nomComplet,
      telephone,
      plaque,
      categorieVehicule: categorie,
      tronconId: troncon.id,
      montantFCFA: tarif.montantFCFA,
    });
    return res.status(201).json({ trajet });
  }

  if (mode === "direct") {
    if (!posteId) {
      return res.status(400).json({ message: "Poste de péage requis." });
    }
    const tarif = tarifPourPoste(posteId, categorie);
    if (!tarif) {
      return res.status(404).json({ message: "Tarif introuvable pour ce poste et ce véhicule." });
    }
    const trajet = creerTrajet({
      mode: "direct",
      nomComplet,
      telephone,
      plaque,
      categorieVehicule: categorie,
      posteId,
      montantFCFA: tarif.montantFCFA,
    });
    return res.status(201).json({ trajet });
  }

  return res.status(400).json({ message: "Mode de paiement invalide." });
}
