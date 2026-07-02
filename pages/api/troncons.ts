import type { NextApiRequest, NextApiResponse } from "next";
import { troncons } from "../../lib/db";
import { Troncon } from "../../lib/models";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ troncons });
  }

  if (req.method === "POST") {
    const { nom, departCommuneId, arriveeCommuneId, postesIds, distanceKm, dureeMinutes } = req.body;
    if (!nom || !departCommuneId || !arriveeCommuneId) {
      return res.status(400).json({ message: "Nom, commune de départ et d'arrivée requis." });
    }
    const nouveau: Troncon = {
      id: Date.now().toString(),
      nom,
      departCommuneId,
      arriveeCommuneId,
      postesIds: postesIds ?? [],
      distanceKm: Number(distanceKm) || 0,
      dureeMinutes: Number(dureeMinutes) || 0,
    };
    troncons.push(nouveau);
    return res.status(201).json({ troncon: nouveau });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Méthode non autorisée." });
}
