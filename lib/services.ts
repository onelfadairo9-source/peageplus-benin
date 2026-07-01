// lib/services.ts
import { trajets } from "./db";
import { Trajet, ModePaiement, CategorieVehicule } from "./models";

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0");
}

/** Génère une référence lisible, ex: PRE-260629-K7M2 ou DIR-260629-A1B2 */
export function genererReference(mode: ModePaiement): string {
  const now = new Date();
  const datePart = `${pad(now.getFullYear() % 100)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const prefix = mode === "predefini" ? "PRE" : "DIR";
  return `${prefix}-${datePart}-${rand}`;
}

interface CreerTrajetInput {
  mode: ModePaiement;
  nomComplet: string;
  telephone: string;
  plaque: string;
  categorieVehicule: CategorieVehicule;
  tronconId?: string;
  posteId?: string;
  montantFCFA: number;
}

export function creerTrajet(input: CreerTrajetInput): Trajet {
  const trajet: Trajet = {
    id: (trajets.length + 1).toString(),
    reference: genererReference(input.mode),
    mode: input.mode,
    nomComplet: input.nomComplet,
    telephone: input.telephone,
    plaque: input.plaque.toUpperCase(),
    categorieVehicule: input.categorieVehicule,
    tronconId: input.tronconId,
    posteId: input.posteId,
    montantFCFA: input.montantFCFA,
    statut: "en_attente",
    createdAt: new Date().toISOString(),
  };
  trajets.push(trajet);
  return trajet;
}

export function trouverTrajetParReference(reference: string): Trajet | undefined {
  return trajets.find((t) => t.reference.toUpperCase() === reference.toUpperCase());
}

/**
 * Active un trajet après vérification RÉELLE de la transaction Kkiapay côté serveur.
 * Ne doit jamais être appelée avec une donnée non vérifiée venant du navigateur seul.
 */
export function activerApresPaiementVerifie(
  reference: string,
  kkiapayTransactionId: string
): { success: boolean; message: string; trajet?: Trajet } {
  const trajet = trouverTrajetParReference(reference);
  if (!trajet) {
    return { success: false, message: "Référence introuvable." };
  }
  if (trajet.statut === "paye") {
    return { success: true, message: "Paiement déjà confirmé.", trajet };
  }
  if (trajet.statut === "annule") {
    return { success: false, message: "Ce trajet a été annulé." };
  }

  trajet.statut = "paye";
  trajet.kkiapayTransactionId = kkiapayTransactionId;
  trajet.paidAt = new Date().toISOString();

  return { success: true, message: "Paiement confirmé.", trajet };
}
