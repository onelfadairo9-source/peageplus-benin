import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

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
      <div className="barrier-stripe" />
      <header className="site-header">
        <div className="header-inner">
          <Link href="/admin" className="brand">
            <span className="brand-mark">P+</span>
            PéagePlus Admin
          </Link>
          <nav className="header-nav">
            <Link href="/">← Site public</Link>
            <button onClick={deconnexion} className="btn btn-outline" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)", padding: "9px 16px" }}>
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

      <footer className="site-footer">PéagePlus Bénin — Espace administrateur</footer>
    </div>
  );
}
