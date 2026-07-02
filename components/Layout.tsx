import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: Props) {
  return (
    <div className="page">
      <Head>
        <title>{title} — PéagePlus Bénin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Bande drapeau béninois (vert | jaune | rouge) */}
      <div style={{ height: "7px", display: "flex" }}>
        <div style={{ flex: 1, background: "var(--drapeau-vert)" }} />
        <div style={{ flex: 1, background: "var(--drapeau-jaune)" }} />
        <div style={{ flex: 1, background: "var(--drapeau-rouge)" }} />
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand">
            <Image
              src="/armoiries-benin.png"
              alt="Armoiries du Bénin"
              width={36}
              height={34}
              style={{ objectFit: "contain" }}
              priority
            />
            PéagePlus Bénin
          </Link>
          <nav className="header-nav">
            <Link href="/predefini">Mode Prédéfini</Link>
            <Link href="/direct">Mode Direct</Link>
            <Link href="/verification">Vérifier</Link>
            <Link href="/admin/login" className="cta">
              Espace Admin
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="site-footer">
        {/* Bande drapeau en haut du footer */}
        <div style={{ height: "5px", display: "flex", marginBottom: "16px" }}>
          <div style={{ flex: 1, background: "var(--drapeau-vert)" }} />
          <div style={{ flex: 1, background: "var(--drapeau-jaune)" }} />
          <div style={{ flex: 1, background: "var(--drapeau-rouge)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
          <Image
            src="/armoiries-benin.png"
            alt="Armoiries du Bénin"
            width={28}
            height={26}
            style={{ objectFit: "contain", opacity: 0.85 }}
          />
          <span>PéagePlus Bénin — Réseau national de péage · République du Bénin</span>
        </div>
        <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
          📞 Contact : <a href="tel:0151485451" style={{ color: "var(--drapeau-jaune)", fontWeight: 700 }}>0151485451</a>
        </div>
      </footer>
    </div>
  );
}
