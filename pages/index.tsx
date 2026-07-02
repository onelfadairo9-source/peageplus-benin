import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Map from "../components/Map";
import { Poste } from "../lib/models";

export default function Home() {
  const [postes, setPostes] = useState<Poste[]>([]);

  useEffect(() => {
    fetch("/api/postes")
      .then((r) => r.json())
      .then((d) => setPostes(d.postes ?? []))
      .catch(() => setPostes([]));
  }, []);

  return (
    <Layout title="Accueil">
      <section className="hero">
        <div className="container">
          <span className="hero-eyebrow">Réseau national de péage</span>
          <h1 className="hero-title">
            Passez les postes de péage,
            <br />
            <span className="accent">sans ralentir.</span>
          </h1>
          <p className="hero-sub">
            Programmez votre trajet à l&rsquo;avance ou payez directement au
            poste — en Mobile Money ou par carte, partout au Bénin.
          </p>
          <div className="hero-actions">
            <Link href="/predefini" className="btn btn-rouge">
              🗺️ Mode Prédéfini
            </Link>
            <Link href="/direct" className="btn btn-outline">
              ⚡ Mode Direct
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Choisissez votre mode de passage</h2>
          <p className="section-sub">
            Les deux modes vous donnent le même reçu officiel, vérifiable à
            tout moment.
          </p>

          <div className="mode-grid">
            <Link href="/predefini" className="mode-card">
              <span className="mode-stripe" />
              <span className="mode-icon">🗺️</span>
              <h3>Mode Prédéfini</h3>
              <p>
                Programmez votre trajet (départ → arrivée) et payez à
                l&rsquo;avance. Idéal pour les longs trajets traversant
                plusieurs postes.
              </p>
              <span className="mode-link">Programmer un trajet →</span>
            </Link>

            <Link href="/direct" className="mode-card">
              <span className="mode-stripe" />
              <span className="mode-icon">⚡</span>
              <h3>Mode Direct</h3>
              <p>
                Payez immédiatement au poste de péage où vous vous trouvez,
                sans rien programmer à l&rsquo;avance.
              </p>
              <span className="mode-link">Payer au poste →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#fff", borderTop: "1px solid var(--bordure)" }}>
        <div className="container">
          <h2 className="section-title">Couverture nationale</h2>
          <p className="section-sub">
            Le réseau couvre les 12 départements et les 77 communes du Bénin,
            avec les postes officiels de péage et de pesage.
          </p>
          <div
            style={{
              height: "420px",
              marginTop: "24px",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              border: "2px solid var(--bordure)",
              boxShadow: "var(--ombre)",
            }}
          >
            <Map postes={postes.filter((p) => p.actif)} zoom={7} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
