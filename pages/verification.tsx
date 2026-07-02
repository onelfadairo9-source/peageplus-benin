import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { genererRecuPDF } from "../lib/receipt";

const statutLabel: Record<string, string> = {
  paye: "Payé",
  en_attente: "En attente de paiement",
  echoue: "Échoué",
  annule: "Annulé",
};
const statutClass: Record<string, string> = {
  paye: "badge-paye",
  en_attente: "badge-attente",
  echoue: "badge-echoue",
  annule: "badge-annule",
};

function TrajetCard({ trajet }: { trajet: any }) {
  const [genererPdf, setGenererPdf] = useState(false);
  const [erreurPdf, setErreurPdf] = useState("");

  async function telecharger() {
    setGenererPdf(true);
    setErreurPdf("");
    try {
      await genererRecuPDF(trajet);
    } catch {
      setErreurPdf("Impossible de générer le reçu.");
    } finally {
      setGenererPdf(false);
    }
  }

  return (
    <div className="trip-summary" style={{ marginTop: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="trip-route">{trajet.reference}</div>
        <span className={`badge ${statutClass[trajet.statut]}`}>{statutLabel[trajet.statut]}</span>
      </div>
      {trajet.mode === "predefini" && trajet.departNom && trajet.arriveeNom ? (
        <div className="trip-meta">Trajet : {trajet.departNom} → {trajet.arriveeNom}</div>
      ) : trajet.posteNom ? (
        <div className="trip-meta">Poste : {trajet.posteNom}</div>
      ) : null}
      <div className="trip-meta">Conducteur : {trajet.nomComplet}</div>
      <div className="trip-meta">Plaque : {trajet.plaque}</div>
      <div className="trip-meta">Mode : {trajet.mode === "predefini" ? "Prédéfini" : "Direct"}</div>
      <div className="trip-amount">{trajet.montantFCFA.toLocaleString("fr-FR")} FCFA</div>
      {trajet.paidAt && (
        <div className="trip-meta" style={{ marginTop: "6px" }}>
          Payé le {new Date(trajet.paidAt).toLocaleString("fr-FR")}
        </div>
      )}
      {erreurPdf && <div className="alert alert-error" style={{ marginTop: "10px" }}>{erreurPdf}</div>}
      <button
        className="btn btn-outline btn-block"
        style={{ marginTop: "14px" }}
        onClick={telecharger}
        disabled={genererPdf}
      >
        {genererPdf ? <span className="spinner" /> : "📄 Télécharger le reçu (PDF)"}
      </button>
    </div>
  );
}

export default function Verification() {
  const router = useRouter();
  const [onglet, setOnglet] = useState<"reference" | "telephone">("reference");

  // Onglet référence
  const [reference, setReference] = useState("");
  const [trajet, setTrajet] = useState<any>(null);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  // Onglet téléphone
  const [telephone, setTelephone] = useState("");
  const [resultats, setResultats] = useState<any[] | null>(null);
  const [erreurTel, setErreurTel] = useState("");
  const [loadingTel, setLoadingTel] = useState(false);

  useEffect(() => {
    if (router.query.reference && typeof router.query.reference === "string") {
      setReference(router.query.reference);
      rechercher(router.query.reference);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.reference]);

  async function rechercher(ref?: string) {
    const r = ref ?? reference;
    if (!r) return;
    setErreur("");
    setLoading(true);
    setTrajet(null);
    try {
      const res = await fetch(`/api/trajets/${encodeURIComponent(r)}`);
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.message ?? "Référence introuvable.");
        return;
      }
      setTrajet(data.trajet);
    } catch {
      setErreur("Erreur réseau, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  async function rechercherParTelephone() {
    if (!telephone) return;
    setErreurTel("");
    setLoadingTel(true);
    setResultats(null);
    try {
      const res = await fetch(`/api/trajets/recherche?telephone=${encodeURIComponent(telephone)}`);
      const data = await res.json();
      if (!res.ok) {
        setErreurTel(data.message ?? "Aucun trajet trouvé.");
        return;
      }
      setResultats(data.trajets);
    } catch {
      setErreurTel("Erreur réseau, veuillez réessayer.");
    } finally {
      setLoadingTel(false);
    }
  }

  return (
    <Layout title="Vérifier un paiement">
      <div className="container-narrow" style={{ padding: "40px 24px 60px" }}>
        <h1 className="section-title">Vérifier un paiement</h1>
        <p className="section-sub">
          Retrouvez votre trajet par référence ou par numéro de téléphone.
        </p>

        <div className="form-card">
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <button
              className={onglet === "reference" ? "btn btn-rouge" : "btn btn-outline"}
              style={{ flex: 1 }}
              onClick={() => setOnglet("reference")}
            >
              Par référence
            </button>
            <button
              className={onglet === "telephone" ? "btn btn-rouge" : "btn btn-outline"}
              style={{ flex: 1 }}
              onClick={() => setOnglet("telephone")}
            >
              Par téléphone
            </button>
          </div>

          {onglet === "reference" ? (
            <>
              <div className="form-group">
                <label>Référence</label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="Ex : PRE-260629-K7M2"
                />
              </div>
              <button className="btn btn-rouge btn-block" onClick={() => rechercher()} disabled={loading}>
                {loading ? <span className="spinner" /> : "Vérifier"}
              </button>

              {erreur && <div className="alert alert-error" style={{ marginTop: "16px" }}>{erreur}</div>}
              {trajet && <TrajetCard trajet={trajet} />}
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Numéro de téléphone</label>
                <input
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="Ex : 01 97 00 00 00"
                />
              </div>
              <button className="btn btn-rouge btn-block" onClick={rechercherParTelephone} disabled={loadingTel}>
                {loadingTel ? <span className="spinner" /> : "Rechercher mes trajets"}
              </button>

              {erreurTel && <div className="alert alert-error" style={{ marginTop: "16px" }}>{erreurTel}</div>}
              {resultats && (
                <div>
                  <p className="section-sub" style={{ marginTop: "16px", marginBottom: 0 }}>
                    {resultats.length} trajet{resultats.length > 1 ? "s" : ""} trouvé{resultats.length > 1 ? "s" : ""}
                  </p>
                  {resultats.map((t) => (
                    <TrajetCard key={t.id} trajet={t} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
