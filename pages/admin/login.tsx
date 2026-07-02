import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function connexion(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setErreur(data.message ?? "Identifiants incorrects.");
      }
    } catch {
      setErreur("Erreur réseau, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ background: "var(--encre)" }}>
      <Head>
        <title>Connexion admin — PéagePlus Bénin</title>
      </Head>
      <div className="container-narrow" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span
            className="brand-mark"
            style={{ display: "inline-flex", width: "48px", height: "48px", fontSize: "1.3rem" }}
          >
            P+
          </span>
          <h1 style={{ color: "#fff", margin: "14px 0 4px" }}>Espace administrateur</h1>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>PéagePlus Bénin</p>
        </div>

        <form className="form-card" onSubmit={connexion}>
          {erreur && <div className="alert alert-error">{erreur}</div>}
          <div className="form-group">
            <label>Identifiant</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-rouge btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : "Se connecter"}
          </button>
          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <Link href="/" style={{ fontSize: "0.85rem", color: "var(--encre-soft)" }}>
              ← Retour au site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
