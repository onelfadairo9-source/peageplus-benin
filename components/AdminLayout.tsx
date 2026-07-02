import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

interface Props {
  title: string;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/communes", label: "Communes" },
  { href: "/admin/postes", label: "Postes" },
  { href: "/admin/troncons", label: "Tronçons" },
  { href: "/admin/tarifs", label: "Tarifs" },
];

export default function AdminLayout({ title, children }: Props) {
  const router = useRouter();

  async function deconnexion() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="page">
      <Head>
        <title>{title} — Admin PéagePlus</title>
      </Head>

      {/* Bande drapeau béninois */}
      <div style={{ height: "7px", display: "flex" }}>
        <div style={{ flex: 1, background: "var(--drapeau-vert)" }} />
        <div style={{ flex: 1, background: "var(--drapeau-jaune)" }} />
        <div style={{ flex: 1, background: "var(--drapeau-rouge)" }} />
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Link href="/admin" className="brand">
            <Image
              src="/armoiries-benin.png"
              alt="Armoiries du Bénin"
              width={36}
              height={34}
              style={{ objectFit: "contain" }}
              priority
            />
            PéagePlus Admin
          </Link>
          <nav className="header-nav">
            <Link href="/">← Site public</Link>
            <button
              onClick={deconnexion}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.4)",
                padding: "9px 16px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              Déconnexion
            </button>
          </nav>
        </div>
      </header>

      <nav className="admin-nav">
        <div className="admin-nav-inner">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={router.pathname === item.href ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <div className="container" style={{ padding: "32px 24px 60px" }}>
          <h1 className="section-title">{title}</h1>
          {children}
        </div>
      </main>

      <footer className="site-footer">
        <div style={{ height: "5px", display: "flex", marginBottom: "16px" }}>
          <div style={{ flex: 1, background: "var(--drapeau-vert)" }} />
          <div style={{ flex: 1, background: "var(--drapeau-jaune)" }} />
          <div style={{ flex: 1, background: "var(--drapeau-rouge)" }} />
        </div>
        PéagePlus Bénin — Espace administrateur ·{" "}
        <a href="tel:0151485451" style={{ color: "var(--drapeau-jaune)", fontWeight: 700 }}>
          0151485451
        </a>
      </footer>
    </div>
  );
}
