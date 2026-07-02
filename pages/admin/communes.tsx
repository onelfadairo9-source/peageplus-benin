import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAdminGuard } from "../../lib/useAdminGuard";
import { Departement } from "../../lib/models";

interface Commune {
  id: string;
  nom: string;
  departement: Departement;
  coordonnees?: { lat: number; lng: number };
}

const DEPARTEMENTS: Departement[] = [
  "Alibori", "Atacora", "Atlantique", "Borgou", "Collines", "Couffo",
  "Donga", "Littoral", "Mono", "Ouémé", "Plateau", "Zou",
];

export default function AdminCommunes() {
  const ready = useAdminGuard();
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [nom, setNom] = useState("");
  const [departement, setDepartement] = useState<Departement>("Littoral");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [erreur, setErreur] = useState("");
  const [filtreDept, setFiltreDept] = useState("");

  function charger() {
    fetch("/api/communes").then((r) => r.json()).then((d) => setCommunes(d.communes));
  }

  useEffect(() => {
    if (ready) charger();
  }, [ready]);

  async function ajouter() {
    setErreur("");
    if (!nom) {
      setErreur("Le nom de la commune est requis.");
      return;
    }
    const coordonnees = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined;
    const res = await fetch("/api/communes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, departement, coordonnees }),
    });
    if (res.ok) {
      setNom("");
      setLat("");
      setLng("");
      charger();
    } else {
      const d = await res.json();
      setErreur(d.message ?? "Erreur lors de l'ajout.");
    }
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer cette commune ?")) return;
    await fetch(`/api/communes/${id}`, { method: "DELETE" });
    charger();
  }

  if (!ready) return null;

  const listeFiltrée = filtreDept ? communes.filter((c) => c.departement === filtreDept) : communes;

  return (
    <AdminLayout title="Gestion des communes">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Ajouter une commune</h3>
        {erreur && <div className="alert alert-error">{erreur}</div>}
        <div className="form-row">
          <div className="form-group">
            <label>Nom de la commune</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Cotonou" />
          </div>
          <div className="form-group">
            <label>Département</label>
            <select value={departement} onChange={(e) => setDepartement(e.target.value as Departement)}>
              {DEPARTEMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Latitude (optionnel)</label>
            <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="6.3654" />
          </div>
          <div className="form-group">
            <label>Longitude (optionnel)</label>
            <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="2.4183" />
          </div>
        </div>
        <button className="btn btn-rouge" onClick={ajouter}>Ajouter la commune</button>
      </div>

      <div style={{ marginTop: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <h3 style={{ margin: 0 }}>Liste des communes ({listeFiltrée.length})</h3>
        <select value={filtreDept} onChange={(e) => setFiltreDept(e.target.value)} style={{ maxWidth: "220px" }}>
          <option value="">Tous les départements</option>
          {DEPARTEMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nom</th><th>Département</th><th>Coordonnées</th><th></th></tr>
          </thead>
          <tbody>
            {listeFiltrée.map((c) => (
              <tr key={c.id}>
                <td>{c.nom}</td>
                <td>{c.departement}</td>
                <td>{c.coordonnees ? `${c.coordonnees.lat}, ${c.coordonnees.lng}` : "—"}</td>
                <td>
                  <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "0.78rem" }} onClick={() => supprimer(c.id)}>
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
