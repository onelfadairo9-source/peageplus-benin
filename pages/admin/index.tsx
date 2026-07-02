import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAdminGuard } from "../../lib/useAdminGuard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface RevenuJour {
  date: string;
  revenu: number;
  trajets: number;
}
interface RevenuPoste {
  nom: string;
  revenu: number;
  trajets: number;
}
interface ModeStat {
  mode: string;
  trajets: number;
  revenu: number;
}
interface CategorieStat {
  categorie: string;
  trajets: number;
}

interface Stats {
  totalCommunes: number;
  totalPostes: number;
  postesActifs: number;
  totalTroncons: number;
  totalTarifs: number;
  totalTrajets: number;
  trajetsPayes: number;
  trajetsEnAttente: number;
  revenuTotal: number;
  revenuAujourdHui: number;
  revenuParJour: RevenuJour[];
  revenuParPoste: RevenuPoste[];
  parMode: ModeStat[];
  parCategorie: CategorieStat[];
}

const ROUGE = "#D5001C";
const ROUGE_FONCE = "#8C0014";
const VERT = "#1C7C4C";
const JAUNE = "#F2B705";
const COULEURS_PIE = [ROUGE, VERT, JAUNE, "#5B7FBF"];

function formatJourCourt(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
}

export default function AdminDashboard() {
  const ready = useAdminGuard();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!ready) return;
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats));
  }, [ready]);

  if (!ready) return null;

  return (
    <AdminLayout title="Tableau de bord">
      {!stats ? (
        <div className="empty-state"><div className="icon">⏳</div>Chargement…</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Communes</div>
              <div className="stat-value">{stats.totalCommunes}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Postes actifs</div>
              <div className="stat-value">{stats.postesActifs}/{stats.totalPostes}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tronçons</div>
              <div className="stat-value">{stats.totalTroncons}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tarifs</div>
              <div className="stat-value">{stats.totalTarifs}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Trajets payés</div>
              <div className="stat-value">{stats.trajetsPayes}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">En attente</div>
              <div className="stat-value" style={{ color: "#946200" }}>{stats.trajetsEnAttente}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Revenu total</div>
              <div className="stat-value">{stats.revenuTotal.toLocaleString("fr-FR")} FCFA</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Revenu aujourd&rsquo;hui</div>
              <div className="stat-value">{stats.revenuAujourdHui.toLocaleString("fr-FR")} FCFA</div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "20px",
              marginTop: "28px",
            }}
          >
            {/* Revenu des 7 derniers jours */}
            <div className="form-card" style={{ minHeight: "320px" }}>
              <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>Revenu des 7 derniers jours</h3>
              {stats.revenuParJour.every((j) => j.revenu === 0) ? (
                <div className="empty-state" style={{ padding: "40px 0" }}>
                  <div className="icon">📊</div>Aucun paiement enregistré sur cette période.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={stats.revenuParJour} margin={{ left: -10 }}>
                    <defs>
                      <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={ROUGE} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={ROUGE} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD5" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatJourCourt}
                      tick={{ fontSize: 11, fill: "#6B6258" }}
                      axisLine={{ stroke: "#E8DFD5" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6B6258" }} axisLine={{ stroke: "#E8DFD5" }} />
                    <Tooltip
                      formatter={(value: any) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Revenu"]}
                      labelFormatter={(label) => formatJourCourt(label as string)}
                      contentStyle={{ borderRadius: 8, border: "1px solid #E8DFD5" }}
                    />
                    <Area type="monotone" dataKey="revenu" stroke={ROUGE_FONCE} strokeWidth={2} fill="url(#revGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Répartition par mode */}
            <div className="form-card" style={{ minHeight: "320px" }}>
              <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>Trajets payés par mode</h3>
              {stats.parMode.every((m) => m.trajets === 0) ? (
                <div className="empty-state" style={{ padding: "40px 0" }}>
                  <div className="icon">🥧</div>Pas encore de données.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.parMode}
                      dataKey="trajets"
                      nameKey="mode"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {stats.parMode.map((_, i) => (
                        <Cell key={i} fill={COULEURS_PIE[i % COULEURS_PIE.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={30} />
                    <Tooltip
                      formatter={(value: any, _name: any, props: any) => [
                        `${value} trajet(s) · ${props.payload.revenu.toLocaleString("fr-FR")} FCFA`,
                        props.payload.mode,
                      ]}
                      contentStyle={{ borderRadius: 8, border: "1px solid #E8DFD5" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Revenu par poste */}
            <div className="form-card" style={{ minHeight: "300px", gridColumn: "1 / -1" }}>
              <h3 style={{ marginBottom: "16px", fontSize: "1rem" }}>Revenu par poste (paiements directs)</h3>
              {stats.revenuParPoste.length === 0 ? (
                <div className="empty-state" style={{ padding: "40px 0" }}>
                  <div className="icon">🚧</div>Aucun paiement direct enregistré pour l&rsquo;instant.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.revenuParPoste} margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD5" />
                    <XAxis dataKey="nom" tick={{ fontSize: 11, fill: "#6B6258" }} axisLine={{ stroke: "#E8DFD5" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B6258" }} axisLine={{ stroke: "#E8DFD5" }} />
                    <Tooltip
                      formatter={(value: any) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Revenu"]}
                      contentStyle={{ borderRadius: 8, border: "1px solid #E8DFD5" }}
                    />
                    <Bar dataKey="revenu" fill={ROUGE} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <p style={{ color: "var(--encre-soft)", fontSize: "0.85rem", marginTop: "20px" }}>
            ⚠️ Les données sont en mémoire et seront réinitialisées au redémarrage du serveur.
          </p>
        </>
      )}
    </AdminLayout>
  );
}
