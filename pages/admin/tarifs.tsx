import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAdminGuard } from "../../lib/useAdminGuard";
import { CategorieVehicule } from "../../lib/models";

interface Troncon { id: string; nom: string; }
interface Poste { id: string; nom: string; }
interface Tarif {
  id: string; tronconId?: string; posteId?: string;
  categorieVehicule: CategorieVehicule; montantFCFA: number; dateDebut: string;
}

export default function AdminTarifs() {
  const ready = useAdminGuard();
  const [troncons, setTroncons] = useState<Troncon[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [lie, setLie] = useState<"troncon" | "poste">("troncon");
  const [tronconId, setTronconId] = useState("");
  const [posteId, setPosteId] = useState("");
  const [categorie, setCategorie] = useState<CategorieVehicule>("leger");
  const [montant, setMontant] = useState("");
  const [dateDebut, setDateDebut] = useState("2026-01-01");
  const [erreur, setErreur] = useState("");

  function charger() {
    fetch("/api/troncons").then((r) => r.json()).then((d) => setTroncons(d.troncons));
    fetch("/api/postes").then((r) => r.json()).then((d) => setPostes(d.postes));
    fetch("/api/tarifs").then((r) => r.json()).then((d) => setTarifs(d.tarifs));
  }

  useEffect(() => { if (ready) charger(); }, [ready]);

  async function ajouter() {
    setErreur("");
    if (!montant || !dateDebut) { setErreur("Montant et date de début requis."); return; }
    if (lie === "troncon" && !tronconId) { setErreur("Choisissez un tronçon."); return; }
    if (lie === "poste" && !posteId) { setErreur("Choisissez un poste."); return; }
    const res = await fetch("/api/tarifs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tronconId: lie === "troncon" ? tronconId : undefined,
        posteId: lie === "poste" ? posteId : undefined,
        categorieVehicule: categorie,
        montantFCFA: parseFloat(montant),
        dateDebut,
      }),
    });
    if (res.ok) {
      setMontant(""); setTronconId(""); setPosteId(""); charger();
    } else { const d = await res.json(); setErreur(d.message ?? "Erreur lors de l'ajout."); }
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer ce tarif ?")) return;
    await fetch(`/api/tarifs/${id}`, { method: "DELETE" });
    charger();
  }

  if (!ready) return null;

  return (
    <AdminLayout title="Gestion des tarifs">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Ajouter un tarif</h3>
        {erreur && <div className="alert alert-error">{erreur}</div>}
        <div className="form-group">
          <label>Lié à</label>
          <select value={lie} onChange={(e) => setLie(e.target.value as "troncon" | "poste")}>
            <option value="troncon">Un tronçon</option>
            <option value="poste">Un poste</option>
          </select>
        </div>
        {lie === "troncon" ? (
          <div className="form-group">
            <label>Tronçon</label>
            <select value={tronconId} onChange={(e) => setTronconId(e.target.value)}>
              <option value="">Choisir…</option>
              {troncons.map((t) => <option key={t.id} value={t.id}>{t.nom}</option>)}
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label>Poste</label>
            <select value={posteId} onChange={(e) => setPosteId(e.target.value)}>
              <option value="">Choisir…</option>
              {postes.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </div>
        )}
        <div className="form-row">
          <div className="form-group">
            <label>Catégorie de véhicule</label>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value as CategorieVehicule)}>
              <option value="leger">Véhicule léger</option>
              <option value="lourd">Poids lourd</option>
            </select>
          </div>
          <div className="form-group">
            <label>Montant (FCFA)</label>
            <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="500" />
          </div>
        </div>
        <div className="form-group">
          <label>Date de début</label>
          <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
        </div>
        <button className="btn btn-rouge" onClick={ajouter}>Ajouter le tarif</button>
      </div>

      <h3 style={{ marginTop: "28px" }}>Liste des tarifs ({tarifs.length})</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Lié à</th><th>Catégorie</th><th>Montant</th><th>Depuis</th><th></th></tr>
          </thead>
          <tbody>
            {tarifs.map((t) => (
              <tr key={t.id}>
                <td>
                  {t.tronconId
                    ? troncons.find((tr) => tr.id === t.tronconId)?.nom ?? t.tronconId
                    : postes.find((p) => p.id === t.posteId)?.nom ?? t.posteId}
                </td>
                <td>{t.categorieVehicule === "leger" ? "Véhicule léger" : "Poids lourd"}</td>
                <td><strong>{t.montantFCFA.toLocaleString("fr-FR")} FCFA</strong></td>
                <td>{t.dateDebut}</td>
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
