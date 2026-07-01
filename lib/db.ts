// lib/db.ts
// Données en mémoire (réinitialisées à chaque redémarrage du serveur).
// Les 77 communes officielles du Bénin, réparties dans leurs 12 départements.

import { Commune, Poste, Troncon, Tarif, Trajet } from "./models";

export let communes: Commune[] = [
  { id: "1", nom: "Banikoara", departement: "Alibori", coordonnees: { lat: 11.2989, lng: 2.4386 } },
  { id: "2", nom: "Gogounou", departement: "Alibori", coordonnees: { lat: 10.8333, lng: 2.8333 } },
  { id: "3", nom: "Kandi", departement: "Alibori", coordonnees: { lat: 11.1342, lng: 2.9386 } },
  { id: "4", nom: "Karimama", departement: "Alibori", coordonnees: { lat: 12.0667, lng: 3.2 } },
  { id: "5", nom: "Malanville", departement: "Alibori", coordonnees: { lat: 11.8667, lng: 3.3833 } },
  { id: "6", nom: "Ségbana", departement: "Alibori", coordonnees: { lat: 11.2, lng: 3.6833 } },
  { id: "7", nom: "Boukoumbé", departement: "Atacora", coordonnees: { lat: 10.1833, lng: 1.1 } },
  { id: "8", nom: "Cobly", departement: "Atacora", coordonnees: { lat: 10.3833, lng: 0.9833 } },
  { id: "9", nom: "Kérou", departement: "Atacora", coordonnees: { lat: 10.8, lng: 2.0167 } },
  { id: "10", nom: "Kouandé", departement: "Atacora", coordonnees: { lat: 10.3333, lng: 1.6833 } },
  { id: "11", nom: "Matéri", departement: "Atacora", coordonnees: { lat: 10.7167, lng: 1.0667 } },
  { id: "12", nom: "Natitingou", departement: "Atacora", coordonnees: { lat: 10.3167, lng: 1.3833 } },
  { id: "13", nom: "Péhunco", departement: "Atacora", coordonnees: { lat: 10.6, lng: 1.8333 } },
  { id: "14", nom: "Tanguiéta", departement: "Atacora", coordonnees: { lat: 10.6167, lng: 1.2667 } },
  { id: "15", nom: "Toucountouna", departement: "Atacora", coordonnees: { lat: 10.4333, lng: 1.3833 } },
  { id: "16", nom: "Abomey-Calavi", departement: "Atlantique", coordonnees: { lat: 6.4486, lng: 2.3553 } },
  { id: "17", nom: "Allada", departement: "Atlantique", coordonnees: { lat: 6.6667, lng: 2.15 } },
  { id: "18", nom: "Kpomassè", departement: "Atlantique", coordonnees: { lat: 6.4667, lng: 1.9833 } },
  { id: "19", nom: "Ouidah", departement: "Atlantique", coordonnees: { lat: 6.3636, lng: 2.0855 } },
  { id: "20", nom: "Sô-Ava", departement: "Atlantique", coordonnees: { lat: 6.45, lng: 2.4333 } },
  { id: "21", nom: "Toffo", departement: "Atlantique", coordonnees: { lat: 6.85, lng: 2.1833 } },
  { id: "22", nom: "Tori-Bossito", departement: "Atlantique", coordonnees: { lat: 6.5667, lng: 2.1167 } },
  { id: "23", nom: "Zè", departement: "Atlantique", coordonnees: { lat: 6.6167, lng: 2.3 } },
  { id: "24", nom: "Bembéréké", departement: "Borgou", coordonnees: { lat: 10.2167, lng: 2.6667 } },
  { id: "25", nom: "Kalalé", departement: "Borgou", coordonnees: { lat: 10.2833, lng: 3.3833 } },
  { id: "26", nom: "N\'Dali", departement: "Borgou", coordonnees: { lat: 9.85, lng: 2.6833 } },
  { id: "27", nom: "Nikki", departement: "Borgou", coordonnees: { lat: 9.9333, lng: 3.2 } },
  { id: "28", nom: "Parakou", departement: "Borgou", coordonnees: { lat: 9.3372, lng: 2.6303 } },
  { id: "29", nom: "Pèrèrè", departement: "Borgou", coordonnees: { lat: 10.0333, lng: 2.7833 } },
  { id: "30", nom: "Sinendé", departement: "Borgou", coordonnees: { lat: 10.4167, lng: 2.3667 } },
  { id: "31", nom: "Tchaourou", departement: "Borgou", coordonnees: { lat: 8.8833, lng: 2.5833 } },
  { id: "32", nom: "Bantè", departement: "Collines", coordonnees: { lat: 8.4167, lng: 1.8833 } },
  { id: "33", nom: "Dassa-Zoumè", departement: "Collines", coordonnees: { lat: 7.75, lng: 2.1833 } },
  { id: "34", nom: "Glazoué", departement: "Collines", coordonnees: { lat: 7.9833, lng: 2.3333 } },
  { id: "35", nom: "Ouèssè", departement: "Collines", coordonnees: { lat: 8.2833, lng: 2.3833 } },
  { id: "36", nom: "Savalou", departement: "Collines", coordonnees: { lat: 7.9333, lng: 1.9833 } },
  { id: "37", nom: "Savè", departement: "Collines", coordonnees: { lat: 8.0333, lng: 2.4833 } },
  { id: "38", nom: "Aplahoué", departement: "Couffo", coordonnees: { lat: 6.9333, lng: 1.6833 } },
  { id: "39", nom: "Djakotomey", departement: "Couffo", coordonnees: { lat: 6.9167, lng: 1.7833 } },
  { id: "40", nom: "Dogbo", departement: "Couffo", coordonnees: { lat: 6.8, lng: 1.7833 } },
  { id: "41", nom: "Klouékanmè", departement: "Couffo", coordonnees: { lat: 6.9667, lng: 1.85 } },
  { id: "42", nom: "Lalo", departement: "Couffo", coordonnees: { lat: 6.9167, lng: 1.8833 } },
  { id: "43", nom: "Toviklin", departement: "Couffo", coordonnees: { lat: 6.85, lng: 1.8167 } },
  { id: "44", nom: "Bassila", departement: "Donga", coordonnees: { lat: 9.0167, lng: 1.6667 } },
  { id: "45", nom: "Copargo", departement: "Donga", coordonnees: { lat: 9.8333, lng: 1.5833 } },
  { id: "46", nom: "Djougou", departement: "Donga", coordonnees: { lat: 9.7086, lng: 1.666 } },
  { id: "47", nom: "Ouaké", departement: "Donga", coordonnees: { lat: 9.7833, lng: 1.3833 } },
  { id: "48", nom: "Cotonou", departement: "Littoral", coordonnees: { lat: 6.3654, lng: 2.4183 } },
  { id: "49", nom: "Athiémé", departement: "Mono", coordonnees: { lat: 6.5833, lng: 1.6667 } },
  { id: "50", nom: "Bopa", departement: "Mono", coordonnees: { lat: 6.5833, lng: 1.9667 } },
  { id: "51", nom: "Comè", departement: "Mono", coordonnees: { lat: 6.4, lng: 1.8833 } },
  { id: "52", nom: "Grand-Popo", departement: "Mono", coordonnees: { lat: 6.2833, lng: 1.8333 } },
  { id: "53", nom: "Houéyogbé", departement: "Mono", coordonnees: { lat: 6.5, lng: 1.8167 } },
  { id: "54", nom: "Lokossa", departement: "Mono", coordonnees: { lat: 6.6389, lng: 1.7167 } },
  { id: "55", nom: "Adjarra", departement: "Ouémé", coordonnees: { lat: 6.5167, lng: 2.5667 } },
  { id: "56", nom: "Adjohoun", departement: "Ouémé", coordonnees: { lat: 6.7, lng: 2.4833 } },
  { id: "57", nom: "Aguégués", departement: "Ouémé", coordonnees: { lat: 6.45, lng: 2.5667 } },
  { id: "58", nom: "Akpro-Missérété", departement: "Ouémé", coordonnees: { lat: 6.5833, lng: 2.5333 } },
  { id: "59", nom: "Avrankou", departement: "Ouémé", coordonnees: { lat: 6.5333, lng: 2.6667 } },
  { id: "60", nom: "Bonou", departement: "Ouémé", coordonnees: { lat: 6.9, lng: 2.45 } },
  { id: "61", nom: "Dangbo", departement: "Ouémé", coordonnees: { lat: 6.5833, lng: 2.45 } },
  { id: "62", nom: "Porto-Novo", departement: "Ouémé", coordonnees: { lat: 6.4969, lng: 2.6283 } },
  { id: "63", nom: "Sèmè-Kpodji", departement: "Ouémé", coordonnees: { lat: 6.3667, lng: 2.5833 } },
  { id: "64", nom: "Adja-Ouèrè", departement: "Plateau", coordonnees: { lat: 7.15, lng: 2.55 } },
  { id: "65", nom: "Ifangni", departement: "Plateau", coordonnees: { lat: 6.9, lng: 2.6667 } },
  { id: "66", nom: "Kétou", departement: "Plateau", coordonnees: { lat: 7.3667, lng: 2.6 } },
  { id: "67", nom: "Pobè", departement: "Plateau", coordonnees: { lat: 6.9667, lng: 2.6667 } },
  { id: "68", nom: "Sakété", departement: "Plateau", coordonnees: { lat: 6.7333, lng: 2.65 } },
  { id: "69", nom: "Abomey", departement: "Zou", coordonnees: { lat: 7.1833, lng: 1.9833 } },
  { id: "70", nom: "Agbangnizoun", departement: "Zou", coordonnees: { lat: 7.1167, lng: 2.0167 } },
  { id: "71", nom: "Bohicon", departement: "Zou", coordonnees: { lat: 7.1781, lng: 2.0667 } },
  { id: "72", nom: "Covè", departement: "Zou", coordonnees: { lat: 7.2333, lng: 2.3333 } },
  { id: "73", nom: "Djidja", departement: "Zou", coordonnees: { lat: 7.3667, lng: 1.9333 } },
  { id: "74", nom: "Ouinhi", departement: "Zou", coordonnees: { lat: 7.2, lng: 2.4333 } },
  { id: "75", nom: "Za-Kpota", departement: "Zou", coordonnees: { lat: 7.1167, lng: 2.2667 } },
  { id: "76", nom: "Zagnanado", departement: "Zou", coordonnees: { lat: 7.2667, lng: 2.35 } },
  { id: "77", nom: "Zogbodomey", departement: "Zou", coordonnees: { lat: 7.0667, lng: 2.2167 } },
];

// TOTAL: 77 communes

export let postes: Poste[] = [
  { id: "1", nom: "Ahozon", communeId: "19", type: "peage_pesage", coordonnees: { lat: 6.3636, lng: 2.0855 }, actif: true },
  { id: "2", nom: "Houègbo", communeId: "17", type: "peage", coordonnees: { lat: 6.65, lng: 2.1167 }, actif: true },
  { id: "3", nom: "Grand-Popo", communeId: "52", type: "peage", coordonnees: { lat: 6.2833, lng: 1.8333 }, actif: true },
  { id: "4", nom: "Ekpè", communeId: "63", type: "peage_pesage", coordonnees: { lat: 6.3667, lng: 2.5833 }, actif: true },
  { id: "5", nom: "Kpédékpo", communeId: "66", type: "peage_pesage", coordonnees: { lat: 7.3667, lng: 2.6 }, actif: true },
  { id: "6", nom: "Sirarou", communeId: "26", type: "peage_pesage", coordonnees: { lat: 9.6333, lng: 2.7 }, actif: true },
  { id: "7", nom: "Biro", communeId: "27", type: "peage_pesage", coordonnees: { lat: 9.9333, lng: 3.2 }, actif: true },
  { id: "8", nom: "Liboussou", communeId: "6", type: "peage_pesage", coordonnees: { lat: 11.2, lng: 3.6833 }, actif: true },
  { id: "9", nom: "Tigninti", communeId: "12", type: "peage_pesage", coordonnees: { lat: 10.3167, lng: 1.3833 }, actif: true },
  { id: "10", nom: "Diho", communeId: "37", type: "peage_pesage", coordonnees: { lat: 8.0333, lng: 2.4833 }, actif: true },
];

export let troncons: Troncon[] = [
  { id: "1", nom: "Cotonou – Porto-Novo", departCommuneId: "48", arriveeCommuneId: "62", postesIds: ["4"], distanceKm: 30, dureeMinutes: 40 },
  { id: "2", nom: "Cotonou – Ouidah", departCommuneId: "48", arriveeCommuneId: "19", postesIds: ["1"], distanceKm: 42, dureeMinutes: 50 },
  { id: "3", nom: "Cotonou – Grand-Popo", departCommuneId: "48", arriveeCommuneId: "52", postesIds: ["1", "3"], distanceKm: 85, dureeMinutes: 90 },
  { id: "4", nom: "Cotonou – Bohicon", departCommuneId: "48", arriveeCommuneId: "71", postesIds: ["2"], distanceKm: 125, dureeMinutes: 120 },
  { id: "5", nom: "Cotonou – Parakou", departCommuneId: "48", arriveeCommuneId: "28", postesIds: ["2", "10"], distanceKm: 420, dureeMinutes: 360 },
  { id: "6", nom: "Parakou – Malanville", departCommuneId: "28", arriveeCommuneId: "5", postesIds: ["6", "8"], distanceKm: 330, dureeMinutes: 300 },
  { id: "7", nom: "Parakou – Nikki", departCommuneId: "28", arriveeCommuneId: "27", postesIds: ["7"], distanceKm: 110, dureeMinutes: 100 },
  { id: "8", nom: "Porto-Novo – Kétou", departCommuneId: "62", arriveeCommuneId: "66", postesIds: ["5"], distanceKm: 95, dureeMinutes: 110 },
  { id: "9", nom: "Natitingou – Tanguiéta", departCommuneId: "12", arriveeCommuneId: "14", postesIds: ["9"], distanceKm: 45, dureeMinutes: 50 },
];

export let tarifs: Tarif[] = [
  { id: "1", tronconId: "1", categorieVehicule: "leger", montantFCFA: 500, dateDebut: "2026-01-01" },
  { id: "2", tronconId: "1", categorieVehicule: "lourd", montantFCFA: 1500, dateDebut: "2026-01-01" },
  { id: "3", tronconId: "2", categorieVehicule: "leger", montantFCFA: 500, dateDebut: "2026-01-01" },
  { id: "4", tronconId: "2", categorieVehicule: "lourd", montantFCFA: 1500, dateDebut: "2026-01-01" },
  { id: "5", tronconId: "3", categorieVehicule: "leger", montantFCFA: 1000, dateDebut: "2026-01-01" },
  { id: "6", tronconId: "3", categorieVehicule: "lourd", montantFCFA: 3000, dateDebut: "2026-01-01" },
  { id: "7", tronconId: "4", categorieVehicule: "leger", montantFCFA: 500, dateDebut: "2026-01-01" },
  { id: "8", tronconId: "4", categorieVehicule: "lourd", montantFCFA: 1500, dateDebut: "2026-01-01" },
  { id: "9", tronconId: "5", categorieVehicule: "leger", montantFCFA: 1000, dateDebut: "2026-01-01" },
  { id: "10", tronconId: "5", categorieVehicule: "lourd", montantFCFA: 3000, dateDebut: "2026-01-01" },
  { id: "11", tronconId: "6", categorieVehicule: "leger", montantFCFA: 1000, dateDebut: "2026-01-01" },
  { id: "12", tronconId: "6", categorieVehicule: "lourd", montantFCFA: 3000, dateDebut: "2026-01-01" },
  { id: "13", tronconId: "7", categorieVehicule: "leger", montantFCFA: 500, dateDebut: "2026-01-01" },
  { id: "14", tronconId: "7", categorieVehicule: "lourd", montantFCFA: 1500, dateDebut: "2026-01-01" },
  { id: "15", tronconId: "8", categorieVehicule: "leger", montantFCFA: 500, dateDebut: "2026-01-01" },
  { id: "16", tronconId: "8", categorieVehicule: "lourd", montantFCFA: 1500, dateDebut: "2026-01-01" },
  { id: "17", tronconId: "9", categorieVehicule: "leger", montantFCFA: 500, dateDebut: "2026-01-01" },
  { id: "18", tronconId: "9", categorieVehicule: "lourd", montantFCFA: 1500, dateDebut: "2026-01-01" },
  { id: "19", posteId: "1", categorieVehicule: "leger", montantFCFA: 500, dateDebut: "2026-01-01" }, // Ahozon
  { id: "20", posteId: "1", categorieVehicule: "lourd", montantFCFA: 1500, dateDebut: "2026-01-01" },
  { id: "21", posteId: "2", categorieVehicule: "leger", montantFCFA: 500, dateDebut: "2026-01-01" }, // Houègbo
  { id: "22", posteId: "2", categorieVehicule: "lourd", montantFCFA: 1500, dateDebut: "2026-01-01" },
  { id: "23", posteId: "3", categorieVehicule: "leger", montantFCFA: 400, dateDebut: "2026-01-01" }, // Grand-Popo
  { id: "24", posteId: "3", categorieVehicule: "lourd", montantFCFA: 1200, dateDebut: "2026-01-01" },
  { id: "25", posteId: "4", categorieVehicule: "leger", montantFCFA: 300, dateDebut: "2026-01-01" }, // Ekpè
  { id: "26", posteId: "4", categorieVehicule: "lourd", montantFCFA: 1000, dateDebut: "2026-01-01" },
  { id: "27", posteId: "5", categorieVehicule: "leger", montantFCFA: 1000, dateDebut: "2026-01-01" }, // Kpédékpo
  { id: "28", posteId: "5", categorieVehicule: "lourd", montantFCFA: 2500, dateDebut: "2026-01-01" },
  { id: "29", posteId: "6", categorieVehicule: "leger", montantFCFA: 1000, dateDebut: "2026-01-01" }, // Sirarou
  { id: "30", posteId: "6", categorieVehicule: "lourd", montantFCFA: 2500, dateDebut: "2026-01-01" },
  { id: "31", posteId: "7", categorieVehicule: "leger", montantFCFA: 1000, dateDebut: "2026-01-01" }, // Biro
  { id: "32", posteId: "7", categorieVehicule: "lourd", montantFCFA: 2500, dateDebut: "2026-01-01" },
  { id: "33", posteId: "8", categorieVehicule: "leger", montantFCFA: 1000, dateDebut: "2026-01-01" }, // Liboussou
  { id: "34", posteId: "8", categorieVehicule: "lourd", montantFCFA: 2500, dateDebut: "2026-01-01" },
  { id: "35", posteId: "9", categorieVehicule: "leger", montantFCFA: 800, dateDebut: "2026-01-01" }, // Tigninti
  { id: "36", posteId: "9", categorieVehicule: "lourd", montantFCFA: 2000, dateDebut: "2026-01-01" },
  { id: "37", posteId: "10", categorieVehicule: "leger", montantFCFA: 600, dateDebut: "2026-01-01" }, // Diho
  { id: "38", posteId: "10", categorieVehicule: "lourd", montantFCFA: 1800, dateDebut: "2026-01-01" },
];

export let trajets: Trajet[] = [];
