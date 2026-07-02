import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Script from "next/script";
import Layout from "../components/Layout";

interface Poste {
  id: string;
  nom: string;
  type: string;
  actif: boolean;
}

declare global {
  interface Window {
    openKkiapayWidget?: (config: Record<string, unknown>) => void;
    addSuccessListener?: (cb: (response: { transactionId: string }) => void) => void;
  }
}

export default function Direct() {
  const router = useRouter();
  const [postes, setPostes] = useState<Poste[]>([]);
  const [posteId, setPosteId] = useState("");
  const [nomComplet, setNomComplet] = useState("");
  const [telephone, setTelephone] = useState("");
  const [plaque, setPlaque] = useState("");
  const [categorie, setCategorie] = useState<"leger" | "lourd">("leger");

  const [trajet, setTrajet] = useState<any>(null);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [kkiapayConfig, setKkiapayConfig] = useState<{ publicKey: string; sandbox: boolean } | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    fetch("/api/postes").then((r) => r.json()).then((d) => setPostes(d.postes));
    fetch("/api/payment/config").then((r) => r.json()).then(setKkiapayConfig);
  }, []);

  useEffect(() => {
    if (!widgetReady || typeof window === "undefined" || !window.addSuccessListener) return;
    window.addSuccessListener(async (response) => {
      if (!trajet) return;
      setLoading(true);
      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: trajet.reference, transactionId: response.transactionId }),
        });
        const result = await res.json();
        if (result.success) {
          router.push(`/verification?reference=${trajet.reference}`);
        } else {
          setErreur(result.message ?? "Paiement non confirmé.");
        }
      } catch {
        setErreur("Erreur lors de la confirmation du paiement.");
      } finally {
        setLoading(false);
      }
    });
  }, [widgetReady, trajet, router]);

  async function creerEtPayer() {
    setErreur("");
    if (!nomComplet || !telephone || !plaque || !posteId) {
      setErreur("Merci de remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/trajets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "direct",
          nomComplet,
          telephone,
          plaque,
          categorieVehicule: categorie,
          posteId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.message ?? "Erreur lors de la création du paiement.");
        return;
      }
      setTrajet(data.trajet);
    } catch {
      setErreur("Erreur réseau, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  function payer() {
    if (!kkiapayConfig?.publicKey || !trajet) return;
    window.openKkiapayWidget?.({
      amount: trajet.montantFCFA,
      key: kkiapayConfig.publicKey,
      sandbox: kkiapayConfig.sandbox,
      position: "center",
      phone: telephone,
      data: JSON.stringify({ reference: trajet.reference }),
    });
  }

  const posteActuel = postes.find((p) => p.id === posteId);

  return (
    <Layout title="Mode Direct">
      <Script src="https://cdn.kkiapay.me/k.js" onLoad={() => setWidgetReady(true)} />
      <div className="container-narrow" style={{ padding: "40px 24px 60px" }}>
        <h1 className="section-title">Paiement au poste</h1>
        <p className="section-sub">
          Choisissez le poste où vous vous trouvez et payez immédiatement.
        </p>

        <div className="form-card">
          {erreur && <div className="alert alert-error">{erreur}</div>}

          <div className="form-group">
            <label>Poste de péage</label>
            <select value={posteId} onChange={(e) => setPosteId(e.target.value)}>
              <option value="">Choisir...</option>
              {postes.filter((p) => p.actif).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({p.type === "peage" ? "Péage" : "Péage & Pesage"})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nom complet</label>
              <input value={nomComplet} onChange={(e) => setNomComplet(e.target.value)} placeholder="Ex : Koffi Adjolala" />
            </div>
            <div className="form-group">
              <label>Téléphone (Mobile Money)</label>
              <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="01 97 00 00 00" />
            </div>
          </div>

          <div className="form-group">
            <label>Plaque d&rsquo;immatriculation</label>
            <input value={plaque} onChange={(e) => setPlaque(e.target.value.toUpperCase())} placeholder="AB-1234-CD" />
          </div>

          <div className="form-group">
            <label>Type de véhicule</label>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value as "leger" | "lourd")}>
              <option value="leger">Véhicule léger</option>
              <option value="lourd">Poids lourd</option>
            </select>
          </div>

          {!trajet ? (
            <button className="btn btn-rouge btn-block" onClick={creerEtPayer} disabled={loading}>
              {loading ? <span className="spinner" /> : "Continuer"}
            </button>
          ) : (
            <>
              <div className="trip-summary">
                <div className="trip-route">{posteActuel?.nom}</div>
                <div className="trip-meta">Référence : {trajet.reference}</div>
                <div className="trip-amount">{trajet.montantFCFA.toLocaleString("fr-FR")} FCFA</div>
              </div>
              <button className="btn btn-rouge btn-block" onClick={payer} disabled={loading || !widgetReady}>
                {loading ? <span className="spinner" /> : `Payer ${trajet.montantFCFA.toLocaleString("fr-FR")} FCFA`}
              </button>
            </>
          )}

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link href="/predefini" className="mode-link">
              💳 Je préfère programmer mon trajet à l&rsquo;avance
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
