import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAdminGuard } from "../../lib/useAdminGuard";

interface Commune { id: string; nom: string; }
interface Poste { id: string; nom: string; }
interface Troncon {
  id: string; nom: string; departCommuneId: string;
  arriveeCommuneId: string; postesIds: string[];
  distanceKm: number; dureeMinutes: number;
}

export default function AdminTroncons() {
  const ready = useAdminGuard();
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [troncons, setTroncons] = useState<Troncon[]>([]);
  const [nom, setNom] = useState("");
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [postesSelectionnes, setPostesSelectionnes] = useState<string[]>([]);
  const [distance, setDistance] = useState("");
  const [duree, setDuree] = useState("");
  const [erreur, setErreur] = useState("");

  function charger() {
    fetch("/api/communes").then((r) => r.json()).then((d) => setCommunes(d.communes));
    fetch("/api/postes").then((r) => r.json()).then((d) => setPostes(d.postes));
    fetch("/api/troncons").then((r) => r.json()).then((d) => setTroncons(d.troncons));
  }

  useEffect(() => { if (ready) charger(); }, [ready]);

  function togglePoste(id: string) {
    setPostesSelectionnes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function ajouter() {
    setErreur("");
    if (!nom || !depart || !arrivee) {
      setErreur("Nom, commune de départ et d'arrivée requis.");
      return;
    }
    const res = await fetch("/api/troncons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom, departCommuneId: depart, arriveeCommuneId: arrivee,
        postesIds: postesSelectionnes,
        distanceKm: parseFloat(distance) || 0,
        dureeMinutes: parseFloat(duree) || 0,
      }),
    });
    if (res.ok) {
      setNom(""); setDepart(""); setArrivee(""); setPostesSelectionnes([]);
      setDistance(""); setDuree(""); charger();
    } else { const d = await res.json(); setErreur(d.message ?? "Erreur lors de l'ajout."); }
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer ce tronçon ?")) return;
    await fetch(`/api/troncons/${id}`, { method: "DELETE" });
    charger();
  }

  if (!ready) return null;

  return (
    <AdminLayout title="Gestion des tronçons">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Ajouter un tronçon</h3>
        {erreur && <div className="alert alert-error">{erreur}</div>}
        <div className="form-group">
          <label>Nom du tronçon</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Cotonou – Parakou" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Commune de départ</label>
            <select value={depart} onChange={(e) => setDepart(e.target.value)}>
              <option value="">Choisir…</option>
              {communes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Commune d&rsquo;arrivée</label>
            <select value={arrivee} onChange={(e) => setArrivee(e.target.value)}>
              <option value="">Choisir…</option>
              {communes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Distance (km)</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="420" />
          </div>
          <div className="form-group">
            <label>Durée estimée (min)</label>
            <input type="number" value={duree} onChange={(e) => setDuree(e.target.value)} placeholder="360" />
          </div>
        </div>
        <div className="form-group">
          <label>Postes traversés (sélection multiple)</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
            {postes.map((p) => (
              <label key={p.id} className="checkbox-row" style={{ padding: "6px 12px", background: postesSelectionnes.includes(p.id) ? "var(--rouge-soft)" : "#f5f5f5", borderRadius: "6px", cursor: "pointer" }}>
                <input type="checkbox" checked={postesSelectionnes.includes(p.id)} onChange={() => togglePoste(p.id)} />
                {p.nom}
              </label>
            ))}
          </div>
        </div>
        <button className="btn btn-rouge" onClick={ajouter}>Ajouter le tronçon</button>
      </div>

      <h3 style={{ marginTop: "28px" }}>Liste des tronçons ({troncons.length})</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nom</th><th>Départ</th><th>Arrivée</th><th>Distance</th><th>Postes</th><th></th></tr>
          </thead>
          <tbody>
            {troncons.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.nom}</strong></td>
                <td>{communes.find((c) => c.id === t.departCommuneId)?.nom ?? "—"}</td>
                <td>{communes.find((c) => c.id === t.arriveeCommuneId)?.nom ?? "—"}</td>
                <td>{t.distanceKm} km</td>
                <td>{t.postesIds.map((id) => postes.find((p) => p.id === id)?.nom ?? id).join(", ") || "—"}</td>
                <td>
                  <button className="btn btn-rouge" style={{ padding: "6px 12px", fontSize: "0.78rem" }} onClick={() => supprimer(t.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
