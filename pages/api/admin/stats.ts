import type { NextApiRequest, NextApiResponse } from "next";
import { communes, postes, troncons, tarifs, trajets } from "../../../lib/db";
import { estAdminValide, tokenDepuisRequete } from "../../../lib/auth";

function jourFCFA(dateISO: string) {
  return dateISO.slice(0, 10);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!estAdminValide(tokenDepuisRequete(req))) {
    return res.status(401).json({ message: "Non authentifié." });
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Méthode non autorisée." });
  }

  const trajetsPayes = trajets.filter((t) => t.statut === "paye");
  const revenuTotal = trajetsPayes.reduce((sum, t) => sum + t.montantFCFA, 0);
  const aujourdHui = new Date().toISOString().slice(0, 10);
  const revenuAujourdHui = trajetsPayes
    .filter((t) => t.paidAt?.slice(0, 10) === aujourdHui)
    .reduce((sum, t) => sum + t.montantFCFA, 0);

  // --- Revenu des 7 derniers jours ---
  const revenuParJour: { date: string; revenu: number; trajets: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const jour = d.toISOString().slice(0, 10);
    const trajetsDuJour = trajetsPayes.filter((t) => t.paidAt && jourFCFA(t.paidAt) === jour);
    revenuParJour.push({
      date: jour,
      revenu: trajetsDuJour.reduce((sum, t) => sum + t.montantFCFA, 0),
      trajets: trajetsDuJour.length,
    });
  }

  // --- Revenu par poste (postes directs) ---
  const revenuParPoste = postes
    .map((p) => {
      const trajetsPoste = trajetsPayes.filter((t) => t.posteId === p.id);
      return {
        nom: p.nom,
        revenu: trajetsPoste.reduce((sum, t) => sum + t.montantFCFA, 0),
        trajets: trajetsPoste.length,
      };
    })
    .filter((p) => p.trajets > 0)
    .sort((a, b) => b.revenu - a.revenu);

  // --- Répartition par mode ---
  const parMode = [
    {
      mode: "Prédéfini",
      trajets: trajetsPayes.filter((t) => t.mode === "predefini").length,
      revenu: trajetsPayes.filter((t) => t.mode === "predefini").reduce((s, t) => s + t.montantFCFA, 0),
    },
    {
      mode: "Direct",
      trajets: trajetsPayes.filter((t) => t.mode === "direct").length,
      revenu: trajetsPayes.filter((t) => t.mode === "direct").reduce((s, t) => s + t.montantFCFA, 0),
    },
  ];

  // --- Répartition par catégorie de véhicule ---
  const parCategorie = [
    { categorie: "Léger", trajets: trajetsPayes.filter((t) => t.categorieVehicule === "leger").length },
    { categorie: "Lourd", trajets: trajetsPayes.filter((t) => t.categorieVehicule === "lourd").length },
  ];

  return res.status(200).json({
    stats: {
      totalCommunes: communes.length,
      totalPostes: postes.length,
      postesActifs: postes.filter((p) => p.actif).length,
      totalTroncons: troncons.length,
      totalTarifs: tarifs.length,
      totalTrajets: trajets.length,
      trajetsPayes: trajetsPayes.length,
      trajetsEnAttente: trajets.filter((t) => t.statut === "en_attente").length,
      revenuTotal,
      revenuAujourdHui,
      revenuParJour,
      revenuParPoste,
      parMode,
      parCategorie,
    },
  });
}
