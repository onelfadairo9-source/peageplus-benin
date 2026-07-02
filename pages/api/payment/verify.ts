import type { NextApiRequest, NextApiResponse } from "next";
import { kkiapay } from "@kkiapay-org/nodejs-sdk";
import { trouverTrajetParReference, activerApresPaiementVerifie } from "../../../lib/services";

const k = kkiapay({
  privatekey: process.env.KKIAPAY_PRIVATE_KEY ?? "",
  publickey: process.env.KKIAPAY_PUBLIC_KEY ?? "",
  secretkey: process.env.KKIAPAY_SECRET ?? "",
  sandbox: process.env.KKIAPAY_SANDBOX === "true",
});

/**
 * Vérifie une transaction Kkiapay auprès des serveurs Kkiapay avant
 * d'activer le trajet. On ne fait jamais confiance à un simple "succès"
 * renvoyé par le widget côté navigateur — la transaction est toujours
 * revérifiée ici, côté serveur.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Méthode non autorisée." });
  }

  const { reference, transactionId } = req.body;
  if (!reference || !transactionId) {
    return res.status(400).json({ success: false, message: "Paramètres manquants." });
  }

  const trajet = trouverTrajetParReference(reference);
  if (!trajet) {
    return res.status(404).json({ success: false, message: "Référence introuvable." });
  }
  if (trajet.statut === "paye") {
    return res.status(200).json({ success: true, message: "Paiement déjà confirmé." });
  }

  try {
    const verification = await k.verify(transactionId);
    const isSuccess = verification && verification.status === "SUCCESS";
    const amountPaid = verification ? Number(verification.amount) : null;

    if (!isSuccess) {
      return res.status(402).json({ success: false, message: "Paiement non confirmé par Kkiapay." });
    }

    if (amountPaid !== null && amountPaid !== trajet.montantFCFA) {
      console.warn(
        `Montant incohérent pour ${reference}: attendu ${trajet.montantFCFA}, reçu ${amountPaid}`
      );
      return res.status(402).json({ success: false, message: "Montant payé incohérent." });
    }

    const result = activerApresPaiementVerifie(reference, transactionId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("Erreur vérification Kkiapay:", err);
    return res.status(500).json({ success: false, message: "Erreur lors de la vérification du paiement." });
  }
}
