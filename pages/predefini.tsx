import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import Layout from "../components/Layout";
import Map from "../components/Map";

interface Commune {
  id: string;
  nom: string;
  departement: string;
}
interface Troncon {
  id: string;
  nom: string;
  departCommuneId: string;
  arriveeCommuneId: string;
  postesIds: string[];
  distanceKm: number;
  dureeMinutes: number;
}
import { TypePoste } from "../lib/models";

interface Poste {
  id: string;
  nom: string;
  communeId: string;
  type: TypePoste;
  actif: boolean;
  coordonnees: { lat: number; lng: number };
}

declare global {
  interface Window {
    openKkiapayWidget?: (config: Record<string, unknown>) => void;
    addSuccessListener?: (cb: (response: { transactionId: string }) => void) => void;
    addFailedListener?: (cb: (response: unknown) => void) => void;
  }
}

export default function Predefini() {
  const router = useRouter();
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [troncons, setTroncons] = useState<Troncon[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);

  const [nomComplet, setNomComplet] = useState("");
  const [telephone, setTelephone] = useState("");
  const [plaque, setPlaque] = useState("");
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [categorie, setCategorie] = useState<"leger" | "lourd">("leger");

  const [trajet, setTrajet] = useState<any>(null);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [kkiapayConfig, setKkiapayConfig] = useState<{ publicKey: string; sandbox: boolean } | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    fetch("/api/communes").then((r) => r.json()).then((d) => setCommunes(d.communes));
    fetch("/api/troncons").then((r) => r.json()).then((d) => setTroncons(d.troncons));
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

  async function calculerTrajet() {
    setErreur("");
    if (!nomComplet || !telephone || !plaque || !depart || !arrivee) {
      setErreur("Merci de remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/trajets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "predefini",
          nomComplet,
          telephone,
          plaque,
          categorieVehicule: categorie,
          departCommuneId: depart,
          arriveeCommuneId: arrivee,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.message ?? "Erreur lors du calcul du trajet.");
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

  const tronconActuel = trajet ? troncons.find((t) => t.id === trajet.tronconId) : null;
  const postesTrajet = tronconActuel
    ? tronconActuel.postesIds.map((id) => postes.find((p) => p.id === id)).filter(Boolean) as Poste[]
    : [];
  const departNom = communes.find((c) => c.id === depart)?.nom;
  const arriveeNom = communes.find((c) => c.id === arrivee)?.nom;

  return (
    <Layout title="Mode Prédéfini">
      <Script src="https://cdn.kkiapay.me/k.js" onLoad={() => setWidgetReady(true)} />
      <div className="container-narrow" style={{ padding: "40px 24px 60px" }}>
        <h1 className="section-title">Programmez votre trajet</h1>
        <p className="section-sub">
          Renseignez votre trajet, payez à l&rsquo;avance et passez les postes
          sans attendre.
        </p>

        <div className="form-card">
          {erreur && <div className="alert alert-error">{erreur}</div>}

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

          <div className="form-row">
            <div className="form-group">
              <label>Commune de départ</label>
              <select value={depart} onChange={(e) => setDepart(e.target.value)}>
                <option value="">Choisir...</option>
                {communes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Commune d&rsquo;arrivée</label>
              <select value={arrivee} onChange={(e) => setArrivee(e.target.value)}>
                <option value="">Choisir...</option>
                {communes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Type de véhicule</label>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value as "leger" | "lourd")}>
              <option value="leger">Véhicule léger</option>
              <option value="lourd">Poids lourd</option>
            </select>
          </div>

          {!trajet ? (
            <button className="btn btn-rouge btn-block" onClick={calculerTrajet} disabled={loading}>
              {loading ? <span className="spinner" /> : "Calculer le trajet"}
            </button>
          ) : (
            <>
              <div className="trip-summary">
                <div className="trip-route">{departNom} → {arriveeNom}</div>
                <div className="trip-meta">
                  Distance : {tronconActuel?.distanceKm} km · Durée estimée : {tronconActuel?.dureeMinutes} min
                </div>
                <div className="trip-meta">Référence : {trajet.reference}</div>
                <div className="trip-amount">{trajet.montantFCFA.toLocaleString("fr-FR")} FCFA</div>
              </div>

              {postesTrajet.length > 0 && (
                <div style={{ height: "260px", margin: "18px 0", borderRadius: "10px", overflow: "hidden", border: "2px solid var(--bordure)" }}>
                  <Map postes={postesTrajet} zoom={8} />
                </div>
              )}

              <button className="btn btn-rouge btn-block" onClick={payer} disabled={loading || !widgetReady}>
                {loading ? <span className="spinner" /> : `Payer ${trajet.montantFCFA.toLocaleString("fr-FR")} FCFA`}
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
