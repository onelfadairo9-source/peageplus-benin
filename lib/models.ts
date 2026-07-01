// lib/models.ts

export type Departement =
  | "Alibori"
  | "Atacora"
  | "Atlantique"
  | "Borgou"
  | "Collines"
  | "Couffo"
  | "Donga"
  | "Littoral"
  | "Mono"
  | "Ouémé"
  | "Plateau"
  | "Zou";

export interface Commune {
  id: string;
  nom: string;
  departement: Departement;
  coordonnees?: { lat: number; lng: number };
}

export type TypePoste = "peage" | "peage_pesage";

export interface Poste {
  id: string;
  nom: string;
  communeId: string;
  type: TypePoste;
  coordonnees: { lat: number; lng: number };
  imageUrl?: string;
  actif: boolean;
}

export interface Troncon {
  id: string;
  nom: string;
  departCommuneId: string;
  arriveeCommuneId: string;
  postesIds: string[];
  distanceKm: number;
  dureeMinutes: number;
}

export type CategorieVehicule = "leger" | "lourd";

export interface Tarif {
  id: string;
  tronconId?: string;
  posteId?: string;
  categorieVehicule: CategorieVehicule;
  montantFCFA: number;
  dateDebut: string;
  dateFin?: string;
}

export type StatutPaiement = "en_attente" | "paye" | "echoue" | "annule";
export type ModePaiement = "predefini" | "direct";

export interface Trajet {
  id: string;
  reference: string;
  mode: ModePaiement;
  nomComplet: string;
  telephone: string;
  plaque: string;
  categorieVehicule: CategorieVehicule;
  tronconId?: string;
  posteId?: string;
  montantFCFA: number;
  statut: StatutPaiement;
  kkiapayTransactionId?: string;
  createdAt: string;
  paidAt?: string;
}
