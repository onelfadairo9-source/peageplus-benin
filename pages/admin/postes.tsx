import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAdminGuard } from "../../lib/useAdminGuard";
import { TypePoste } from "../../lib/models";

interface Commune { id: string; nom: string; departement: string; }
interface Poste {
  id: string; nom: string; communeId: string; type: TypePoste;
  coordonnees: { lat: number; lng: number }; actif: boolean;
}

export default function AdminPostes() {
  const ready = useAdminGuard();
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [nom, setNom] = useState("");
  const [communeId, setCommuneId] = useState("");
  const [type, setType] = useState<TypePoste>("peage");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [actif, setActif] = useState(true);
  const [erreur, setErreur] = useState("");

  function charger() {
    fetch("/api/communes").then((r) => r.json()).then((d) => setCommunes(d.communes));
    fetch("/api/postes").then((r) => r.json()).then((d) => setPostes(d.postes));
  }

  useEffect(() => { if (ready) charger(); }, [ready]);

  async function ajouter() {
    setErreur("");
    if (!nom || !communeId) { setErreur("Nom et commune requis."); return; }
    const res = await fetch("/api/postes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom, communeId, type,
        coordonnees: { lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0 },
        actif,
      }),
    });
    if (res.ok) { setNom(""); setCommuneId(""); setLat(""); setLng(""); charger(); }
    else { const d = await res.json(); setErreur(d.message ?? "Erreur lors de l'ajout."); }
  }

  async function toggleActif(poste: Poste) {
    await fetch(`/api/postes/${poste.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actif: !poste.actif }),
    });
    charger();
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer ce poste ?")) return;
    await fetch(`/api/postes/${id}`, { method: "DELETE" });
    charger();
  }

  if (!ready) return null;

  return (
    <AdminLayout title="Gestion des postes">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Ajouter un poste</h3>
        {erreur && <div className="alert alert-error">{erreur}</div>}
        <div className="form-row">
          <div className="form-group">
            <label>Nom du poste</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : EKPÈ" />
          </div>
          <div className="form-group">
            <label>Commune</label>
            <select value={communeId} onChange={(e) => setCommuneId(e.target.value)}>
              <option value="">Choisir…</option>
              {communes.map((c) => <option key={c.id} value={c.id}>{c.nom} ({c.departement})</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as TypePoste)}>
              <option value="peage">Péage</option>
              <option value="peage_pesage">Péage & Pesage</option>
            </select>
          </div>
          <div className="form-group">
            <label>Actif</label>
            <select value={actif ? "1" : "0"} onChange={(e) => setActif(e.target.value === "1")}>
              <option value="1">Oui</option>
              <option value="0">Non</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Latitude</label>
            <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="6.3654" />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="2.4183" />
          </div>
        </div>
        <button className="btn btn-rouge" onClick={ajouter}>Ajouter le poste</button>
      </div>

      <h3 style={{ marginTop: "28px" }}>Liste des postes ({postes.length})</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nom</th><th>Commune</th><th>Type</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {postes.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.nom}</strong></td>
                <td>{communes.find((c) => c.id === p.communeId)?.nom ?? "—"}</td>
                <td>{p.type === "peage" ? "Péage" : "Péage & Pesage"}</td>
                <td>
                  <span className={`badge ${p.actif ? "badge-actif" : "badge-inactif"}`}>
                    {p.actif ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "0.78rem" }} onClick={() => toggleActif(p)}>
                    {p.actif ? "Désactiver" : "Activer"}
                  </button>
                  <button className="btn btn-rouge" style={{ padding: "6px 12px", fontSize: "0.78rem" }} onClick={() => supprimer(p.id)}>
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
