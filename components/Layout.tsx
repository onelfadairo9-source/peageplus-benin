import Link from "next/link";
import Head from "next/head";

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

      <div className="barrier-stripe" />
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand">
            <span className="brand-mark">P+</span>
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
        PéagePlus Bénin — Réseau national de péage · République du Bénin
      </footer>
    </div>
  );
}
