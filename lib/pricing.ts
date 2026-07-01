// lib/pricing.ts
import { troncons, tarifs, postes } from "./db";
import { CategorieVehicule } from "./models";

export function tarifPourTroncon(tronconId: string, categorie: CategorieVehicule) {
  return tarifs.find(
    (t) => t.tronconId === tronconId && t.categorieVehicule === categorie
  );
}

export function tarifPourPoste(posteId: string, categorie: CategorieVehicule) {
  return tarifs.find(
    (t) => t.posteId === posteId && t.categorieVehicule === categorie
  );
}

export function trouverTroncon(departCommuneId: string, arriveeCommuneId: string) {
  return troncons.find(
    (t) =>
      (t.departCommuneId === departCommuneId && t.arriveeCommuneId === arriveeCommuneId) ||
      (t.departCommuneId === arriveeCommuneId && t.arriveeCommuneId === departCommuneId)
  );
}

export function postesDuTroncon(tronconId: string) {
  const t = troncons.find((tr) => tr.id === tronconId);
  if (!t) return [];
  return t.postesIds.map((id) => postes.find((p) => p.id === id)).filter(Boolean);
}
